import { create } from "zustand";

interface PrimaryNavbar {
  selectedPrimaryNavbarLink: string;
  setSelectedPrimaryNavbarLink: (by: string) => void;
}

interface Navbar {
  selectedNavbarLink: string;
  setSelectedNavbarLink: (by: string) => void;
}

export const usePrimaryNavbarStore = create<PrimaryNavbar>((set) => ({
  selectedPrimaryNavbarLink: "home",
  setSelectedPrimaryNavbarLink: (by: string) =>
    set((state) => ({ selectedPrimaryNavbarLink: by })),
}));

export const useNavbarStore = create<Navbar>((set) => ({
  selectedNavbarLink: "",
  setSelectedNavbarLink: (by: string) =>
    set((state) => ({ selectedNavbarLink: by })),
}));
