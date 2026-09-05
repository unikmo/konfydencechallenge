import { NextRequest, NextResponse } from "next/server";
import { getSessionTokenFromCookie, validateSessionToken, invalidateSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const token = await getSessionTokenFromCookie();
  if (token) {
    const { sessionId } = await validateSessionToken(token);
    if (sessionId) await invalidateSession(sessionId);
  }
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
