import { ELocalStorageKeys } from '@/enums';
import { dataFromLocalStorage } from '@/helpers/objects';
import { create } from 'zustand';

const getStoredCollapsedSidebar = () => {
	const closeSidebar = dataFromLocalStorage(ELocalStorageKeys.collapsedSidebar);
	return closeSidebar === 'true';
};

export interface SidebarLayoutStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useSidebarLayoutStore = create<SidebarLayoutStore>((set) => ({
  open: getStoredCollapsedSidebar(),
  setOpen: (open: boolean) => set({ open }),
}));