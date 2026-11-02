import type { Metadata } from "next";
import { PoPageView } from "@/components/lockscreens/PoPageView";

export const metadata: Metadata = {
  title: "Bestellung | Konfydence Lockscreens",
  robots: { index: false, follow: false },
};

export default async function WorkplaceBestellungDokumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PoPageView tier="workplace" id={id} lang="de" />;
}
