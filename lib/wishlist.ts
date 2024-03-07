"use client";

import { Product } from "@/interfaces/product";
import { axiosInstance } from "./axios";

interface HandleWishlistProps {
  item: Product;
  products: Product[];
  wishlist: Product[];
  setProducts: (item: Product[]) => void;
  setWishlist: (item: Product[]) => void;
}

export const handleAddToWishlist = async (id: number, userId: number) => {
  const url = `/api/wishlist?userId=${userId}&productId=${id}`;
  const response = await axiosInstance.get(url);

  if (response && response.status === 200 && response.data) {
    const foundWishlist = response.data.wishlist;

    if (foundWishlist.length === 0) {
      const url = "/api/wishlist";
      const body = { productId: id, userId };
      const createWishlist = await axiosInstance.post(url, body);
    } else {
      const url = `/api/wishlist/${foundWishlist[0].id}`;
      const deleteWishlistItem = await axiosInstance.delete(url);
    }
  }
};
