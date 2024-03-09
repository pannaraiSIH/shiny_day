"use client";

import React, { useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { Separator } from "@/components/ui/separator";
import NoItems from "@/components/NoItems";
import HeaderText from "@/components/HeaderText";
import { Product } from "@/interfaces/product";
import { useCartStore, useProductStore } from "@/stores/useShopStore";
import { handleAddToCart } from "@/lib/cart";
import { ItemInCart } from "@/interfaces/shop";
import { axiosInstance } from "@/lib/axios";
import { useLoadingStore } from "@/stores/useLoadingStore";
import Loading from "../loading";

const Page = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const setWishlist = useWishlistStore((state) => state.setWishlist);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const fetchData = useCallback(async () => {
    setWishlist([]);
    setIsLoading(true);

    try {
      const url = "/api/wishlist";
      const response = await axiosInstance.get(url);

      if (response && response.status === 200 && response.data) {
        const data = response.data.wishlist.map((item: any) => {
          return {
            id: item.id,
            userId: item.user_id,
            productId: item.product_id,
            product: item.products,
            createdAt: item.created_at,
          };
        });
        setWishlist(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [setWishlist, setIsLoading]);

  const handleCart = (item: ItemInCart) => {
    handleAddToCart({ item, cart, setCart });
  };

  const handleDeleteWishlistItem = async (id: number) => {
    try {
      const url = `/api/wishlist/${id}`;
      const response = await axiosInstance.delete(url);

      if (response && response.status === 200) {
        await fetchData();
      }
    } catch (error) {}
  };

  useEffect(() => {
    async function getData() {
      await fetchData();
    }

    getData();
  }, [setWishlist, fetchData]);

  return (
    <main className='flex-1 mt-[4.5rem]'>
      <div className='container py-16 '>
        <HeaderText>
          Wishlist {wishlist.length !== 0 && `(${wishlist.length})`}
        </HeaderText>
        <Separator className='my-8' />
        {isLoading ? (
          <Loading />
        ) : wishlist.length === 0 ? (
          <NoItems />
        ) : (
          <ul className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {wishlist.map((item) => (
              <li key={item.product.name} className='group h-full'>
                <Card className='relative overflow-hidden transition-all h-full hover:bg-muted'>
                  <CardContent className='p-6 h-full'>
                    <div className='relative w-100 aspect-square mb-4'>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill={true}
                        style={{ objectFit: "cover" }}
                        sizes='33vw'
                        quality={80}
                        className='rounded-md'
                      />
                    </div>
                    <p className='text-md uppercase text-center'>
                      {item.product.name}
                    </p>
                  </CardContent>
                  <CardFooter className='flex flex-col justify-center gap-2 bg-white pt-6 border-t min-h-[8rem]  h-0 opacity-0 absolute w-full bottom-0 left-[50%] translate-x-[-50%]  transition-all group-hover:opacity-100 group-hover:h-[7rem]'>
                    <Button
                      className='flex items-center gap-1 w-full'
                      variant={"destructive"}
                      onClick={() => {
                        handleDeleteWishlistItem(item.id);

                        toast("Wishlist item has been removed", {});
                      }}
                    >
                      <Trash2 />
                      Remove
                    </Button>
                    <Button
                      className='flex items-center gap-1 w-full'
                      onClick={() => {
                        handleCart({
                          id: item.id,
                          name: item.product.name,
                          price: item.product.price,
                          image: item.product.image,
                          amount: 1,
                        });

                        toast("Wishlist item has been added to your cart", {});
                      }}
                    >
                      <ShoppingCart />
                      Add to cart
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Page;
