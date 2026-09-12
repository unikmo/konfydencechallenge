import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { computeChallengeTotals } from "@/lib/scoring/scoringEngine";
import { DownloadCertificateButton, ShareCertificateButton } from "./CertificateActions";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { CERTIFICATE_STRINGS, EDITION_DECK_NAME_DE, localizeLevel, downloadButtonLabel } from "@/lib/challenge/resultStrings";

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
  // A session's language is whatever its own scenario rows were seeded in —
  // see lib/challenge/sessionGenerator.ts and lib/challenge/uiStrings.ts.
  const firstCard = await prisma.challengeSessionCard.findFirst({
    where: { sessionId },
    select: { scenario: { select: { lang: true } } },
  });
  const lang: UiLang = firstCard?.scenario.lang === "de" ? "de" : "en";
  const t = CERTIFICATE_STRINGS[lang];

  const totals = computeChallengeTotals({ scoreTotal: session.scoreTotal, scoreMax: session.scoreMax });
  const level = localizeLevel(totals.level, lang);

  // Certificates are completion-based, not score-gated (spec §9 / HANDOFF.md §2.5).
  const certificateEligible = session.currentIndex >= totalCards;

  if (!certificateEligible) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>{t.lockedHeading}</h2>
            <p style={styles.p}>{t.lockedBody}</p>
            <Link style={styles.secondary} href={`/challenge/session/${sessionId}/results`}>
              {t.backToResults}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedAt = session.completedAt ?? new Date();
  const completionDate = completedAt.toLocaleDateString(t.dateLocale, { day: "2-digit", month: "short", year: "numeric" });
  const certificateId = certificateIdFor(sessionId, session.edition, completedAt.getFullYear());
  const deckName = (lang === "de" ? EDITION_DECK_NAME_DE : EDITION_DECK_NAME)[session.edition] ?? session.edition;
  const downloadLabel = downloadButtonLabel(session.edition, lang);

  const host = (await headers()).get("host") ?? "localhost";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const certificateUrl = `${protocol}://${host}/challenge/session/${sessionId}/certificate`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`;

  // Placeholder participant name — real auth/accounts not built yet (HANDOFF.md §4.5).
  const participantName = t.participantName;

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.card} id="certificate-print-area">
          <div style={styles.header}>
            <div style={styles.title}>{t.title}</div>
            <div style={styles.sub}>{t.deckSuffix(deckName)}</div>
          </div>

          <div style={styles.body}>
            <div style={styles.line}>
              {t.nameLabel} <strong>{participantName}</strong>
            </div>
            <div style={styles.line}>
              {t.deckLabel} <strong>{t.deckSuffix(deckName)}</strong>
            </div>
            <div style={styles.line}>
              {t.scoreLabel} <strong>{totals.totalScoreTotal} / {totals.totalScoreMax}</strong>
            </div>
            <div style={styles.line}>
              {t.bandLabel} <strong>{level}</strong>
            </div>
            <div style={styles.line}>
              {t.dateLabel} <strong>{completionDate}</strong>
            </div>
            <div style={styles.line}>
              {t.idLabel} <strong>{certificateId}</strong>
            </div>

            <div style={styles.disclaimer}>
              {t.disclaimer(participantName, deckName)}
            </div>
          </div>

          <div className="certificateActions" style={styles.actions}>
            <DownloadCertificateButton label={downloadLabel} />
            <ShareCertificateButton
              certificateUrl={certificateUrl}
              shareText={t.shareText(deckName, totals.totalScoreTotal, totals.totalScoreMax, level)}
              buttonLabel={t.shareButton}
              copiedAlert={t.copiedAlert}
            />
            <a href={linkedInShareUrl} target="_blank" rel="noopener noreferrer" style={styles.secondary}>
              {t.addToLinkedIn}
            </a>
            <Link style={styles.secondary} href={`/challenge/session/${sessionId}/results`}>
              {t.backToResults}
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
    background: "radial-gradient(140% 80% at 50% -10%,#f4efe4 0%,#ece5d7 60%,#e7dfce 100%)",
    padding: "48px 24px 60px",
    color: "var(--k-ink)",
    display: "flex",
    justifyContent: "center",
  },
  shell: { width: "min(860px, 100%)" },
  card: {
    background: "#fffefc",
    color: "var(--k-ink)",
    border: "1px solid rgba(17,20,23,.09)",
    borderRadius: "var(--k-radius)",
    padding: 40,
    boxShadow: "0 1px 2px rgba(17,20,23,.05), 0 10px 20px -6px rgba(17,20,23,.10), 0 40px 70px -24px rgba(17,20,23,.26)",
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
