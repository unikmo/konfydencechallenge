import { NextRequest, NextResponse } from "next/server";

// Gates /admin with HTTP Basic Auth. app/admin/page.tsx has no login of its own —
// it was a publicly reachable "V1 placeholder" dashboard that anyone who found or
// guessed the URL could open (robots.txt disallows crawlers, but that doesn't stop
// a human visiting it directly). Requires ADMIN_USER/ADMIN_PASSWORD env vars; if
// either is missing this fails closed (blocks the route) rather than leaving it open.
export function middleware(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (user === adminUser && password === adminPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Konfydence Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
