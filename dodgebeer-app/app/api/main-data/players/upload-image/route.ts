import { NextRequest } from "next/server";
import { uploadPlayerImage } from "@backend/controllers/UploadContentController";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("photo") as File;
  return uploadPlayerImage(file);
}
