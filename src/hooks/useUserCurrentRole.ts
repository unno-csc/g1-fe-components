import { useAppLayoutStore } from '@/store';

export const useUserCurrentRole = () => {
	const userRole = useAppLayoutStore(state => state.userRole);
	return userRole;
};

