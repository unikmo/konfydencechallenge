import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_COOKIE_NAME } from "@/lib/comasyAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/comasy/dashboard/login", request.url), 303);
  response.cookies.set(CUSTOMER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
