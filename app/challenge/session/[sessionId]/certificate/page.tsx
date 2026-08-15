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
    background: "linear-gradient(180deg, #08111f, #0b2237)",
    padding: 18,
    color: "white",
    display: "flex",
    justifyContent: "center",
  },
  shell: { width: "100%", maxWidth: 980 },
  card: {
    background: "white",
    color: "#0b1b2b",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
    minHeight: 420,
  },
  header: { borderBottom: "1px solid rgba(11,27,43,0.12)", paddingBottom: 14, marginBottom: 14 },
  title: { fontSize: 22, fontWeight: 1000, color: "#035494" },
  sub: { marginTop: 6, color: "#344a5e", fontWeight: 800 },
  body: { display: "grid", gap: 10 },
  line: { fontSize: 15, color: "#0b1b2b" },
  disclaimer: {
    marginTop: 18,
    background: "rgba(255,179,29,0.08)",
    border: "1px solid rgba(255,179,29,0.25)",
    padding: 12,
    borderRadius: 12,
    color: "#344a5e",
    lineHeight: 1.6,
    fontWeight: 700,
  },
  p: { color: "#344a5e", lineHeight: 1.6 },
  actions: { marginTop: 8 },
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
};
