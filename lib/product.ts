import { Product } from "@/interfaces/product";
import { axiosInstance } from "./axios";

interface fetchProducts {
  pathname: string;
  controller: AbortController;
}

export const fetchProducts = async ({
  pathname,
  controller,
}: fetchProducts) => {
  let data = [];
  let category;
  const items = pathname.split("/");
  const activeLink = items[items.length - 1];
  if (activeLink === "body") category = 1;
  if (activeLink === "face") category = 2;
  if (activeLink === "oral") category = 3;

  const url = `api/products?category=${category}`;
  const response = await axiosInstance.get(url, {
    signal: controller.signal,
  });

  if (response && response.status === 200 && response.data) {
    data = response.data.products.map((product: any) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        sold: product._count.order_histories,
        rating: product.rating,
        isWishlist: product.wishlist ? true : false,
      };
    });
  }

  return data;
};
