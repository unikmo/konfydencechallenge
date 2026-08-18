import { NextResponse } from "next/server";
import { getBackendHealth } from "@/lib/backendHealth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const health = await getBackendHealth();
    return NextResponse.json(health, {
      status: health.ready ? 200 : 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      {
        ready: false,
        database: "unavailable",
        error: "backend_unavailable",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
}
