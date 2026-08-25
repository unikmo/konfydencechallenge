"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

  const title = isTravelCheckIn ? "Help shape Travel Check-In." : isSchoolsTeams ? "Bring Konfydence to your organisation." : "Start a conversation.";
  const copy = isSchoolsTeams
    ? "Tell us who you want to train and what you need. We’ll discuss the right School, University, Workplace or CoMaSy rollout."
    : isTravelCheckIn
      ? "Tell us about your travel context and what would make a voluntary check-in useful."
      : "Questions about Konfydence, products or organisational access are welcome.";

  return (
    <main className="page">
      <header className="nav"><Link href="/" className="brand">Konfydence</Link><Link href="/challenge">Try a challenge <span>↗</span></Link></header>
      <div className="shell">
        <section className="intro"><p className="eyebrow">Contact</p><h1>{title}</h1><p>{copy}</p></section>
        <section className="formWrap">
          <div className="context"><span>What happens next</span><p>We review the context you provide and reply with the most relevant next step. No automated sales sequence.</p><small>For urgent fraud or financial loss, contact the relevant bank, platform or official authority directly.</small></div>
          <div>
            {submitted ? (
              <section className="success"><p className="eyebrow">Received</p><h2>Thank you.</h2><p>We’ll review your message and reply as soon as possible.</p></section>
            ) : (
              <form onSubmit={handleSubmit}>
                {error ? <div role="alert" className="error">{error}</div> : null}
                <Field label="Name"><input name="name" value={formData.name} onChange={handleChange} required autoComplete="name" /></Field>
                <Field label="Email"><input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" /></Field>
                <Field label={isTravelCheckIn ? "Travel context (optional)" : "Organisation (optional)"}><input name="organization" value={formData.organization} onChange={handleChange} autoComplete="organization" /></Field>
                {isSchoolsTeams ? <Field label="Approximate students / employees"><input type="number" min="1" name="seatCount" value={formData.seatCount} onChange={handleChange} placeholder="e.g. 500" /></Field> : null}
                <Field label="Message"><textarea name="message" value={formData.message} onChange={handleChange} required rows={6} /></Field>
                <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required/><span>I agree to be contacted about this enquiry and have read the <Link href="/privacy-policy">Privacy Policy</Link>.</span></label>
                <button type="submit" disabled={loading}>{loading ? "Sending…" : "Send message"}<span>↗</span></button>
              </form>
            )}
          </div>
        </section>
      </div>
      <footer><Link href="/">Konfydence</Link><nav><Link href="/challenge">Challenges</Link><Link href="/comasy">CoMaSy</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link></nav></footer>
      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#f4f1ea;color:#171717}.page{--paper:#f4f1ea;--ink:#171717;--muted:#716c64;--accent:#d9574c;--line:rgba(23,23,23,.16);font-family:Inter,ui-sans-serif,system-ui,sans-serif;min-height:100vh}.nav{height:78px;width:min(1240px,calc(100% - 56px));margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}.brand{font:400 25px Georgia,serif!important;color:var(--ink)!important}.nav>a{color:var(--ink);text-decoration:none;font-size:12px;font-weight:700}.shell{width:min(1240px,calc(100% - 56px));margin:auto}.intro{padding:110px 0 105px;max-width:980px}.eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:#827c73;margin:0 0 22px}.intro h1{font:400 clamp(58px,7vw,98px)/.92 Georgia,serif;letter-spacing:-.06em;margin:0}.intro>p:last-child{font-size:18px;line-height:1.72;color:var(--muted);max-width:660px;margin:35px 0 0}.formWrap{display:grid;grid-template-columns:.72fr 1.28fr;gap:100px;border-top:1px solid var(--line);padding:75px 0 130px}.context{padding-right:30px}.context>span{font:400 29px Georgia,serif}.context p,.context small{display:block;color:var(--muted);line-height:1.65}.context p{font-size:14px;margin:20px 0}.context small{font-size:11px;border-top:1px solid var(--line);padding-top:20px}form{display:grid;grid-template-columns:1fr 1fr;gap:26px 20px}form label{display:grid;gap:9px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#6e6961}form label:nth-of-type(5){grid-column:1/-1}input,textarea{width:100%;border:0;border-bottom:1px solid #aaa49b;background:transparent;border-radius:0;padding:12px 0;color:var(--ink);font:400 16px Inter,sans-serif;outline:none}textarea{resize:vertical}input:focus,textarea:focus{border-bottom-color:var(--ink);box-shadow:0 1px 0 var(--ink)}.consent{grid-column:1/-1!important;display:flex!important;align-items:flex-start;gap:10px!important;text-transform:none!important;letter-spacing:0!important;font-weight:500!important;line-height:1.5!important}.consent input{width:16px;margin-top:2px;accent-color:var(--ink)}.consent a{color:var(--ink)}button{grid-column:1/-1;border:0;border-radius:999px;background:var(--ink);color:#fff;min-height:50px;padding:0 18px;display:flex;justify-content:space-between;align-items:center;font-weight:800;cursor:pointer}button:disabled{opacity:.55;cursor:not-allowed}.error{grid-column:1/-1;border-top:1px solid #bd5a51;border-bottom:1px solid #bd5a51;padding:14px 0;color:#9d443c;font-size:13px}.success{padding:30px 0;border-top:1px solid var(--line)}.success h2{font:400 54px Georgia,serif;margin:0}.success>p:last-child{color:var(--muted)}footer{background:#151719;color:#9b9790;padding:48px max(28px,calc((100vw - 1240px)/2));display:flex;justify-content:space-between;gap:40px}footer>a{font:400 24px Georgia,serif;color:#fff;text-decoration:none}footer nav{display:flex;gap:22px;flex-wrap:wrap}footer nav a{font-size:11px;color:#aaa6a0;text-decoration:none}@media(max-width:760px){.nav,.shell{width:calc(100% - 40px)}.intro{padding:90px 0 80px}.intro h1{font-size:clamp(52px,15vw,74px)}.formWrap{grid-template-columns:1fr;gap:50px;padding:60px 0 100px}form{grid-template-columns:1fr}form label,form label:nth-of-type(5){grid-column:auto}.consent,button,.error{grid-column:1/-1!important}footer{flex-direction:column;padding:45px 20px}}
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label>{label}{children}</label>;
}
