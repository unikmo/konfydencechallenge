import type { Metadata } from "next";
import { AdminPageView } from "@/components/lockscreens/AdminPageView";

export const metadata: Metadata = {
  title: "Manage your lockscreens | Konfydence",
  robots: { index: false, follow: false },
};

export default async function WorkplaceLockscreenAdminPage({ params }: { params: Promise<{ adminToken: string }> }) {
  const { adminToken } = await params;
  return <AdminPageView tier="workplace" adminToken={adminToken} lang="en" />;
}
