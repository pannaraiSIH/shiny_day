"use client";

import React, { useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useCartStore, useProductStore } from "@/stores/useShopStore";
import { ItemInCart } from "@/interfaces/shop";
import { handleAddToCart } from "@/lib/cart";
import { handleAddToWishlist } from "@/lib/wishlist";
import { usePathname } from "next/navigation";
import NoItems from "@/components/NoItems";
import { fetchProducts } from "@/lib/product";
import { useLoadingStore } from "@/stores/useLoadingStore";
import Loading from "../loading";
import { useNavbarStore } from "@/stores/useNavbarStore";

const Page = () => {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const setSelectedNavbarLink = useNavbarStore(
    (state) => state.setSelectedNavbarLink
  );
  const pathname = usePathname();
  const activeLink = pathname.split("/")[2];
  // console.log(activeLink);

  const handleCart = (item: ItemInCart) => {
    handleAddToCart({ item, cart, setCart });
  };

  useEffect(() => {
    const controller = new AbortController();
    // setSelectedNavbarLink(activeLink);

    async function getData() {
      setIsLoading(true);

      try {
        const data = await fetchProducts({ pathname, controller });
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        if (
          (error instanceof Error && error.name === "AbortError") ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          console.log("Request aborted");
        } else {
          console.log(error);
        }

        setIsLoading(false);
      }
    }

    getData();

    return () => controller.abort();
  }, [pathname, activeLink, setSelectedNavbarLink, setProducts, setIsLoading]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
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
              handleAddToWishlist={handleAddToWishlist}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Page;
