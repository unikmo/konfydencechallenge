import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareButtons } from "@/components/ShareButtons";
import { prisma } from "@/lib/prisma";
import { computeChallengeTotals, computeHackBreakdown, computeCategoryBreakdown } from "@/lib/scoring/scoringEngine";
import { HACK_LABELS, type HackTrigger } from "@/lib/challenge/labels";
import { ResultViewedHook } from "@/components/ResultEventHooks";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";
import { CrossSellStrip } from "@/components/commerce/CrossSellStrip";
import { ScoreRing } from "@/components/illustrations/ScoreRing";
import { HackIcon } from "@/components/illustrations/HackIcon";
import { readinessTierColor } from "@/lib/theme/tokens";
import { isGuestEmail } from "@/lib/challenge/startSessionUtil";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #08111f, #0b2237)",
    padding: 18,
    color: "white",
    display: "flex",
    justifyContent: "center",
  },
  shell: { width: "100%", maxWidth: 980 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerTitle: { fontWeight: 950, color: "white" },
  smallLink: { color: "#ffffffcc", fontSize: 13, fontWeight: 700, textDecoration: "none" },
  card: {
    background: "white",
    color: "#0b1b2b",
    borderRadius: 14,
    padding: 18,
    boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
  },
  conversionCard: {
    background: "#0b1f3a",
    color: "white",
    borderRadius: 14,
    padding: 18,
    marginTop: 14,
    border: "2px solid #ffb31d",
  },
  badge: {
    display: "inline-flex",
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,179,29,0.35)",
    background: "rgba(255,179,29,0.08)",
    fontWeight: 950,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#ffb31d",
    border: "1px solid rgba(0,0,0,0.05)",
    color: "#08111f",
    textDecoration: "none",
    fontWeight: 950,
    marginTop: 12,
  },
  secondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#fff",
    border: "1px solid rgba(11,27,43,0.14)",
    color: "#0b1b2b",
    textDecoration: "none",
    fontWeight: 950,
    marginTop: 10,
  },
  outlineButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "transparent",
    border: "2px solid rgba(255,179,29,0.7)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 950,
    marginTop: 10,
  },
  hackRow: { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8 },
  hackKey: { fontWeight: 950, color: "#0b1b2b" },
  muted: { color: "#344a5e" },
};

const EDITION_DECK_NAME: Record<string, string> = {
  school: "School",
  university: "University",
  family: "Family",
  travelsafe: "TravelSafe",
  workplace: "Workplace",
};

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      edition: true,
      mode: true,
      status: true,
      completedAt: true,
      currentIndex: true,
      scoreTotal: true,
      scoreMax: true,
      user: { select: { id: true, email: true } },
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

  const hackBreakdown = computeHackBreakdown(
    cards.map((c) => ({ hackKey: c.scenario.hackKey, score: c.score }))
  ).filter((entry) => entry.cardCount > 0);

  const categoryBreakdown = computeCategoryBreakdown(
    cards.map((c) => ({ category: c.scenario.category, score: c.score }))
  );

  const weakestTrigger = [...hackBreakdown].sort((a, b) => a.pct - b.pct)[0] ?? null;
  const bestCategory = categoryBreakdown[0] ?? null;

  const readinessScorePoints = totals.totalScoreTotal;
  const readinessMaxPoints = totals.totalScoreMax;
  const readinessPercentage = totals.totalPercent;

  const readinessInterpretation = (() => {
    const pct = readinessPercentage;
    if (pct >= 90) return "You consistently spotted pressure and chose safer actions.";
    if (pct >= 75) return "You caught most traps, but a few pressure signals still got through.";
    if (pct >= 55) return "You recognized some signals, but urgency or trust cues still influenced decisions.";
    return "Scammers could move you too quickly before you verify.";
  })();

  const hackCoachingNote: Record<HackTrigger, string> = {
    H: "You are most vulnerable when a message creates urgency, deadlines, or fear of missing out.",
    A: "You were most at risk when a message looked official or came from someone in charge.",
    C: "Familiar or trusted-sounding channels reduce your attention â€” stay objective under pressure.",
    K: "Pause before the critical action moment: verify the request before you click, pay, share, or reply.",
  };

  const deckName = EDITION_DECK_NAME[session.edition] ?? session.edition;

  // Mark session completed when fully finished (belt-and-suspenders; submit route already does this)
  if (completedAll && session.status !== "COMPLETED") {
    await prisma.challengeSession.update({
      where: { id: sessionId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }

  const isDiagnostic = session.mode === "diagnostic";
  const diagnosticSessions = isDiagnostic
    ? await prisma.challengeSession.count({ where: { userId: session.user.id, mode: "diagnostic" } })
    : 0;
  const isRegistered = isDiagnostic ? !isGuestEmail(session.user.email) : true;
  const canPlayAnotherFreeRound = isDiagnostic && diagnosticSessions < 2;
  const freeRoundHref = isRegistered
    ? "/challenge/" + session.edition + "/start?mode=diagnostic"
    : "/challenge/register?next=" + encodeURIComponent("/challenge/" + session.edition + "/start?mode=diagnostic");

  const krsScore = Math.round(readinessPercentage);
  const pressurePattern = weakestTrigger ? HACK_LABELS[weakestTrigger.hackKey].public : "None identified";
  const tierColor = readinessTierColor(readinessPercentage);

  return (
    <div style={styles.page}>
      <ResultViewedHook sessionId={sessionId} krsScore={krsScore} pressurePattern={pressurePattern} />

      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>Konfydence Challenge</div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link style={styles.smallLink} href="/dashboard">
              My Results
            </Link>
            <Link style={styles.smallLink} href="/challenge">
              Start over
            </Link>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Your Konfydence Readiness Score&trade;</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
            <ScoreRing percent={readinessPercentage} color={tierColor}>
              <div style={{ fontWeight: 1000, fontSize: 26, color: "#0b1b2b" }}>{Math.round(readinessPercentage)}%</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>
                {readinessScorePoints}/{readinessMaxPoints}
              </div>
            </ScoreRing>
            <div style={{ ...styles.badge, borderColor: tierColor, background: `${tierColor}1a`, color: "#0b1b2b" }}>
              {totals.level}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <p style={{ marginTop: 0, marginBottom: 0, color: "#344a5e", fontWeight: 850 }}>
              {readinessInterpretation}
            </p>
            <p style={{ marginTop: 8, marginBottom: 0, color: "#64748b", fontWeight: 800, fontSize: 13 }}>
              This is a readiness signal, not a guarantee of protection.
            </p>
          </div>

          {!isDiagnostic ? (
            <>
              <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 950, marginBottom: 8 }}>HACK breakdown</div>
                {hackBreakdown.map((h) => (
                  <div key={h.hackKey} style={styles.hackRow}>
                    <div style={styles.hackKey}>{HACK_LABELS[h.hackKey].public}</div>
                    <div style={styles.muted}>
                      {h.scoreEarned} / {h.scoreMax} ({Math.round(h.pct)}%)
                    </div>
                  </div>
                ))}
              </div>

              {bestCategory ? (
                <div style={{ marginTop: 16, color: "#166534", fontWeight: 850, fontSize: 13, lineHeight: 1.4 }}>
                  Best category: <strong>{bestCategory.category}</strong> â€” {Math.round(bestCategory.pct)}% safe
                  choices. Keep it up.
                </div>
              ) : null}

              {weakestTrigger ? (
                <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }}>
                  <div style={{ fontWeight: 950, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                    <HackIcon trigger={weakestTrigger.hackKey} color="#c2410c" size={18} />
                    Your weakest pressure pattern: {HACK_LABELS[weakestTrigger.hackKey].public}
                  </div>
                  <p style={{ margin: 0, color: "#7c2d12", fontWeight: 750, fontSize: 13, lineHeight: 1.45 }}>
                    {hackCoachingNote[weakestTrigger.hackKey]}
                  </p>
                  <Link
                    style={{ ...styles.outlineButton, background: "#ffb31d", color: "#08111f", border: "none" }}
                    href={`/challenge/${session.edition}/start?mode=full`}
                  >
                    Train this weakness
                  </Link>
                </div>
              ) : null}

              <div style={{ marginTop: 14 }}>
                <Link style={styles.secondary} href={`/challenge/session/${sessionId}/certificate`}>
                  {completedAll ? "View certificate" : "Certificate (locked)"}
                </Link>
                <Link style={styles.button} href={`/challenge/${session.edition}/start?mode=full`}>
                  Retry challenge
                </Link>
              </div>
            </>
          ) : null}
        </div>

        {completedAll ? (
          <div style={styles.card}>
            <ShareButtons
              url={"/challenge/session/" + sessionId + "/results"}
              title="Konfydence Challenge"
              text={"I just finished a Konfydence " + deckName + " round. Take the free check and compare your pressure pattern."}
            />
          </div>
        ) : null}

        {isDiagnostic && weakestTrigger ? (
          <div style={styles.conversionCard}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, letterSpacing: "-0.01em" }}>
              You found your pressure pattern. Now train it.
            </h3>
            <p style={{ margin: "0 0 14px", fontWeight: 750, lineHeight: 1.55, color: "#dbeafe" }}>
              You have completed a free 10-question round. The full challenge gives you 50 scenarios, a deeper KRS dashboard, and a certificate.
            </p>

            <div style={{ fontWeight: 950, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffb31d", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <HackIcon trigger={weakestTrigger.hackKey} color="#ffb31d" size={16} />
              Your weakest pressure pattern: {HACK_LABELS[weakestTrigger.hackKey].public}
            </div>
            <p style={{ margin: "0 0 10px", fontWeight: 800, lineHeight: 1.5 }}>{hackCoachingNote[weakestTrigger.hackKey]}</p>

            {bestCategory ? (
              <p style={{ margin: "0 0 10px", fontWeight: 750, lineHeight: 1.5, color: "#dbeafe" }}>
                Best answer habit: <strong>{bestCategory.category}</strong> â€” {Math.round(bestCategory.pct)}% safe
                choices.
              </p>
            ) : null}

            <p style={{ margin: 0, fontWeight: 800, lineHeight: 1.5, color: "#dbeafe" }}>
              Recommended: unlock the full {deckName} Challenge to train this pattern across 50 real-life scenarios.
            </p>

            {canPlayAnotherFreeRound ? (
              <Link style={{ ...styles.secondary, marginTop: 12, background: "#ffffff", color: "#0b1b2b" }} href={freeRoundHref}>
                {isRegistered ? "Play one more free round" : "Unlock one more free round"}
              </Link>
            ) : (
              <p style={{ margin: "12px 0 0", fontWeight: 850, lineHeight: 1.45, color: "#dbeafe" }}>
                Your 20 free questions are complete. Unlock the full challenge to keep practising.
              </p>
            )}
            <div style={{ marginTop: 12 }}>
              <CheckoutRedirectButton
                sku={`CHAL-SINGLE-${session.edition.toUpperCase()}`}
                label="Unlock Full Challenge â€” $4.99"
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <CheckoutRedirectButton
                sku="CHAL-UNLIMITED"
                label="Get All 5 Challenges â€” $19.99"
                variant="outline"
              />
            </div>
          </div>
        ) : null}



        {isDiagnostic && weakestTrigger ? (
          <div style={{ marginTop: 14 }}>
            <CrossSellStrip product={Math.random() < 0.5 ? "wallet" : "magnet"} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
