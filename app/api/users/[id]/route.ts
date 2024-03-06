import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const username = body.username;
    const role = body.role;
    const updateUser = await prisma.users.update({
      where: { id },
      data: { username, role },
    });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message });

    return NextResponse.json({ message: (error as Error).message });
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const id = Number(params.id);
    const deleteUser = await prisma.users.delete({
      where: { id },
    });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message });
  }
}
