"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export default function ContactPage() {
  return <Suspense fallback={null}><ContactForm /></Suspense>;
}

function ContactForm() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "general";
  const isSchoolsTeams = topic === "schools-teams" || topic === "organization";
  const isTravelCheckIn = topic === "travel-check-in";
  const [formData, setFormData] = useState({ name: "", email: "", organization: "", seatCount: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, topic, consent }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error || "We could not send your message. Please try again.");
        return;
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", organization: "", seatCount: "", message: "" });
      setConsent(false);
    } catch {
      setError("We could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const title = isTravelCheckIn ? "Tell us what would make travel check-in useful." : isSchoolsTeams ? "Bring Konfydence into your organisation." : "Start a conversation.";
  const intro = isSchoolsTeams
    ? "Tell us who you want to train, the approximate cohort size and what you need to demonstrate."
    : isTravelCheckIn
      ? "Share your travel context and the kind of voluntary support you would actually find useful."
      : "Questions about Konfydence, purchases, partnerships and organisational access are welcome.";

  return (
    <PremiumPage ctaHref="/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Try Konfydence">
      <section className="k-shell k-page-hero">
        <p className="k-kicker">Contact Konfydence</p>
        <h1 className="k-display">{title}</h1>
        <p className="k-lede">{intro}</p>
      </section>

      <section className="k-shell k-section-tight" style={{display:"grid",gridTemplateColumns:"minmax(0,.72fr) minmax(360px,1fr)",gap:72,alignItems:"start"}}>
        <div>
          <p className="k-kicker">What happens next</p>
          <h2 className="k-display-sm">A useful reply, not a sales sequence.</h2>
          <p className="k-copy">Your message goes to the Konfydence team. We use the information only to respond to the enquiry and understand the context you have shared.</p>
          <div className="k-statements" style={{gridTemplateColumns:"1fr",marginTop:40}}>
            <article className="k-statement"><span className="k-index">01</span><h3>Context first</h3><p>Tell us the real use case, not the polished version.</p></article>
            <article className="k-statement"><span className="k-index">02</span><h3>Right next step</h3><p>We will point you to the relevant product, pilot or information rather than forcing every enquiry into one funnel.</p></article>
          </div>
        </div>

        {submitted ? (
          <section className="k-form" role="status">
            <p className="k-kicker">Message received</p>
            <h2 style={{fontFamily:"var(--k-display)",fontSize:40,fontWeight:400,letterSpacing:"-.04em",margin:"0 0 8px"}}>Thank you.</h2>
            <p className="k-copy">We’ll review your message and reply as soon as possible.</p>
            <div className="k-actions"><Link className="k-button-quiet" href="/">Return home</Link></div>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="k-form">
            {error ? <div role="alert" style={{padding:12,border:"1px solid #c9a39e",borderRadius:12,color:"#8d4039",fontSize:13}}>{error}</div> : null}
            <Field label="Name"><input name="name" value={formData.name} onChange={handleChange} required autoComplete="name" /></Field>
            <Field label="Email"><input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" /></Field>
            <Field label={isTravelCheckIn ? "Travel context (optional)" : "Organisation (optional)"}><input name="organization" value={formData.organization} onChange={handleChange} autoComplete="organization" /></Field>
            {isSchoolsTeams ? <Field label="Approximate students / employees"><input type="number" min="1" name="seatCount" value={formData.seatCount} onChange={handleChange} placeholder="e.g. 500" /></Field> : null}
            <Field label="Message"><textarea name="message" value={formData.message} onChange={handleChange} required rows={7} style={{resize:"vertical"}} /></Field>
            <label style={{display:"flex",alignItems:"flex-start",gap:9,color:"#66615a",fontSize:12,lineHeight:1.55}}>
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required style={{marginTop:3}} />
              <span>I agree to be contacted about this enquiry and have read the <Link href="/privacy-policy">Privacy Policy</Link>.</span>
            </label>
            <button type="submit" disabled={loading} className="k-button" style={{width:"100%",border:0,opacity:loading ? 0.65 : 1}}>{loading ? "Sending…" : "Send message"}</button>
          </form>
        )}
      </section>
      <style>{`@media(max-width:820px){.k-section-tight[style]{grid-template-columns:1fr!important;gap:44px!important}}`}</style>
    </PremiumPage>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label>{label}{children}</label>;
}
