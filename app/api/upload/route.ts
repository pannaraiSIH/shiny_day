import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const file = req.body || "";
    const headersList = headers();
    const contentType = headersList.get("content-type") || "text/plain";
    const date = new Date().getTime();
    const fileName = `${date}.${contentType.split("/")[1]}`;
    const blob = await put(fileName, file, {
      contentType,
      access: "public",
    });

    return NextResponse.json({ message: "success", blob });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
