import { PremiumPage } from "@/components/PremiumSiteChrome";
import { LockscreenOrderForm } from "@/components/lockscreens/LockscreenOrderForm";

export default function SchoolLockscreenOrderPage() {
  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 32 }}>
        <p className="k-kicker">Lockscreens for Schools</p>
        <h1>Get an instant quote and purchase order.</h1>
        <p>
          $2 per managed computer per year, $150 minimum annual licence. Computers and managed tablets only —
          no phones. Fill this in and we generate a numbered purchase order immediately — a Konfydence rep
          confirms payment terms before the licence activates.
        </p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 64 }}>
        <LockscreenOrderForm tier="school" />
      </section>
    </PremiumPage>
  );
}
