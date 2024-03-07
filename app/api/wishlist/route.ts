import prisma from "@/lib/prisma";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { number } from "zod";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = Number(searchParams.get("userId")) || undefined;
    const productId = Number(searchParams.get("productId")) || undefined;

    const wishlist = await prisma.wishlist.findMany({
      where: {
        user_id: userId,
        product_id: productId,
      },
      include: {
        products: {
          select: {
            name: true,
            image: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({ message: "success", wishlist });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientUnknownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = Number(body.userId);
    const productId = Number(body.productId);

    const wishlist = await prisma.wishlist.create({
      data: { user_id: userId, product_id: productId },
    });

    return NextResponse.json({ message: "success", wishlist }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientUnknownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
