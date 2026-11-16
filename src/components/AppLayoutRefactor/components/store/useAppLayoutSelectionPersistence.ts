import { ELocalStorageKeys } from '@/enums';
import { useEncrypt } from '@/hooks';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useRef, useState } from 'react';
import { StoredAppLayoutSelection, useAppLayoutStore } from './useAppLayoutStore';

const parseStoredId = (value?: string): number | undefined => {
	if (value === undefined || value === '') return undefined;

	const id = Number(value);
	return Number.isInteger(id) ? id : undefined;
};

export const useAppLayoutSelectionPersistence = (
	optionsCompany: DefaultOptionType[],
	loadingAppLayout: boolean,
	appNavigate?: () => void,
) => {
	const { getDecryptDataFromStorage, setEncryptedDataInStorage } = useEncrypt();
	const hydrateSelection = useAppLayoutStore(state => state.hydrateSelection);
	const setCompanyOptions = useAppLayoutStore(state => state.setCompanyOptions);
	const companyOptionsReady = useAppLayoutStore(state => state.companyOptionsReady);
	const permissions = useAppLayoutStore(state => state.permissions);
	const module = useAppLayoutStore(state => state.module);
	const selectionIds = useAppLayoutStore(state => state.selectionIds);
	const [storageReady, setStorageReady] = useState(false);
	const initialNavigationDone = useRef(false);

	useEffect(() => {
		setCompanyOptions(optionsCompany, !loadingAppLayout);
	}, [loadingAppLayout, optionsCompany, setCompanyOptions]);

	useEffect(() => {
		const read = (key: ELocalStorageKeys): string | undefined => {
			try {
				return getDecryptDataFromStorage(key);
			} catch {
				localStorage.removeItem(key);
				return undefined;
			}
		};
		const storedSelection: StoredAppLayoutSelection = {
			companyValue: read(ELocalStorageKeys.company),
			agencyId: parseStoredId(read(ELocalStorageKeys.agency)),
			subAgencyId: parseStoredId(read(ELocalStorageKeys.subAgency)),
			moduleId: parseStoredId(read(ELocalStorageKeys.module)),
			submoduleId: parseStoredId(read(ELocalStorageKeys.submodule)),
		};

		hydrateSelection(storedSelection);
		setStorageReady(true);
	}, [getDecryptDataFromStorage, hydrateSelection]);

	useEffect(() => {
		if (!storageReady) return;

		const persist = (key: ELocalStorageKeys, value?: string | number) => {
			if (value === undefined) {
				localStorage.removeItem(key);
				return;
			}
			setEncryptedDataInStorage(key, String(value));
		};

		if (companyOptionsReady) {
			persist(ELocalStorageKeys.company, selectionIds.companyValue);
		}
		if (permissions !== undefined) {
			persist(ELocalStorageKeys.agency, selectionIds.agencyId);
			persist(ELocalStorageKeys.subAgency, selectionIds.subAgencyId);
			persist(ELocalStorageKeys.module, selectionIds.moduleId);
			persist(ELocalStorageKeys.submodule, selectionIds.submoduleId);
		}
	}, [
		companyOptionsReady,
		permissions,
		selectionIds.agencyId,
		selectionIds.companyValue,
		selectionIds.moduleId,
		selectionIds.subAgencyId,
		selectionIds.submoduleId,
		setEncryptedDataInStorage,
		storageReady,
	]);

	useEffect(() => {
		if (
			!storageReady ||
			loadingAppLayout ||
			permissions === undefined ||
			!module ||
			initialNavigationDone.current
		)
			return;

		initialNavigationDone.current = true;
		appNavigate?.();
	}, [appNavigate, loadingAppLayout, module, permissions, storageReady]);
};
