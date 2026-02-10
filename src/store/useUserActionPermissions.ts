import { create } from "zustand";
import { IActionsValidatePermission } from "@/interfaces";



export interface UserActionPermissionsStore {
    userActionPermissions?: IActionsValidatePermission;
    setUserActionPermissions: (userActionPermissions: IActionsValidatePermission) => void;
}


export const useUserActionPermissions = create<UserActionPermissionsStore>(set => ({
    userActionPermissions: undefined,
    setUserActionPermissions: (userActionPermissions: IActionsValidatePermission) => set({ userActionPermissions }),
    
}));