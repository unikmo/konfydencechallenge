import https from "node:https";
import { NextResponse } from "next/server";
import { COUNTRY_PROFILES, type CountryProfile } from "@/lib/countries";

export const dynamic = "force-dynamic";

const CANADA_LEVELS = [
  "Take normal security precautions",
  "Exercise a high degree of caution",
  "Avoid non-essential travel",
  "Avoid all travel",
] as const;

const NZ_LEVELS = [
  "Exercise normal safety and security precautions",
  "Exercise increased caution",
  "Avoid non-essential travel",
  "Do not travel",
] as const;

type OfficialRisk = {
  authority: "Canada" | "New Zealand";
  url: string;
  live: boolean;
  statusCode?: number;
  riskLevel?: string;
  levelNumber?: 1 | 2 | 3 | 4;
  scamGuidance?: string[];
  lastUpdated?: string;
  error?: string;
};

function textFromHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function firstPhrase(text: string, phrases: readonly string[]) {
  const lower = text.toLowerCase();
  return phrases
    .map((phrase) => ({ phrase, index: lower.indexOf(phrase.toLowerCase()) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index)[0]?.phrase;
}

function getLevelNumber(level: string | undefined, levels: readonly string[]) {
  const index = level ? levels.indexOf(level) : -1;
  return index >= 0 ? (index + 1) as 1 | 2 | 3 | 4 : undefined;
}

const SCAM_KEYWORDS = /scam|fraud|fraudulent|phishing|identity theft|card skimming|credit card|atm|fake payment|online fraud|cybercrime|counterfeit|pickpocket|theft|robbery|money transfer/i;

function extractScamGuidance(text: string) {
  const sentences = text.split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim().replace(/\s+/g, String.fromCharCode(32)))
    .filter((sentence) => sentence.length >= 45 && sentence.length <= 280 && SCAM_KEYWORDS.test(sentence));
  return Array.from(new Set(sentences)).slice(0, 3);
}

function parseCanada(html: string, country: CountryProfile) {
  const text = textFromHtml(html);
  if (country.slug === "canada") return { level: "No separate Canadian destination advisory", updated: undefined };
  if (country.slug === "vatican-city") return { level: "No separate Canadian destination page", updated: undefined };

  const lower = text.toLowerCase();
  const riskIndex = lower.indexOf("risk level");
  const riskSection = text.slice(riskIndex >= 0 ? riskIndex : 0, (riskIndex >= 0 ? riskIndex : 0) + 4200);
  const level = firstPhrase(riskSection, CANADA_LEVELS);
  const updated = text.match(/Last updated:\s*([A-Za-z]+ \d{1,2}, \d{4}(?: \d{1,2}:\d{2} [A-Z]+)?)/i)?.[1];
  return { level, updated, levelNumber: getLevelNumber(level, CANADA_LEVELS), scamGuidance: extractScamGuidance(text) };
}

function parseNewZealand(html: string, country: CountryProfile) {
  const text = textFromHtml(html);
  if (country.slug === "vatican-city") return { level: "No separate New Zealand destination page", updated: undefined };
  if (country.slug === "new-zealand") return { level: "No self-destination advisory", updated: undefined };
  const lower = text.toLowerCase();
  const adviceIndex = lower.indexOf("advice level");
  const adviceSection = text.slice(adviceIndex >= 0 ? adviceIndex : 0, (adviceIndex >= 0 ? adviceIndex : 0) + 5200);
  const phrases = [
    "No advice level at this time",
    "No travel advisory",
    ...NZ_LEVELS,
  ];
  // SafeTravel can place the current level after a long overview or regional-advice section.
  // Fall back to the full official page so a valid country-level status is not reported as missing.
  const found = firstPhrase(adviceSection, phrases) ?? firstPhrase(text, phrases) ?? firstPhrase(html, phrases);
  const level = found === "No advice level at this time" || found === "No travel advisory"
    ? "No specific travel advisory"
    : found;
  const updated = text.match(/Page updated\s*([A-Za-z]+ \d{1,2}, \d{4})/i)?.[1]
    ?? text.match(/Still current at:\s*([A-Za-z]+ \d{1,2}, \d{4})/i)?.[1];
  return { level, updated, levelNumber: getLevelNumber(level, NZ_LEVELS), scamGuidance: extractScamGuidance(text) };
}
function fetchOverHttps(url: string, headers: Record<string, string>): Promise<{ statusCode: number; html: string }> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, (response) => {
      const chunks: Buffer[] = [];
      const location = response.headers.location;
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && typeof location === "string") {
        response.resume();
        resolve(fetchOverHttps(new URL(location, url).toString(), headers));
        return;
      }
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({
        statusCode: response.statusCode ?? 0,
        html: Buffer.concat(chunks).toString("utf8"),
      }));
    });
    request.setTimeout(15000, () => request.destroy(new Error("Request timed out.")));
    request.on("error", reject);
  });
}
async function fetchRisk(
  authority: OfficialRisk["authority"],
  url: string,
  country: CountryProfile,
): Promise<OfficialRisk> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    let statusCode = 0;
    let responseOk = false;
    let html = "";
    if (authority === "New Zealand" && country.slug === "cote-d-ivoire") {
      const response = await fetchOverHttps(url, {});
      statusCode = response.statusCode;
      responseOk = response.statusCode >= 200 && response.statusCode < 300;
      html = response.html;
    } else {
      const response = await fetch(url, {
        headers: { "User-Agent": "Konfydence official travel risk check/1.0", "Accept": "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.9" },
        cache: "no-store",
        signal: controller.signal,
      });
      statusCode = response.status;
      responseOk = response.ok;
      html = await response.text();
    }
    if (!responseOk) {
      return { authority, url, live: false, statusCode, error: "Official page unavailable." };
    }
    const parsed = authority === "Canada" ? parseCanada(html, country) : parseNewZealand(html, country);
    return {
      authority,
      url,
      live: true,
      statusCode,
      riskLevel: parsed.level ?? "Official page available; level not stated.",
      lastUpdated: parsed.updated,
      levelNumber: parsed.levelNumber,
      scamGuidance: parsed.scamGuidance ?? [],
      ...(!parsed.level ? { error: "The official page loaded, but no national level was extracted." } : {}),
    };
  } catch {
    return { authority, url, live: false, error: "Official page could not be checked right now." };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(_request: Request, props: { params: Promise<{ country: string }> }) {
  const params = await props.params;
  const country = COUNTRY_PROFILES[params.country];
  if (!country) {
    return NextResponse.json({ error: "Country not found." }, { status: 404 });
  }

  const official = await Promise.all([
    fetchRisk("Canada", country.sources[0].url, country),
    fetchRisk("New Zealand", country.sources[1].url, country),
  ]);

  return NextResponse.json(
    {
      country: country.name,
      checkedAt: new Date().toISOString(),
      official,
      covered: official.every((item) => item.live && Boolean(item.riskLevel) && !item.error),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    },
  );
}
