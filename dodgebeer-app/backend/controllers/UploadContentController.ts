import { ApiError, ApiSuccess } from "@/types/api";
import * as process from "node:process";
import path from "path";
import { writeFile } from "fs/promises";

export async function uploadPlayerImage(file: File) {
  if (!file) {
    return ApiError({ status: 400, message: "Could not upload player photo" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = file.name;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filePath, buffer);

  return ApiSuccess<null>(null);
}
