import Spinner from "@/components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className='w-full h-full flex justify-center items-center text-center uppercase'>
      <Spinner />
    </div>
  );
};

export default Loading;
