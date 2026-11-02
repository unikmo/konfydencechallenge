import type { Metadata } from "next";
import { AdminPageView } from "@/components/lockscreens/AdminPageView";

export const metadata: Metadata = {
  title: "Lockscreens verwalten | Konfydence",
  robots: { index: false, follow: false },
};

export default async function SchoolVerwaltungPage({ params }: { params: Promise<{ adminToken: string }> }) {
  const { adminToken } = await params;
  return <AdminPageView tier="school" adminToken={adminToken} lang="de" />;
}
