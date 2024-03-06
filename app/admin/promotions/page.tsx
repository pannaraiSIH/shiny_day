"use client";

import React, { FormEventHandler, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, PlusCircle, Trash2 } from "lucide-react";
import HeaderText from "@/components/HeaderText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import NoItems from "@/components/NoItems";
import axios from "axios";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";
import DatePicker from "@/components/DatePicker";

interface Promotion {
  id: number;
  name: string;
  discount: number;
  period: {};
  condition: string;
  products: number[];
  status: boolean;
  isEdit: boolean;
}

const Page = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromotion, setNewPromotion] = useState<Promotion>({
    id: 0,
    name: "",
    discount: 0,
    period: {},
    condition: "",
    products: [],
    status: false,
    isEdit: false,
  });
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const handleEdit = (id: number) => {
    let copyPromotions = [...promotions];
    copyPromotions = copyPromotions.map((user) => ({ ...user, isEdit: false }));
    const foundPromotion = copyPromotions.findIndex((user) => user.id === id);
    copyPromotions[foundPromotion].isEdit = true;
    setPromotions(copyPromotions);
  };

  const handleCancel = () => {
    let copyPromotions = [...promotions];
    copyPromotions = copyPromotions.map((user) => ({ ...user, isEdit: false }));
    setPromotions(copyPromotions);
  };

  const handleEditName = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let copyPromotions = [...promotions];
    const foundPromotion = copyPromotions.findIndex((user) => user.id === id);
    copyPromotions[foundPromotion].name = e.target.value;
    setPromotions(copyPromotions);
  };

  const handleEditPeriod = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let copyPromotions = [...promotions];
    const foundPromotion = copyPromotions.findIndex((user) => user.id === id);
    // copyPromotions[foundPromotion].period = Number(e.target.value);
    // setPromotions(copyPromotions);
  };

  const handleEditProducts = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let copyPromotions = [...promotions];
    const foundPromotion = copyPromotions.findIndex((user) => user.id === id);
    copyPromotions[foundPromotion].products = [Number(e.target.value)];
    setPromotions(copyPromotions);
  };

  const handleSubmitEdit = (id: number) => {
    let copyPromotions = [...promotions];
    const foundPromotion = copyPromotions.findIndex((user) => user.id === id);
  };

  const handleSubmitCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(newPromotion);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "/api/promotions";
        const response = await axiosInstance.get(url);

        if (response && response.status === 200 && response.data) {
          const data = response.data.promotions.map((promotion: any) => ({
            ...promotion,
            isEdit: false,
          }));
          setPromotions(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className='w-full'>
      <div className='flex items-center gap-4'>
        <HeaderText>Promotion</HeaderText>
        <Dialog>
          <DialogTrigger
            asChild
            className='border p-2 rounded-full cursor-pointer'
          >
            <div>
              <Plus size={20} />
            </div>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Create promotion</DialogTitle>
            </DialogHeader>
            <form
              className='grid gap-4 py-4'
              onSubmit={handleSubmitCreateProduct}
            >
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='name'
                  value={newPromotion.name}
                  className='col-span-3'
                  onChange={(e) =>
                    setNewPromotion((promotion) => ({
                      ...promotion,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='discount' className='text-right'>
                  Discount
                </Label>
                <Input
                  id='discount'
                  value={newPromotion.name}
                  className='col-span-3'
                  onChange={(e) =>
                    setNewPromotion((promotion) => ({
                      ...promotion,
                      products: [Number(e.target.value)],
                    }))
                  }
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='period' className='text-right'>
                  period
                </Label>
                <DatePicker date={date} setDate={setDate} />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='condition' className='text-right'>
                  Condition
                </Label>
                <Textarea id='condition' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='product' className='text-right'>
                  Product
                </Label>
                <Input
                  id='product'
                  value={newPromotion.name}
                  className='col-span-3'
                  onChange={(e) =>
                    setNewPromotion((promotion) => ({
                      ...promotion,
                      discount: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='status' className='text-right'>
                  Status
                </Label>
                <Switch checked={false} />
              </div>
            </form>
            <DialogFooter>
              <Button type='submit'>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {promotions.length === 0 ? (
        <NoItems />
      ) : (
        <ul className='grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3'>
          {promotions.map((product, index) => (
            <li key={index}>
              <Card>
                <CardContent className='p-6'>
                  <form action=''>
                    <div className='space-y-2'>
                      <div className=''>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                          id='name'
                          type='text'
                          value={product.name}
                          onChange={(e) => handleEditName(e, product.id)}
                          disabled={!product.isEdit}
                        />
                      </div>
                      <div className=''>
                        <Label htmlFor='discount'>Discount</Label>
                        <Input
                          id='discount'
                          type='text'
                          value={product.discount}
                          onChange={(e) => handleEditName(e, product.id)}
                          disabled={!product.isEdit}
                        />
                      </div>
                      <div className='w-full'>
                        <p className='text-sm font-medium'>Period</p>
                        <DatePicker date={date} setDate={setDate} />
                      </div>
                      <div>
                        <Label htmlFor='condition'>Condition</Label>
                        <Textarea id='condition' />
                      </div>
                      <div className=''>
                        <Switch checked={product.status} />
                      </div>
                      <div>
                        <Label htmlFor='products'>Products</Label>
                        <Input
                          id='products'
                          type='text'
                          value={product.discount}
                          onChange={(e) => handleEditProducts(e, product.id)}
                          disabled={!product.isEdit}
                        />
                      </div>
                    </div>

                    <div className='flex gap-2 mt-4'>
                      {product.isEdit ? (
                        <Button
                          type='submit'
                          className='flex-1'
                          onClick={() => handleSubmitEdit(product.id)}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button
                          className='flex-1'
                          variant={"secondary"}
                          onClick={() => handleEdit(product.id)}
                        >
                          <Pencil size={20} />
                        </Button>
                      )}

                      {product.isEdit ? (
                        <Button
                          variant={"destructive"}
                          className='flex-1'
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button variant={"destructive"} className='flex-1'>
                          <Trash2 size={20} />
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
