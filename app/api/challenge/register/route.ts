import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readAgeBand } from "@/lib/challenge/ageGate";
import {
  ensureVisitorUser,
  isGuestEmail,
} from "@/lib/challenge/startSessionUtil";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/challenge";
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/challenge/register?error=invalid", request.url));
  }
  const registerPath = String(formData.get("lang") ?? "") === "de" ? "/de/challenge/registrieren" : "/challenge/register";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const consent = String(formData.get("consent") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || consent !== "yes") {
    return NextResponse.redirect(
      new URL(registerPath + "?error=invalid&next=" + encodeURIComponent(next), request.url)
    );
  }

  // Server-side age tiering: the age screen must have been completed, under-13s
  // cannot give an email address, and 13-15s can only register a parent or
  // guardian who confirms they are one.
  const band = readAgeBand(request.headers.get("cookie"));
  if (!band || band === "under13" || (band === "13to15" && String(formData.get("parent") ?? "") !== "yes")) {
    return NextResponse.redirect(
      new URL(registerPath + "?error=age&next=" + encodeURIComponent(next), request.url),
      303
    );
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)kf_uid=([^;]+)/);
  const existingKfUid = match?.[1];
  const kfUid = existingKfUid ?? randomUUID();
  const user = await ensureVisitorUser(kfUid);
  const existingEmailUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingEmailUser && existingEmailUser.id !== user.id) {
    const response = NextResponse.redirect(
      new URL(registerPath + "?error=already-used&next=" + encodeURIComponent(next), request.url)
    );
    if (!existingKfUid) response.cookies.set("kf_uid", kfUid, COOKIE_OPTIONS);
    return response;
  }

  if (!isGuestEmail(user.email) && user.email !== email) {
    return NextResponse.redirect(
      new URL(registerPath + "?error=already-used&next=" + encodeURIComponent(next), request.url)
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { email },
  });

  const response = NextResponse.redirect(new URL(next, request.url));
  if (!existingKfUid) response.cookies.set("kf_uid", kfUid, COOKIE_OPTIONS);
  return response;
}
