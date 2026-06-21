import Link from "next/link";

const editions = [
  {
    edition: "travelsafe",
    label: "TravelSafe Challenge",
    description:
      "Spot travel scams before they cost you money, identity access, or peace of mind.",
    price: "$4.99",
  },
  {
    edition: "student",
    label: "Student Challenge",
    description:
      "Practice real decisions around tuition, housing, jobs, campus messages, and AI scams.",
    price: "$1 per student / year",
  },
  {
    edition: "workplace",
    label: "Workplace Challenge",
    description:
      "Train employees to slow down, verify requests, and resist phishing, payment pressure, impersonation, and AI threats.",
    price: "$5 per employee / year",
  },
] as const;

export default function ChallengeLandingPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.brandRow}>
          <div style={styles.logoMark}>K</div>
          <span style={styles.brandName}>Konfydence Challenge</span>
        </div>

        <h1 style={styles.title}>Can you spot the scam before it costs you?</h1>

        <p style={styles.subtitle}>
          Scenario-based scam awareness training for travelers, students, and
          workplaces. No timers. No tricks. Just better decisions under pressure.
        </p>
      </section>

      <section style={styles.grid} aria-label="Available challenges">
        {editions.map((item) => (
          <article key={item.edition} style={styles.card}>
            <div>
              <p style={styles.price}>{item.price}</p>
              <h2 style={styles.cardTitle}>{item.label}</h2>
              <p style={styles.cardText}>{item.description}</p>
            </div>

            <Link
              href={`/challenge/${item.edition}/start`}
              style={styles.button}
            >
              Start challenge
            </Link>
          </article>
        ))}
      </section>

      <section style={styles.noteCard}>
        <h2 style={styles.noteTitle}>How it works</h2>
        <p style={styles.noteText}>
          Each challenge presents realistic scam scenarios. You choose what you
          would do, see immediate feedback, and receive a final readiness result.
        </p>
      </section>
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
    margin: "0 auto 36px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },
  logoMark: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#f59e0b",
    color: "#08111f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "20px",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "0.01em",
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
  grid: {
    maxWidth: "1040px",
    margin: "0 auto",
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
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.24)",
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
    margin: "0 0 12px",
    fontSize: "26px",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
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
    background: "#f59e0b",
    color: "#111827",
    padding: "12px 18px",
    fontWeight: 800,
    textDecoration: "none",
  },
  noteCard: {
    maxWidth: "1040px",
    margin: "22px auto 0",
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
};