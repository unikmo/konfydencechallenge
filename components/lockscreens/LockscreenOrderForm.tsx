"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  screenCountOptionsFor,
  cadenceOptionsFor,
  computeQuote,
  formatMoney,
  TIER_CONFIG,
  UNIT_LABELS_DE,
  type LsLang,
  type Tier,
  type ScreenCount,
  type Cadence,
} from "@/lib/lockscreens/pricing";

type Asset = { number: number; category: string; hook: string; body: string; action: string; imagePath: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const T = {
  en: {
    poBase: "/lockscreens",
    org: (tier: Tier) => (tier === "school" ? "School" : "Organisation"),
    orgName: (tier: Tier) => (tier === "school" ? "School name" : "Organisation name"),
    unitsToLicence: (plural: string) => `${plural[0].toUpperCase() + plural.slice(1)} to licence`,
    contactName: "Contact name",
    contactEmail: "Contact email",
    billing: "Billing address (optional)",
    plan: "Plan",
    screenPackage: "Screen package",
    cadence: "Cadence",
    weeklyNote: "Weekly cadence isn’t self-serve priced yet, and it can miss half its flips on MDM fleets that only refresh fortnightly. ",
    extendedNote: "The extended library isn’t self-serve priced yet for this tier. ",
    reviewNote: "Your PO will be issued at the standard rate, and a rep will follow up to confirm the final number.",
    customMode: (n: number) => <>Choose specific screens instead of the standard 1&ndash;{n} sequence</>,
    selectedOf: (a: number, b: number) => `Selected ${a} / ${b}`,
    loadingLib: "Loading library…",
    notes: "Notes (optional)",
    estimated: "Estimated annual total",
    minApplied: (m: string) => ` — ${m} minimum applied`,
    generating: "Generating purchase order…",
    generate: "Generate purchase order",
    errOrg: (tier: Tier) => `Enter your ${tier === "school" ? "school" : "organisation"} name.`,
    errEmail: "Enter a valid contact email.",
    errCount: (plural: string) => `Enter the number of ${plural} to licence.`,
    errSelect: (n: number) => `Select exactly ${n} screens, or switch back to the standard sequence.`,
    errGeneric: "Something went wrong. Please try again.",
  },
  de: {
    poBase: "/de/lockscreens",
    org: (tier: Tier) => (tier === "school" ? "Schule" : "Organisation"),
    orgName: (tier: Tier) => (tier === "school" ? "Name der Schule" : "Name der Organisation"),
    unitsToLicence: (plural: string) => `Zu lizenzierende ${plural[0].toUpperCase() + plural.slice(1)}`,
    contactName: "Ansprechperson",
    contactEmail: "E-Mail-Adresse der Ansprechperson",
    billing: "Rechnungsadresse (optional)",
    plan: "Paket",
    screenPackage: "Screen-Paket",
    cadence: "Wechselrhythmus",
    weeklyNote: "Der wöchentliche Wechsel ist noch nicht als Selbstbedienungspreis hinterlegt. Bei Geräteflotten, die sich nur alle zwei Wochen aktualisieren, kann außerdem jeder zweite Wechsel ausfallen. ",
    extendedNote: "Die erweiterte Bibliothek ist für diese Zielgruppe noch nicht als Selbstbedienungspreis hinterlegt. ",
    reviewNote: "Eure Bestellung wird zum Standardpreis ausgestellt; wir melden uns, um den endgültigen Betrag zu bestätigen.",
    customMode: (n: number) => <>Eigene Screens auswählen statt der Standardfolge 1&ndash;{n}</>,
    selectedOf: (a: number, b: number) => `${a} von ${b} ausgewählt`,
    loadingLib: "Bibliothek wird geladen …",
    notes: "Anmerkungen (optional)",
    estimated: "Voraussichtliche Jahressumme",
    minApplied: (m: string) => ` – Mindestbetrag von ${m} angewendet`,
    generating: "Bestellung wird erstellt …",
    generate: "Bestellung erstellen",
    errOrg: (tier: Tier) => `Bitte gib den Namen der ${tier === "school" ? "Schule" : "Organisation"} an.`,
    errEmail: "Bitte gib eine gültige E-Mail-Adresse an.",
    errCount: (plural: string) => `Bitte gib an, wie viele ${plural} lizenziert werden sollen.`,
    errSelect: (n: number) => `Wähle genau ${n} Screens aus oder wechsle zurück zur Standardfolge.`,
    errGeneric: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
  },
} as const;

export function LockscreenOrderForm({ tier, lang = "en" }: { tier: Tier; lang?: LsLang }) {
  const router = useRouter();
  const t = T[lang];
  const config = TIER_CONFIG[tier];
  const unitPlural = lang === "de" ? UNIT_LABELS_DE[tier].plural : config.unitLabelPlural;
  const screenCountOptions = useMemo(() => screenCountOptionsFor(tier, lang), [tier, lang]);
  const cadenceOptions = useMemo(() => cadenceOptionsFor(lang), [lang]);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsRequested, setAssetsRequested] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [unitCount, setUnitCount] = useState<number | "">("");
  const [screenCount, setScreenCount] = useState<ScreenCount>(27);
  const [cadence, setCadence] = useState<Cadence>("fortnightly");
  const [customMode, setCustomMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadAssetsOnce() {
    if (assetsRequested) return;
    setAssetsRequested(true);
    fetch(`/api/lockscreens/${tier}/assets`)
      .then((r) => r.json())
      .then((data) => setAssets(data.assets || []))
      .catch(() => {})
      .finally(() => setAssetsLoading(false));
  }

  function handleScreenCountChange(next: ScreenCount) {
    setScreenCount(next);
    setSelected((prev) => prev.slice(0, next));
  }

  function handleCustomModeChange(next: boolean) {
    setCustomMode(next);
    if (next) loadAssetsOnce();
  }

  const quote = computeQuote(tier, Number(unitCount) || 0, screenCount, cadence);

  function toggleAsset(n: number) {
    setSelected((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= screenCount) return prev;
      return [...prev, n];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!orgName.trim()) return setError(t.errOrg(tier));
    if (!EMAIL_RE.test(contactEmail.trim())) return setError(t.errEmail);
    if (!unitCount || Number(unitCount) < 1) return setError(t.errCount(unitPlural));
    if (customMode && selected.length !== screenCount) {
      return setError(t.errSelect(screenCount));
    }

    setLoading(true);
    try {
      const countField = tier === "school" ? "computerCount" : "employeeCount";
      const response = await fetch(`/api/lockscreens/${tier}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: orgName.trim(),
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          billingAddress: billingAddress.trim(),
          [countField]: Number(unitCount),
          screenCount,
          cadence,
          sequence: customMode ? selected : undefined,
          notes: notes.trim(),
          lang,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError((lang === "en" && data.error) || t.errGeneric);
        setLoading(false);
        return;
      }
      router.push(`${t.poBase}/${tier}/po/${data.id}`);
    } catch {
      setError(t.errGeneric);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 28, maxWidth: 720 }}>
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>{t.org(tier)}</legend>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <label style={labelStyle}>
            <span className="k-kicker">{t.orgName(tier)}</span>
            <input style={inputStyle} value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
          </label>
          <label style={labelStyle}>
            <span className="k-kicker">{t.unitsToLicence(unitPlural)}</span>
            <input
              style={inputStyle}
              type="number"
              min={1}
              max={200000}
              value={unitCount}
              onChange={(e) => setUnitCount(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
          </label>
          <label style={labelStyle}>
            <span className="k-kicker">{t.contactName}</span>
            <input style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </label>
          <label style={labelStyle}>
            <span className="k-kicker">{t.contactEmail}</span>
            <input style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
          </label>
        </div>
        <label style={{ ...labelStyle, marginTop: 16 }}>
          <span className="k-kicker">{t.billing}</span>
          <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
        </label>
      </fieldset>

      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>{t.plan}</legend>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <label style={labelStyle}>
            <span className="k-kicker">{t.screenPackage}</span>
            <select style={inputStyle} value={screenCount} onChange={(e) => handleScreenCountChange(Number(e.target.value) as ScreenCount)}>
              {screenCountOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label style={labelStyle}>
            <span className="k-kicker">{t.cadence}</span>
            <select style={inputStyle} value={cadence} onChange={(e) => setCadence(e.target.value as Cadence)}>
              {cadenceOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
        {quote.needsSalesReview ? (
          <p style={{ fontSize: 12, color: "#a66d00", marginTop: 10 }}>
            {cadence !== "fortnightly" ? t.weeklyNote : ""}
            {screenCount !== 27 && config.extendedLibrarySurchargePerUnit == null ? t.extendedNote : ""}
            {t.reviewNote}
          </p>
        ) : null}

        <div style={{ marginTop: 18 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={customMode} onChange={(e) => handleCustomModeChange(e.target.checked)} />
            {t.customMode(screenCount)}
          </label>
        </div>

        {customMode ? (
          <div style={{ marginTop: 16 }}>
            <p className="k-copy" style={{ fontSize: 13 }}>
              {t.selectedOf(selected.length, screenCount)}
            </p>
            {assetsLoading ? (
              <p className="k-copy">{t.loadingLib}</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10, maxHeight: 480, overflowY: "auto", padding: 4 }}>
                {assets.map((a) => {
                  const isSelected = selected.includes(a.number);
                  return (
                    <button
                      type="button"
                      key={a.number}
                      onClick={() => toggleAsset(a.number)}
                      title={a.hook}
                      style={{
                        position: "relative",
                        border: isSelected ? "2px solid var(--k-gold, #af8752)" : "1px solid rgba(17,20,23,.15)",
                        borderRadius: 8,
                        padding: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                        background: "none",
                      }}
                    >
                      <Image src={a.imagePath} alt={a.hook} width={220} height={124} style={{ width: "100%", height: "auto", display: "block" }} />
                      <span style={{ position: "absolute", top: 4, left: 4, background: "rgba(17,20,23,.75)", color: "#fff", fontSize: 10, padding: "2px 5px", borderRadius: 4 }}>
                        {a.number}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </fieldset>

      <label style={labelStyle}>
        <span className="k-kicker">{t.notes}</span>
        <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <div className="conversion" style={{ background: "var(--k-deep, #12191f)", color: "#fff", borderRadius: 16, padding: 24 }}>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#af8752" }}>{t.estimated}</p>
        <p style={{ margin: "8px 0 4px", fontSize: 34, fontFamily: "var(--k-display)", fontWeight: 400 }}>{formatMoney(quote.annualTotal, lang)}</p>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,.7)" }}>
          {unitCount || 0} {unitPlural} &times; {formatMoney(quote.ratePerUnit, lang)}
          {quote.minimumApplied ? t.minApplied(formatMoney(config.minimumAnnual, lang)) : ""}
        </p>
        <button type="submit" disabled={loading} style={{ marginTop: 18, width: "100%", minHeight: 48, borderRadius: 999, border: "none", background: "#fff", color: "#111417", fontWeight: 650, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? t.generating : t.generate}
        </button>
        {error ? <p role="alert" style={{ color: "#f2b8a0", fontSize: 13, marginTop: 10 }}>{error}</p> : null}
      </div>
    </form>
  );
}

const fieldsetStyle: React.CSSProperties = { minWidth: 0, border: "1px solid rgba(17,20,23,.12)", borderRadius: 12, padding: 20 };
const legendStyle: React.CSSProperties = { fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", padding: "0 6px" };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(17,20,23,.22)",
  background: "#fffdf9",
  fontSize: 15,
  color: "#111417",
  fontFamily: "inherit",
};
