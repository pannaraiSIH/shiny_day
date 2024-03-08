import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const histories = await prisma.order_histories.findMany({
      take: 10,
      where: { rating: { gte: 4 } },
      include: {
        users: { select: { username: true } },
        products: { select: { image: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ message: "success", histories: histories });
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
