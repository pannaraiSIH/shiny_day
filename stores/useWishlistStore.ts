import { Product } from "@/interfaces/product";
import { create } from "zustand";

interface Wishlist {
  wishlist: Product[];
  setWishlist: (by: Product[]) => void;
}

export const useWishlistStore = create<Wishlist>((set) => ({
  wishlist: [],
  setWishlist: (by: Product[]) => set((state) => ({ wishlist: by })),
}));
