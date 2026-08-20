import {
	decryptData,
	decryptDataFromStorage,
	encryptData,
	setDataEncryptedInStorage,
} from '@/helpers/encrypt';
import CryptoJS from 'crypto-js';
import { createContext, ReactNode, useCallback, useMemo } from 'react';

export interface IUseEncryptHook {
	encryptKey: CryptoJS.lib.WordArray;
	encryptData: (value: string) => string;
	decryptData: (value: string) => string;
	getDecryptDataFromStorage: (key: string) => string | undefined;
	setEncryptedDataInStorage: (key: string, value: string) => void;
}

export interface IEncryptProviderProps {
	children: ReactNode;
	/** Clave AES en hexadecimal (ej. `import.meta.env.VITE_KEY_ENCRYPTER_AES`). */
	aesKeyHex: string;
}

export const EncryptContext = createContext<IUseEncryptHook | undefined>(undefined);

export const EncryptProvider = ({ children, aesKeyHex }: IEncryptProviderProps) => {
	const encryptKey = useMemo(() => CryptoJS.enc.Hex.parse(aesKeyHex), [aesKeyHex]);

	const handleEncryptData = useCallback(
		(value: string) => {
			return encryptData(value, encryptKey);
		},
		[encryptKey],
	);

	const handleDecryptData = useCallback(
		(value: string) => {
			return decryptData(value, encryptKey);
		},
		[encryptKey],
	);

	const handleDecryptDataFromStorage = useCallback(
		(key: string) => {
			return decryptDataFromStorage(key, encryptKey);
		},
		[encryptKey],
	);

	const handleSetDataEncryptedInStorage = useCallback(
		(key: string, value: string) => {
			setDataEncryptedInStorage(key, value, encryptKey);
		},
		[encryptKey],
	);

	const api = useMemo(
		() => ({
			encryptKey,
			encryptData: handleEncryptData,
			decryptData: handleDecryptData,
			getDecryptDataFromStorage: handleDecryptDataFromStorage,
			setEncryptedDataInStorage: handleSetDataEncryptedInStorage,
		}),
		[
			encryptKey,
			handleEncryptData,
			handleDecryptData,
			handleDecryptDataFromStorage,
			handleSetDataEncryptedInStorage,
		],
	);

	return <EncryptContext.Provider value={api}>{children}</EncryptContext.Provider>;
};
