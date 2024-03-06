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

interface reviewProp {
  username: string;
  image: string;
  reviewMessage: string;
  rating: number;
}

const reviews: reviewProp[] = [
  {
    username: "Lisa",
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    reviewMessage:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis, modi?",
    rating: 5,
  },
  {
    username: "Jisoo",
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    reviewMessage: "Lorem ipsum dolor sit amet.",
    rating: 4,
  },
  {
    username: "Jennie",
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    reviewMessage:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis impedit architecto deleniti quidem alias vero?",
    rating: 5,
  },
  {
    username: "Jennie",
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    reviewMessage: "Lorem, ipsum dolor.",
    rating: 5,
  },
  {
    username: "Jennie",
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    reviewMessage:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem dicta enim dolorum.",
    rating: 3,
  },
  {
    username: "Jennie",
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    reviewMessage:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere exercitationem ut cumque dicta est perferendis aut labore quos harum dolorem!",
    rating: 1,
  },
];

const Reviews = () => {
  return (
    <div className='bg-muted py-20'>
      <div className='container'>
        <HeaderText>Reviews</HeaderText>

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
              {reviews.map((item, index) => (
                <CarouselItem key={index} className='sm:basis-1/2 lg:basis-1/3'>
                  <div className='p-1 h-full'>
                    <Card className='h-full'>
                      <CardContent className='flex flex-col gap-3 aspect-square items-center justify-center p-6'>
                        <div className='relative w-full aspect-square'>
                          <Image
                            src={item.image}
                            alt={item.image}
                            fill={true}
                            sizes='100%'
                            style={{ objectFit: "cover" }}
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
                            Array.from(
                              { length: 5 - item.rating },
                              (_, index) => (
                                <Star
                                  key={index}
                                  className='text-yellow-500'
                                  size={18}
                                />
                              )
                            )}
                        </div>

                        <div className='w-full'>
                          <p className='text-lg'>{item.username}</p>
                          <p className='text-sm'>{item.reviewMessage}</p>
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
      </div>
    </div>
  );
};

export default Reviews;
