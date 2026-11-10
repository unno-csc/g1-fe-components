import { ELocalStorageKeys } from '@/enums';
import { decryptDataFromStorage, setDataEncryptedInStorage } from '@/helpers/encrypt';
import { EncryptProvider } from '@/hooks';
import { IAgency, IPermissions } from '@/interfaces';
import { act, renderHook, waitFor } from '@testing-library/react';
import CryptoJS from 'crypto-js';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppLayoutSelectionPersistence } from './useAppLayoutSelectionPersistence';
import { useAppLayoutStore } from './useAppLayoutStore';

const createAgency = (id: number, subAgencyId: number, moduleId: number, submoduleId: number): IAgency => ({
	id,
	name: `Agency ${id}`,
	subAgencies: [
		{
			id: subAgencyId,
			name: `SubAgency ${subAgencyId}`,
			modules: [
				{
					id: moduleId,
					name: `Module ${moduleId}`,
					icon: '',
					submodules: [
						{
							id: submoduleId,
							name: `Submodule ${submoduleId}`,
							icon: '',
							programs: [],
						},
					],
				},
			],
		},
	],
});

const permissions: IPermissions = {
	agencies: [createAgency(1, 10, 100, 1000), createAgency(2, 20, 200, 2000)],
};

const companyOptions = [
	{ label: 'Company 1', value: 'company-1' },
	{ label: 'Company 2', value: 'company-2' },
];

const resetStore = () => {
	useAppLayoutStore.setState({
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
	});
};

describe('useAppLayoutStore selection orchestration', () => {
	beforeEach(() => {
		localStorage.clear();
		resetStore();
	});

	it('restores selections when options and permissions arrive after hydration', () => {
		act(() => {
			useAppLayoutStore.getState().hydrateSelection({
				companyValue: 'company-2',
				agencyId: 2,
				subAgencyId: 20,
				moduleId: 200,
				submoduleId: 2000,
			});
			useAppLayoutStore.getState().setCompanyOptions(companyOptions);
			useAppLayoutStore.getState().setPermissions(permissions);
		});

		const state = useAppLayoutStore.getState();
		expect(state.currentCompany?.value).toBe('company-2');
		expect(state.agency?.id).toBe(2);
		expect(state.subAgency?.id).toBe(20);
		expect(state.module?.id).toBe(200);
		expect(state.currentSubmodule?.id).toBe(2000);
	});

	it('falls back to the first valid hierarchy and removes orphaned descendants', () => {
		act(() => {
			useAppLayoutStore.getState().hydrateSelection({
				companyValue: 'missing-company',
				agencyId: 99,
				subAgencyId: 99,
				moduleId: 99,
				submoduleId: 99,
			});
			useAppLayoutStore.getState().setCompanyOptions(companyOptions);
			useAppLayoutStore.getState().setPermissions(permissions);
		});

		expect(useAppLayoutStore.getState().selectionIds).toEqual({
			companyValue: 'company-1',
			agencyId: 1,
			subAgencyId: 10,
			moduleId: 100,
			submoduleId: 1000,
		});

		act(() => {
			useAppLayoutStore.getState().setPermissions({ agencies: [] });
		});

		expect(useAppLayoutStore.getState().agency).toBeUndefined();
		expect(useAppLayoutStore.getState().subAgency).toBeUndefined();
		expect(useAppLayoutStore.getState().module).toBeUndefined();
		expect(useAppLayoutStore.getState().currentSubmodule).toBeUndefined();
		expect(useAppLayoutStore.getState().selectionIds.companyValue).toBe('company-1');
		expect(useAppLayoutStore.getState().selectionIds.agencyId).toBeUndefined();
		expect(useAppLayoutStore.getState().selectionIds.subAgencyId).toBeUndefined();
		expect(useAppLayoutStore.getState().selectionIds.moduleId).toBeUndefined();
		expect(useAppLayoutStore.getState().selectionIds.submoduleId).toBeUndefined();
	});

	it('cascades subagency and module changes without changing company', () => {
		const agencyWithTwoModules = createAgency(3, 30, 300, 3000);
		const subAgency = agencyWithTwoModules.subAgencies?.[0];
		if (subAgency === undefined) throw new Error('Expected test subagency');
		subAgency.modules.push({
			id: 301,
			name: 'Module 301',
			icon: '',
			submodules: [{ id: 3010, name: 'Submodule 3010', icon: '', programs: [] }],
		});

		act(() => {
			useAppLayoutStore.getState().setCompanyOptions(companyOptions);
			useAppLayoutStore.getState().selectCompany('company-2');
			useAppLayoutStore.getState().setPermissions({ agencies: [...permissions.agencies, agencyWithTwoModules] });
			useAppLayoutStore.getState().selectSubAgency(30, 3);
			useAppLayoutStore.getState().selectModule(301);
		});

		const state = useAppLayoutStore.getState();
		expect(state.currentCompany?.value).toBe('company-2');
		expect(state.agency?.id).toBe(3);
		expect(state.subAgency?.id).toBe(30);
		expect(state.module?.id).toBe(301);
		expect(state.currentSubmodule?.id).toBe(3010);
	});
});

describe('useAppLayoutSelectionPersistence', () => {
	beforeEach(() => {
		localStorage.clear();
		resetStore();
	});

	it('decrypts, validates and rewrites the initial selection before navigating', async () => {
		const aesKeyHex = '00112233445566778899aabbccddeeff';
		const encryptKey = CryptoJS.enc.Hex.parse(aesKeyHex);
		setDataEncryptedInStorage(ELocalStorageKeys.company, 'missing-company', encryptKey);
		setDataEncryptedInStorage(ELocalStorageKeys.subAgency, '999', encryptKey);
		setDataEncryptedInStorage(ELocalStorageKeys.module, '999', encryptKey);
		const appNavigate = vi.fn();
		const wrapper = ({ children }: { children: ReactNode }) => (
			<EncryptProvider aesKeyHex={aesKeyHex}>{children}</EncryptProvider>
		);

		act(() => {
			useAppLayoutStore.getState().setPermissions(permissions);
		});
		renderHook(
			() => useAppLayoutSelectionPersistence(companyOptions, false, appNavigate),
			{ wrapper },
		);

		await waitFor(() => {
			expect(appNavigate).toHaveBeenCalledTimes(1);
			expect(decryptDataFromStorage(ELocalStorageKeys.company, encryptKey)).toBe('company-1');
			expect(decryptDataFromStorage(ELocalStorageKeys.agency, encryptKey)).toBe('1');
			expect(decryptDataFromStorage(ELocalStorageKeys.subAgency, encryptKey)).toBe('10');
			expect(decryptDataFromStorage(ELocalStorageKeys.module, encryptKey)).toBe('100');
			expect(decryptDataFromStorage(ELocalStorageKeys.submodule, encryptKey)).toBe('1000');
		});
	});
});
