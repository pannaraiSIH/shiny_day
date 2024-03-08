import Spinner from "@/components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className='w-full h-full flex justify-center items-center text-center uppercase md:col-span-2 lg:col-span-4'>
      <Spinner />
    </div>
  );
};

export default Loading;
