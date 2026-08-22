import Link from "next/link";

export default function CoMaSyDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Link className="comasyInsightsLauncher" href="/comasy/dashboard/insights?period=90">
        Trends &amp; reporting <span>↗</span>
      </Link>
      <style>{`
        .comasyInsightsLauncher{position:fixed;right:18px;bottom:18px;z-index:80;display:inline-flex;align-items:center;gap:14px;padding:12px 15px;border-radius:999px;background:#b8ff3d;color:#071726;text-decoration:none;font:900 10px/1 Inter,system-ui,sans-serif;letter-spacing:.02em;box-shadow:0 14px 34px #07172638;border:1px solid #0717261f}.comasyInsightsLauncher span{font-size:13px}@media(max-width:780px){.comasyInsightsLauncher{right:12px;bottom:12px;padding:11px 13px}}
      `}</style>
    </>
  );
}
