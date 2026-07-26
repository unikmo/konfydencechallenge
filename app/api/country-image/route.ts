import { NextRequest, NextResponse } from "next/server";

type CommonsMetadata = { value?: string };
type CommonsImageInfo = {
  thumburl?: string;
  width?: number;
  height?: number;
  mime?: string;
  extmetadata?: {
    Artist?: CommonsMetadata;
    LicenseShortName?: CommonsMetadata;
  };
};
type CommonsPage = { pageid?: number; title?: string; imageinfo?: CommonsImageInfo[] };

function isUsablePhoto(page: CommonsPage) {
  const image = page.imageinfo?.[0];
  const title = page.title ?? "";
  const ratio = image?.width && image.height ? image.width / image.height : 0;
  const excluded = /map|flag|logo|coat of arms|diagram|chart|symbol|icon|seal|plan|location/i.test(title);
  return Boolean(
    image &&
      image.thumburl &&
      image.mime?.startsWith("image/") &&
      image.mime !== "image/svg+xml" &&
      (image.width ?? 0) >= 640 &&
      (image.height ?? 0) >= 400 &&
      ratio >= 0.9 &&
      ratio <= 3.2 &&
      !excluded,
  );
}

function cleanMetadata(value?: string) {
  return value?.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, "").replace(/\s+/g, " ").trim();
}

export async function GET(request: NextRequest) {
  const landmark = request.nextUrl.searchParams.get("landmark")?.trim();
  const country = request.nextUrl.searchParams.get("country")?.trim();
  if (!landmark) return NextResponse.json({ error: "A landmark is required." }, { status: 400 });

  const apiUrl = new URL("https://commons.wikimedia.org/w/api.php");
  apiUrl.searchParams.set("action", "query");
  apiUrl.searchParams.set("generator", "search");
  apiUrl.searchParams.set("gsrnamespace", "6");
  apiUrl.searchParams.set("gsrsearch", country ? landmark + " " + country : landmark);
  apiUrl.searchParams.set("gsrlimit", "20");
  apiUrl.searchParams.set("prop", "imageinfo");
  apiUrl.searchParams.set("iiprop", "url|size|mime|extmetadata");
  apiUrl.searchParams.set("iiurlwidth", "1200");
  apiUrl.searchParams.set("format", "json");
  apiUrl.searchParams.set("origin", "*");

  try {
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Konfydence TravelSafe local image preparation/1.0" },
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!response.ok) return NextResponse.json({ error: "The image source is temporarily unavailable." }, { status: 502 });
    const data = await response.json() as { query?: { pages?: Record<string, CommonsPage> } };
    const page = Object.values(data.query?.pages ?? {}).find(isUsablePhoto);
    const image = page?.imageinfo?.[0];
    if (!page || !image?.thumburl) return NextResponse.json({ error: "No suitable landmark photograph was found." }, { status: 404 });

    return NextResponse.json({
      imageUrl: image.thumburl,
      sourceUrl: "https://commons.wikimedia.org/?curid=" + (page.pageid ?? ""),
      title: page.title?.replace(/^File:/, "") ?? landmark,
      artist: cleanMetadata(image.extmetadata?.Artist?.value) ?? "Wikimedia Commons contributor",
      license: cleanMetadata(image.extmetadata?.LicenseShortName?.value) ?? "See local source metadata",
      width: image.width,
      height: image.height,
    }, { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ error: "The image source is temporarily unavailable." }, { status: 502 });
  }
}

