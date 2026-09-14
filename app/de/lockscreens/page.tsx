import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";
import { ScreenGallery, type GalleryTier } from "@/components/lockscreens/ScreenGallery";

export const metadata: Metadata = {
  title: { absolute: "Konfydence Lockscreens | Anhalten. Abklären. Ansprechen." },
  description:
    "Ein Sperrbildschirm-Dienst gegen Betrug. Gerät wählen, den ersten Screen einrichten, alle zwei Wochen ein neuer Anhalten · Abklären · Ansprechen-Hinweis.",
  alternates: {
    canonical: "/de/lockscreens",
    languages: { en: "https://konfydence.com/lockscreens", de: "https://konfydence.com/de/lockscreens" },
  },
  openGraph: {
    title: "Konfydence Lockscreens | Anhalten. Abklären. Ansprechen.",
    description: "Der ruhige Hinweis, den du wirklich siehst — alle zwei Wochen neu.",
    url: "https://konfydence.com/de/lockscreens",
    siteName: "Konfydence",
    type: "website",
  },
};

const howItWorks = [
  ["Auf konfydence.com kaufen", "Ein Checkout. Danach landest du auf einer Seite, die sagt: schütze dein erstes Gerät."],
  ["Gerät wählen", "iPhone, Android, Windows, Mac oder iPad. Wir zeigen automatisch das passende Format — kein Rätselraten, kein ZIP."],
  ["Screen eins einrichten", "Lade den ersten Hinweis herunter und folge ein paar kurzen, gerätespezifischen Schritten. Weitere Geräte kannst du ergänzen."],
  ["Alle zwei Wochen ein neuer Screen", "„Dein nächster Konfydence-Screen ist da.“ Ein Klick, ein Download. Wortlaut und Betrugsmuster bleiben aktuell."],
];

type Tier = {
  name: string;
  price: string;
  unit: string;
  renew: string;
  copy: string;
  cta: string;
  href?: string;
  sku?: "LOCKSCREENS-HOME" | "LOCKSCREENS-TEEN";
};

const tiers: Tier[] = [
  {
    name: "Home",
    price: "19,99 €",
    unit: "erstes Jahr",
    renew: "danach 14,99 € / Jahr",
    copy: "Ein Telefon. Alle zwei Wochen ein neuer Hinweis und dauerhafter Zugriff auf das komplette Set. Per E-Mail geliefert — jeden Screen als Hintergrundbild speichern.",
    cta: "Home holen — 19,99 €",
    sku: "LOCKSCREENS-HOME",
  },
  {
    name: "Teen Home",
    price: "19,99 €",
    unit: "erstes Jahr",
    renew: "danach 14,99 € / Jahr",
    copy: "Derselbe Dienst mit Hinweisen für das Handy eines Teenagers — Gaming-, Social- und Gruppendruck-Betrug.",
    cta: "Teen Home holen — 19,99 €",
    sku: "LOCKSCREENS-TEEN",
  },
  {
    name: "Schulen",
    price: "2 €",
    unit: "pro verwaltetem Computer / Jahr",
    renew: "Für geteilte und MDM-verwaltete Geräte ausgelegt",
    copy: "Eine Lizenz pro verwaltetem Computer. Ausgerollt auf Labor-, Bibliotheks- und Klassenzimmer-Rechner über eure Geräteverwaltung.",
    cta: "Sofort-Angebot erhalten",
    href: "/lockscreens/school/order",
  },
  {
    name: "Arbeitsplatz",
    price: "4 €",
    unit: "pro Mitarbeitendem / Jahr",
    renew: "300 € Mindestjahreslizenz",
    copy: "Lizenzierung pro Mitarbeitendem für Firmengeräte. Lässt sich mit einem CoMaSy-Pilotprojekt kombinieren, wenn ihr auch Verhalten messen wollt.",
    cta: "Sofort-Angebot erhalten",
    href: "/lockscreens/workplace/order",
  },
];

const screenGalleries: GalleryTier[] = [
  {
    name: "Home",
    blurb: "Bank-, Paket-, Familien- und Rückerstattungsbetrug — für ein Erwachsenen-Handy.",
    frame: "phone",
    shots: [
      "/lockscreens/home/phone/21.png",
      "/lockscreens/home/phone/45.png",
      "/lockscreens/home/phone/25.png",
    ],
  },
  {
    name: "Teen Home",
    blurb: "Gaming-, Social-, Deepfake- und Geldforderungs-Betrug — in der Sprache eines Teenagers.",
    frame: "phone",
    shots: [
      "/lockscreens/teen/phone/58.png",
      "/lockscreens/teen/phone/24.png",
      "/lockscreens/teen/phone/43.png",
    ],
  },
  {
    name: "Arbeitsplatz",
    blurb: "Rechnungsbetrug, Chef-Betrug und Zugangsdaten-Diebstahl — auf Firmengeräten.",
    frame: "desktop",
    shots: [
      "/lockscreens/workplace/desktop/30.png",
      "/lockscreens/workplace/desktop/44.png",
      "/lockscreens/workplace/desktop/05.png",
      "/lockscreens/workplace/desktop/12.png",
    ],
  },
  {
    name: "Schulen",
    blurb: "Account-Handel, QR-Codes und Login-Phishing — auf geteilten, verwalteten Rechnern.",
    frame: "desktop",
    shots: [
      "/lockscreens/school/desktop/10.png",
      "/lockscreens/school/desktop/33.png",
      "/lockscreens/school/desktop/05.png",
      "/lockscreens/school/desktop/40.png",
    ],
  },
];

export default function LockscreensPageDe() {
  return (
    <PremiumPageDe ctaHref="#pricing" ctaLabel="Preise ansehen">
      <section className="kls-hero kg-shell">
        <div className="kls-hero-copy">
          <p className="k-kicker">Konfydence Lockscreens</p>
          <h1 className="k-display">Der Hinweis, den du wirklich siehst.</h1>
          <p className="k-lede">
            Betrugsdruck funktioniert, weil er dich mittendrin im Scrollen erwischt. Ein Sperrbildschirm zeigt dir <strong>Anhalten. Abklären. Ansprechen.</strong> bevor
            du antwortest, klickst oder zahlst — alle zwei Wochen ein frischer Hinweis, wenn sich die Betrugsmaschen ändern.
          </p>
          <div className="k-actions">
            <a className="k-button" href="#pricing">Preise ansehen</a>
            <Link className="k-button-quiet" href="/de/hack-method">Zur Methode</Link>
          </div>
        </div>
        <div className="kls-devices">
          <div className="kls-phone">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lockscreens/home/phone/21.png" alt="Ein Konfydence-Sperrbildschirm mit dem Text „Karte gesperrt. Jetzt anrufen?“ und dem Hinweis, die Banking-App selbst zu öffnen." />
          </div>
          <div className="kls-desktop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lockscreens/workplace/desktop/30.png" alt="Ein Konfydence-Desktop-Sperrbildschirm mit dem Text „Bevor der Klick zum Vorfall wird…“ und Anhalten · Abklären · Ansprechen." />
          </div>
        </div>
      </section>

      <section className="kg-shell k-section" aria-labelledby="see-the-screens">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Die Screens ansehen</p>
            <h2 id="see-the-screens" className="k-display-sm">Echte Hinweise, keine Stock-Poster.</h2>
          </div>
          <p className="k-copy">
            Jeder Screen benennt einen konkreten Trick eines Betrugs und die eine ruhige Reaktion darauf. Ein Beispiel aus jeder Bibliothek —
            die vollständigen Sets wechseln alle zwei Wochen auf eurem Gerät.
          </p>
        </div>
        <ScreenGallery tiers={screenGalleries} />
        <p className="kls-gallery-note">
          Tippe auf einen Screen für die volle Größe. Home- und Teen-Screens sind fürs Handy gedacht; Schulen und Arbeitsplatz
          liefern Desktop-, Notebook- und Tablet-Formate für eure Geräteverwaltung. Botschaft und Betrugsmaschen bleiben das ganze Jahr aktuell.
        </p>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">So funktioniert es</p>
            <h2 className="k-display-sm">Ein Dienst, kein Ordner voller Hintergrundbilder.</h2>
          </div>
          <p className="k-copy">
            Du fasst nie ein ZIP mit 180 Dateien an. Du richtest einen Screen auf einem Gerät in unter einer Minute ein — und Konfydence
            hält ihn für dich aktuell.
          </p>
        </div>
        <div className="kls-includes">
          {howItWorks.map(([title, copy], i) => (
            <article key={title}>
              <span className="kls-step-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="kg-shell kls-buy">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Preise</p>
            <h2 className="k-display-sm">Jährlich, weil die Hinweise das ganze Jahr aktualisiert werden.</h2>
          </div>
          <p className="k-copy">
            Jahr eins umfasst Einrichtung und das komplette Hinweis-Set. Die Verlängerung sorgt weiter für die zweiwöchentlichen
            Updates, neue Betrugsmuster und Zugriff.
          </p>
        </div>
        <div className="kls-tiers is-4">
          {tiers.map((tier, i) => (
            <article className={`kls-tier ${i < 2 ? "is-featured" : ""}`} key={tier.name}>
              <p className="kls-tier-name">{tier.name}</p>
              <p className="kls-tier-price"><strong>{tier.price}</strong> {tier.unit}</p>
              <p className="kls-tier-renew">{tier.renew}</p>
              <p className="kls-tier-copy">{tier.copy}</p>
              <div className="kls-tier-cta">
                {tier.sku
                  ? <CheckoutRedirectButton sku={tier.sku} label={tier.cta} locale="de" />
                  : <Link className="k-button-quiet" href={tier.href!}>{tier.cta}</Link>}
              </div>
            </article>
          ))}
        </div>
        <p className="kls-buy-note">
          Home und Teen sind sofort abgeschlossen. Schulen und Arbeitsplatz erhalten ein nummeriertes Angebot und eine Stripe-Rechnung,
          zahlbar per Karte oder Überweisung — dieser Bestellweg läuft aktuell noch auf Englisch. Lieber erst einen kostenlosen Hinweis?
          Das <Link href="/free-scam-safety-pack">Notfall-Betrugsprotokoll</Link> ist ein kostenloser Download.
        </p>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Mehr erfahren</p>
            <h2 className="k-display-sm">So passt es zu eurer Situation.</h2>
          </div>
          <p className="k-copy">
            Der Sperrbildschirm ist eine Idee, auf verschiedene Arten angewendet — eine Geräteflotte unter Geräteverwaltung, die geteilten
            Rechner einer Schule oder ein Handy in der Familie. Jede Situation hat ihre eigene Seite.
          </p>
        </div>
        <div className="kc-linkcards">
          <Link href="/de/lockscreens/sicherheitsbewusstsein-sperrbildschirm">
            <b>Security-Awareness-Sperrbildschirme</b>
            <span>Der Überblick — was es ist, für wen, was es kostet.</span>
          </Link>
          <Link href="/de/lockscreens/phishing-sensibilisierung-zwischen-schulungen">
            <b>Zwischen den Schulungen</b>
            <span>Phishing-Bewusstsein in den elf Monaten nach dem jährlichen Modul aufrechterhalten.</span>
          </Link>
          <Link href="/de/lockscreens/sicherheitsplakate">
            <b>Vs. Sicherheitsplakate</b>
            <span>Erreicht Remote-Mitarbeitende und wechselt die Botschaft alle zwei Wochen.</span>
          </Link>
          <Link href="/de/lockscreens/intune">
            <b>Microsoft Intune</b>
            <span>Eine Hintergrundbild-Richtlinie, eine URL, immer aktuell.</span>
          </Link>
          <Link href="/de/lockscreens/jamf">
            <b>Jamf (Mac &amp; iPad)</b>
            <span>Einmal auf eure Apple-Flotte ausrollen; die Botschaft bleibt frisch.</span>
          </Link>
          <Link href="/de/lockscreens/familie-betrugsschutz">
            <b>Für die Familie</b>
            <span>Ein ruhiger Hinweis auf dem Handy eines Elternteils oder Teenagers.</span>
          </Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
