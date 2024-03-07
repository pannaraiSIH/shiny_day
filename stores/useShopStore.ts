import { Product } from "@/interfaces/product";
import { ItemInCart } from "@/interfaces/shop";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Products {
  products: Product[];
  setProducts: (by: Product[]) => void;
}

interface Cart {
  cart: ItemInCart[];
  setCart: (by: ItemInCart[]) => void;
}

export const useProductStore = create<Products>((set) => ({
  products: [],
  setProducts: (by: Product[]) => set((state) => ({ products: by })),
}));

export const useCartStore = create<Cart>()(
  persist(
    (set) => ({
      cart: [],
      setCart: (by: ItemInCart[]) => set((state) => ({ cart: by })),
    }),
    { name: "cart", partialize: (state) => ({ cart: state.cart }) }
  )
);
