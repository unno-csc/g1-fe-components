import { create } from "zustand";

export interface UploadImagesStore {
    imageKey?: string;
    setImageKey: (imageKey: string) => void;
}

export const useUploadImages = create<UploadImagesStore>((set) => ({
    imageKey: undefined,
    setImageKey: (imageKey) => set({ imageKey }),
}));