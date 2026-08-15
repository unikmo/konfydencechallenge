import { NextRequest, NextResponse } from "next/server";

// Gates /admin with HTTP Basic Auth. The route fails closed if credentials are
// not configured, so a missing environment variable can never expose admin.
export function proxy(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex > 0) {
      const user = decoded.slice(0, separatorIndex);
      const password = decoded.slice(separatorIndex + 1);
      if (user === adminUser && password === adminPassword) {
        return NextResponse.next();
      }
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
