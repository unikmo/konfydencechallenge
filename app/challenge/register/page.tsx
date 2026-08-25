import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export default async function RegisterForReplayPage(
  props: { searchParams?: Promise<{ next?: string; error?: string }> }
) {
  const searchParams = await props.searchParams;
  const next = searchParams?.next?.startsWith("/") ? searchParams.next : "/challenge";
  const error = searchParams?.error;

  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Challenges">
      <section className="k-shell k-page-hero center">
        <p className="k-kicker">One more free round</p>
        <h1 className="k-display">Keep practising without losing your progress.</h1>
        <p className="k-lede">Enter your email to unlock one additional 8-scenario readiness check. Your full challenge remains optional.</p>
      </section>

      <section className="k-shell k-section-tight" style={{maxWidth:680}}>
        {error === "already-used" ? (
          <p role="alert" style={{padding:14,border:"1px solid #cbaaa4",borderRadius:14,color:"#8d4039",background:"#fff",fontSize:13,lineHeight:1.55}}>
            That email is already linked to another player. Use the email from this device or continue with the full challenge.
          </p>
        ) : null}
        <form method="post" action="/api/challenge/register" className="k-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
          <label style={{display:"flex",gridTemplateColumns:"auto 1fr",alignItems:"flex-start",gap:10,fontWeight:400,lineHeight:1.55}}>
            <input type="checkbox" name="consent" value="yes" required style={{width:"auto",marginTop:2}} />
            <span>Send me my progress link and occasional Konfydence updates. Unsubscribe anytime.</span>
          </label>
          <button type="submit" className="k-button" style={{border:0,width:"100%"}}>Unlock my next free round <span>→</span></button>
        </form>
        <p className="k-copy" style={{fontSize:11,textAlign:"center",margin:"18px auto 0"}}>By continuing, you agree to our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms-of-service">Terms</Link>.</p>
      </section>
    </PremiumPage>
  );
}
