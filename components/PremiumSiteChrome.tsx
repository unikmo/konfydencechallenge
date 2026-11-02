"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Language switch: go to the equivalent page, not just the other home page.
const EN_TO_DE: Record<string, string> = {
  "/": "/de",
  "/pilot": "/de/pilot",
  "/pilot/schools": "/de/pilot/schulen",
  "/comasy": "/de/comasy",
  "/comasy/pilot": "/de/comasy/pilotprojekt",
  "/comasy/pilot/thank-you": "/de/comasy/pilotprojekt",
  "/comasy/security": "/de/comasy/sicherheit",
  "/comasy/methodology": "/de/comasy/methodik",
  "/comasy/nis2-security-awareness": "/de/comasy/nis2-sicherheitsbewusstsein",
  "/privacy-policy": "/de/datenschutz",
  "/cookie-policy": "/de/cookie-richtlinie",
  "/terms-of-service": "/de/agb",
  "/imprint": "/de/impressum",
  "/pricing": "/de/pricing",
  "/challenge": "/de/challenge",
  "/challenge/register": "/de/challenge/registrieren",
  "/lockscreens": "/de/lockscreens",
  "/lockscreens/security-awareness-lock-screens": "/de/lockscreens/sicherheitsbewusstsein-sperrbildschirm",
  "/lockscreens/intune": "/de/lockscreens/intune",
  "/lockscreens/jamf": "/de/lockscreens/jamf",
  "/lockscreens/security-awareness-posters": "/de/lockscreens/sicherheitsplakate",
  "/lockscreens/phishing-awareness-between-trainings": "/de/lockscreens/phishing-sensibilisierung-zwischen-schulungen",
  "/lockscreens/family-scam-protection": "/de/lockscreens/familie-betrugsschutz",
  "/lockscreens/school/order": "/de/lockscreens/school/order",
  "/lockscreens/workplace/order": "/de/lockscreens/workplace/order",
  "/lockscreens/thank-you": "/de/lockscreens/danke",
  "/play": "/de/spielen",
  "/teams": "/de/teams",
  "/teams/join": "/de/teams/join",
  "/hack-method": "/de/hack-method",
  "/countries": "/de/countries",
  "/country-alerts": "/de/laender-warnungen",
  "/contact": "/de/kontakt",
  "/gift": "/de/geschenk",
  "/gift/redeem": "/de/geschenk/einloesen",
  "/gift/thank-you": "/de/geschenk/danke",
  "/free-scam-safety-pack": "/de/gratis-sicherheitspaket",
  "/travelsafe": "/de/travelsafe",
  "/family": "/de/family",
  "/school": "/de/school",
  "/university": "/de/university",
  "/workplace": "/de/workplace",
  "/security-awareness-training": "/de/sicherheitsbewusstsein-schulung",
  "/cybersecurity-awareness-training-for-employees": "/de/cybersicherheit-schulung-mitarbeiter",
  "/social-engineering-training": "/de/social-engineering-schulung",
  "/security-decision-simulation": "/de/entscheidungssimulation-sicherheit",
};
const DE_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_DE).filter(([en]) => en !== "/comasy/pilot/thank-you").map(([en, de]) => [de, en])
);
const trim = (path: string) => (path.length > 1 ? path.replace(/[/]+$/, "") : path);

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
  const deHref = EN_TO_DE[trim(usePathname() ?? "/")] ?? "/de";
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
        <Link href="/pilot">Schools &amp; Teams</Link>
        <Link href="/free-scam-safety-pack">Resources</Link>
      </nav>
      <div className="k-nav-actions">
        <Link href={deHref} className="k-lang-switch" aria-label="Auf Deutsch ansehen">DE</Link>
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
          <Link href="/pilot">Schools &amp; Teams pilots</Link>
          <Link href="/comasy">CoMaSy</Link>
          <Link href="/comasy/security">CoMaSy security</Link>
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
  const enHref = DE_TO_EN[trim(usePathname() ?? "/de")] ?? "/";
  return (
    <header className="k-shell k-nav">
      <Link href="/de" className="k-brand" aria-label="Konfydence Startseite">
        <KonfydenceLogo />
      </Link>
      <nav className="k-nav-links" aria-label="Hauptnavigation">
        <Link href="/de/challenge">Challenge</Link>
        <Link href="/de/lockscreens">Lockscreens</Link>
        <Link href="/de/pricing">Preise</Link>
        <Link href="/de/pilot">Schulen &amp; Teams</Link>
      </nav>
      <div className="k-nav-actions">
        <Link href={enHref} className="k-lang-switch" aria-label="View in English">EN</Link>
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
          <Link href="/de/lockscreens">Lockscreens</Link>
          <Link href="/de/pricing">Preise</Link>
          <Link href="/de/pilot">Schulen &amp; Teams Pilotprojekte</Link>
          <Link href="/de/comasy">CoMaSy</Link>
          <Link href="/de/comasy/sicherheit">CoMaSy Sicherheit</Link>
          <Link href="/de/hack-method">Methode</Link>
          <Link href="/de/countries">Länder-Betrugswarnungen</Link>
          <Link href="/de/kontakt">Kontakt</Link>
          <Link href="/de/geschenk">Challenge verschenken</Link>
          <Link href="/de/gratis-sicherheitspaket">Kostenloses Merkblatt</Link>
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
