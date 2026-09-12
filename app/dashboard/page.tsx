import { redirect } from "next/navigation";

// The player dashboard moved to /account with the unified-accounts work
// (docs/UNIFIED_ACCOUNTS_PLAN.md). Keep the old URL working.
export const dynamic = "force-dynamic";

export default async function DashboardPage(props: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await props.searchParams;
  redirect(sp.lang === "de" ? "/account?lang=de" : "/account");
}
