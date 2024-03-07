import { create } from "zustand";

interface Loading {
  isLoading: boolean;
  setIsLoading: (by: boolean) => void;
}

export const useLoadingStore = create<Loading>((set) => ({
  isLoading: false,
  setIsLoading: (by: boolean) => set((state) => ({ isLoading: by })),
}));
