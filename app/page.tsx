"use client";

import CategoryCard from "@/components/CategoryCard";
import Reviews from "@/components/Reviews";
import { Globe2, LeafyGreen, Star, Terminal, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AlertBox from "@/components/AlertBox";
import { axiosInstance } from "@/lib/axios";
import HeaderText from "@/components/HeaderText";
import { useLoadingStore } from "@/stores/useLoadingStore";

interface ReviewProps {
  id: number;
  username: string;
  product: { image: string };
  review: string;
  rating: number;
}

const shinyDayFeatures = [
  { label: "Inclusive formulations", icon: <Star /> },
  { label: "Cruelty-Free and Vegan", icon: <LeafyGreen /> },
  { label: "Sustainable Packaging", icon: <Globe2 /> },
  { label: "Dermatologist-Recommended", icon: <ThumbsUp /> },
];

export default function Home() {
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        const url = "/api/reviews";
        const response = await axiosInstance.get(url, {
          signal: controller.signal,
        });
        if (response && response.status === 200 && response.data) {
          const data = response.data.histories.map((item: any) => {
            const username = item.users.username;
            const firstChar = username.substring(0, 3);
            const lastChar = username[username.length - 1];
            const anonymous =
              username.length > 2
                ? `${firstChar}${"*".repeat(username.length - 4)}${lastChar}`
                : username;

            return {
              id: item.id,
              username: anonymous,
              product: item.products,
              review: item.review,
              rating: item.rating,
            };
          });

          setReviews(data);
        }
      } catch (error) {
        if (
          (error instanceof Error && error.name === "AbortError") ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          console.log("Request aborted");
        } else {
          console.log(error);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

  return (
    <main>
      <section className='h-screen relative'>
        <div className='absolute top-[20%] left-[12%] right-[12%] z-10 lg:left-[10%] lg:top-[35%]'>
          <div className='mx-10 md:mx-24 lg:max-w-[20rem] lg:mx-0 xl:max-w-[30rem]'>
            <p className='uppercase text-center font-semibold text-xl leading-relaxed md:text-2xl lg:text-left md:mb-4 lg:text-3xl xl:text-4xl '>
              Discover Your Radiant Glow with Shiny Day
            </p>
          </div>
          <div className='hidden lg:block'>
            <p className='max-w-[25rem] text-md xl:text-xl text-wrap'>
              Your Ultimate Destination for Skin Care Essentials!
            </p>
          </div>
        </div>

        <Image
          src='/pexels-cup-of-couple-8015488.jpg'
          alt='hero_image'
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </section>

      <section className='bg-[#eaeaea] '>
        <div className='container relative py-20 flex flex-col md:grid md:grid-cols-4 md:grid-rows-3 '>
          <h2 className='text-center text-muted text-xl uppercase bg-primary py-4 md:col-start-1 md:col-span-2 md:row-start-2 md:self-center md:justify-self-center md:z-10 md:w-fit  md:px-12 md:text-xl lg:text-2xl lg:py-8 xl:text-4xl'>
            Why Shiny Day?
          </h2>
          <div className='relative w-full aspect-square md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-3 '>
            <Image
              src='/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg'
              alt='features'
              fill={true}
              style={{ objectFit: "cover" }}
              sizes='100%'
            />
          </div>
          <ul className='w-full h-full grid grid-cols-2 grid-rows-2 gap-y-6 items-start mt-4 md:mt-0 md:absolute md:top-0 md:left-0 md:items-center'>
            {shinyDayFeatures.map((item, index) => (
              <li
                key={item.label}
                className={`mx-8 space-y-2 flex flex-col w-fit items-center text-center ${
                  index % 2 !== 0 ? "justify-self-end" : ""
                }`}
              >
                <div className='flex flex-col items-center gap-1'>
                  {item.icon}
                  <p className='text-sm sm:text-md md:text-lg lg:text-xl'>
                    {item.label}
                  </p>
                </div>
                <p className='max-w-[20rem] hidden text-sm md:block lg:text-md'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Laboriosam maxime illo facere ab nobis dolor!
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className='bg-muted py-20'>
        <div className='container'>
          <HeaderText>Reviews</HeaderText>

          <Reviews reviews={reviews} />
        </div>
      </div>
    </main>
  );
}
