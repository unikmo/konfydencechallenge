import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { computeChallengeTotals } from "@/lib/scoring/scoringEngine";
import { DownloadCertificateButton, ShareCertificateButton } from "./CertificateActions";

const EDITION_DECK_NAME: Record<string, string> = {
  school: "School",
  university: "University",
  family: "Family",
  travelsafe: "TravelSafe",
  workplace: "Workplace",
};

const EDITION_ID_ABBR: Record<string, string> = {
  school: "SCHOOL",
  university: "UNI",
  family: "FAMILY",
  travelsafe: "TRAVEL",
  workplace: "WORK",
};

// Spec §9: exact edition-specific download button copy. Family/TravelSafe aren't
// specified there — default to the generic label for those two.
const DOWNLOAD_BUTTON_LABEL: Record<string, string> = {
  school: "Download Completion Certificate",
  university: "Download Completion Certificate",
  workplace: "Download Compliance Certificate",
  family: "Download Certificate",
  travelsafe: "Download Certificate",
};

function certificateIdFor(sessionId: string, edition: string, year: number): string {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash * 31 + sessionId.charCodeAt(i)) >>> 0;
  }
  const digits = String(hash % 1000000).padStart(6, "0");
  const abbr = EDITION_ID_ABBR[edition] ?? edition.toUpperCase();
  return `KRS-${abbr}-${year}-${digits}`;
}

export default async function CertificatePage(props: { params: Promise<{ sessionId: string }> }) {
  const params = await props.params;
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, status: true, completedAt: true, currentIndex: true, scoreTotal: true, scoreMax: true },
  });
  if (!session) notFound();

  const totalCards = await prisma.challengeSessionCard.count({ where: { sessionId } });

  const totals = computeChallengeTotals({ scoreTotal: session.scoreTotal, scoreMax: session.scoreMax });

  // Certificates are completion-based, not score-gated (spec §9 / HANDOFF.md §2.5).
  const certificateEligible = session.currentIndex >= totalCards;

  if (!certificateEligible) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Certificate locked</h2>
            <p style={styles.p}>Complete the full challenge to unlock your certificate.</p>
            <Link style={styles.secondary} href={`/challenge/session/${sessionId}/results`}>
              Back to results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedAt = session.completedAt ?? new Date();
  const completionDate = completedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const certificateId = certificateIdFor(sessionId, session.edition, completedAt.getFullYear());
  const deckName = EDITION_DECK_NAME[session.edition] ?? session.edition;
  const downloadLabel = DOWNLOAD_BUTTON_LABEL[session.edition] ?? "Download Certificate";

  const host = (await headers()).get("host") ?? "localhost";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const certificateUrl = `${protocol}://${host}/challenge/session/${sessionId}/certificate`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`;

  // Placeholder participant name — real auth/accounts not built yet (HANDOFF.md §4.5).
  const participantName = "Challenge Participant";

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.card} id="certificate-print-area">
          <div style={styles.header}>
            <div style={styles.title}>Konfydence Readiness Certified</div>
            <div style={styles.sub}>{deckName} Challenge</div>
          </div>

          <div style={styles.body}>
            <div style={styles.line}>
              Name: <strong>{participantName}</strong>
            </div>
            <div style={styles.line}>
              Deck: <strong>{deckName} Challenge</strong>
            </div>
            <div style={styles.line}>
              Score: <strong>{totals.totalScoreTotal} / {totals.totalScoreMax}</strong>
            </div>
            <div style={styles.line}>
              KRS band: <strong>{totals.level}</strong>
            </div>
            <div style={styles.line}>
              Date: <strong>{completionDate}</strong>
            </div>
            <div style={styles.line}>
              Certificate ID: <strong>{certificateId}</strong>
            </div>

            <div style={styles.disclaimer}>
              &ldquo;This certifies that {participantName} completed the {deckName} Challenge and demonstrated
              practical scam-readiness skills under real-life pressure scenarios.&rdquo;
            </div>
          </div>

          <div className="certificateActions" style={styles.actions}>
            <DownloadCertificateButton label={downloadLabel} />
            <ShareCertificateButton
              certificateUrl={certificateUrl}
              shareText={`I just completed the Konfydence ${deckName} Challenge — ${totals.totalScoreTotal}/${totals.totalScoreMax}, ${totals.level}.`}
            />
            <a href={linkedInShareUrl} target="_blank" rel="noopener noreferrer" style={styles.secondary}>
              Add to LinkedIn
            </a>
            <Link style={styles.secondary} href={`/challenge/session/${sessionId}/results`}>
              Back to results
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .certificateActions { display: none; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--k-paper)",
    padding: "48px 24px 60px",
    color: "var(--k-ink)",
    display: "flex",
    justifyContent: "center",
  },
  shell: { width: "min(860px, 100%)" },
  card: {
    background: "var(--k-white)",
    color: "var(--k-ink)",
    border: "1px solid var(--k-line)",
    borderRadius: "var(--k-radius)",
    padding: 40,
    boxShadow: "0 24px 60px rgba(17,20,23,.08)",
    minHeight: 420,
  },
  header: { borderBottom: "1px solid var(--k-line)", paddingBottom: 18, marginBottom: 20 },
  title: { fontFamily: "var(--k-display)", fontSize: 30, fontWeight: 400, letterSpacing: "-.03em", color: "var(--k-ink)" },
  sub: { marginTop: 8, color: "var(--k-gold)", fontWeight: 700, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" },
  body: { display: "grid", gap: 12 },
  line: { fontSize: 15, color: "var(--k-muted)" },
  disclaimer: {
    marginTop: 22,
    background: "var(--k-paper)",
    border: "1px solid var(--k-line)",
    padding: 16,
    borderRadius: 14,
    color: "var(--k-muted)",
    lineHeight: 1.65,
    fontStyle: "italic",
  },
  p: { color: "var(--k-muted)", lineHeight: 1.65 },
  actions: { marginTop: 8 },
  secondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 46,
    padding: "11px 14px",
    borderRadius: 999,
    background: "transparent",
    border: "1px solid var(--k-line)",
    color: "var(--k-ink)",
    textDecoration: "none",
    fontWeight: 600,
    marginTop: 10,
  },
};
