"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

type Plan = { sequence: number[]; screenCount: number; cadence: string; anchor: string };

const CADENCE_MS: Record<string, number> = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  fortnightly: 14 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

function currentPosition(plan: { sequence: number[]; cadence: string; anchor: string }, now: number): number {
  const cadenceMs = CADENCE_MS[plan.cadence] ?? CADENCE_MS.fortnightly;
  const elapsed = now - new Date(plan.anchor).getTime();
  const index = Math.floor(elapsed / cadenceMs);
  const len = plan.sequence.length || 1;
  return ((index % len) + len) % len;
}

const T = {
  en: {
    locale: "en-US",
    pending: "This licence is pending confirmation. You can still set up your sequence now — it activates as soon as your PO is confirmed. ",
    viewPo: "View your purchase order",
    showing: "Currently showing",
    loading: "Loading…",
    noScreen: "No screen resolved yet — save a sequence below.",
    comingUp: "Coming up",
    delivery: "Delivery",
    deliveryP: (tier: Tier) =>
      `Point your MDM policy at this URL for ${tier === "school" ? "managed computers and tablets" : "computers and laptops"}. It always resolves to whatever screen should be showing right now — nothing to update on your side.`,
    deliveryNote: "Notebook and tablet formats are on the way — this link currently serves the desktop 16:9 render for every device class.",
    plan: "Plan",
    screenPackage: "Screen package",
    cadence: "Cadence",
    rateChange: (rate: string, unit: string, total: string) =>
      `This changes your rate to ${rate}/${unit}/year (${total}/year total). Sequence and cadence changes save instantly below; a rate change needs a fresh, confirmed PO before it bills.`,
    requote: "Request updated PO",
    requoting: "Generating…",
    yourSequence: (a: number, b: number) => <>Your sequence &middot; {a} / {b}</>,
    up: "Move up",
    down: "Move down",
    remove: "Remove",
    addFrom: "Add from the library",
    saving: "Saving…",
    saved: "Saved",
    save: "Save changes",
    licence: "Licence",
    licensed: (n: number, plural: string) => `${n.toLocaleString("en-US")} ${plural} licensed`,
    termStarts: (d: string) => ` · term starts ${d}`,
    renews: (d: string) => ` · renews ${d}`,
    changeCount: "To change your licensed count, contact your Konfydence rep — it’s the billing basis for this licence.",
    errLen: (a: number, b: number) => `Your sequence has ${a} screens but the package is set to ${b}. Add or remove screens to match.`,
    errSave: "Could not save changes.",
    errSaveRetry: "Could not save changes. Please try again.",
    errPo: "Could not generate an updated PO.",
  },
  de: {
    locale: "de-DE",
    pending: "Diese Lizenz wartet noch auf die Bestätigung. Ihr könnt die Folge schon jetzt einrichten – sie startet, sobald eure Bestellung bestätigt ist. ",
    viewPo: "Bestellung ansehen",
    showing: "Aktuell angezeigt",
    loading: "Wird geladen …",
    noScreen: "Noch kein Screen festgelegt – speichert unten eine Folge.",
    comingUp: "Als Nächstes",
    delivery: "Auslieferung",
    deliveryP: (tier: Tier) =>
      `Tragt diese URL in eure Geräteverwaltung (MDM) ein – für ${tier === "school" ? "verwaltete Computer und Tablets" : "Computer und Laptops"}. Sie liefert immer den Screen, der gerade angezeigt werden soll. Auf eurer Seite ist nichts weiter zu aktualisieren.`,
    deliveryNote: "Formate für Notebooks und Tablets folgen – dieser Link liefert derzeit für alle Gerätetypen das 16:9-Format für Desktops.",
    plan: "Paket",
    screenPackage: "Screen-Paket",
    cadence: "Wechselrhythmus",
    rateChange: (rate: string, unit: string, total: string) =>
      `Damit ändert sich euer Preis auf ${rate} pro ${unit} und Jahr (${total} pro Jahr insgesamt). Änderungen an Folge und Rhythmus werden unten sofort gespeichert; ein geänderter Preis wird erst nach einer neuen, bestätigten Bestellung abgerechnet.`,
    requote: "Aktualisierte Bestellung anfordern",
    requoting: "Wird erstellt …",
    yourSequence: (a: number, b: number) => <>Eure Folge &middot; {a} von {b}</>,
    up: "Nach oben",
    down: "Nach unten",
    remove: "Entfernen",
    addFrom: "Aus der Bibliothek hinzufügen",
    saving: "Wird gespeichert …",
    saved: "Gespeichert",
    save: "Änderungen speichern",
    licence: "Lizenz",
    licensed: (n: number, plural: string) => `${n.toLocaleString("de-DE")} ${plural} lizenziert`,
    termStarts: (d: string) => ` · Laufzeit beginnt am ${d}`,
    renews: (d: string) => ` · verlängert sich am ${d}`,
    changeCount: "Wenn sich die Zahl der lizenzierten Geräte ändern soll, meldet euch bei eurer Ansprechperson bei Konfydence – sie ist die Abrechnungsgrundlage dieser Lizenz.",
    errLen: (a: number, b: number) => `Eure Folge hat ${a} Screens, das Paket ist aber auf ${b} eingestellt. Fügt Screens hinzu oder entfernt welche.`,
    errSave: "Die Änderungen konnten nicht gespeichert werden.",
    errSaveRetry: "Die Änderungen konnten nicht gespeichert werden. Bitte versucht es noch einmal.",
    errPo: "Die aktualisierte Bestellung konnte nicht erstellt werden.",
  },
} as const;

export function LockscreenAdminDashboard({
  tier,
  adminToken,
  deliveryToken,
  tokenStatus,
  licensedCount,
  termStart,
  termEnd,
  plan,
  assets,
  currentRatePerHead,
  latestPoUrl,
  lang = "en",
}: {
  tier: Tier;
  adminToken: string;
  deliveryToken: string;
  tokenStatus: string;
  licensedCount: number;
  termStart: string | null;
  termEnd: string | null;
  plan: Plan;
  assets: Asset[];
  currentRatePerHead: number | null;
  latestPoUrl: string | null;
  lang?: LsLang;
}) {
  const t = T[lang];
  const fmtDate = (d: Date) => d.toLocaleDateString(t.locale, { month: "short", day: "numeric", year: "numeric" });
  const config = TIER_CONFIG[tier];
  const unitSingular = lang === "de" ? UNIT_LABELS_DE[tier].singular : config.unitLabel;
  const unitPlural = lang === "de" ? UNIT_LABELS_DE[tier].plural : config.unitLabelPlural;
  const screenCountOptions = useMemo(() => screenCountOptionsFor(tier, lang), [tier, lang]);
  const cadenceOptions = useMemo(() => cadenceOptionsFor(lang), [lang]);
  const assetByNumber = useMemo(() => new Map(assets.map((a) => [a.number, a])), [assets]);

  const [sequence, setSequence] = useState<number[]>(plan.sequence);
  const [screenCount, setScreenCount] = useState<ScreenCount>(plan.screenCount as ScreenCount);
  const [cadence, setCadence] = useState<Cadence>(plan.cadence as Cadence);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [requoting, setRequoting] = useState(false);

  // Read the clock once on mount rather than during render, so this stays a
  // pure component (and the server-rendered shell doesn't fight the client
  // over "now").
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  const cadenceMs = CADENCE_MS[plan.cadence] ?? CADENCE_MS.fortnightly;
  const anchorTime = new Date(plan.anchor).getTime();
  const pos = now != null ? currentPosition(plan, now) : 0;
  const nowShowing = now != null && plan.sequence[pos] ? assetByNumber.get(plan.sequence[pos]) : null;

  const upcoming = useMemo(() => {
    if (now == null) return [];
    const len = plan.sequence.length || 1;
    const nowIndex = Math.floor((now - anchorTime) / cadenceMs);
    return Array.from({ length: 6 }, (_, i) => {
      const flipIndex = nowIndex + i + 1;
      const flipDate = new Date(anchorTime + flipIndex * cadenceMs);
      const position = ((flipIndex % len) + len) % len;
      const assetNumber = plan.sequence[position];
      return { date: flipDate, assetNumber, asset: assetByNumber.get(assetNumber) };
    });
  }, [now, plan.sequence, anchorTime, cadenceMs, assetByNumber]);

  const quote = computeQuote(tier, licensedCount, screenCount, cadence);
  const dirty =
    sequence.length !== plan.sequence.length ||
    sequence.some((n, i) => n !== plan.sequence[i]) ||
    screenCount !== plan.screenCount ||
    cadence !== plan.cadence;
  const pricingChanged = currentRatePerHead != null && Math.abs(quote.ratePerUnit - currentRatePerHead) > 0.001;

  function move(index: number, dir: -1 | 1) {
    setSequence((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(number: number) {
    setSequence((prev) => prev.filter((n) => n !== number));
  }

  function add(number: number) {
    setSequence((prev) => (prev.includes(number) || prev.length >= screenCount ? prev : [...prev, number]));
  }

  function handleScreenCountChange(next: ScreenCount) {
    setScreenCount(next);
    setSequence((prev) => {
      if (prev.length > next) return prev.slice(0, next);
      if (prev.length < next) {
        const missing = assets.map((a) => a.number).filter((n) => !prev.includes(n)).slice(0, next - prev.length);
        return [...prev, ...missing];
      }
      return prev;
    });
  }

  async function handleSave() {
    if (sequence.length !== screenCount) {
      setSaveError(t.errLen(sequence.length, screenCount));
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const response = await fetch(`/api/lockscreens/${tier}/admin/${adminToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence, screenCount, cadence }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSaveError((lang === "en" && data.error) || t.errSave);
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
    } catch {
      setSaveError(t.errSaveRetry);
      setSaving(false);
    }
  }

  async function handleRequote() {
    setRequoting(true);
    try {
      const response = await fetch(`/api/lockscreens/${tier}/admin/${adminToken}/requote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenCount, cadence, lang }),
      });
      const data = await response.json();
      if (response.ok && data.poUrl) {
        window.location.href = data.poUrl;
      } else {
        setSaveError((lang === "en" && data.error) || t.errPo);
        setRequoting(false);
      }
    } catch {
      setSaveError(t.errPo);
      setRequoting(false);
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const deliveryUrl = `${appUrl}/api/l/${deliveryToken}/current/desktop`;
  const unselected = assets.filter((a) => !sequence.includes(a.number));

  return (
    <div style={{ display: "grid", gap: 32, maxWidth: 880 }}>
      {tokenStatus === "pending" ? (
        <div style={{ background: "#f7f0e1", border: "1px solid rgba(168,125,46,.35)", borderRadius: 10, padding: "14px 18px", fontSize: 13 }}>
          {t.pending}{latestPoUrl ? <Link href={latestPoUrl}>{t.viewPo}</Link> : null}
        </div>
      ) : null}

      <section style={cardStyle}>
        <p className="k-kicker">{t.showing}</p>
        {nowShowing ? (
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
            <Image src={nowShowing.imagePath} alt={nowShowing.hook} width={140} height={79} style={{ borderRadius: 6, width: 140, height: "auto" }} />
            <div>
              <div style={{ fontWeight: 700 }}>#{nowShowing.number} &middot; {nowShowing.hook}</div>
              <div style={{ fontSize: 13, color: "#66645f" }}>{nowShowing.category}</div>
            </div>
          </div>
        ) : (
          <p className="k-copy">{now == null ? t.loading : t.noScreen}</p>
        )}

        <p className="k-kicker" style={{ marginTop: 20 }}>{t.comingUp}</p>
        <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
          {upcoming.map((u, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid rgba(17,20,23,.06)", padding: "4px 0" }}>
              <span>{fmtDate(u.date)}</span>
              <span>#{u.assetNumber} &middot; {u.asset?.hook ?? "—"}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <p className="k-kicker">{t.delivery}</p>
        <p className="k-copy" style={{ fontSize: 13 }}>{t.deliveryP(tier)}</p>
        <code style={{ display: "block", background: "#f4efe4", padding: "10px 12px", borderRadius: 6, fontSize: 12, wordBreak: "break-all", marginTop: 8 }}>
          {deliveryUrl}
        </code>
        <p style={{ fontSize: 12, color: "#66645f", marginTop: 8 }}>
          {t.deliveryNote}
        </p>
      </section>

      <section style={cardStyle}>
        <p className="k-kicker">{t.plan}</p>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginTop: 8 }}>
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

        {pricingChanged ? (
          <div style={{ marginTop: 14, background: "#f7f0e1", border: "1px solid rgba(168,125,46,.35)", borderRadius: 8, padding: "12px 14px", fontSize: 13 }}>
            {t.rateChange(formatMoney(quote.ratePerUnit, lang), unitSingular, formatMoney(quote.annualTotal, lang))}
            <div style={{ marginTop: 10 }}>
              <button type="button" onClick={handleRequote} disabled={requoting} style={quietButtonStyle}>
                {requoting ? t.requoting : t.requote}
              </button>
            </div>
          </div>
        ) : null}

        <p className="k-kicker" style={{ marginTop: 22 }}>{t.yourSequence(sequence.length, screenCount)}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          {sequence.map((n, i) => {
            const a = assetByNumber.get(n);
            if (!a) return null;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(17,20,23,.1)", borderRadius: 8, padding: "6px 10px" }}>
                <span style={{ fontSize: 12, color: "#8d8980", width: 20 }}>{i + 1}</span>
                <Image src={a.imagePath} alt={a.hook} width={72} height={40} style={{ borderRadius: 4, width: 72, height: "auto" }} />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <div style={{ fontWeight: 650 }}>#{a.number} &middot; {a.hook}</div>
                  <div style={{ color: "#8d8980", fontSize: 11 }}>{a.category}</div>
                </div>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={miniButtonStyle} aria-label={t.up}>&uarr;</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === sequence.length - 1} style={miniButtonStyle} aria-label={t.down}>&darr;</button>
                <button type="button" onClick={() => remove(n)} style={{ ...miniButtonStyle, color: "#b4552f" }} aria-label={t.remove}>&times;</button>
              </div>
            );
          })}
        </div>

        {sequence.length < screenCount ? (
          <>
            <p className="k-kicker" style={{ marginTop: 20 }}>{t.addFrom}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, marginTop: 8, maxHeight: 320, overflowY: "auto" }}>
              {unselected.map((a) => (
                <button
                  key={a.number}
                  type="button"
                  onClick={() => add(a.number)}
                  title={a.hook}
                  style={{ border: "1px solid rgba(17,20,23,.12)", borderRadius: 6, padding: 0, overflow: "hidden", cursor: "pointer", background: "none", position: "relative" }}
                >
                  <Image src={a.imagePath} alt={a.hook} width={180} height={101} style={{ width: "100%", height: "auto", display: "block" }} />
                  <span style={{ position: "absolute", top: 3, left: 3, background: "rgba(17,20,23,.75)", color: "#fff", fontSize: 9, padding: "1px 4px", borderRadius: 3 }}>{a.number}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        <div style={{ marginTop: 24 }}>
          <button type="button" onClick={handleSave} disabled={saving || !dirty} style={{ ...primaryButtonStyle, opacity: dirty ? 1 : 0.5 }}>
            {saving ? t.saving : saved && !dirty ? t.saved : t.save}
          </button>
          {saveError ? <p role="alert" style={{ color: "#b4552f", fontSize: 13, marginTop: 8 }}>{saveError}</p> : null}
        </div>
      </section>

      <section style={cardStyle}>
        <p className="k-kicker">{t.licence}</p>
        <p className="k-copy" style={{ fontSize: 13 }}>
          {t.licensed(licensedCount, unitPlural)}
          {termStart ? t.termStarts(fmtDate(new Date(termStart))) : ""}
          {termEnd ? t.renews(fmtDate(new Date(termEnd))) : ""}.
        </p>
        <p className="k-copy" style={{ fontSize: 12, color: "#66645f" }}>{t.changeCount}</p>
      </section>
    </div>
  );
}

const cardStyle: React.CSSProperties = { border: "1px solid rgba(17,20,23,.12)", borderRadius: 14, padding: 22, background: "#fffdf9" };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(17,20,23,.22)",
  background: "#fffdf9",
  fontSize: 14,
  color: "#111417",
  fontFamily: "inherit",
};
const miniButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(17,20,23,.15)",
  background: "transparent",
  borderRadius: 6,
  width: 26,
  height: 26,
  cursor: "pointer",
  fontSize: 13,
};
const primaryButtonStyle: React.CSSProperties = {
  background: "#111417",
  color: "#fffdf9",
  border: "none",
  borderRadius: 999,
  padding: "12px 22px",
  fontSize: 14,
  fontWeight: 650,
  cursor: "pointer",
};
const quietButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #a66d00",
  color: "#a66d00",
  borderRadius: 999,
  padding: "8px 16px",
  fontSize: 13,
  cursor: "pointer",
};
