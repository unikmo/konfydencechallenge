import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";
import { ProductCard } from "@/components/commerce/ProductCard";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

export default function ProductsPage() {
  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <Link href="/" style={styles.logoLink} aria-label="Back to Konfydence home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/LOGO-05.png" alt="Konfydence" style={styles.logo} />
          </Link>
          <Link href="/challenge" style={styles.link}>Try the Challenge</Link>
        </header>
        <p style={styles.eyebrow}>Konfydence Safety Suite</p>
        <h1 style={styles.title}>Keep the safer action visible.</h1>
        <p style={styles.lede}>Practical reminders for homes and workspaces. These products are separate from the Konfydence Challenge game.</p>

        <section style={styles.grid} aria-label="Safety Suite products">
          <ProductCard
            name="KonfyGuard Wallet Card"
            price="$14.99"
            description="Pocket-sized HACK pressure reminder. Keep it where you keep your credit cards."
            variant="paid"
            cta={<CheckoutRedirectButton sku="KG-WALLET" label="Add to cart — $14.99" />}
          />
          <ProductCard
            name="KonfyGuard Fridge Magnet"
            price="$9.99"
            description="A visible household reminder to pause and verify."
            variant="paid"
            cta={<CheckoutRedirectButton sku="KG-MAGNET" label="Add to cart — $9.99" />}
          />
          <ProductCard
            name="Phone Lockscreen"
            description="A daily prompt to keep safer action visible."
            variant="free"
            cta={
              <a href="/assets/lockscreens/konfyguard-phone-lockscreen.pdf" download style={styles.downloadLink}>
                Download free
              </a>
            }
          />
          <ProductCard
            name="Computer Lockscreen"
            description="A calm reminder for shared workspaces."
            variant="free"
            cta={
              <a href="/assets/lockscreens/konfyguard-computer-lockscreen.pdf" download style={styles.downloadLink}>
                Download free
              </a>
            }
          />
        </section>

        <section style={styles.next}>
          <div><p style={styles.type}>Separate experience</p><h2 style={styles.nextTitle}>Practise under pressure.</h2><p style={styles.description}>Open the scenario-based decision game when you want to test your response.</p></div>
          <Link href="/challenge" style={styles.button}>Open Challenge</Link>
        </section>
        <footer style={styles.footer}><Link href="/" style={styles.link}>Konfydence home</Link><Link href="/pricing" style={styles.link}>Pricing</Link></footer>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f4f7fb", color: "#0b1f3a", padding: "24px 20px 56px", fontFamily: "Inter, ui-sans-serif, system-ui, Segoe UI, sans-serif" },
  shell: { maxWidth: 1040, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 72 },
  logoLink: { display: "inline-flex" },
  logo: { height: 36, width: "auto" },
  eyebrow: { color: "#035494", fontSize: 13, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 14px" },
  title: { fontSize: "clamp(42px, 7vw, 76px)", lineHeight: 0.98, letterSpacing: "-0.04em", margin: 0 },
  lede: { color: "#52657d", fontSize: 19, lineHeight: 1.6, maxWidth: 700, margin: "24px 0 44px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 },
  type: { color: "#e07814", fontSize: 12, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 12px" },
  description: { color: "#52657d", lineHeight: 1.55, margin: 0 },
  link: { color: "#035494", fontWeight: 850, textDecoration: "none" },
  downloadLink: {
    display: "inline-flex",
    justifyContent: "center",
    width: "100%",
    color: tokens.badgeBlue,
    fontWeight: 850,
    textDecoration: "none",
    border: `1px solid ${tokens.badgeBlue}`,
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
  },
  next: { marginTop: 28, padding: 26, background: "#0b1f3a", color: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" },
  nextTitle: { margin: "0 0 8px", fontSize: 25 },
  button: { background: "#ffb31d", color: "#0b1f3a", borderRadius: 999, padding: "13px 18px", fontWeight: 900, textDecoration: "none", whiteSpace: "nowrap" },
  footer: { display: "flex", gap: 20, marginTop: 34, borderTop: "1px solid #dbe4ef", paddingTop: 20 },
};
