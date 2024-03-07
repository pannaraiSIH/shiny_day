import prisma from "@/lib/prisma";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    const wishlist = await prisma.wishlist.delete({ where: { id } });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    if (error instanceof PrismaClientUnknownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    const wishlist = await prisma.wishlist.delete({ where: { id } });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    if (error instanceof PrismaClientUnknownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
