import { NextRequest, NextResponse } from "next/server";
import { SCAM_SAFETY_RESOURCE_MAP } from "@/lib/scamSafetyResources";

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

function filenameFor(resourceId: string, preview: boolean) {
  const resource = SCAM_SAFETY_RESOURCE_MAP.get(resourceId);
  if (!resource) return "Konfydence-resource";

  if (resource.kind === "protocol") {
    return preview
      ? "Konfydence-Emergency-Scam-Protocol.png"
      : "Konfydence-Emergency-Scam-Protocol.pdf";
  }

  const number = resource.id.split("-")[1] || "01";
  const device = resource.kind === "phone" ? "Phone" : "Computer";
  return safeFilename(`Konfydence-${device}-Lock-Screen-${number}.jpg`);
}

export async function GET(request: NextRequest) {
  const resourceId = String(request.nextUrl.searchParams.get("resource") || "");
  const preview = request.nextUrl.searchParams.get("preview") === "1";
  const resource = SCAM_SAFETY_RESOURCE_MAP.get(resourceId);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  if (preview) {
    return NextResponse.redirect(new URL(resource.previewPath, request.url), 307);
  }

  const fileId = resource.fileId;
  const upstreamUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      redirect: "follow",
      headers: { "User-Agent": "KonfydenceResourceDelivery/1.0" },
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      console.error("Drive resource fetch failed:", resourceId, upstream.status);
      return NextResponse.json({ error: "Resource is temporarily unavailable." }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    if (contentType.includes("text/html")) {
      console.error("Drive resource fetch returned HTML:", resourceId);
      return NextResponse.json({ error: "Resource is temporarily unavailable." }, { status: 502 });
    }

    const bytes = await upstream.arrayBuffer();
    const filename = filenameFor(resourceId, preview);

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bytes.byteLength),
        "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${filename}"`,
        "Cache-Control": preview
          ? "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
          : "private, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Drive resource proxy error:", resourceId, error);
    return NextResponse.json({ error: "Resource is temporarily unavailable." }, { status: 502 });
  }
}
