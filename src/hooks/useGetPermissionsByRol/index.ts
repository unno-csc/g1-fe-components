import { IUserInformation, IUserRole } from '@/interfaces';
import { useAppLayoutStore } from '@/store';
import { useMemo } from 'react';

export interface IUseGetUserInformationProps {
	codeUserRole: string;
	userRole?: IUserRole;
	userInformation?: IUserInformation;
}

export const useGetUserInformation = (): IUseGetUserInformationProps => {
	const userInformation = useAppLayoutStore(state => state.userInformation);
	const currentModule = useAppLayoutStore(state => state.module);

	const userRole = useMemo((): IUserRole | undefined => {
		return userInformation?.roles.find(role => role.moduleId === currentModule?.id) ?? undefined;
	}, [userInformation, currentModule]);

	const codeUserRole = useMemo(() => {
		const code = userRole?.code;
		if(code){
			return code;
		}
		return '';
    }, [userRole]);

	return {
        codeUserRole,
		userRole,
		userInformation,
	};
};
