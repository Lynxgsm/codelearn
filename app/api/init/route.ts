import { createDir } from "@/helpers/file";
import { NextResponse } from "next/server";

export async function GET() {
  createDir("__tests__");
  return NextResponse.json({
    message: "created test directory",
  });
}
