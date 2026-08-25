import type { Metadata } from "next";
import { COUNTRY_PROFILES } from "@/lib/countries";

export async function generateMetadata(props: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await props.params;
  const profile = COUNTRY_PROFILES[country];
  if (!profile) return {};

  const hasPublishedResearch = profile.scamResearch.some((item) => item.status === "published");

  return {
    title: { absolute: `${profile.name} Scam Alerts & Travel Safety | Konfydence` },
    description: `Travel scam-awareness resources and official travel-safety source links for ${profile.name}.`,
    alternates: { canonical: `/countries/${profile.slug}` },
    robots: { index: hasPublishedResearch, follow: true },
  };
}

export default function CountryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
