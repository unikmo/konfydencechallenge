import { NextResponse } from "next/server";
import { AGE_BAND_COOKIE, AGE_BAND_MAX_AGE_SECONDS, ageBandFromBirthMonth, readAgeBand } from "@/lib/challenge/ageGate";

const safePath = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : null;

// Records a coarse age band for the age screen (free-round sign-up and results gate).
// The birth month and year are read, turned into a band and discarded. They are
// never stored or logged. Once a band exists the screen cannot be re-submitted
// until the cookie expires, so a child cannot go back and enter a different year.
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/challenge/register", request.url), 303);
  }
  const lang = String(formData.get("lang") ?? "") === "de" ? "de" : "en";
  const registerPath = lang === "de" ? "/de/challenge/registrieren" : "/challenge/register";
  const next = safePath(String(formData.get("next") ?? "")) ?? "/challenge";
  const returnTo = safePath(String(formData.get("return") ?? "")) ?? `${registerPath}?next=${encodeURIComponent(next)}`;
  const withError = (path: string) => `${path}${path.includes("?") ? "&" : "?"}ageError=1`;

  if (readAgeBand(request.headers.get("cookie"))) {
    return NextResponse.redirect(new URL(returnTo, request.url), 303);
  }

  const band = ageBandFromBirthMonth(Number(formData.get("month")), Number(formData.get("year")));
  if (!band) return NextResponse.redirect(new URL(withError(returnTo), request.url), 303);

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(AGE_BAND_COOKIE, band, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AGE_BAND_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}
