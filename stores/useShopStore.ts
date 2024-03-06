// import { Product } from "@/interfaces/product";
import { Product } from "@/interfaces/product";
import { ItemInCart } from "@/interfaces/shop";
import { create } from "zustand";

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

export const useCartStore = create<Cart>((set) => ({
  cart: [],
  setCart: (by: ItemInCart[]) => set((state) => ({ cart: by })),
}));
