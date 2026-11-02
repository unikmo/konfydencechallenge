import { formatMoney, TIER_CONFIG, UNIT_LABELS_DE, type Tier, type LsLang } from "@/lib/lockscreens/pricing";
import type { LockscreenOrder, LockscreenTenant } from "@prisma/client";

const T = {
  en: {
    locale: "en-US",
    prefix: "",
    tierLabel: (tier: Tier) => (tier === "school" ? "Schools" : "Workplace"),
    unitsPlural: (tier: Tier) => TIER_CONFIG[tier].unitLabelPlural,
    lockscreensFor: "Lockscreens for",
    po: "Purchase Order",
    issued: "Issued",
    billTo: "Bill to",
    term: "Licence term",
    status: "Status",
    statusName: (s: string) => s.replace("_", " "),
    description: "Description",
    qty: "Qty",
    rate: "Rate",
    amount: "Amount",
    licence: (tierLabel: string) => <>Konfydence Lockscreens &mdash; {tierLabel} licence</>,
    sequenceLine: (cadence: string) => `27-screen sequence, ${cadence} rotation`,
    extended: "Extended library upgrade",
    extendedSub: (n: number) => `${n} screens instead of 27`,
    perYear: "/yr",
    minAdj: "Annual minimum licence adjustment",
    minSub: (m: string) => `${m} minimum annual licence applies`,
    negotiated: "Negotiated pricing adjustment",
    negotiatedSub: "Agreed rate for this licence",
    totalYear: "Total / year",
    manage: "Manage your screen sequence, cadence, and see the delivery link:",
    notes: "Notes:",
    payInvoice: (m: string) => `Pay this invoice — ${m} →`,
    payHint: "Card or bank transfer. Your licence activates automatically once it clears.",
    withInvoice: "This purchase order sets out pricing; the invoice above is how you pay it. The lockscreen sequence goes live automatically once payment clears.",
    withoutInvoice: "This purchase order confirms pricing and does not itself activate the licence. A Konfydence team member will send your invoice; the sequence goes live once it is paid.",
    vat: "Where the customer is a business established in the EU, VAT is not charged — the reverse charge applies and the recipient accounts for VAT. Konfydence is a product of PlanetHike, an educational scam-readiness product, and does not guarantee protection from fraud.",
    questions: "Questions? Reply to the email this PO arrived in, or contact concierge@konfydence.com.",
    print: "Print / Save as PDF",
  },
  de: {
    locale: "de-DE",
    prefix: "/de",
    tierLabel: (tier: Tier) => (tier === "school" ? "Schulen" : "Unternehmen"),
    unitsPlural: (tier: Tier) => UNIT_LABELS_DE[tier].plural,
    lockscreensFor: "Lockscreens für",
    po: "Bestellung",
    issued: "Ausgestellt am",
    billTo: "Rechnungsempfänger",
    term: "Lizenzzeitraum",
    status: "Status",
    statusName: (s: string) =>
      ({ quote_issued: "Angebot ausgestellt", confirmed: "Bestätigt", cancelled: "Storniert", pending: "Ausstehend" } as Record<string, string>)[s] ?? s.replace("_", " "),
    description: "Beschreibung",
    qty: "Menge",
    rate: "Preis",
    amount: "Betrag",
    licence: (tierLabel: string) => <>Konfydence Lockscreens &ndash; Lizenz für {tierLabel}</>,
    sequenceLine: (cadence: string) => `Folge mit 27 Screens, Wechsel ${cadence === "weekly" ? "wöchentlich" : "alle zwei Wochen"}`,
    extended: "Upgrade auf die erweiterte Bibliothek",
    extendedSub: (n: number) => `${n} statt 27 Screens`,
    perYear: "/Jahr",
    minAdj: "Anpassung auf die Mindestjahreslizenz",
    minSub: (m: string) => `Es gilt eine Mindestjahreslizenz von ${m}`,
    negotiated: "Anpassung auf den vereinbarten Preis",
    negotiatedSub: "Vereinbarter Preis für diese Lizenz",
    totalYear: "Summe pro Jahr",
    manage: "Hier verwaltet ihr Screen-Folge und Rhythmus und findet den Auslieferungslink:",
    notes: "Anmerkungen:",
    payInvoice: (m: string) => `Rechnung bezahlen – ${m} →`,
    payHint: "Per Karte oder Überweisung. Eure Lizenz startet automatisch, sobald die Zahlung eingegangen ist.",
    withInvoice: "Diese Bestellung legt den Preis fest; bezahlt wird über die Rechnung oben. Die Sperrbildschirm-Folge geht automatisch live, sobald die Zahlung eingegangen ist.",
    withoutInvoice: "Diese Bestellung bestätigt den Preis, schaltet die Lizenz aber nicht selbst frei. Jemand aus dem Konfydence-Team schickt euch die Rechnung; die Folge geht live, sobald sie bezahlt ist.",
    vat: "Ist der Kunde ein in der EU ansässiges Unternehmen, wird keine Umsatzsteuer berechnet – es gilt die Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge), und der Empfänger führt die Umsatzsteuer selbst ab. Konfydence ist ein Produkt von PlanetHike, ein Bildungsprodukt zur Betrugsprävention, und garantiert keinen Schutz vor Betrug.",
    questions: "Fragen? Antwortet auf die E-Mail, mit der euch diese Bestellung erreicht hat, oder schreibt an concierge@konfydence.com.",
    print: "Drucken / Als PDF speichern",
  },
} as const;

export function PurchaseOrderDocument({
  tier,
  order,
  lang = "en",
}: {
  tier: Tier;
  order: LockscreenOrder & { tenant: LockscreenTenant | null };
  lang?: LsLang;
}) {
  const t = T[lang];
  const fmtDate = (d: Date) => d.toLocaleDateString(t.locale, { year: "numeric", month: "long", day: "numeric" });
  const unitsPlural = t.unitsPlural(tier);
  const formatUsd = (n: number) => formatMoney(n, lang);
  const tierLabel = t.tierLabel(tier);
  const issued = order.createdAt;
  const baseTotal = order.employeeCount * order.baseRatePerHead;
  const surchargeTotal = order.employeeCount * order.surchargePerHead;
  const rawTotal = baseTotal + surchargeTotal;
  const termStart = order.tenant?.termStart ?? issued;
  const termEnd = order.tenant?.termEnd ?? null;
  const adminUrl = order.tenant
    ? `${process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com"}${t.prefix}/lockscreens/${tier}/admin/${order.tenant.adminToken}`
    : null;

  return (
    <div style={{ background: "#f4efe4", minHeight: "100vh", padding: "48px 20px" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "#fffefc",
          border: "1px solid rgba(17,20,23,.12)",
          borderRadius: 8,
          padding: "44px 48px",
          color: "#111417",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111417", paddingBottom: 20, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.02em" }}>Konfydence</div>
            <div style={{ fontSize: 12, color: "#66645f", marginTop: 4 }}>konfydence.com &middot; {t.lockscreensFor} {tierLabel}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#af8752", fontWeight: 700 }}>{t.po}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{order.poNumber}</div>
            <div style={{ fontSize: 12, color: "#66645f", marginTop: 4 }}>{t.issued} {fmtDate(issued)}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", marginBottom: 6 }}>{t.billTo}</div>
            <div style={{ fontWeight: 700 }}>{order.orgName}</div>
            {order.contactName ? <div>{order.contactName}</div> : null}
            <div>{order.contactEmail}</div>
            {order.billingAddress ? <div style={{ whiteSpace: "pre-line", marginTop: 4 }}>{order.billingAddress}</div> : null}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", marginBottom: 6 }}>{t.term}</div>
            <div>{fmtDate(termStart)} &ndash; {termEnd ? fmtDate(termEnd) : "—"}</div>
            <div style={{ marginTop: 10, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", marginBottom: 6 }}>{t.status}</div>
            <div style={{ textTransform: "capitalize" }}>{t.statusName(order.status)}</div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(17,20,23,.2)", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "#8d8980" }}>
              <th style={{ textAlign: "left", padding: "8px 0" }}>{t.description}</th>
              <th style={{ textAlign: "right", padding: "8px 0" }}>{t.qty}</th>
              <th style={{ textAlign: "right", padding: "8px 0" }}>{t.rate}</th>
              <th style={{ textAlign: "right", padding: "8px 0" }}>{t.amount}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
              <td style={{ padding: "12px 0" }}>
                {t.licence(tierLabel)}
                <div style={{ fontSize: 12, color: "#66645f" }}>{t.sequenceLine(order.cadence)}</div>
              </td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>{order.employeeCount.toLocaleString(t.locale)} {unitsPlural}</td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.baseRatePerHead)}{t.perYear}</td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(baseTotal)}</td>
            </tr>
            {order.surchargePerHead > 0 ? (
              <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
                <td style={{ padding: "12px 0" }}>
                  {t.extended}
                  <div style={{ fontSize: 12, color: "#66645f" }}>{t.extendedSub(order.screenCount)}</div>
                </td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{order.employeeCount.toLocaleString(t.locale)} {unitsPlural}</td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.surchargePerHead)}{t.perYear}</td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(surchargeTotal)}</td>
              </tr>
            ) : null}
            {order.minimumApplied ? (
              <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
                <td style={{ padding: "12px 0" }} colSpan={3}>
                  {t.minAdj}
                  <div style={{ fontSize: 12, color: "#66645f" }}>{t.minSub(formatUsd(TIER_CONFIG[tier].minimumAnnual))}</div>
                </td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.annualTotal - rawTotal)}</td>
              </tr>
            ) : null}
            {order.overrideAnnualTotal != null ? (
              <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
                <td style={{ padding: "12px 0" }} colSpan={3}>
                  {t.negotiated}
                  <div style={{ fontSize: 12, color: "#66645f" }}>{t.negotiatedSub}</div>
                </td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.overrideAnnualTotal - order.annualTotal)}</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
          <div style={{ minWidth: 220 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, borderTop: "2px solid #111417", paddingTop: 10 }}>
              <span>{t.totalYear}</span>
              <span>{formatUsd(order.overrideAnnualTotal ?? order.annualTotal)}</span>
            </div>
          </div>
        </div>

        {adminUrl ? (
          <div className="poPrintHide" style={{ background: "#f7f4ee", border: "1px solid rgba(17,20,23,.1)", borderRadius: 6, padding: "14px 16px", fontSize: 13, marginBottom: 24 }}>
            {t.manage}{" "}
            <a href={adminUrl} style={{ color: "#af8752", fontWeight: 700 }}>{adminUrl}</a>
          </div>
        ) : null}

        {order.notes ? (
          <div style={{ background: "#f7f4ee", border: "1px solid rgba(17,20,23,.1)", borderRadius: 6, padding: "14px 16px", fontSize: 13, marginBottom: 24 }}>
            <strong>{t.notes}</strong> {order.notes}
          </div>
        ) : null}

        {order.stripeInvoiceUrl && order.status !== "confirmed" ? (
          <div className="poPrintHide" style={{ background: "#111417", borderRadius: 6, padding: "16px 18px", marginBottom: 24, textAlign: "center" }}>
            <a
              href={order.stripeInvoiceUrl}
              style={{ color: "#fffdf9", fontWeight: 700, textDecoration: "none", fontSize: 15 }}
            >
              {t.payInvoice(formatUsd(order.overrideAnnualTotal ?? order.annualTotal))}
            </a>
            <div style={{ color: "#c9c6c0", fontSize: 12, marginTop: 6 }}>{t.payHint}</div>
          </div>
        ) : null}

        <div style={{ fontSize: 12, color: "#66645f", borderTop: "1px solid rgba(17,20,23,.1)", paddingTop: 16 }}>
          <p>
            {order.stripeInvoiceUrl ? t.withInvoice : t.withoutInvoice} {t.vat}
          </p>
          <p style={{ marginTop: 8 }}>{t.questions}</p>
        </div>
      </div>

      <div className="poPrintHide" style={{ maxWidth: 720, margin: "16px auto 0", textAlign: "center" }}>
        <button
          type="button"
          style={{ background: "transparent", border: "1px solid rgba(17,20,23,.3)", borderRadius: 999, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}
          className="poPrintButton"
        >
          {t.print}
        </button>
      </div>

      <style>{`
        @media print {
          .poPrintHide { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.querySelector('.poPrintButton')?.addEventListener('click', function(){ window.print(); });`,
        }}
      />
    </div>
  );
}
