import Link from "next/link";
import type { Metadata } from "next";

// SEO metadata — docs/DEV_BRIEF_DIAGNOSTIC_UPGRADE.md §15.
export const metadata: Metadata = {
  title: "Konfydence | Scam Readiness Game & Online Scam Training",
  description:
    "Take a free 3-minute scam-readiness challenge with real-life scenarios, get your Konfydence Readiness Score, and learn which pressure tricks could catch you.",
};

// Painpoint-based deck copy — docs/DEV_BRIEF_DIAGNOSTIC_UPGRADE.md §7.
const editions = [
  {
    edition: "school",
    label: "School Edition",
    audience: "Ages 12–18 · Schools, teachers, parents, youth programs",
    description: "Gaming pressure, fake links, group chats, account takeovers, and risky sharing.",
    price: "$4.99",
    cta: "Start School Test",
  },
  {
    edition: "university",
    label: "University Edition",
    audience: "Students 18+ · Universities, student unions, international offices",
    description: "Housing scams, fake jobs, tuition pressure, identity risks, campus messages, and travel traps.",
    price: "$4.99",
    cta: "Start University Test",
  },
  {
    edition: "family",
    label: "Family Edition",
    audience: "Parents, children, elders · Households",
    description: "Money requests, elder scams, child accounts, shared devices, and emotional pressure.",
    price: "$4.99",
    cta: "Start Family Test",
  },
  {
    edition: "travelsafe",
    label: "TravelSafe",
    audience: "Travellers, tourists, exchange students, solo travellers",
    description: "Flights, hotels, taxis, WiFi, SIM cards, refunds, rentals, and tourist traps.",
    price: "$4.99",
    cta: "Start TravelSafe Test",
  },
  {
    edition: "workplace",
    label: "Workplace",
    audience: "Employees, teams, HR/L&D · Companies and managers",
    description: "Phishing, fake invoices, payroll changes, executive pressure, AI voice scams, and data requests.",
    price: "$4.99",
    cta: "Start Workplace Test",
  },
] as const;

const howItWorks = [
  {
    title: "Choose your challenge",
    body: "Pick the situation that fits your life: family, school, university, travel, or workplace.",
  },
  {
    title: "Face 10 real-life scenarios",
    body: "Make decisions under the same pressure scammers use in real life.",
  },
  {
    title: "Get your Konfydence Readiness Score™",
    body: "See your score, your weakest pressure pattern, and what to practice next.",
  },
  {
    title: "Unlock the full challenge",
    body: "Upgrade to the 50-scenario deck for the full KRS dashboard and certificate.",
  },
] as const;

export default function ChallengeLandingPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.brandRow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/LOGO-05.png" alt="Konfydence" style={styles.logoImg} />
        </div>

        <h1 style={styles.title}>Think you can&rsquo;t be scammed?</h1>

        <p style={styles.subtitle}>
          Take the free 3-minute challenge with real-life scenarios and get your Konfydence Readiness Score&trade;.
        </p>

        <p style={styles.supportLine}>
          Most scams work because they don&rsquo;t feel like scams in the moment. See how you react to urgency,
          authority, emotional pressure, and risky action moments &mdash; before they happen in real life.
        </p>

        <div style={styles.ctaRow}>
          <Link href="#challenges" style={styles.primaryButton}>
            Start Free Challenge
          </Link>
          <Link href="#challenges" style={styles.secondaryButton}>
            Explore the 5 Challenges
          </Link>
        </div>
        <p style={styles.trustLine}>No lectures. No jargon. Just real choices under pressure.</p>
      </section>

      <section style={styles.howItWorks} aria-label="How Konfydence works">
        <h2 style={styles.sectionTitle}>How Konfydence works</h2>
        <div style={styles.howGrid}>
          {howItWorks.map((step, i) => (
            <div key={step.title} style={styles.howCard}>
              <div style={styles.howStepNumber}>{i + 1}</div>
              <div style={styles.howStepTitle}>{step.title}</div>
              <div style={styles.howStepBody}>{step.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="challenges" aria-label="Available challenges">
        <h2 style={{ ...styles.sectionTitle, maxWidth: "1040px", margin: "0 auto 20px" }}>
          Where could pressure catch you?
        </h2>
        <div style={styles.grid}>
          {editions.map((item) => (
            <article key={item.edition} style={styles.card}>
              <div>
                <p style={styles.price}>{item.price}</p>
                <h3 style={styles.cardTitle}>{item.label}</h3>
                <p style={styles.audience}>{item.audience}</p>
                <p style={styles.cardText}>{item.description}</p>
              </div>

              <div>
                <Link href={`/challenge/${item.edition}/start?mode=diagnostic`} style={styles.button}>
                  {item.cta}
                </Link>
                <Link href="/pricing" style={styles.subtleLink}>
                  Full challenge available
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.noteCard}>
        <h2 style={styles.noteTitle}>What your score reveals</h2>
        <p style={styles.noteText}>
          Your Konfydence Readiness Score&trade; is not just about right or wrong answers. It shows how you react
          when a scam uses urgency, authority, emotional connection, or a risky action moment.
        </p>
        <div style={styles.revealGrid}>
          <div style={styles.revealCard}>
            <div style={styles.revealTitle}>Your score</div>
            <div style={styles.revealBody}>How ready you are in real-life scam moments.</div>
          </div>
          <div style={styles.revealCard}>
            <div style={styles.revealTitle}>Your weakest pressure pattern</div>
            <div style={styles.revealBody}>The type of pressure most likely to make you act too fast.</div>
          </div>
          <div style={styles.revealCard}>
            <div style={styles.revealTitle}>Your safer-action habits</div>
            <div style={styles.revealBody}>What you already do well and what to practice next.</div>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        Konfydence is an educational scam-readiness game. It does not guarantee protection from fraud or financial
        loss.
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#08111f",
    color: "#ffffff",
    padding: "48px 20px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    maxWidth: "1040px",
    margin: "0 auto 48px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },
  logoImg: {
    height: "36px",
    width: "auto",
  },
  title: {
    maxWidth: "820px",
    margin: 0,
    fontSize: "clamp(38px, 7vw, 76px)",
    lineHeight: 0.95,
    letterSpacing: "-0.05em",
  },
  subtitle: {
    maxWidth: "720px",
    marginTop: "22px",
    color: "#cbd5e1",
    fontSize: "20px",
    lineHeight: 1.6,
  },
  supportLine: {
    maxWidth: "680px",
    marginTop: "14px",
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  ctaRow: {
    marginTop: "28px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "18px",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "#ffb31d",
    color: "#08111f",
    padding: "14px 24px",
    fontWeight: 800,
    fontSize: "16px",
    textDecoration: "none",
  },
  trustLine: {
    marginTop: "14px",
    color: "#94a3b8",
    fontSize: "14px",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.28)",
    color: "#ffffff",
    padding: "14px 24px",
    fontWeight: 800,
    fontSize: "16px",
    textDecoration: "none",
  },
  sectionTitle: {
    fontSize: "clamp(24px, 4vw, 32px)",
    letterSpacing: "-0.02em",
    marginBottom: 0,
  },
  howItWorks: {
    maxWidth: "1040px",
    margin: "0 auto 48px",
  },
  howGrid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  howCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "20px",
  },
  howStepNumber: {
    display: "inline-flex",
    width: 28,
    height: 28,
    borderRadius: 999,
    background: "#ffb31d",
    color: "#08111f",
    fontWeight: 900,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  howStepTitle: { fontWeight: 800, marginBottom: 6, fontSize: 15 },
  howStepBody: { color: "#cbd5e1", fontSize: 14, lineHeight: 1.5 },
  grid: {
    maxWidth: "1040px",
    margin: "0 auto 48px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    minHeight: "280px",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid rgba(15,23,42,0.08)",
  },
  price: {
    display: "inline-flex",
    margin: "0 0 18px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontSize: "13px",
    fontWeight: 700,
  },
  cardTitle: {
    margin: "0 0 8px",
    fontSize: "26px",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    color: "#035494",
  },
  audience: {
    margin: "0 0 12px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#64748b",
  },
  cardText: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.55,
  },
  button: {
    marginTop: "28px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "#ffb31d",
    color: "#08111f",
    padding: "12px 18px",
    fontWeight: 800,
    textDecoration: "none",
  },
  subtleLink: {
    display: "block",
    marginTop: "10px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
  },
  noteCard: {
    maxWidth: "1040px",
    margin: "0 auto 32px",
    padding: "24px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  noteTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
  },
  noteText: {
    margin: 0,
    maxWidth: "760px",
    color: "#cbd5e1",
    lineHeight: 1.6,
  },
  revealGrid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
  },
  revealCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    padding: "16px",
  },
  revealTitle: { fontWeight: 800, marginBottom: 6, fontSize: 14, color: "#ffb31d" },
  revealBody: { color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 },
  footer: {
    maxWidth: "1040px",
    margin: "0 auto",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.6,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "20px",
  },
};
