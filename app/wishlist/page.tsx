"use client";

import React from "react";
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

const Page = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const setWishlist = useWishlistStore((state) => state.setWishlist);
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const handleCart = (item: ItemInCart) => {
    handleAddToCart({ item, cart, setCart });
  };

  const handleDeleteWishlistItem = (item: Product) => {
    let copyWishlist = [...wishlist];
    copyWishlist = copyWishlist.filter(
      (itemInWishlist) => itemInWishlist.id !== item.id
    );
    let copyProducts = [...products];
    const foundItemInProducts = copyProducts.findIndex(
      (itemInProducts) => itemInProducts.id === item.id
    );
    copyProducts[foundItemInProducts].isWishlist = false;

    setWishlist(copyWishlist);
    setProducts(copyProducts);
  };

  return (
    <main className='flex-1 mt-[4.5rem]'>
      <div className='container py-16 '>
        <HeaderText>
          Wishlist {wishlist.length !== 0 && `(${wishlist.length})`}
        </HeaderText>
        <Separator className='my-8' />

        {wishlist.length === 0 ? (
          <NoItems />
        ) : (
          <ul className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {wishlist.map((item) => (
              <li key={item.name} className='group'>
                <Card className='relative overflow-hidden transition-all hover:bg-muted'>
                  <CardContent className='p-6'>
                    <div className='relative w-100 aspect-square mb-4'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill={true}
                        style={{ objectFit: "contain" }}
                        sizes='100%'
                      />
                    </div>
                    <p className='text-md uppercase text-center'>{item.name}</p>
                  </CardContent>
                  <CardFooter className='bg-white pt-6 border-t  h-0 opacity-0 absolute w-full bottom-0 left-[50%] translate-x-[-50%] space-x-2 transition-all group-hover:opacity-100 group-hover:h-[7rem]'>
                    <Button
                      className='flex items-center gap-1 w-full'
                      variant={"destructive"}
                      onClick={() => {
                        handleDeleteWishlistItem(item);

                        toast("Wishlist item has been removed", {});
                      }}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                    <Button
                      className='flex items-center gap-1 w-full'
                      onClick={() => {
                        handleCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
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
