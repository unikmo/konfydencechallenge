import Link from "next/link";
import type { Metadata } from "next";
import { tokens } from "@/lib/theme/tokens";
import { ProductCard } from "@/components/commerce/ProductCard";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

export const metadata: Metadata = {
  // absolute: stops root layout's title template from double-appending " | Konfydence".
  title: { absolute: "Konfydence Merch | Wallet Card & Fridge Magnet" },
  description:
    "Physical reminders of the HACK framework â€” a wallet-sized scam-check card and a fridge magnet, built to keep pressure-tactic red flags visible at the moment they matter.",
};

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
        <h1 style={styles.title}>Keep the pause close when pressure hits.</h1>
        <p style={styles.lede}>Small, physical cues that help you slow down, verify the request, and protect the people and workspaces that matter to you.</p>

        <section style={styles.grid} aria-label="Safety Suite products">
          <ProductCard
            name="KonfyGuard Wallet Card"
            price="$14.99"
            description="A pocket-sized HACK reminder for the moments a message, call, or payment request feels urgent. Keep the pause within reach."
            variant="paid"
            cta={<CheckoutRedirectButton sku="KG-WALLET" label="Add to cart â€” $14.99" />}
          />
          <ProductCard
            name="KonfyGuard Fridge Magnet"
            price="$9.99"
            description="Make the safer question part of the household routine: pause, verify, then act."
            variant="paid"
            cta={<CheckoutRedirectButton sku="KG-MAGNET" label="Add to cart â€” $9.99" />}
          />
          <ProductCard
            name="Phone Lockscreen"
            description="A quiet daily prompt on the screen you check most: pause before you tap."
            variant="free"
            cta={
              <a href="/assets/lockscreens/konfyguard-phone-lockscreen.pdf" download style={styles.downloadLink}>
                Download free
              </a>
            }
          />
          <ProductCard
            name="Computer Lockscreen"
            description="Keep a visible pause cue where work messages and payment requests arrive."
            variant="free"
            cta={
              <a href="/assets/lockscreens/konfyguard-computer-lockscreen.pdf" download style={styles.downloadLink}>
                Download free
              </a>
            }
          />
        </section>

        <section style={styles.next}>
          <div><p style={styles.type}>Separate experience</p><h2 style={styles.nextTitle}>Want to practise the pause?</h2><p style={styles.description}>Try realistic pressure scenarios and see how you respond before the moment is real.</p></div>
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
    color: tokens.badgeBlue, background: "#eaf3ff",
    fontWeight: 850,
    textDecoration: "none",
    border: `1px solid ${tokens.badgeBlue}`,
    borderRadius: 999,
    padding: "11px 14px",
    fontSize: 13,
  },
  next: { marginTop: 28, padding: 26, background: "#0b1f3a", color: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" },
  nextTitle: { margin: "0 0 8px", fontSize: 25 },
  button: { background: "#ffb31d", color: "#0b1f3a", borderRadius: 999, padding: "13px 18px", fontWeight: 900, textDecoration: "none", whiteSpace: "nowrap" },
  footer: { display: "flex", gap: 20, marginTop: 34, borderTop: "1px solid #dbe4ef", paddingTop: 20 },
};
import { redirect } from "next/navigation";
