import Link from "next/link";
import type { ReactNode } from "react";

export function PremiumHeader({ ctaHref = "/challenge/travelsafe/start?mode=diagnostic", ctaLabel = "Start challenge" }: { ctaHref?: string; ctaLabel?: string }) {
  return (
    <header className="k-shell k-nav">
      <Link href="/" className="k-brand" aria-label="Konfydence home">
        <span className="k-brand-mark">K</span>
        <span>Konfydence</span>
      </Link>
      <nav className="k-nav-links" aria-label="Primary navigation">
        <Link href="/challenge">Experiences</Link>
        <Link href="/products">Products</Link>
        <Link href="/hack-method">Method</Link>
        <Link href="/comasy">For organisations</Link>
        <Link href="/countries">Travel intelligence</Link>
      </nav>
      <div className="k-nav-actions">
        <Link href="/comasy/dashboard/login" className="k-nav-login">Login</Link>
        <Link href={ctaHref} className="k-button">{ctaLabel} <span aria-hidden>↗</span></Link>
      </div>
    </header>
  );
}

export function PremiumFooter() {
  return (
    <footer className="k-footer">
      <div className="k-shell k-footer-inner">
        <div>
          <Link href="/" className="k-brand"><span className="k-brand-mark">K</span><span>Konfydence</span></Link>
          <p>Practise the pause before the pressure is real.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/challenge">Challenges</Link>
          <Link href="/products">Products</Link>
          <Link href="/comasy">CoMaSy</Link>
          <Link href="/countries">Countries</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/imprint">Imprint</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-of-service">Terms</Link>
          <Link href="/cookie-policy">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}

export function PremiumPage({ children, ctaHref, ctaLabel }: { children: ReactNode; ctaHref?: string; ctaLabel?: string }) {
  return (
    <main className="k-site">
      <PremiumHeader ctaHref={ctaHref} ctaLabel={ctaLabel} />
      {children}
      <PremiumFooter />
    </main>
  );
}
