"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function PremiumHeader({
  ctaHref = "/challenge/travelsafe/start?mode=diagnostic",
  ctaLabel = "Get started",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <header className="k-shell k-nav">
      <Link href="/" className="k-brand" aria-label="Konfydence home">
        <span className="k-wordmark">konfydence.</span>
      </Link>
      <nav className="k-nav-links" aria-label="Primary navigation">
        <Link href="/travelsafe">For people</Link>
        <Link href="/comasy">For organisations</Link>
        <Link href="/hack-method">Method</Link>
        <Link href="/countries">Travel intelligence</Link>
      </nav>
      <div className="k-nav-actions">
        <Link href={ctaHref} className="k-button">{ctaLabel}</Link>
      </div>
    </header>
  );
}

export function PremiumFooter() {
  return (
    <footer className="k-footer">
      <div className="k-shell k-footer-inner">
        <div>
          <Link href="/" className="k-brand"><span className="k-wordmark">konfydence.</span></Link>
          <p>Confidence under pressure.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/travelsafe">TravelSafe</Link>
          <Link href="/comasy">CoMaSy</Link>
          <Link href="/hack-method">Method</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/imprint">Imprint</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-of-service">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

export function PremiumPage({
  children,
  ctaHref,
  ctaLabel,
}: {
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <main className="k-site">
      <PremiumHeader ctaHref={ctaHref} ctaLabel={ctaLabel} />
      {children}
      <PremiumFooter />
    </main>
  );
}
