import { create } from "zustand";
import { IActions } from "@/interfaces";



export interface ActionsUserStore {
    actionsUser?: IActions;
    setActionsUser: (actionsUser: IActions) => void;
}

export const useActionsUser = create<ActionsUserStore>(set => ({
    actionsUser: undefined,
    setActionsUser: (actionsUser: IActions) => set({ actionsUser }),
}));