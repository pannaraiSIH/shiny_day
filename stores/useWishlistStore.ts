import { Product } from "@/interfaces/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
  createdAt: Date;
}

interface Wishlist {
  wishlist: WishlistItem[];
  setWishlist: (by: WishlistItem[]) => void;
}

export const useWishlistStore = create<Wishlist>((set) => ({
  wishlist: [],
  setWishlist: (by: WishlistItem[]) => set((state) => ({ wishlist: by })),
}));
