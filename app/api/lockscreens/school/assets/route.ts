import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const assets = await prisma.lockscreenAsset.findMany({
      where: { status: "live", track: "school" },
      orderBy: { number: "asc" },
      select: { number: true, category: true, hook: true, body: true, action: true, imagePath: true },
    });
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Lockscreen assets fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
