import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const kfUid = cookieStore.get("kf_uid")?.value;

    if (!kfUid) {
      return NextResponse.json({ entitlements: [] });
    }

    // Find user by kf_uid (which is stored as id)
    const user = await prisma.user.findUnique({
      where: { id: kfUid },
      include: {
        entitlements: {
          where: { status: "active" },
          select: {
            tier: true,
            edition: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ entitlements: [] });
    }

    return NextResponse.json({
      entitlements: user.entitlements,
    });
  } catch (error) {
    console.error("Error fetching entitlements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
