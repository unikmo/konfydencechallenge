import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareButtons } from "@/components/ShareButtons";
import { prisma } from "@/lib/prisma";
import { computeChallengeTotals, computeHackProfile, computeCategoryBreakdown } from "@/lib/scoring/scoringEngine";
import { HACK_LABELS } from "@/lib/challenge/labels";
import { ResultViewedHook } from "@/components/ResultEventHooks";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";
import { ScoreRing } from "@/components/illustrations/ScoreRing";
import { HackIcon } from "@/components/illustrations/HackIcon";
import { readinessTierColor } from "@/lib/theme/tokens";
import { isGuestEmail } from "@/lib/challenge/startSessionUtil";
import { ResultEmailGate } from "@/components/challenge/ResultEmailGate";
import { sendChallengeResultEmail } from "@/lib/challenge/sendResultEmail";

const EDITION_DECK_NAME: Record<string, string> = {
  school: "School",
  university: "University",
  family: "Family",
  travelsafe: "TravelSafe",
  workplace: "Workplace",
};

const levelColor = { strong: "#4f8a10", watch: "#a66d00", vulnerable: "#c2410c" } as const;

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "radial-gradient(140% 80% at 50% -10%,#f4efe4 0%,#ece5d7 60%,#e7dfce 100%)", padding: "20px 24px 60px", color: "var(--k-ink)" },
  shell: { width: "min(1000px, 100%)", margin: "0 auto" },
  header: { height: 72, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--k-line)", marginBottom: 26 },
  smallLink: { color: "var(--k-muted)", fontSize: 12, fontWeight: 600, textDecoration: "none" },
  card: { background: "#fffefc", color: "var(--k-ink)", border: "1px solid rgba(17,20,23,.09)", borderRadius: "var(--k-radius)", padding: 30, boxShadow: "0 1px 2px rgba(17,20,23,.05), 0 10px 20px -6px rgba(17,20,23,.10), 0 40px 70px -24px rgba(17,20,23,.26)", marginBottom: 16 },
  button: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 48, padding: "12px 15px", borderRadius: 999, background: "var(--k-ink)", color: "#fff", textDecoration: "none", fontWeight: 650, marginTop: 12 },
  secondary: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 46, padding: "11px 14px", borderRadius: 999, background: "transparent", border: "1px solid var(--k-line)", color: "var(--k-ink)", textDecoration: "none", fontWeight: 600, marginTop: 10 },
};

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ claim?: string }>;
}) {
  const { sessionId } = await params;
  const { claim } = await searchParams;
  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true, edition: true, mode: true, status: true, currentIndex: true,
      scoreTotal: true, scoreMax: true, user: { select: { id: true, email: true } },
    },
  });
  if (!session) notFound();

  const cards = await prisma.challengeSessionCard.findMany({
    where: { sessionId },
    select: { score: true, scenario: { select: { hackKey: true, category: true } } },
  });
  const totalCards = cards.length;
  const completedAll = session.currentIndex >= totalCards;
  const totals = computeChallengeTotals({ scoreTotal: session.scoreTotal, scoreMax: session.scoreMax });
  const profile = computeHackProfile(cards.map((c) => ({ hackKey: c.scenario.hackKey, score: c.score })));
  const categories = computeCategoryBreakdown(cards.map((c) => ({ category: c.scenario.category, score: c.score })));
  const weakest = profile.primaryVulnerability;
  const strongest = profile.strongestReflex;
  const bestCategory = categories[0] ?? null;
  const isDiagnostic = session.mode === "diagnostic";
  const deckName = EDITION_DECK_NAME[session.edition] ?? session.edition;
  const pct = totals.totalPercent;
  const tierColor = readinessTierColor(pct);

  if (completedAll && session.status !== "COMPLETED") {
    await prisma.challengeSession.update({ where: { id: sessionId }, data: { status: "COMPLETED", completedAt: new Date() } });
  }

  // Free play is free to start, but the result is delivered by email. Stand the
  // email gate in front of the result for a player who has not registered yet.
  if (completedAll && isGuestEmail(session.user.email)) {
    return <ResultEmailGate sessionId={sessionId} edition={session.edition} claim={claim} />;
  }

  // Registered player finishing a run: send the results email (idempotent).
  if (completedAll && !isGuestEmail(session.user.email)) {
    await sendChallengeResultEmail(sessionId).catch(() => {});
  }

  const interpretation = pct >= 90
    ? "Your stop-and-verify reflex held up consistently under pressure."
    : pct >= 75
      ? "You caught most traps, but one or two pressure patterns still changed your decisions."
      : pct >= 55
        ? "You spot some warning signs, but pressure can still move you before independent verification."
        : "The scenarios moved you too often toward the action the requester wanted. Your biggest gain will come from slowing the next step down.";

  const diagnosticSessions = isDiagnostic
    ? await prisma.challengeSession.count({ where: { userId: session.user.id, mode: "diagnostic" } })
    : 0;
  const isRegistered = isDiagnostic ? !isGuestEmail(session.user.email) : true;
  const canPlayAnotherFreeRound = isDiagnostic && diagnosticSessions < 2;
  const freeRoundHref = isRegistered
    ? `/challenge/${session.edition}/start?mode=diagnostic`
    : `/challenge/register?next=${encodeURIComponent(`/challenge/${session.edition}/start?mode=diagnostic`)}`;
  const pressurePattern = weakest ? HACK_LABELS[weakest.hackKey].public : "None identified";

  return (
    <main style={styles.page}>
      <ResultViewedHook sessionId={sessionId} krsScore={Math.round(pct)} pressurePattern={pressurePattern} />
      <div style={styles.shell}>
        <header style={styles.header}>
          <Link href="/" className="k-wordmark" style={{ textDecoration: "none" }}>Konfydence</Link>
          <div style={{ display: "flex", gap: 16 }}>
            <Link style={styles.smallLink} href="/dashboard">My results</Link>
            <Link style={styles.smallLink} href="/challenge">Choose another test</Link>
          </div>
        </header>

        <section style={styles.card}>
          <p className="overline">{isDiagnostic ? "FREE READINESS CHECK" : "FULL CHALLENGE"}</p>
          <div className="scoreIntro">
            <div>
              <h1>Your Scam Survival Profile</h1>
              <p>{interpretation}</p>
              <small>{isDiagnostic ? "Directional signal based on two decisions in each H.A.C.K. dimension — not a guarantee of protection." : "A balanced pressure-profile result across six decisions in each H.A.C.K. dimension."}</small>
            </div>
            <div className="ringWrap">
              <ScoreRing percent={pct} color={tierColor}>
                <strong>{Math.round(pct)}%</strong><span>{totals.totalScoreTotal}/{totals.totalScoreMax}</span>
              </ScoreRing>
              <b>{totals.level}</b>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div className="sectionTitle"><div><p className="overline">YOUR H.A.C.K. PROFILE</p><h2>Where pressure changes your decisions.</h2></div><p>Each dimension is scored separately so a strong overall result cannot hide one repeatable weakness.</p></div>
          <div className="profileGrid">
            {profile.dimensions.map((item) => (
              <article className={`dimension ${item.level}`} key={item.hackKey}>
                <div className="dimensionHead">
                  <span className="key"><HackIcon trigger={item.hackKey} color={levelColor[item.level]} size={18} /></span>
                  <div><p>{HACK_LABELS[item.hackKey].short}</p><small>{item.levelLabel}</small></div>
                  <strong>{Math.round(item.pct)}%</strong>
                </div>
                <div className="bar"><span style={{ width: `${item.pct}%`, background: levelColor[item.level] }} /></div>
                <p className="insight">{item.insight}</p>
                <small className="sample">Tested across {item.cardCount} decision{item.cardCount === 1 ? "" : "s"}.</small>
              </article>
            ))}
          </div>

          {weakest ? (
            <div className="priority">
              <div className="priorityTop"><span>PRIORITY TO TRAIN</span><b>{HACK_LABELS[weakest.hackKey].public}</b></div>
              <h3>{weakest.practice}</h3>
              <p>Your lowest H.A.C.K. signal was {Math.round(weakest.pct)}%. Practise this rule until it becomes the automatic next move, not something you remember after acting.</p>
            </div>
          ) : null}

          <div className="strengthRow">
            {strongest ? <p><span>Strongest reflex</span><b>{HACK_LABELS[strongest.hackKey].public} · {Math.round(strongest.pct)}%</b></p> : null}
            {bestCategory ? <p><span>Strongest situation</span><b>{bestCategory.category} · {Math.round(bestCategory.pct)}%</b></p> : null}
          </div>
        </section>

        {isDiagnostic ? (
          <section className="conversion">
            <p className="overline lime">YOUR FREE CHECK FOUND THE PATTERN</p>
            <h2>Do not just know the weakness. Train the reflex.</h2>
            <p>The full {deckName} Challenge works through 40+ real-life scenarios — balanced across Hurry, Authority, Comfort and Kill-Switch — in short rounds, with a deeper profile and completion certificate.</p>
            <p className="bankNote">Each round prioritises scenarios you have not seen, so practice measures decision quality rather than memory of the previous round.</p>
            {weakest ? <div className="recommend"><b>Start here:</b> {weakest.practice}</div> : null}
            <div className="commerce">
              <CheckoutRedirectButton sku={`CHAL-SINGLE-${session.edition.toUpperCase()}`} label="Unlock Full Challenge — $6.99" />
              <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get All 5 Challenges — $24.99" variant="outline" />
            </div>
            {canPlayAnotherFreeRound ? <Link style={{ ...styles.secondary, background: "white" }} href={freeRoundHref}>{isRegistered ? "Play my second free check" : "Register to unlock my second free check"}</Link> : <p className="limit">Your two free readiness checks are complete.</p>}
          </section>
        ) : (
          <section style={styles.card}>
            <h2 style={{ margin: 0 }}>Keep the reflex fresh.</h2>
            <p style={{ color: "#5f6c75", lineHeight: 1.6 }}>A replay uses unseen scenarios first, while keeping H.A.C.K. balanced. That makes improvement more meaningful than memorising the previous answers.</p>
            <Link style={styles.button} href={`/challenge/${session.edition}/start?mode=full`}>Run another balanced challenge</Link>
            <Link style={styles.secondary} href={`/challenge/session/${sessionId}/certificate`}>{completedAll ? "View certificate" : "Certificate locked until completion"}</Link>
          </section>
        )}

        {completedAll ? <section style={styles.card}><ShareButtons url={`/challenge/session/${sessionId}/results`} title="Konfydence Challenge" text={`I just tested my Konfydence ${deckName} pressure profile. Take the free check and compare your H.A.C.K. pattern.`} /></section> : null}
      </div>

      <style>{`
        :global(*){box-sizing:border-box}
        .overline{margin:0 0 14px;color:var(--k-gold);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
        .scoreIntro{display:grid;grid-template-columns:1fr 190px;gap:40px;align-items:center}
        .scoreIntro h1,.sectionTitle h2,.conversion h2{font-family:var(--k-display);font-weight:400;letter-spacing:-.035em}
        .scoreIntro h1{font-size:clamp(30px,4vw,46px);line-height:1.02;margin:0 0 16px}
        .scoreIntro>div>p{color:var(--k-muted);font-size:15px;line-height:1.65;margin:0 0 10px;max-width:650px}
        .scoreIntro small{color:var(--k-soft);font-size:11px;line-height:1.5}
        .ringWrap{text-align:center}.ringWrap strong{font-size:28px;color:var(--k-ink);font-family:var(--k-display);font-weight:400}.ringWrap span{display:block;font-size:10px;color:var(--k-soft)}
        .ringWrap>b{display:inline-block;margin-top:10px;border-radius:999px;background:var(--k-stone);padding:6px 12px;color:var(--k-ink);font-size:11px;font-weight:600}
        .sectionTitle{display:grid;grid-template-columns:1fr .7fr;gap:34px;align-items:end;margin-bottom:26px}
        .sectionTitle h2{font-size:clamp(24px,2.6vw,32px);line-height:1.05;margin:0}
        .sectionTitle>p{margin:0;color:var(--k-soft);font-size:12px;line-height:1.6}
        .profileGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .dimension{border:1px solid var(--k-line);border-radius:16px;padding:18px;background:var(--k-paper)}
        .dimensionHead{display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:center}
        .dimensionHead .key{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--k-white);border:1px solid var(--k-line)}
        .dimensionHead p{font-weight:700;margin:0;font-size:13px}
        .dimensionHead small{color:var(--k-soft);font-size:10px;font-weight:600}
        .dimensionHead>strong{font-size:22px;font-family:var(--k-display);font-weight:400}
        .bar{height:4px;background:var(--k-stone);border-radius:999px;overflow:hidden;margin:14px 0}
        .bar span{display:block;height:100%;border-radius:999px}
        .insight{font-size:12px;line-height:1.55;color:var(--k-muted);margin:0 0 8px}
        .sample{font-size:9px;color:var(--k-soft);letter-spacing:.02em}
        .priority{margin-top:18px;border-radius:18px;background:var(--k-deep);color:#fff;padding:24px}
        .priorityTop{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .priorityTop span{font-size:9px;color:#c5a97e;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
        .priorityTop b{font-size:12px;color:#d9d6d1}
        .priority h3{font-family:var(--k-display);font-weight:400;font-size:22px;line-height:1.25;margin:16px 0 8px;max-width:760px}
        .priority p{font-size:11px;line-height:1.6;color:#aaa7a2;margin:0}
        .strengthRow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
        .strengthRow p{border:1px solid var(--k-line);border-radius:14px;padding:14px;margin:0;display:flex;flex-direction:column;gap:5px}
        .strengthRow span{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:var(--k-soft);font-weight:700}
        .strengthRow b{font-size:12px}
        .conversion{background:var(--k-deep);color:#fff;border:1px solid var(--k-line);border-radius:var(--k-radius);padding:30px;margin-bottom:16px}
        .conversion .overline,.lime{color:#c5a97e}
        .conversion h2{font-size:clamp(24px,3vw,34px);line-height:1.05;margin:0 0 14px}
        .conversion>p:not(.overline):not(.limit){color:#bcb8b1;line-height:1.65;font-size:13px;max-width:780px}
        .bankNote{font-size:11px!important;color:#aaa7a2!important}
        .recommend{border-left:2px solid var(--k-gold);background:rgba(175,135,82,.12);padding:12px 16px;margin:18px 0;font-size:12px;line-height:1.55}
        .commerce{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}
        .limit{color:#aaa7a2;font-size:11px;font-weight:600;text-align:center;margin:12px 0 0}
        @media(max-width:680px){.scoreIntro,.sectionTitle{grid-template-columns:1fr}.ringWrap{text-align:left}.profileGrid,.strengthRow,.commerce{grid-template-columns:1fr}.priorityTop{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}
