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

const EDITION_DECK_NAME: Record<string, string> = {
  school: "School",
  university: "University",
  family: "Family",
  travelsafe: "TravelSafe",
  workplace: "Workplace",
};

const levelColor = { strong: "#4f8a10", watch: "#a66d00", vulnerable: "#c2410c" } as const;

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(180deg,#07131f,#0b2237)", padding: 18, color: "white" },
  shell: { width: "100%", maxWidth: 1000, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  smallLink: { color: "#ffffffcc", fontSize: 12, fontWeight: 800, textDecoration: "none" },
  card: { background: "#fffdf8", color: "#091522", borderRadius: 22, padding: 24, boxShadow: "0 18px 50px rgba(0,0,0,.22)", marginBottom: 14 },
  button: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 48, padding: "12px 15px", borderRadius: 999, background: "#ff5b50", color: "white", textDecoration: "none", fontWeight: 950, marginTop: 10 },
  secondary: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 46, padding: "11px 14px", borderRadius: 999, background: "white", border: "1px solid #d8dcd8", color: "#091522", textDecoration: "none", fontWeight: 900, marginTop: 9 },
};

export default async function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
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
          <Link href="/" style={{ color: "white", textDecoration: "none", fontWeight: 950 }}>Konfydence</Link>
          <div style={{ display: "flex", gap: 16 }}>
            <Link style={styles.smallLink} href="/dashboard">My results</Link>
            <Link style={styles.smallLink} href="/challenge">Choose another test</Link>
          </div>
        </header>

        <section style={styles.card}>
          <p className="overline">{isDiagnostic ? "FREE 8-DECISION READINESS CHECK" : "FULL 24-DECISION CHALLENGE"}</p>
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
            <p>The full {deckName} Challenge draws 24 balanced decisions from its 40-scenario bank — six each across Hurry, Authority, Comfort and Kill-Switch — with a deeper profile and completion certificate.</p>
            <p className="bankNote">Replays prioritise unseen cards, so practice measures decision quality rather than memory of the previous round.</p>
            {weakest ? <div className="recommend"><b>Start here:</b> {weakest.practice}</div> : null}
            <div className="commerce">
              <CheckoutRedirectButton sku={`CHAL-SINGLE-${session.edition.toUpperCase()}`} label="Unlock Full Challenge — $4.99" />
              <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get All 5 Challenges — $19.99" variant="outline" />
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

        {completedAll ? <section style={styles.card}><ShareButtons url={`/challenge/session/${sessionId}/results`} title="Konfydence Challenge" text={`I just tested my Konfydence ${deckName} pressure profile. Take the free 8-scenario check and compare your H.A.C.K. pattern.`} /></section> : null}
      </div>

      <style>{`
        :global(*){box-sizing:border-box}.overline{margin:0 0 10px;color:#d34b42;font-size:9px;font-weight:950;letter-spacing:.12em}.scoreIntro{display:grid;grid-template-columns:1fr 190px;gap:35px;align-items:center}.scoreIntro h1,.sectionTitle h2,.conversion h2{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.04em}.scoreIntro h1{font-size:clamp(39px,6vw,60px);line-height:.97;margin:0 0 16px}.scoreIntro>div>p{color:#41515d;font-size:15px;line-height:1.6;margin:0 0 10px;max-width:650px}.scoreIntro small{color:#75828b;font-size:11px;line-height:1.45}.ringWrap{text-align:center}.ringWrap strong{font-size:28px;color:#091522}.ringWrap span{display:block;font-size:10px;color:#71808a}.ringWrap>b{display:inline-block;margin-top:8px;border-radius:999px;background:#edf1ed;padding:6px 10px;color:#30404b;font-size:11px}.sectionTitle{display:grid;grid-template-columns:1fr .7fr;gap:30px;align-items:end;margin-bottom:22px}.sectionTitle h2{font-size:34px;line-height:1;margin:0}.sectionTitle>p{margin:0;color:#687781;font-size:12px;line-height:1.55}.profileGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dimension{border:1px solid #dce0dc;border-radius:16px;padding:16px;background:white}.dimensionHead{display:grid;grid-template-columns:36px 1fr auto;gap:10px;align-items:center}.dimensionHead .key{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#f3f4f1}.dimensionHead p{font-weight:950;margin:0;font-size:13px}.dimensionHead small{color:#72808a;font-size:10px;font-weight:800}.dimensionHead>strong{font-size:22px}.bar{height:5px;background:#e8ebe7;border-radius:999px;overflow:hidden;margin:13px 0}.bar span{display:block;height:100%;border-radius:999px}.insight{font-size:12px;line-height:1.5;color:#53626c;margin:0 0 8px}.sample{font-size:9px;color:#879199}.priority{margin-top:16px;border-radius:18px;background:#091522;color:white;padding:20px}.priorityTop{display:flex;align-items:center;justify-content:space-between;gap:12px}.priorityTop span{font-size:9px;color:#ffb31d;font-weight:950;letter-spacing:.11em}.priorityTop b{font-size:12px;color:#d6e0e7}.priority h3{font-family:Georgia,serif;font-weight:500;font-size:25px;line-height:1.2;margin:18px 0 8px;max-width:760px}.priority p{font-size:11px;line-height:1.55;color:#9eb0bd;margin:0}.strengthRow{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.strengthRow p{border:1px solid #dfe1dd;border-radius:14px;padding:13px;margin:0;display:flex;flex-direction:column;gap:4px}.strengthRow span{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#88939b;font-weight:900}.strengthRow b{font-size:12px}.conversion{background:#0b1f3a;color:white;border:2px solid #ffb31d;border-radius:22px;padding:25px;margin-bottom:14px}.lime{color:#b8ff3d}.conversion h2{font-size:38px;line-height:1;margin:0 0 13px}.conversion>p:not(.overline):not(.limit){color:#c6d4df;line-height:1.6;font-size:13px;max-width:780px}.bankNote{font-size:11px!important;color:#91a4b2!important}.recommend{border-left:3px solid #b8ff3d;background:rgba(184,255,61,.07);padding:12px 14px;margin:16px 0;font-size:12px;line-height:1.5}.commerce{display:grid;grid-template-columns:1fr 1fr;gap:10px}.limit{color:#9eb0bd;font-size:11px;font-weight:800;text-align:center;margin:12px 0 0}
        @media(max-width:680px){.scoreIntro,.sectionTitle{grid-template-columns:1fr}.ringWrap{text-align:left}.profileGrid,.strengthRow,.commerce{grid-template-columns:1fr}.conversion h2{font-size:31px}.priorityTop{align-items:flex-start;flex-direction:column}.scoreIntro h1{font-size:42px}}
      `}</style>
    </main>
  );
}
