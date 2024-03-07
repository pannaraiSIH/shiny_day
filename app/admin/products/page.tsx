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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import NoItems from "@/components/NoItems";
import { axiosInstance } from "@/lib/axios";
import { useAlertStore } from "@/stores/useAlertStore";
import { PutBlobResult } from "@vercel/blob";
import Spinner from "@/components/Spinner";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: number;
  isEdit: boolean;
}

interface NewProduct {
  name: string;
  price: number;
  image: string;
  category: number;
  isEdit: boolean;
}

const mock = [
  {
    id: 1,
    name: "body lotion",
    price: 200,
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    category: 1,
    isEdit: false,
  },
  {
    id: 2,
    name: "shampoo",
    price: 300,
    image: "/kier-in-sight-archives-eIM4FWocz2E-unsplash.jpg",
    category: 1,
    isEdit: false,
  },
];

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    price: 0,
    image: "",
    category: 1,
    isEdit: false,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{ image: string | null }>({
    image: null,
  });
  const [warningText, setWarningText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (id: number) => {
    let copyProducts = [...products];
    copyProducts = copyProducts.map((user) => ({ ...user, isEdit: false }));
    const foundProduct = copyProducts.findIndex((user) => user.id === id);
    copyProducts[foundProduct].isEdit = true;
    setProducts(copyProducts);
  };

  const handleCancel = () => {
    let copyProducts = [...products];
    copyProducts = copyProducts.map((user) => ({ ...user, isEdit: false }));
    setProducts(copyProducts);
  };

  const handleEditName = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let copyProducts = [...products];
    const foundProduct = copyProducts.findIndex((user) => user.id === id);
    copyProducts[foundProduct].name = e.target.value;
    setProducts(copyProducts);
  };

  const handleEditPrice = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let copyProducts = [...products];
    const foundProduct = copyProducts.findIndex((user) => user.id === id);
    copyProducts[foundProduct].price = Number(e.target.value);
    setProducts(copyProducts);
  };

  const handleEditCategory = (value: string, id: number) => {
    let copyProducts = [...products];
    const foundProduct = copyProducts.findIndex((user) => user.id === id);
    copyProducts[foundProduct].category = Number(value);
    setProducts(copyProducts);
  };

  const handleSubmitEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    let copyProducts = [...products];
    const foundProduct = copyProducts.findIndex((user) => user.id === id);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    const imageMimeType = /image\/(png|jpg|jpeg)/i;

    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        setWarningText("File is too large");
        return;
      }

      if (!file.type.match(imageMimeType)) {
        setWarningText("Invalid file type");
        return;
      }

      setWarningText(null);
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategory = (value: string) => {
    let copyNewProduct = { ...newProduct };
    copyNewProduct.category = Number(value);
    setNewProduct(copyNewProduct);
  };

  const handleSubmitCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, price, category } = newProduct;
    if (!file || !name || !price || !category) return;

    setIsLoading(true);
    setOpenDialog(false);

    try {
      const uploadUrl = "/api/upload";
      const response = await axiosInstance.post(uploadUrl, file, {
        headers: { "content-type": file?.type || "application/octet-stream" },
      });

      if (response && response.status === 200) {
        const blob = response.data.blob as PutBlobResult;
        const imageUrl = blob.url;

        const url = "/api/products";
        const body = { name, price, category, image: imageUrl };
        const newProductResponse = await axiosInstance.post(url, body);

        if (newProductResponse && newProductResponse.status === 201) {
          const getProductsResponse = await axiosInstance.get(url);

          if (getProductsResponse && getProductsResponse.status === 200) {
            const data = response.data.products.map((product: any) => ({
              ...product,
              isEdit: false,
            }));

            setIsLoading(false);

            setProducts(data);
          }
        }
      }
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      setNewProduct({
        name: "",
        price: 0,
        image: "",
        category: 1,
        isEdit: false,
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setProducts([]);
      try {
        const url = "/api/products";
        const response = await axiosInstance.get(url);

        if (response && response.status && response.data) {
          const data = response.data.products.map((product: any) => ({
            ...product,
            isEdit: false,
          }));

          setIsLoading(false);
          setProducts(data);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className='w-full'>
      <div className='flex items-center gap-4'>
        <HeaderText>Products</HeaderText>
        <Dialog open={openDialog}>
          <DialogTrigger
            asChild
            className='border p-2 rounded-full cursor-pointer'
            onClick={() => setOpenDialog(true)}
          >
            <div>
              <Plus size={20} />
            </div>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Create product</DialogTitle>
            </DialogHeader>
            <form
              className='grid gap-4 py-4'
              onSubmit={handleSubmitCreateProduct}
            >
              {fileData.image && (
                <div className='grid grid-cols-4 items-center gap-4'>
                  <div className='col-start-2 col-span-3 flex justify-center'>
                    <Image
                      src={fileData.image || ""}
                      alt='preview'
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
              )}

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='image' className='text-right'>
                  Image
                </Label>
                <div className='col-span-3'>
                  <Input
                    id='image'
                    type='file'
                    accept='image/*'
                    onChange={handleUploadImage}
                    placeholder='choose file'
                  />
                  {warningText && (
                    <p className='text-destructive text-sm'>{warningText}</p>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='product-name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='product-name'
                  value={newProduct.name}
                  className='col-span-3'
                  onChange={(e) =>
                    setNewProduct((product) => ({
                      ...product,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='price' className='text-right'>
                  Price
                </Label>
                <Input
                  id='price'
                  value={newProduct.price}
                  className='col-span-3'
                  onChange={(e) =>
                    setNewProduct((product) => ({
                      ...product,
                      price: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='category' className='text-right'>
                  Category
                </Label>
                <Select
                  onValueChange={handleCategory}
                  value={String(newProduct.category)}
                >
                  <SelectTrigger className='w-full col-span-3'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value='1'>Body</SelectItem>
                      <SelectItem value='2'>Face</SelectItem>
                      <SelectItem value='3'>Oral</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Button type='submit' className='col-start-4'>
                  Create
                </Button>
                <Button
                  variant={"destructive"}
                  className='col-start-3 row-start-1'
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <NoItems />
      ) : (
        <ul className='grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4'>
          {products.map((product, index) => (
            <li key={index}>
              <Card>
                <CardContent className='p-6'>
                  <form
                    action=''
                    onSubmit={(e) => handleSubmitEdit(e, product.id)}
                  >
                    <div className='space-y-2'>
                      <div className='relative w-full aspect-square'>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill={true}
                          style={{ objectFit: "cover" }}
                          sizes={"30vw"}
                        />
                      </div>
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
                        <Label htmlFor='price'>Price</Label>
                        <Input
                          id='price'
                          type='text'
                          value={product.price}
                          onChange={(e) => handleEditPrice(e, product.id)}
                          disabled={!product.isEdit}
                        />
                      </div>
                      <div>
                        <Label htmlFor='price'>Category</Label>
                        <Select
                          disabled={!product.isEdit}
                          value={String(product.category)}
                          onValueChange={(e) =>
                            handleEditCategory(e, product.id)
                          }
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Category</SelectLabel>
                              <SelectItem value='1'>Body</SelectItem>
                              <SelectItem value='2'>Face</SelectItem>
                              <SelectItem value='3'>Oral</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className='flex gap-2 mt-4'>
                      {product.isEdit && (
                        <Button
                          type='submit'
                          className='flex-1'
                          variant={product.isEdit ? "default" : "secondary"}
                        >
                          Submit
                        </Button>
                      )}

                      {!product.isEdit && (
                        <Button
                          className='flex-1'
                          variant={product.isEdit ? "default" : "secondary"}
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
