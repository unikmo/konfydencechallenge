import Link from "next/link";
import type { Metadata } from "next";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Konfydence Products | Keep the pause close" },
  description: "Physical and digital reminders of the H.A.C.K. framework, designed to keep safer decisions visible when pressure hits.",
};

const products = [
  { name: "KonfyGuard Wallet Card", label: "Pocket reminder", price: "$14.99", copy: "A pocket-sized H.A.C.K. reminder for the moments a message, call or payment request feels urgent.", sku: "KG-WALLET" },
  { name: "KonfyGuard Fridge Magnet", label: "Household reminder", price: "$9.99", copy: "Make the safer question part of the household routine: pause, verify, then act.", sku: "KG-MAGNET" },
];

export default function ProductsPage() {
  return (
    <PremiumPage>
      <section className="k-shell k-page-hero">
        <p className="k-kicker">Konfydence objects</p>
        <h1 className="k-display">Keep the pause close.</h1>
        <p className="k-lede">Small physical and digital cues for the exact moment an urgent request tries to make the decision for you.</p>
      </section>

      <section className="k-shell k-section-tight">
        <div className="k-product-grid">
          {products.map((product) => (
            <article className="k-product" key={product.name}>
              <span className="k-kicker">{product.label}</span>
              <h2>{product.name}</h2>
              <p>{product.copy}</p>
              <strong style={{fontSize:28,fontWeight:500,marginTop:18}}>{product.price}</strong>
              <div className="k-actions"><CheckoutRedirectButton sku={product.sku} label={`Add to cart — ${product.price}`} /></div>
            </article>
          ))}
          <article className="k-product">
            <span className="k-kicker">Digital · free</span>
            <h2>Phone Lockscreen</h2>
            <p>A quiet daily prompt on the screen you check most: pause before you tap.</p>
            <div className="k-actions"><a className="k-button" href="/assets/lockscreens/konfyguard-phone-lockscreen.pdf" download>Download free <span>↓</span></a></div>
          </article>
          <article className="k-product">
            <span className="k-kicker">Digital · free</span>
            <h2>Computer Lockscreen</h2>
            <p>Keep a visible pause cue where work messages and payment requests arrive.</p>
            <div className="k-actions"><a className="k-button" href="/assets/lockscreens/konfyguard-computer-lockscreen.pdf" download>Download free <span>↓</span></a></div>
          </article>
        </div>
      </section>

      <section className="k-shell k-callout">
        <div><p className="k-kicker">Practice, not reminders</p><h2 className="k-display-sm">Want to know how you respond under pressure?</h2><p className="k-copy">The free TravelSafe readiness check gives you realistic choices and an immediate pressure-pattern result.</p></div>
        <div className="k-actions"><Link href="/challenge" className="k-button">Open challenges <span>→</span></Link></div>
      </section>
    </PremiumPage>
  );
}
