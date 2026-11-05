import { IAgency, IModule, IPermissions, ISubAgency, ISubmodule, IUserInformation, IUserRole } from '@/interfaces';
import { DefaultOptionType } from 'antd/es/select';
import { create } from 'zustand';

export interface StoredAppLayoutSelection {
	companyValue?: string;
	agencyId?: number;
	subAgencyId?: number;
	moduleId?: number;
	submoduleId?: number;
}

export interface ResolvedPermissionSelection {
	agency?: IAgency;
	subAgency?: ISubAgency;
	module?: IModule;
	currentSubmodule?: ISubmodule;
}

const optionValue = (option?: DefaultOptionType): string | undefined =>
	option?.value === undefined || option.value === null ? undefined : String(option.value);

export const resolveCompany = (
	options: DefaultOptionType[],
	preferredValue?: string,
): DefaultOptionType | undefined =>
	options.find(option => optionValue(option) === preferredValue) ?? options[0];

export const resolvePermissionSelection = (
	permissions: IPermissions,
	preferred: StoredAppLayoutSelection,
): ResolvedPermissionSelection => {
	const availableSubAgencies = permissions.agencies.flatMap(agency => {
		if (agency.subAgencies && agency.subAgencies.length > 0) {
			return agency.subAgencies.map(subAgency => ({ agency, subAgency }));
		}
		const syntheticSubAgency: ISubAgency = {
			id: agency.id,
			name: agency.name,
			modules: agency.modules ?? [],
		};
		return [{ agency, subAgency: syntheticSubAgency }];
	});
	const preferredPair = availableSubAgencies.find(
		item =>
			(preferred.subAgencyId !== undefined &&
				item.subAgency.id === preferred.subAgencyId &&
				(preferred.agencyId === undefined || item.agency.id === preferred.agencyId)) ||
			(preferred.subAgencyId === undefined &&
				preferred.agencyId !== undefined &&
				item.agency.id === preferred.agencyId),
	);
	const selectedPair = preferredPair ?? availableSubAgencies[0];

	if (!selectedPair) {
		return {
			agency: undefined,
			subAgency: undefined,
			module: undefined,
			currentSubmodule: undefined,
		};
	}

	const module =
		selectedPair.subAgency.modules.find(item => item.id === preferred.moduleId) ??
		selectedPair.subAgency.modules[0];
	const currentSubmodule =
		module?.submodules.find(item => item.id === preferred.submoduleId) ?? module?.submodules[0];

	return {
		agency: selectedPair.agency,
		subAgency: selectedPair.subAgency,
		module,
		currentSubmodule,
	};
};

const permissionIds = (selection: ResolvedPermissionSelection): StoredAppLayoutSelection => ({
	agencyId: selection.agency?.id,
	subAgencyId: selection.subAgency?.id,
	moduleId: selection.module?.id,
	submoduleId: selection.currentSubmodule?.id,
});

export interface AppLayoutStore {
	permissions?: IPermissions;
	companyOptions: DefaultOptionType[];
	companyOptionsReady: boolean;
	selectionIds: StoredAppLayoutSelection;
	hydrated: boolean;

	agency?: IAgency;
	subAgency?: ISubAgency;
	module?: IModule;
	currentSubmodule?: ISubmodule;
	currentCompany?: DefaultOptionType;

	// Backward compatibility properties & aliases
	currentModule?: IModule;
	currentAgency?: IAgency | ISubAgency;
	agencies: IAgency[];
	modulesAgency: IModule[];
	submodulesAgency: ISubmodule[];
	userName?: string;
	setUserName: (userName: string) => void;
	setAgencies: (agencies: IAgency[]) => void;
	setCurrentAgency: (agency: IAgency | ISubAgency) => void;
	setCurrentModule: (module: IModule) => void;
	setCurrentSubmodule: (submodule: ISubmodule) => void;
	setModulesAgency: (modules: IModule[]) => void;
	setSubmodulesAgency: (submodules: ISubmodule[]) => void;

	userRole?: IUserRole;
	setUserRole: (userRole: IUserRole) => void;

	userInformation?: IUserInformation;
	setUserInformation: (userInformation: IUserInformation) => void;

	businessLineId?: number;
	setBusinessLineId: (businessLineId: number) => void;

	hydrateSelection: (selection: StoredAppLayoutSelection) => void;
	setPermissions: (permissions: IPermissions) => void;
	setCompanyOptions: (options: DefaultOptionType[], ready?: boolean) => void;
	selectCompany: (value: string) => void;
	selectSubAgency: (subAgencyId: number, agencyId?: number) => void;
	selectModule: (moduleId: number) => void;
	selectSubmodule: (submoduleId: number) => void;
}

export interface IAppLayoutStore extends AppLayoutStore {}

export const useAppLayoutStore = create<AppLayoutStore>((set, get) => ({
	permissions: undefined,
	companyOptions: [],
	companyOptionsReady: false,
	selectionIds: {},
	hydrated: false,
	agency: undefined,
	subAgency: undefined,
	module: undefined,
	currentSubmodule: undefined,
	currentCompany: undefined,
	userInformation: undefined,
	businessLineId: undefined,
	currentModule: undefined,
	currentAgency: undefined,
	agencies: [],
	modulesAgency: [],
	submodulesAgency: [],
	userName: undefined,
	setUserName: (userName: string) => set({ userName }),
	setAgencies: (agencies: IAgency[]) => {
		set({ agencies });
		const permissions: IPermissions = { agencies };
		get().setPermissions(permissions);
	},
	setCurrentAgency: (agency: IAgency | ISubAgency) => {
		set({ currentAgency: agency });
		if ('modules' in agency && Array.isArray(agency.modules)) {
			set({ modulesAgency: agency.modules });
		}
		if (agency.id !== undefined) {
			get().selectSubAgency(agency.id);
		}
	},
	setCurrentModule: (module: IModule) => {
		set({
			currentModule: module,
			module,
			submodulesAgency: module?.submodules ?? [],
			currentSubmodule: module?.submodules?.[0],
		});
		if (module.id !== undefined) {
			get().selectModule(module.id);
		}
	},
	setCurrentSubmodule: (submodule: ISubmodule) => {
		set({ currentSubmodule: submodule });
		if (submodule.id !== undefined) {
			get().selectSubmodule(submodule.id);
		}
	},
	setModulesAgency: (modules: IModule[]) => set({ modulesAgency: modules }),
	setSubmodulesAgency: (submodules: ISubmodule[]) => set({ submodulesAgency: submodules }),
	hydrateSelection: selection => {
		const state = get();
		const currentCompany = state.companyOptionsReady
			? resolveCompany(state.companyOptions, selection.companyValue)
			: undefined;
		const permissionSelection = state.permissions
			? resolvePermissionSelection(state.permissions, selection)
			: {};

		set({
			hydrated: true,
			selectionIds: {
				...selection,
				...(state.companyOptionsReady ? { companyValue: optionValue(currentCompany) } : {}),
				...(state.permissions ? permissionIds(permissionSelection) : {}),
			},
			currentCompany,
			...permissionSelection,
			currentModule: permissionSelection.module,
			currentAgency: permissionSelection.subAgency ?? permissionSelection.agency,
			modulesAgency: permissionSelection.subAgency?.modules ?? [],
			submodulesAgency: permissionSelection.module?.submodules ?? [],
		});
	},

	setPermissions: permissions => {
		const permissionSelection = resolvePermissionSelection(permissions, get().selectionIds);
		set(state => ({
			permissions,
			...permissionSelection,
			currentModule: permissionSelection.module,
			currentAgency: permissionSelection.subAgency ?? permissionSelection.agency,
			agencies: permissions.agencies ?? [],
			modulesAgency: permissionSelection.subAgency?.modules ?? [],
			submodulesAgency: permissionSelection.module?.submodules ?? [],
			selectionIds: {
				...state.selectionIds,
				...permissionIds(permissionSelection),
			},
		}));
	},

	setCompanyOptions: (companyOptions, ready = true) => {
		const currentCompany = ready
			? resolveCompany(companyOptions, get().selectionIds.companyValue)
			: undefined;
		set(state => ({
			companyOptions,
			companyOptionsReady: ready,
			currentCompany,
			selectionIds: ready
				? { ...state.selectionIds, companyValue: optionValue(currentCompany) }
				: state.selectionIds,
		}));
	},

	selectCompany: value => {
		const currentCompany = resolveCompany(get().companyOptions, value);
		set(state => ({
			currentCompany,
			selectionIds: { ...state.selectionIds, companyValue: optionValue(currentCompany) },
		}));
	},

	selectSubAgency: (subAgencyId, agencyId) => {
		const permissions = get().permissions;
		if (!permissions) return;

		const permissionSelection = resolvePermissionSelection(permissions, { agencyId, subAgencyId });
		set(state => ({
			...permissionSelection,
			currentModule: permissionSelection.module,
			currentAgency: permissionSelection.subAgency ?? permissionSelection.agency,
			modulesAgency: permissionSelection.subAgency?.modules ?? [],
			submodulesAgency: permissionSelection.module?.submodules ?? [],
			selectionIds: {
				...state.selectionIds,
				...permissionIds(permissionSelection),
			},
		}));
	},

	selectModule: moduleId => {
		const state = get();
		if (!state.subAgency) return;

		const module = state.subAgency.modules.find(item => item.id === moduleId) ?? state.subAgency.modules[0];
		const currentSubmodule = module?.submodules[0];
		set(currentState => ({
			module,
			currentModule: module,
			currentSubmodule,
			submodulesAgency: module?.submodules ?? [],
			selectionIds: {
				...currentState.selectionIds,
				moduleId: module?.id,
				submoduleId: currentSubmodule?.id,
			},
		}));
	},

	selectSubmodule: submoduleId => {
		const state = get();
		if (!state.module) return;

		const submodule = state.module.submodules.find(item => item.id === submoduleId) ?? state.module.submodules[0];
		set(currentState => ({
			currentSubmodule: submodule,
			selectionIds: {
				...currentState.selectionIds,
				submoduleId: submodule?.id,
			},
		}));
	},

	setUserInformation: (userInformation: IUserInformation) => {
		set({ userInformation });
	},

	setUserRole: (userRole: IUserRole) => {
		set({ userRole });
	},

	setBusinessLineId: (businessLineId: number) => {
		set({ businessLineId });
	},
	
}));
