import React from "react";

const NoItems = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='200'
        height='200'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='lucide lucide-milestone text-muted-foreground'
      >
        <path d='M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z' />
        <path d='M12 13v8' />
        <path d='M12 3v3' />
      </svg>

      <p className=''>No items</p>
    </div>
  );
};

export default NoItems;
