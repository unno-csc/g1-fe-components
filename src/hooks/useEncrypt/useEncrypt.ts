import { useContext } from 'react';
import { EncryptContext, type IUseEncryptHook } from './EncryptProvider';

export type { IUseEncryptHook };

export const useEncrypt = (): IUseEncryptHook => {
	const ctx = useContext(EncryptContext);
	if (!ctx) {
		throw new Error(
			'useEncrypt debe usarse dentro de EncryptProvider. Pasa aesKeyHex (ej. import.meta.env.VITE_KEY_ENCRYPTER_AES).',
		);
	}
	return ctx;
};
