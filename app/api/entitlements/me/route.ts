import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const kfUid = cookieStore.get("kf_uid")?.value;

    if (!kfUid) return NextResponse.json({ entitlements: [] });

    const user = await prisma.user.findUnique({
      where: { id: kfUid },
      include: {
        entitlements: {
          where: { status: "active" },
          select: { tier: true, edition: true },
        },
      },
    });

    return NextResponse.json({ entitlements: user?.entitlements ?? [] });
  } catch (error) {
    console.error("Error fetching entitlements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
