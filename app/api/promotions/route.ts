import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const promotions = await prisma.promotions.findMany({
      select: {
        id: true,
        name: true,
        discount: true,
        period: true,
        condition: true,
        status: true,
      },
    });

    return NextResponse.json({ message: "success", promotions: promotions });
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
    const name = body.name;
    const discount = body.discount;
    const period = body.period;
    const condition = body.condition;
    const status = body.status;
    const product_id = 1;

    const createPromotion = await prisma.promotions.create({
      data: { name, discount, period, condition, status, product_id },
    });

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message });

    return NextResponse.json({ message: (error as Error).message });
  }
}
