"use client";

import React, { useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/interfaces/product";
import { useCartStore, useProductStore } from "@/stores/useShopStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { ItemInCart } from "@/interfaces/shop";
import { handleAddToCart } from "@/lib/cart";
import { handleAddToWishlist } from "@/lib/wishlist";
import { axiosInstance } from "@/lib/axios";
import { usePathname } from "next/navigation";
import NoItems from "@/components/NoItems";

const Page = () => {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const setWishlist = useWishlistStore((state) => state.setWishlist);
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const pathname = usePathname();

  const handleCart = (item: ItemInCart) => {
    handleAddToCart({ item, cart, setCart });
  };

  const handleWishlist = (item: Product) => {
    handleAddToWishlist({ item, products, wishlist, setProducts, setWishlist });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let category;
        const items = pathname.split("/");
        const activeLink = items[items.length - 1];
        if (activeLink === "body") category = 1;
        if (activeLink === "face") category = 2;
        if (activeLink === "oral") category = 3;

        const url = `api/products?category=${category}`;
        const response = await axiosInstance.get(url);

        if (response && response.status === 200 && response.data) {
          const data = response.data.products.map((product: any) => {
            return {
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              category: product.category,
              sold: product._count.order_histories,
              rating: product.rating,
            };
          });
          setProducts(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [pathname, setProducts]);

  return (
    <>
      {products.length === 0 ? (
        <div className='col-span-4'>
          <NoItems />
        </div>
      ) : (
        <>
          {products.map((item, index) => (
            <ProductCard
              key={index}
              {...item}
              handleCart={handleCart}
              handleWishlist={handleWishlist}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Page;
