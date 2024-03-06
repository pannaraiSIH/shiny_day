import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { useSearchParams } from "next/navigation";

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
    console.log(reviews);

    const histories = await prisma.order_histories.createMany({
      data: reviews,
    });

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message });

    return NextResponse.json({ message: (error as Error).message });
  }
}
