import { NextResponse } from "next/server";
import { COUNTRY_PROFILES } from "@/lib/countries";

export const dynamic = "force-dynamic";

type SourceCheck = {
  authority: string;
  name: string;
  url: string;
  live: boolean;
  statusCode: number | null;
};

async function checkSource(source: SourceCheck): Promise<SourceCheck> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(source.url, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Konfydence TravelSafe source check/1.0" },
    });
    return { ...source, live: response.ok, statusCode: response.status };
  } catch {
    return { ...source, live: false, statusCode: null };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(_request: Request, props: { params: Promise<{ country: string }> }) {
  const params = await props.params;
  const profile = COUNTRY_PROFILES[params.country];
  if (!profile) {
    return NextResponse.json({ error: "Country not found." }, { status: 404 });
  }

  const sources = await Promise.all(
    profile.sources.map((source) => checkSource({
      authority: source.authority,
      name: source.name,
      url: source.url,
      live: false,
      statusCode: null,
    })),
  );

  return NextResponse.json(
    {
      country: profile.name,
      checkedAt: new Date().toISOString(),
      sourceMode: "official-page-reachability",
      sources,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
