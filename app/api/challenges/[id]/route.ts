import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { body } = request;
  return NextResponse.json({
    data: body,
  });
}
