import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

interface Props {
  params: Promise<{ image: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  const { image } = await params;
  const filePath = path.join(process.cwd(), "uploads", image);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}
