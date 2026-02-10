import { v4 as uuidv4 } from 'uuid';
import { ELocalStorageKeys } from '@/enums';
import { EOptionsFilterStatus, EActionType } from '@/enums';
import { IActions, IActionsValidatePermission, IAgency, IModule, IProgramActions, ISorterTable, ISubmodule } from '@/interfaces';
import { TNotificationProps, TExtendedMenuItem } from '@/types';
import { notification } from 'antd';
import { dataFromLocalStorage } from '../objects';
import { SorterResult } from 'antd/es/table/interface';
import { useAppLayoutStore } from '@/store';
// import { act } from 'react';

export const openNotificationWithIcon = ({ type, message, description }: TNotificationProps) => {
	notification[type]({
		message,
		description,
	});
};

export const generateUuid = () => uuidv4();

export const normalizeStatus = (status?: string | boolean | number): EOptionsFilterStatus => {
	if (status === undefined || status === null || status === '') return 2;

	if (status === true || status === 'true' || status === 1 || status === '1') return 1;

	if (status === false || status === 'false' || status === 0 || status === '0') return 0;

	return 2;
};

export const getStoredCollapsedSidebar = () => {
	const closeSidebar = dataFromLocalStorage(ELocalStorageKeys.collapsedSidebar);
	return closeSidebar === 'true' ? true : false;
};

export const setStoredCollapsedSidebar = (collapsed: boolean) => {
	localStorage.setItem(ELocalStorageKeys.collapsedSidebar, String(collapsed));
};
export const getProgramActionsbyPath = (path: string, module: IModule): IProgramActions | undefined => {
	if (!path || !module?.submodules?.length) {
		// console.log('getProgramActionsbyPath: early return - path:', path, 'submodules:', module?.submodules?.length);
		return undefined;
	}
	// Normaliza paths para comparar por segmentos y evitar coincidencias parciales (role vs roles)
	const extractPathname = (input: string): string => {
		if (!input) return '';
		let cleaned: string = input.trim();
		// elimina protocolo y host si vienen en la URL
		cleaned = cleaned.replace(/^[a-zA-Z]+:\/\/[^/]+/, '');
		// toma solo el path sin query/hash sin usar indexación insegura
		const qIndex = cleaned.indexOf('?');
		const hIndex = cleaned.indexOf('#');
		let endIndex = cleaned.length;
		if (qIndex !== -1 && hIndex !== -1) endIndex = Math.min(qIndex, hIndex);
		else if (qIndex !== -1) endIndex = qIndex;
		else if (hIndex !== -1) endIndex = hIndex;
		const withoutQuery: string = cleaned.substring(0, endIndex);
		// normaliza slashes de inicio/fin
		let pathname: string = withoutQuery;
		if (pathname.startsWith('/')) pathname = pathname.slice(1);
		if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
		return pathname;
	};

	const matchesPath = (programUrlOrPath: string, targetPath: string): boolean => {
		const programPath = extractPathname(programUrlOrPath);
		const targetPathname = extractPathname(targetPath);
		if (!programPath || !targetPathname) return false;
		// Coincidencia exacta
		if (programPath === targetPathname) return true;
		// El path buscado debe comenzar con el path del programa + '/'
		// Ejemplo: programa tiene "spares/customers-management" y buscamos "spares/customers-management/create"
		return targetPathname.startsWith(programPath + '/');
	};

	const targetPath: string = path;
	//const normalizedTarget = extractPathname(targetPath);

	const submodules = module.submodules ?? [];

	for (const submodule of submodules) {
		// 1) Buscar en programs del submódulo
		const programs = submodule.programs;
		if (programs && programs.length > 0) {
			for (const program of programs) {
				const url = program.url ? program.url : undefined;
				const programPath = program.path ? program.path : undefined;

				// Buscar tanto en url como en path
				const urlMatch = url && typeof url === 'string' && url.length > 0 && matchesPath(url, targetPath);
				const pathMatch =
					programPath &&
					typeof programPath === 'string' &&
					programPath.length > 0 &&
					matchesPath(programPath, targetPath);

				if (urlMatch || pathMatch) {
					if (program.actions) {
						return { actions: program.actions, program: program };
					}
				}
			}
		}

		// 2) Buscar en groups -> programs
		const groups = submodule.groups;
		if (groups && groups.length > 0) {
			for (const group of groups) {
				const groupPrograms = group.programs;
				if (groupPrograms && groupPrograms.length > 0) {
					for (const program of groupPrograms) {
						const url = program.url ? program.url : undefined;
						const programPath = program.path ? program.path : undefined;

						// Buscar tanto en url como en path
						const urlMatch = url && typeof url === 'string' && url.length > 0 && matchesPath(url, targetPath);
						const pathMatch =
							programPath &&
							typeof programPath === 'string' &&
							programPath.length > 0 &&
							matchesPath(programPath, targetPath);

						if (urlMatch || pathMatch) {
							if (program.actions) {
								return { actions: program.actions, program: program };
							}
						}
					}
				}
			}
		}
	}
	return undefined;
};

export const disabledActionButton = (actionExecute?: EActionType, actions?: IActions) => {
	if (!actionExecute) return false;
	if (!actions) return true;
	if (actions.allActions === true) {
		return false;
	}
	if (actions.create === true && actionExecute === EActionType.create) {
		return false;
	}
	if (actions.read === true && actionExecute === EActionType.read) {
		return false;
	}
	if (actions.update === true && actionExecute === EActionType.update) {
		return false;
	}
	if (actions.delete === true && actionExecute === EActionType.delete) {
		return false;
	}
	return true;
};

export const isDisabledAction = (actionsPermissions?: IActionsValidatePermission, operation?: EActionType) => {

	if (!operation || !actionsPermissions) {
		return false;
	}
	if (actionsPermissions.allActions === true) {
		return false;
	}
	if (operation === EActionType.create && actionsPermissions.create === true) {
		return false;
	}
	if (operation === EActionType.read && actionsPermissions.read === true) {
		return false;
	}
	if (operation === EActionType.update && actionsPermissions.update === true) {
		return false;
	}
	if (operation === EActionType.delete && actionsPermissions.delete === true) {
		return false;
	}
	return true;
}

export const uppercaseStrings = <T>(obj: T): T => {
	if (obj === null || obj === undefined) return obj;
	if (typeof obj === 'string') {
		return obj.toUpperCase() as unknown as T;
	}
	if (Array.isArray(obj)) {
		return obj.map(item => uppercaseStrings(item)) as unknown as T;
	}
	if (typeof obj === 'object') {
		const result: any = {};
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				result[key] = uppercaseStrings((obj as any)[key]);
			}
		}
		return result as T;
	}
	return obj;
};

export const parseSorter = (sorter: SorterResult): ISorterTable => {
	// Obtener el campo a ordenar: usar field, columnKey, column.dataIndex o column.key como fallback
	const field = sorter.field
		? Array.isArray(sorter.field)
			? sorter.field[0]
			: sorter.field
		: sorter.columnKey
			? sorter.columnKey
			: sorter.column?.dataIndex
				? Array.isArray(sorter.column.dataIndex)
					? sorter.column.dataIndex.join('.')
					: sorter.column.dataIndex
				: sorter.column?.key
					? sorter.column.key
					: undefined;

	// Convertir field a string si existe
	const fieldString = field ? String(field) : undefined;

	// Construir orderBy basado en el orden y el campo
	// Ant Design usa 'descend', 'ascend' o null para el orden
	const orderBy =
		sorter.order === 'descend' && fieldString
			? `-${fieldString}`
			: sorter.order === 'ascend' && fieldString
				? fieldString
				: undefined;

	return {
		...sorter,
		orderBy,
	} as ISorterTable;
};

export interface ISorterColumn {
	column: {
		title: string;
		dataIndex: string;
	};
	order: 'ascend' | 'descend';
	field: string;
}
const normalizePath = (value: string | null | undefined): string => {
	if (!value) return '';
	return value.replace(/^\/+|\/+$/g, '').toLowerCase();
};

export const findProgramIdByPathFromAgencies = (agencies: IAgency[] | undefined, path: string): ISubmodule | null => {
	if (!agencies || !Array.isArray(agencies) || !path) return null;

	const target = normalizePath(path);
	if (!target) return null;

	const checkPrograms = (programs?: ISubmodule[] | null): ISubmodule | null => {
		if (!programs) return null;
		for (const program of programs) {
			if (normalizePath(program?.path ?? null) === target) {
				return program;
			}
		}
		return null;
	};

	for (const agency of agencies) {
		const modules = agency?.modules ?? [];
		for (const mod of modules ?? []) {
			const foundAtModule = checkPrograms(mod?.submodules ?? []);
			if (foundAtModule !== null) return foundAtModule;

			const submodules = mod?.submodules ?? [];
			for (const sub of submodules ?? []) {
				const foundAtSub = checkPrograms(sub?.programs ?? []);
				if (foundAtSub !== null) return foundAtSub;

				const groups = sub?.groups ?? [];
				for (const group of groups ?? []) {
					const foundAtGroup = checkPrograms(group?.programs ?? []);
					if (foundAtGroup !== null) return foundAtGroup;
				}
			}
		}
	}

	return null;
};

export const findProgramIdByPath = (path: string): ISubmodule | null => {
	const agencies: IAgency[] | undefined = useAppLayoutStore?.getState?.()?.agencies ?? [];
	return findProgramIdByPathFromAgencies(agencies, path);
};

export const findMenuItemByRoute = (menuItems: TExtendedMenuItem[], route: string): TExtendedMenuItem | null => {
	if (!Array.isArray(menuItems) || !route) return null;

	// Normaliza ambas rutas: elimina query params y slashes iniciales para comparar únicamente la ruta base.
	const normalizeRoutePath = (path?: string) => {
		if (!path) return '';
		const basePath = path.split('?')?.[0] ?? '';
		return basePath.replace(/^\/+/, '').replace(/\/+$/, '');
	};

	const normalizedRoute = normalizeRoutePath(route);

	let bestMatch: TExtendedMenuItem | null = null;
	let bestLength = -1;

	const traverse = (list: TExtendedMenuItem[]) => {
		for (const item of list) {
			const itemPath = item.data?.path;
			if (typeof itemPath === 'string' && itemPath.length > 0) {
				const normalizedItemPath = normalizeRoutePath(itemPath);

				// Usamos startsWith para permitir que la ruta actual tenga segmentos adicionales
				if (normalizedRoute === normalizedItemPath || normalizedRoute.startsWith(normalizedItemPath)) {
					if (normalizedItemPath.length > bestLength) {
						bestMatch = item;
						bestLength = normalizedItemPath.length;
					}
				}
			}

			if ('children' in item && item.children?.length) {
				traverse(item.children as TExtendedMenuItem[]);
			}
		}
	};

	traverse(menuItems);
	return bestMatch;
};

export const findContainedPaths = (url: string, pathsConfig: Record<string, (params?: string) => string>): string[] => {
	// A. Extraer la ruta limpia (pathname) usando la API URL
	// El 'http://dummy.com' es un fallback por si pasas una ruta relativa
	let cleanPath = '';
	try {
		const urlObj = new URL(
			url.startsWith('http') || url.startsWith('//') ? url.replace(/^\/\//, '') : `http://dummy.com/${url}`,
		);
		cleanPath = urlObj.pathname;
	} catch (error) {
		console.error('error =>', error);
		cleanPath = url.split('?')[0] ?? ''; // Fallback manual
	}

	// Quitamos barras iniciales/finales para evitar strings vacíos
	cleanPath = cleanPath.replace(/^\/+|\/+$/g, '');

	// B. Crear un Set con todas las rutas válidas de tu config
	// Ejecutamos las funciones para obtener los strings reales
	const validPathsSet = new Set(Object.values(pathsConfig).map(fn => fn()));

	// C. Construir combinaciones hacia atrás y filtrar
	const segments = cleanPath.split('/');
	const matches: string[] = [];
	let currentBuild = '';

	segments.forEach(segment => {
		// Reconstruimos la ruta paso a paso: security -> security/modules -> ...
		currentBuild = currentBuild ? `${currentBuild}/${segment}` : segment;

		// Si esta combinación existe en tu config, la guardamos
		if (validPathsSet.has(currentBuild)) {
			matches.push(currentBuild);
		}
	});

	return matches;
};
export const getOriginFromUrl = (url: string): string | undefined => {
	try {
		const urlObject = new URL(url);
		return urlObject.origin;
	} catch (e) {
		console.error('Error al procesar la URL:', e);
		return undefined;
	}
};


export const formatMoneyIfValid = (val: string | number | undefined | null): string => {
	if (val === undefined || val === null) return '';
	const raw = `${val}`.trim();
	const normalized = raw.replace(/,/g, '');
	// Only format when it's a "complete" numeric value: -123, 123, 123.45
	// (If user is mid-typing like "-", "1.", ".5" we leave it as-is.)
	const isValidNumber = /^-?\d+(\.\d+)?$/.test(normalized);
	if (!isValidNumber) return raw;

	const [intPart = '', decPart] = normalized.split('.');
	const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return decPart !== undefined ? `${groupedInt}.${decPart}` : groupedInt;
};