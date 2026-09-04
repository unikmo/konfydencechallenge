"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SCREEN_COUNT_OPTIONS,
  CADENCE_OPTIONS,
  computeWorkplaceQuote,
  formatUsd,
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

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function WorkplaceAdminDashboard({
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
}: {
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
}) {
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

  const quote = computeWorkplaceQuote(licensedCount, screenCount, cadence);
  const dirty =
    sequence.length !== plan.sequence.length ||
    sequence.some((n, i) => n !== plan.sequence[i]) ||
    screenCount !== plan.screenCount ||
    cadence !== plan.cadence;
  const pricingChanged = currentRatePerHead != null && Math.abs(quote.ratePerHead - currentRatePerHead) > 0.001;

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
      setSaveError(`Your sequence has ${sequence.length} screens but the package is set to ${screenCount}. Add or remove screens to match.`);
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const response = await fetch(`/api/lockscreens/workplace/admin/${adminToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence, screenCount, cadence }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSaveError(data.error || "Could not save changes.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
    } catch {
      setSaveError("Could not save changes. Please try again.");
      setSaving(false);
    }
  }

  async function handleRequote() {
    setRequoting(true);
    try {
      const response = await fetch(`/api/lockscreens/workplace/admin/${adminToken}/requote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenCount, cadence }),
      });
      const data = await response.json();
      if (response.ok && data.poUrl) {
        window.location.href = data.poUrl;
      } else {
        setSaveError(data.error || "Could not generate an updated PO.");
        setRequoting(false);
      }
    } catch {
      setSaveError("Could not generate an updated PO.");
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
          This licence is pending confirmation. You can still set up your sequence now — it activates as soon as
          your PO is confirmed. {latestPoUrl ? <Link href={latestPoUrl}>View your purchase order</Link> : null}
        </div>
      ) : null}

      <section style={cardStyle}>
        <p className="k-kicker">Currently showing</p>
        {nowShowing ? (
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
            <Image src={nowShowing.imagePath} alt={nowShowing.hook} width={140} height={79} style={{ borderRadius: 6, width: 140, height: "auto" }} />
            <div>
              <div style={{ fontWeight: 700 }}>#{nowShowing.number} &middot; {nowShowing.hook}</div>
              <div style={{ fontSize: 13, color: "#66645f" }}>{nowShowing.category}</div>
            </div>
          </div>
        ) : (
          <p className="k-copy">{now == null ? "Loading…" : "No screen resolved yet — save a sequence below."}</p>
        )}

        <p className="k-kicker" style={{ marginTop: 20 }}>Coming up</p>
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
        <p className="k-kicker">Delivery</p>
        <p className="k-copy" style={{ fontSize: 13 }}>
          Point your MDM policy at this URL for computers and laptops. It always resolves to whatever screen
          should be showing right now — nothing to update on your side.
        </p>
        <code style={{ display: "block", background: "#f4efe4", padding: "10px 12px", borderRadius: 6, fontSize: 12, wordBreak: "break-all", marginTop: 8 }}>
          {deliveryUrl}
        </code>
        <p style={{ fontSize: 12, color: "#66645f", marginTop: 8 }}>
          Notebook and tablet formats are on the way — this link currently serves the desktop 16:9 render for
          every device class.
        </p>
      </section>

      <section style={cardStyle}>
        <p className="k-kicker">Plan</p>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr", marginTop: 8 }}>
          <label style={labelStyle}>
            <span className="k-kicker">Screen package</span>
            <select style={inputStyle} value={screenCount} onChange={(e) => handleScreenCountChange(Number(e.target.value) as ScreenCount)}>
              {SCREEN_COUNT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label style={labelStyle}>
            <span className="k-kicker">Cadence</span>
            <select style={inputStyle} value={cadence} onChange={(e) => setCadence(e.target.value as Cadence)}>
              {CADENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        {pricingChanged ? (
          <div style={{ marginTop: 14, background: "#f7f0e1", border: "1px solid rgba(168,125,46,.35)", borderRadius: 8, padding: "12px 14px", fontSize: 13 }}>
            This changes your rate to {formatUsd(quote.ratePerHead)}/employee/year ({formatUsd(quote.annualTotal)}/year total).
            Sequence and cadence changes save instantly below; a rate change needs a fresh, confirmed PO before it bills.
            <div style={{ marginTop: 10 }}>
              <button type="button" onClick={handleRequote} disabled={requoting} style={quietButtonStyle}>
                {requoting ? "Generating…" : "Request updated PO"}
              </button>
            </div>
          </div>
        ) : null}

        <p className="k-kicker" style={{ marginTop: 22 }}>Your sequence &middot; {sequence.length} / {screenCount}</p>
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
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={miniButtonStyle} aria-label="Move up">&uarr;</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === sequence.length - 1} style={miniButtonStyle} aria-label="Move down">&darr;</button>
                <button type="button" onClick={() => remove(n)} style={{ ...miniButtonStyle, color: "#b4552f" }} aria-label="Remove">&times;</button>
              </div>
            );
          })}
        </div>

        {sequence.length < screenCount ? (
          <>
            <p className="k-kicker" style={{ marginTop: 20 }}>Add from the library</p>
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
            {saving ? "Saving…" : saved && !dirty ? "Saved" : "Save changes"}
          </button>
          {saveError ? <p role="alert" style={{ color: "#b4552f", fontSize: 13, marginTop: 8 }}>{saveError}</p> : null}
        </div>
      </section>

      <section style={cardStyle}>
        <p className="k-kicker">Licence</p>
        <p className="k-copy" style={{ fontSize: 13 }}>
          {licensedCount.toLocaleString()} employees licensed
          {termStart ? ` · term starts ${fmtDate(new Date(termStart))}` : ""}
          {termEnd ? ` · renews ${fmtDate(new Date(termEnd))}` : ""}.
        </p>
        <p className="k-copy" style={{ fontSize: 12, color: "#66645f" }}>
          To change your licensed headcount, contact your Konfydence rep — it&rsquo;s the billing basis for
          this licence.
        </p>
      </section>
    </div>
  );
}

const cardStyle: React.CSSProperties = { border: "1px solid rgba(17,20,23,.12)", borderRadius: 14, padding: 22, background: "#fffdf9" };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };
const inputStyle: React.CSSProperties = {
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
