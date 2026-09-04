import { PremiumPage } from "@/components/PremiumSiteChrome";
import { LockscreenOrderForm } from "@/components/lockscreens/LockscreenOrderForm";

export default function WorkplaceLockscreenOrderPage() {
  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 32 }}>
        <p className="k-kicker">Lockscreens for Workplace</p>
        <h1>Get an instant quote and purchase order.</h1>
        <p>
          $4 per employee per year, $300 minimum annual licence. Fill this in and we generate a numbered
          purchase order immediately — a Konfydence rep confirms payment terms before the licence activates.
        </p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 64 }}>
        <LockscreenOrderForm tier="workplace" />
      </section>
    </PremiumPage>
  );
}
