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

const levelColor = { strong: "#4f7a5e", watch: "#9a7135", vulnerable: "#a64d43" } as const;

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#e8e4dc", padding: "0 18px 50px", color: "#171717" },
  shell: { width: "100%", maxWidth: 1080, margin: "0 auto" },
  header: { minHeight: 78, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(23,23,23,.16)", marginBottom: 28 },
  smallLink: { color: "#5f5a53", fontSize: 11, fontWeight: 750, textDecoration: "none" },
  card: { background: "#fbfaf6", color: "#171717", border: "1px solid rgba(23,23,23,.14)", padding: 32, marginBottom: 16 },
  button: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 50, padding: "12px 15px", borderRadius: 999, background: "#d9574c", color: "white", textDecoration: "none", fontWeight: 850, marginTop: 10 },
  secondary: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 48, padding: "11px 14px", borderRadius: 999, background: "transparent", border: "1px solid #aaa49b", color: "#171717", textDecoration: "none", fontWeight: 800, marginTop: 9 },
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
          <Link href="/" className="resultBrand">Konfydence</Link>
          <div className="resultNav"><Link style={styles.smallLink} href="/dashboard">My results</Link><Link style={styles.smallLink} href="/challenge">Choose another test</Link></div>
        </header>

        <section className="resultHero" style={styles.card}>
          <p className="overline">{isDiagnostic ? "FREE 8-DECISION READINESS CHECK" : "FULL 24-DECISION CHALLENGE"}</p>
          <div className="scoreIntro">
            <div><h1>Your pressure profile.</h1><p>{interpretation}</p><small>{isDiagnostic ? "Directional signal based on two decisions in each H.A.C.K. dimension — not a guarantee of protection." : "A balanced pressure-profile result across six decisions in each H.A.C.K. dimension."}</small></div>
            <div className="ringWrap"><ScoreRing percent={pct} color={tierColor}><strong>{Math.round(pct)}%</strong><span>{totals.totalScoreTotal}/{totals.totalScoreMax}</span></ScoreRing><b>{totals.level}</b></div>
          </div>
        </section>

        <section style={styles.card}>
          <div className="sectionTitle"><div><p className="overline">YOUR H.A.C.K. PROFILE</p><h2>Where pressure changes your decisions.</h2></div><p>Each dimension is scored separately so a strong overall result cannot hide one repeatable weakness.</p></div>
          <div className="profileGrid">
            {profile.dimensions.map((item) => (
              <article className={`dimension ${item.level}`} key={item.hackKey}>
                <div className="dimensionHead"><span className="key"><HackIcon trigger={item.hackKey} color={levelColor[item.level]} size={18} /></span><div><p>{HACK_LABELS[item.hackKey].short}</p><small>{item.levelLabel}</small></div><strong>{Math.round(item.pct)}%</strong></div>
                <div className="bar"><span style={{ width: `${item.pct}%`, background: levelColor[item.level] }} /></div>
                <p className="insight">{item.insight}</p><small className="sample">Tested across {item.cardCount} decision{item.cardCount === 1 ? "" : "s"}.</small>
              </article>
            ))}
          </div>
          {weakest ? <div className="priority"><div className="priorityTop"><span>PRIORITY TO TRAIN</span><b>{HACK_LABELS[weakest.hackKey].public}</b></div><h3>{weakest.practice}</h3><p>Your lowest H.A.C.K. signal was {Math.round(weakest.pct)}%. Practise this rule until it becomes the automatic next move, not something you remember after acting.</p></div> : null}
          <div className="strengthRow">{strongest ? <p><span>Strongest reflex</span><b>{HACK_LABELS[strongest.hackKey].public} · {Math.round(strongest.pct)}%</b></p> : null}{bestCategory ? <p><span>Strongest situation</span><b>{bestCategory.category} · {Math.round(bestCategory.pct)}%</b></p> : null}</div>
        </section>

        {isDiagnostic ? (
          <section className="conversion">
            <p className="overline conversionLabel">NEXT STEP</p><h2>Do not just know the weakness. Train the reflex.</h2>
            <p>The full {deckName} Challenge draws 24 balanced decisions from its 40-scenario bank — six each across Hurry, Authority, Comfort and Kill-Switch — with a deeper profile and completion certificate.</p>
            <p className="bankNote">Replays prioritise unseen cards, so practice measures decision quality rather than memory of the previous round.</p>
            {weakest ? <div className="recommend"><b>Start here:</b> {weakest.practice}</div> : null}
            <div className="commerce"><CheckoutRedirectButton sku={`CHAL-SINGLE-${session.edition.toUpperCase()}`} label="Unlock Full Challenge — $4.99" /><CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get All 5 Challenges — $19.99" variant="outline" /></div>
            {canPlayAnotherFreeRound ? <Link style={styles.secondary} href={freeRoundHref}>{isRegistered ? "Play my second free check" : "Register to unlock my second free check"}</Link> : <p className="limit">Your two free readiness checks are complete.</p>}
          </section>
        ) : (
          <section style={styles.card} className="keepFresh"><h2>Keep the reflex fresh.</h2><p>A replay uses unseen scenarios first, while keeping H.A.C.K. balanced. That makes improvement more meaningful than memorising the previous answers.</p><Link style={styles.button} href={`/challenge/${session.edition}/start?mode=full`}>Run another balanced challenge</Link><Link style={styles.secondary} href={`/challenge/session/${sessionId}/certificate`}>{completedAll ? "View certificate" : "Certificate locked until completion"}</Link></section>
        )}

        {completedAll ? <section style={styles.card}><ShareButtons url={`/challenge/session/${sessionId}/results`} title="Konfydence Challenge" text={`I just tested my Konfydence ${deckName} pressure profile. Take the free 8-scenario check and compare your H.A.C.K. pattern.`} /></section> : null}
      </div>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.resultBrand{font:400 25px Georgia,"Times New Roman",serif;color:#171717;text-decoration:none;letter-spacing:-.03em}.resultNav{display:flex;gap:18px;align-items:center}.overline{margin:0 0 12px;color:#9b4f47;font-size:9px;font-weight:900;letter-spacing:.13em}.scoreIntro{display:grid;grid-template-columns:1fr 200px;gap:45px;align-items:center}.scoreIntro h1,.sectionTitle h2,.conversion h2,.keepFresh h2{font-family:Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.05em}.scoreIntro h1{font-size:clamp(48px,6.6vw,72px);line-height:.95;margin:0 0 20px}.scoreIntro>div>p{color:#514c46;font-size:16px;line-height:1.7;margin:0 0 12px;max-width:650px}.scoreIntro small{color:#79736b;font-size:11px;line-height:1.5}.ringWrap{text-align:center}.ringWrap strong{font-size:28px;color:#171717}.ringWrap span{display:block;font-size:10px;color:#7b756d}.ringWrap>b{display:inline-block;margin-top:9px;border-top:1px solid #bdb7ae;padding-top:7px;color:#4f4a44;font-size:11px}.sectionTitle{display:grid;grid-template-columns:1fr .7fr;gap:40px;align-items:end;margin-bottom:30px}.sectionTitle h2{font-size:38px;line-height:1;margin:0}.sectionTitle>p{margin:0;color:#716c64;font-size:12px;line-height:1.6}.profileGrid{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #d9d4cb;border-left:1px solid #d9d4cb}.dimension{border-right:1px solid #d9d4cb;border-bottom:1px solid #d9d4cb;padding:20px;background:#fbfaf6}.dimensionHead{display:grid;grid-template-columns:38px 1fr auto;gap:11px;align-items:center}.dimensionHead .key{width:34px;height:34px;border:1px solid #d1cbc2;border-radius:50%;display:grid;place-items:center}.dimensionHead p{font-weight:850;margin:0;font-size:13px}.dimensionHead small{color:#777168;font-size:10px;font-weight:700}.dimensionHead>strong{font:400 24px Georgia,serif}.bar{height:3px;background:#e2ddd4;overflow:hidden;margin:15px 0}.bar span{display:block;height:100%}.insight{font-size:12px;line-height:1.55;color:#5e5952;margin:0 0 9px}.sample{font-size:9px;color:#8b857c}.priority{margin-top:22px;background:#1b1d1f;color:#f4f1ea;padding:26px}.priorityTop{display:flex;align-items:center;justify-content:space-between;gap:12px}.priorityTop span{font-size:9px;color:#d0a062;font-weight:900;letter-spacing:.11em}.priorityTop b{font-size:12px;color:#d4d0c9}.priority h3{font:400 29px/1.2 Georgia,serif;margin:22px 0 10px;max-width:780px}.priority p{font-size:11px;line-height:1.6;color:#aaa6a0;margin:0}.strengthRow{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #d9d4cb;border-left:1px solid #d9d4cb;margin-top:16px}.strengthRow p{border-right:1px solid #d9d4cb;border-bottom:1px solid #d9d4cb;padding:16px;margin:0;display:flex;flex-direction:column;gap:5px}.strengthRow span{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#8b857c;font-weight:800}.strengthRow b{font-size:12px}.conversion{background:#1b1d1f;color:#f4f1ea;border:1px solid #3e4041;padding:32px;margin-bottom:16px}.conversionLabel{color:#d0a062}.conversion h2{font-size:42px;line-height:1;margin:0 0 16px}.conversion>p:not(.overline):not(.limit){color:#aaa6a0;line-height:1.65;font-size:13px;max-width:790px}.bankNote{font-size:11px!important;color:#85817b!important}.recommend{border-left:2px solid #d0a062;padding:12px 15px;margin:19px 0;font-size:12px;line-height:1.55;background:rgba(208,160,98,.06)}.commerce{display:grid;grid-template-columns:1fr 1fr;gap:10px}.limit{color:#9b9790;font-size:11px;font-weight:750;text-align:center;margin:12px 0 0}.keepFresh h2{font-size:34px;margin:0}.keepFresh>p{color:#716c64;line-height:1.65}.resultHero{padding-top:40px!important;padding-bottom:40px!important}
        @media(max-width:680px){.scoreIntro,.sectionTitle{grid-template-columns:1fr}.ringWrap{text-align:left}.profileGrid,.strengthRow,.commerce{grid-template-columns:1fr}.conversion h2{font-size:34px}.priorityTop{align-items:flex-start;flex-direction:column}.scoreIntro h1{font-size:48px}.resultNav{gap:10px}.resultNav a:first-child{display:none}}
      `}</style>
    </main>
  );
}