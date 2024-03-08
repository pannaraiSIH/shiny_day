import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const histories = await prisma.order_histories.findMany();

    return NextResponse.json({ message: "success", histories: histories });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message });

    return NextResponse.json({ message: (error as Error).message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reviews = body.reviews;
    // console.log(reviews);

    const histories = await prisma.order_histories.createMany({
      data: reviews,
    });

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2003"
    )
      return NextResponse.json({ message: error.message }, { status: 400 });

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
