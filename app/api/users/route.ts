import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return NextResponse.json({ message: "success", users: users });
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
    const username = body.username;
    const password = body.password;
    // const role = body.role;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createUser = await prisma.users.create({
      data: { username, password: hashedPassword, role: "user" },
    });

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError)
      return NextResponse.json({ message: error.message });

    return NextResponse.json({ message: (error as Error).message });
  }
}
