import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSessionCookie, verifyAccessCode } from "@/lib/comasyAuth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim().toLowerCase();
  const accessCode = String(form.get("accessCode") ?? "").trim();
  const next = String(form.get("next") ?? "/comasy/dashboard");
  const de = (String(form.get("lang") ?? "") || request.cookies.get("kf_lang")?.value) === "de";
  const loginError = `/comasy/dashboard/login?error=1${de ? "&lang=de" : ""}`;
  if (!slug || accessCode.length < 6) return NextResponse.redirect(new URL(loginError, request.url), 303);

  const org = await prisma.comasyOrganization.findUnique({
    where: { slug },
    select: { id: true, accessCodeHash: true, accessCodeSalt: true },
  });
  if (!org?.accessCodeHash || !org.accessCodeSalt || !verifyAccessCode(accessCode, org.accessCodeSalt, org.accessCodeHash)) {
    return NextResponse.redirect(new URL(loginError, request.url), 303);
  }

  const cookie = customerSessionCookie(org.id);
  const baseDestination = next.startsWith("/comasy/") ? next : "/comasy/dashboard";
  const destination = de && !baseDestination.includes("lang=") ? `${baseDestination}${baseDestination.includes("?") ? "&" : "?"}lang=de` : baseDestination;
  const response = NextResponse.redirect(new URL(destination, request.url), 303);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
