"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  screenCountOptionsFor,
  CADENCE_OPTIONS,
  computeQuote,
  formatUsd,
  TIER_CONFIG,
  type Tier,
  type ScreenCount,
  type Cadence,
} from "@/lib/lockscreens/pricing";

type Asset = { number: number; category: string; hook: string; body: string; action: string; imagePath: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LockscreenOrderForm({ tier }: { tier: Tier }) {
  const router = useRouter();
  const config = TIER_CONFIG[tier];
  const screenCountOptions = useMemo(() => screenCountOptionsFor(tier), [tier]);

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

    if (!orgName.trim()) return setError(`Enter your ${tier === "school" ? "school" : "organisation"} name.`);
    if (!EMAIL_RE.test(contactEmail.trim())) return setError("Enter a valid contact email.");
    if (!unitCount || Number(unitCount) < 1) return setError(`Enter the number of ${config.unitLabelPlural} to licence.`);
    if (customMode && selected.length !== screenCount) {
      return setError(`Select exactly ${screenCount} screens, or switch back to the standard sequence.`);
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
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push(`/lockscreens/${tier}/po/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 28, maxWidth: 720 }}>
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>{tier === "school" ? "School" : "Organisation"}</legend>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <label style={labelStyle}>
            <span className="k-kicker">{tier === "school" ? "School name" : "Organisation name"}</span>
            <input style={inputStyle} value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
          </label>
          <label style={labelStyle}>
            <span className="k-kicker">{config.unitLabelPlural[0].toUpperCase() + config.unitLabelPlural.slice(1)} to licence</span>
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
            <span className="k-kicker">Contact name</span>
            <input style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </label>
          <label style={labelStyle}>
            <span className="k-kicker">Contact email</span>
            <input style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
          </label>
        </div>
        <label style={{ ...labelStyle, marginTop: 16 }}>
          <span className="k-kicker">Billing address (optional)</span>
          <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
        </label>
      </fieldset>

      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>Plan</legend>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <label style={labelStyle}>
            <span className="k-kicker">Screen package</span>
            <select style={inputStyle} value={screenCount} onChange={(e) => handleScreenCountChange(Number(e.target.value) as ScreenCount)}>
              {screenCountOptions.map((o) => (
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
        {quote.needsSalesReview ? (
          <p style={{ fontSize: 12, color: "#a66d00", marginTop: 10 }}>
            {cadence !== "fortnightly"
              ? "Weekly cadence isn’t self-serve priced yet, and it can miss half its flips on MDM fleets that only refresh fortnightly. "
              : ""}
            {screenCount !== 27 && config.extendedLibrarySurchargePerUnit == null
              ? "The extended library isn’t self-serve priced yet for this tier. "
              : ""}
            Your PO will be issued at the standard rate, and a rep will follow up to confirm the final number.
          </p>
        ) : null}

        <div style={{ marginTop: 18 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={customMode} onChange={(e) => handleCustomModeChange(e.target.checked)} />
            Choose specific screens instead of the standard 1&ndash;{screenCount} sequence
          </label>
        </div>

        {customMode ? (
          <div style={{ marginTop: 16 }}>
            <p className="k-copy" style={{ fontSize: 13 }}>
              Selected {selected.length} / {screenCount}
            </p>
            {assetsLoading ? (
              <p className="k-copy">Loading library…</p>
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
        <span className="k-kicker">Notes (optional)</span>
        <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <div className="conversion" style={{ background: "var(--k-deep, #12191f)", color: "#fff", borderRadius: 16, padding: 24 }}>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#af8752" }}>Estimated annual total</p>
        <p style={{ margin: "8px 0 4px", fontSize: 34, fontFamily: "var(--k-display)", fontWeight: 400 }}>{formatUsd(quote.annualTotal)}</p>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,.7)" }}>
          {unitCount || 0} {config.unitLabelPlural} &times; {formatUsd(quote.ratePerUnit)}
          {quote.minimumApplied ? ` — ${formatUsd(config.minimumAnnual)} minimum applied` : ""}
        </p>
        <button type="submit" disabled={loading} style={{ marginTop: 18, width: "100%", minHeight: 48, borderRadius: 999, border: "none", background: "#fff", color: "#111417", fontWeight: 650, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Generating purchase order…" : "Generate purchase order"}
        </button>
        {error ? <p role="alert" style={{ color: "#f2b8a0", fontSize: 13, marginTop: 10 }}>{error}</p> : null}
      </div>
    </form>
  );
}

const fieldsetStyle: React.CSSProperties = { border: "1px solid rgba(17,20,23,.12)", borderRadius: 12, padding: 20 };
const legendStyle: React.CSSProperties = { fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", padding: "0 6px" };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };
const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(17,20,23,.22)",
  background: "#fffdf9",
  fontSize: 15,
  color: "#111417",
  fontFamily: "inherit",
};
