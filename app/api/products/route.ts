import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(req: NextRequest) {
  try {
    const category = req?.url?.split("?")[1]?.split("=")[1];

    const products = await prisma.products.findMany({
      where: { category: Number(category) || undefined },
      include: {
        wishlist: true,
        order_histories: {
          select: {
            id: true,
            review: true,
            amount: true,
            rating: true,
          },
        },
      },
    });

    const data = products.map((product) => {
      const sold = product.order_histories.reduce((acc: any, curr: any) => {
        return acc + curr.amount;
      }, 0);

      const totalScore = product.order_histories.reduce(
        (acc: any, curr: any) => {
          return acc + curr.amount * curr.rating;
        },
        0
      );

      const rating = (totalScore / sold).toFixed(1);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        sold: sold,
        rating: rating || 0,
        isWishlist: product.wishlist ? true : false,
      };
    });

    return NextResponse.json({ message: "success", products: data });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name;
    const price = body.price;
    const category = body.category;
    const image = body.image;

    const newProduct = await prisma.products.create({
      data: { name, price, category, image },
    });

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message });

    return NextResponse.json({ message: (error as Error).message });
  }
}
