import type { Metadata } from "next";
import { PoPageView } from "@/components/lockscreens/PoPageView";

export const metadata: Metadata = {
  title: "Purchase order | Konfydence Lockscreens",
  robots: { index: false, follow: false },
};

export default async function SchoolLockscreenPurchaseOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PoPageView tier="school" id={id} lang="en" />;
}
