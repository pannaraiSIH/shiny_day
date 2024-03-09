"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import Image from "next/image";
import HeaderText from "./HeaderText";

interface Review {
  id: number;
  username: string;
  product: { image: string };
  review: string;
  rating: number;
}
interface ReviewProps {
  reviews: Review[];
}

const Reviews = ({ reviews }: ReviewProps) => {
  return (
    <div className='px-8 mt-8'>
      <Carousel
        plugins={[Autoplay({ delay: 3000 })]}
        opts={{
          align: "start",
          loop: true,
        }}
        className='w-full'
      >
        <CarouselContent className=''>
          {reviews.map((item: Review) => (
            <CarouselItem key={item.id} className='sm:basis-1/2 lg:basis-1/3'>
              <div className='p-1 h-full'>
                <Card className='h-full'>
                  <CardContent className='flex flex-col gap-3 aspect-square items-center justify-center p-6'>
                    <div className='relative w-full aspect-square'>
                      <Image
                        src={item.product.image}
                        alt={item.product.image}
                        fill={true}
                        sizes='100%'
                        style={{ objectFit: "cover" }}
                        className='rounded-md'
                      />
                    </div>

                    <div className='w-full flex justify-start'>
                      {Array.from({ length: item.rating }, (_, index) => (
                        <Star
                          key={index}
                          className='text-yellow-500'
                          fill='yellow'
                          size={18}
                        />
                      ))}

                      {5 - item.rating > 0 &&
                        Array.from({ length: 5 - item.rating }, (_, index) => (
                          <Star
                            key={index}
                            className='text-yellow-500'
                            size={18}
                          />
                        ))}
                    </div>

                    <div className='w-full'>
                      <p className='text-md uppercase mb-2'>{item.username}</p>
                      <p className='text-sm first-letter:uppercase'>
                        {item.review}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Reviews;
