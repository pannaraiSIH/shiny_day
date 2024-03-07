"use client";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useShopStore";
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
import { MinusCircle, PlusCircle, PlusSquare, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import NoItems from "@/components/NoItems";
import HeaderText from "@/components/HeaderText";
import { handleAddToCart, handleRemoveFromCart } from "@/lib/cart";
import { ItemInCart } from "@/interfaces/shop";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAlertStore } from "@/stores/useAlertStore";

interface Review {
  review: string;
  rating: number;
  product_id: number;
  user_id: number;
  amount: number;
}

const columns: ColumnDef<ItemInCart>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const data = row.original;
      const name = data.name as string;
      const image = data.image as string;
      return (
        <div className='flex gap-2 items-center capitalize'>
          <div className='relative w-[4.5rem] aspect-square mr-2'>
            <Image
              src={image}
              alt={name}
              fill={true}
              style={{ objectFit: "cover" }}
              sizes={"30vw"}
              className='rounded-md'
            />
          </div>
          <p>{name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div className='lowercase'>{row.getValue("price")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className='text-center'>Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;

      return <div className='text-center font-medium'>{amount}</div>;
    },
  },
  {
    id: "add",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className='text-right'>
          <button>
            <PlusCircle className='text-muted-foreground' />
          </button>
        </div>
      );
    },
  },
  {
    id: "remove",

    enableHiding: false,
    cell: ({ row }) => {
      return (
        <button>
          <MinusCircle className='text-red-400' />
        </button>
      );
    },
  },
];

const Page = () => {
  const [showReview, setShowReview] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.price * curr.amount,
    0
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [temporaryRating, setTemporaryRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const setShowAlert = useAlertStore((state) => state.setShowAlert);
  const setAlertDetails = useAlertStore((state) => state.setAlertDetails);
  const [showDialog, setShowDialog] = useState(false);

  const data = cart;
  const { data: session } = useSession();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleCheckout = () => {
    if (!session?.user.id) {
      setAlertDetails({
        title: "Login",
        description: "Please login before proceeding to checkout",
        style: "destructive",
      });
      setShowAlert(true);
      setShowDialog(false);
    } else {
      setShowDialog(true);
    }
  };

  const handleRating = (id: number, rating: number, amount: number) => {
    let copyReviews = [...reviews];
    const foundItem = copyReviews.findIndex((item) => item.product_id === id);

    if (foundItem === -1) {
      const newReview: Review = {
        review: "",
        rating,
        product_id: id,
        user_id: session?.user.id,
        amount: amount,
      };

      setReviews([...copyReviews, newReview]);
    } else {
      copyReviews[foundItem].rating = rating;
    }
  };

  const handleReview = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    id: number,
    amount: number
  ) => {
    const reviewMessage = e.target.value;
    let copyReviews = [...reviews];
    const foundItem = copyReviews.findIndex((item) => item.product_id === id);

    if (foundItem === -1) {
      const newReview: Review = {
        review: reviewMessage,
        rating: 0,
        product_id: id,
        user_id: session?.user.id,
        amount,
      };

      setReviews([...copyReviews, newReview]);
    } else {
      copyReviews[foundItem].review = reviewMessage;
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    const empty = reviews.findIndex(
      (review) =>
        !review.rating ||
        !review.review ||
        !review.product_id ||
        review.amount === 0
    );
    if (empty !== -1) return;

    try {
      const url = "/api/histories";
      const response = await axiosInstance.post(url, { reviews });

      if (response && response.status === 201) {
        setCart([]);
        router.push("/");
      }
    } catch (error) {
      setCart([]);
      console.log(error);
    }
  };

  return (
    <main className='flex-1 mt-[4.5rem]'>
      <div className='container py-16'>
        <div className='flex flex-col gap-2 md:flex-row md:justify-between md:items-center'>
          <HeaderText>Shopping cart</HeaderText>
          <div className=''>
            <div className='flex gap-1'>
              <Input placeholder='Enter coupon' />
              <Button>Apply</Button>
            </div>
          </div>
        </div>

        <Separator className={cart.length === 0 ? "my-8" : "mt-6"} />

        {data.length === 0 ? (
          <NoItems />
        ) : (
          <>
            <div className='w-full space-y-4'>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return cell.column.id !== "add" &&
                              cell.column.id !== "remove" ? (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ) : cell.column.id === "add" ? (
                              <TableCell
                                key={cell.id}
                                onClick={() => {
                                  handleAddToCart({
                                    item: cell.row.original,
                                    cart,
                                    setCart,
                                  });
                                  toast("Item has been added to cart", {});
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ) : (
                              cell.column.id === "remove" && (
                                <TableCell
                                  key={cell.id}
                                  onClick={() => {
                                    handleRemoveFromCart({
                                      item: cell.row.original,
                                      cart,
                                      setCart,
                                    });
                                    toast(
                                      "Item has been removed from cart",
                                      {}
                                    );
                                  }}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              )
                            );
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className='h-24 text-center'
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <ul className='w-full grid grid-cols-1 place-items-end gap-3 text-sm ml-auto md:w-1/4 md:text-md lg:w-1/5'>
                <li className='w-full flex justify-between'>
                  <p>Discount</p>
                  <p>฿0</p>
                </li>
                <li className='w-full flex justify-between'>
                  <p>Shipping</p>
                  <p className='text-teal-400'>Free</p>
                </li>
                <li className='w-full flex justify-between'>
                  <p>Total</p>
                  <p>฿{totalPrice}</p>
                </li>

                <AlertDialog open={showDialog}>
                  <AlertDialogTrigger
                    className='w-full bg-primary text-muted text-sm rounded-md p-2'
                    onClick={handleCheckout}
                  >
                    Checkout
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    {!showReview ? (
                      <AlertDialogHeader>
                        <AlertDialogTitle className='text-center uppercase'>
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
                          Thank you for the purchase!
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-center'>
                          The order will be shipped within two days.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    ) : (
                      <form onSubmit={handleSubmitReview}>
                        <AlertDialogTitle className='text-center mb-4'>
                          Rating
                        </AlertDialogTitle>

                        <ScrollArea className='max-h-[20rem] h-full'>
                          {cart.map((item, index) => (
                            <div key={item.id} className='px-4'>
                              <div className='flex flex-col gap-2 basis-1/1 w-full'>
                                <div className='flex items-center'>
                                  <div className='relative w-[4.5rem] aspect-square mr-2'>
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill={true}
                                      style={{ objectFit: "cover" }}
                                      sizes={"30vw"}
                                      className='rounded-md'
                                    />
                                  </div>
                                  <p className='mr-auto capitalize text-sm'>
                                    {item.name}
                                  </p>
                                  <div className='flex'>
                                    {Array.from({ length: 5 }, (_, index) => (
                                      <Star
                                        key={index}
                                        size={18}
                                        fill={`${
                                          index + 1 <=
                                          (reviews?.find(
                                            (rv) => rv.product_id === item.id
                                          )?.rating || 0)
                                            ? "yellow"
                                            : "white"
                                        }`}
                                        className={`cursor-pointer ${
                                          index + 1 <= temporaryRating
                                            ? "text-yellow-300"
                                            : ""
                                        }`}
                                        onMouseEnter={() =>
                                          setTemporaryRating(index + 1)
                                        }
                                        onMouseLeave={() =>
                                          setTemporaryRating(0)
                                        }
                                        onClick={() =>
                                          handleRating(
                                            item.id,
                                            index + 1,
                                            item.amount
                                          )
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>

                                <Textarea
                                  placeholder='Type your reviews here...'
                                  onChange={(e) =>
                                    handleReview(e, item.id, item.amount)
                                  }
                                />
                              </div>

                              {cart.length - 1 !== index && (
                                <Separator className='my-4' />
                              )}
                            </div>
                          ))}

                          <div className='flex justify-end ml-auto gap-2 mt-4 px-4'>
                            <AlertDialogCancel>
                              <Link href={"/"} onClick={() => setCart([])}>
                                Cancel
                              </Link>
                            </AlertDialogCancel>
                            <Button type='submit'>Submit</Button>
                          </div>
                        </ScrollArea>
                      </form>
                    )}

                    {!showReview && (
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          <Link href={"/"} onClick={() => setCart([])}>
                            Continue
                          </Link>
                        </AlertDialogCancel>
                        <Button onClick={() => setShowReview(true)}>
                          Review
                        </Button>
                      </AlertDialogFooter>
                    )}
                  </AlertDialogContent>
                </AlertDialog>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Page;
