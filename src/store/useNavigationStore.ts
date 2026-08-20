import { create } from "zustand";

const MAX_ROUTE_HISTORY = 5;

interface NavigationStore {
    history: string[];
    addRoute: (route: string) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
    history: [],
    addRoute: (route) =>
        set((state) => ({
            history: [...state.history, route].slice(-MAX_ROUTE_HISTORY),
        })),
}));