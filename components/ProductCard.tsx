import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { ItemInCart } from "@/interfaces/shop";
import { toast } from "sonner";
import { Product } from "@/interfaces/product";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface CardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  sold: number;
  isWishlist: boolean;
  handleCart: (item: ItemInCart) => void;
  handleAddToWishlist: (
    id: number,
    userId: number,
    pathname: string,
    controller: AbortController
  ) => void;
}

const ProductCard = ({
  id,
  name,
  image,
  price,
  rating,
  sold,
  isWishlist,
  handleCart,
  handleAddToWishlist,
}: CardProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const pathname = usePathname();
  const controller = new AbortController();

  return (
    <Card key={name}>
      <CardContent className='p-6'>
        <div className='relative w-full aspect-square mb-4'>
          <Image
            src={image}
            fill={true}
            style={{ objectFit: "cover" }}
            sizes={"30vw"}
            alt={name}
            className='rounded-md'
          />
        </div>

        <div className='space-y-2'>
          <p className='uppercase text-lg'>{name}</p>
          <p>฿{price}</p>
        </div>

        <Separator className='w-full h-[0.05rem] my-4 bg-muted-foreground' />

        <div className='flex justify-between'>
          <div className='flex items-center'>
            {rating === 0 ? (
              <p className='text-sm'>No reviews</p>
            ) : (
              <>
                {Array.from({ length: rating }, (_, index) => (
                  <Star
                    key={index}
                    className='text-yellow-500 '
                    fill='yellow'
                    size={18}
                  />
                ))}
                {rating !== 5 &&
                  Array.from({ length: Math.ceil(5 - rating) }, (_, index) => (
                    <Star
                      key={index}
                      className='text-yellow-500 '
                      fill='none'
                      size={18}
                    />
                  ))}
                <p className='ml-2'>{rating}/5</p>
              </>
            )}
          </div>

          <p className='text-sm'>sold {sold}</p>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <Button
          className='w-full flex gap-2'
          variant={"outline"}
          onClick={() => {
            // handleWishlist({
            //   id: id,
            //   name: name,
            //   price: price,
            //   image: image,
            //   rating: rating,
            //   sold: sold,
            //   isWishlist: isWishlist,
            // });
            handleAddToWishlist(id, userId, pathname, controller);

            toast(
              `${
                isWishlist
                  ? `${name.toUpperCase()} has been removed from your wishlist.`
                  : `${name.toUpperCase()} has been added to your wishlist.`
              }`,
              {
                // description: "Sunday, December 03, 2023 at 9:00 AM",
              }
            );
          }}
        >
          <Heart
            className={"text-red-300"}
            fill={isWishlist ? "#FEB2B2" : "white"}
          />
          Add to wishlist
        </Button>
        <Button
          className='w-full flex gap-2'
          onClick={() => {
            handleCart({
              id: id,
              name: name,
              price: price,
              image: image,
              amount: 0,
            });

            toast(`${name.toUpperCase()} has been added to your cart.`, {
              // description: "Sunday, December 03, 2023 at 9:00 AM",
            });
          }}
        >
          <ShoppingCart />
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
