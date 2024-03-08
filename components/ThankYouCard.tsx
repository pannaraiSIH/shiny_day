import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ThankYouCardProps {
  title: string;
  description: string;
}

const ThankYouCard = ({ title, description }: ThankYouCardProps) => {
  return (
    <AlertDialogHeader>
      <AlertDialogTitle className='text-center uppercase'>
        <div>
          <div className='flex justify-center mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='100'
              height='100'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-badge-check'
            >
              <path d='M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z' />
              <path d='m9 12 2 2 4-4' />
            </svg>
          </div>
          <p>{title}</p>
        </div>
      </AlertDialogTitle>
      <AlertDialogDescription className='text-center'>
        {description}
      </AlertDialogDescription>
    </AlertDialogHeader>
  );
};

export default ThankYouCard;
