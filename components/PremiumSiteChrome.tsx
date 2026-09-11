"use client";

import Link from "next/link";
import type { ReactNode } from "react";

function KonfydenceLogo() {
  return <span className="k-brand-logo" aria-hidden="true" />;
}

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
        <KonfydenceLogo />
      </Link>
      <nav className="k-nav-links" aria-label="Primary navigation">
        <Link href="/challenge">Challenges</Link>
        <Link href="/travelsafe">TravelSafe</Link>
        <Link href="/lockscreens">Lockscreens</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/comasy">For organisations</Link>
        <Link href="/free-scam-safety-pack">Resources</Link>
      </nav>
      <div className="k-nav-actions">
        <Link href="/de" className="k-lang-switch" aria-label="Auf Deutsch ansehen">DE</Link>
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
          <Link href="/" className="k-brand" aria-label="Konfydence home"><KonfydenceLogo /></Link>
          <p>Confidence under pressure.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/challenge">Challenges</Link>
          <Link href="/travelsafe">TravelSafe</Link>
          <Link href="/lockscreens">Lockscreens</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/comasy">CoMaSy</Link>
          <Link href="/gift">Gift a challenge</Link>
          <Link href="/free-scam-safety-pack">Free safety resources</Link>
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

// --- German (/de) chrome ---------------------------------------------------
// Deliberately a separate, smaller nav rather than a translated copy of the
// English one: only the pages that actually exist in German so far (Stage 4,
// in progress — see data/scenarios-de/README.md). Points back to the English
// site via the "EN" switch and the German-labelled Impressum/Datenschutz/AGB.

export function PremiumHeaderDe({
  ctaHref = "/de/challenge/family/start?mode=diagnostic",
  ctaLabel = "Kostenlos starten",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <header className="k-shell k-nav">
      <Link href="/de" className="k-brand" aria-label="Konfydence Startseite">
        <KonfydenceLogo />
      </Link>
      <nav className="k-nav-links" aria-label="Hauptnavigation">
        <Link href="/de/challenge">Challenge</Link>
        <Link href="/de/pricing">Preise</Link>
      </nav>
      <div className="k-nav-actions">
        <Link href="/" className="k-lang-switch" aria-label="View in English">EN</Link>
        <Link href={ctaHref} className="k-button">{ctaLabel}</Link>
      </div>
    </header>
  );
}

export function PremiumFooterDe() {
  return (
    <footer className="k-footer">
      <div className="k-shell k-footer-inner">
        <div>
          <Link href="/de" className="k-brand" aria-label="Konfydence Startseite"><KonfydenceLogo /></Link>
          <p>Vertrauen unter Druck.</p>
        </div>
        <nav aria-label="Fußzeilen-Navigation">
          <Link href="/de/challenge">Challenge</Link>
          <Link href="/de/pricing">Preise</Link>
          <Link href="/de/impressum">Impressum</Link>
          <Link href="/de/datenschutz">Datenschutz</Link>
          <Link href="/de/agb">AGB</Link>
        </nav>
      </div>
    </footer>
  );
}

export function PremiumPageDe({
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
      <PremiumHeaderDe ctaHref={ctaHref} ctaLabel={ctaLabel} />
      {children}
      <PremiumFooterDe />
    </main>
  );
}
