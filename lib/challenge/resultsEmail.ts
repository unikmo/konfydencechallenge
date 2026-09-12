import { escapeHtml } from "@/lib/email";
import { EDITION_LABELS, HACK_LABELS, type ChallengeEdition, type HackTrigger } from "@/lib/challenge/labels";
import { computeChallengeTotals, type HackProfile } from "@/lib/scoring/scoringEngine";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { RESULTS_EMAIL_STRINGS } from "@/lib/challenge/accountStrings";
import { localizeLevel, localizeSignalLabel, hackLabel, EDITION_DECK_NAME_DE, HACK_COACHING_DE } from "@/lib/challenge/resultStrings";

// The email a player receives after finishing a Konfydence Challenge.
// Free (diagnostic) play is frictionless to start, but the result is
// delivered by email — this template is that email, and it is the main
// conversion surface for the free-to-paid step. It also doubles as the
// account touch: the "See your results any time" link verifies the
// address and opens the player's Konfydence account.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";

const C = {
  paper: "#F6F3EC",
  card: "#FFFFFF",
  ink: "#14171A",
  inkSoft: "#3B3A36",
  muted: "#6E6B64",
  soft: "#94908A",
  gold: "#B4862C",
  rule: "#E6E1D6",
  track: "#ECE7DC",
};

const SIGNAL_COLOUR: Record<string, string> = {
  strong: "#4F7A34",
  watch: "#B07C1E",
  vulnerable: "#B4542A",
};

const DISPLAY_FONT = `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,'Times New Roman',serif`;
const BODY_FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

export type ResultsEmailInput = {
  toEmail: string;
  edition: ChallengeEdition;
  mode: "diagnostic" | "full";
  scoreTotal: number;
  scoreMax: number;
  hackProfile: HackProfile;
  /** On-site results page for this run (kept working via the account link). */
  resultsPath: string;
  /** Magic link that verifies the email and opens /account. */
  accountUrl: string;
  /** One-click unsubscribe. */
  unsubscribeUrl: string;
  lang?: UiLang;
};

function bar(labelShort: string, pct: number, level: string, levelLabel: string): string {
  const width = Math.max(3, Math.min(100, Math.round(pct)));
  const colour = SIGNAL_COLOUR[level] ?? C.muted;
  return `
    <tr>
      <td style="padding:10px 0 0;font:600 12px/1.4 ${BODY_FONT};color:${C.ink};">${escapeHtml(labelShort)}</td>
      <td align="right" style="padding:10px 0 0;font:600 11px/1.4 ${BODY_FONT};color:${colour};">${escapeHtml(levelLabel)}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:6px 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.track};border-radius:6px;">
          <tr>
            <td style="padding:0;">
              <table role="presentation" width="${width}%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:8px;background:${colour};border-radius:6px;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function button(href: string, label: string, primary = true): string {
  const bg = primary ? C.ink : C.card;
  const fg = primary ? "#FFFDF9" : C.ink;
  const border = primary ? C.ink : C.rule;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0;">
      <tr>
        <td align="center" style="border-radius:10px;background:${bg};border:1px solid ${border};">
          <a href="${escapeHtml(href)}" target="_blank"
             style="display:inline-block;padding:13px 26px;font:700 14px/1 ${BODY_FONT};color:${fg};text-decoration:none;letter-spacing:.01em;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

export function renderChallengeResultsEmail(input: ResultsEmailInput): { subject: string; html: string } {
  const lang: UiLang = input.lang ?? "en";
  const t = RESULTS_EMAIL_STRINGS[lang];
  const editionLabel = lang === "de" ? EDITION_DECK_NAME_DE[input.edition] ?? input.edition : EDITION_LABELS[input.edition];
  const totals = computeChallengeTotals({ scoreTotal: input.scoreTotal, scoreMax: input.scoreMax });
  const pct = Math.round(totals.totalPercent);
  const level = localizeLevel(totals.level, lang);
  const isDiagnostic = input.mode === "diagnostic";

  const weak = input.hackProfile.primaryVulnerability;
  const weakLabel = weak ? hackLabel(weak.hackKey as HackTrigger, "short", lang, HACK_LABELS[weak.hackKey as HackTrigger].short) : null;

  const resultsUrl = `${APP_URL}${input.resultsPath}`;
  const fullChallengeUrl = `${APP_URL}/pricing?edition=${input.edition}`;
  const packUrl = `${APP_URL}/pricing`;
  const lockscreensUrl = `${APP_URL}/lockscreens`;

  const subject = isDiagnostic ? t.subjectDiagnostic(editionLabel, pct, level) : t.subjectFull(editionLabel, pct, level);

  const preheader = weakLabel ? t.preheaderWeak(pct, level, weakLabel) : t.preheaderNoWeak(pct, level);

  const barsHtml = input.hackProfile.dimensions
    .map((d) => bar(
      hackLabel(d.hackKey as HackTrigger, "short", lang, HACK_LABELS[d.hackKey as HackTrigger].short),
      d.pct,
      d.level,
      localizeSignalLabel(d.levelLabel, lang),
    ))
    .join("");

  const convBlock = isDiagnostic
    ? `
      <p style="margin:0 0 6px;font:400 13px/1.4 ${BODY_FONT};color:${C.soft};letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(t.nextStepOverline)}</p>
      <h2 style="margin:0 0 12px;font:400 22px/1.25 ${DISPLAY_FONT};color:${C.ink};">${escapeHtml(t.nextStepHeading(editionLabel))}</h2>
      <p style="margin:0 0 20px;font:400 14px/1.7 ${BODY_FONT};color:${C.inkSoft};">
        ${escapeHtml(t.nextStepBody(weakLabel ? t.weakSuffix(weakLabel) : ""))}
      </p>
      ${button(fullChallengeUrl, t.unlockFull(editionLabel))}
      <p style="margin:16px 0 0;font:400 13px/1.6 ${BODY_FONT};color:${C.muted};">
        ${escapeHtml(t.moreThanOne)} <a href="${escapeHtml(packUrl)}" target="_blank" style="color:${C.ink};font-weight:600;text-decoration:none;">${escapeHtml(t.allFiveLink)}</a>.
      </p>`
    : `
      <p style="margin:0 0 6px;font:400 13px/1.4 ${BODY_FONT};color:${C.soft};letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(t.keepSharpOverline)}</p>
      <h2 style="margin:0 0 12px;font:400 22px/1.25 ${DISPLAY_FONT};color:${C.ink};">${escapeHtml(t.keepSharpHeading)}</h2>
      <p style="margin:0 0 20px;font:400 14px/1.7 ${BODY_FONT};color:${C.inkSoft};">
        ${escapeHtml(t.keepSharpBody(editionLabel))}
      </p>
      ${button(resultsUrl, t.replay)}
      <p style="margin:16px 0 0;font:400 13px/1.6 ${BODY_FONT};color:${C.muted};">
        <a href="${escapeHtml(lockscreensUrl)}" target="_blank" style="color:${C.ink};font-weight:600;text-decoration:none;">${escapeHtml(t.seeLockscreens)}</a>
      </p>`;

  const html = `<!DOCTYPE html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">

          <tr>
            <td style="padding:0 4px 18px;font:700 13px/1 ${BODY_FONT};letter-spacing:.22em;color:${C.ink};">KONFYDENCE</td>
          </tr>

          <tr>
            <td style="background:${C.card};border:1px solid ${C.rule};border-radius:16px;padding:34px 34px 30px;">

              <p style="margin:0 0 4px;font:400 12px/1.4 ${BODY_FONT};color:${C.soft};letter-spacing:.1em;text-transform:uppercase;">${escapeHtml(editionLabel)} · ${isDiagnostic ? escapeHtml(t.freeCheckLabel) : escapeHtml(t.fullChallengeLabel)}</p>
              <h1 style="margin:0 0 18px;font:400 20px/1.3 ${DISPLAY_FONT};color:${C.ink};">${escapeHtml(t.readinessScore)}</h1>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font:400 52px/1 ${DISPLAY_FONT};color:${C.ink};padding-right:16px;">${pct}<span style="font-size:22px;color:${C.muted};">%</span></td>
                  <td style="font:400 20px/1.2 ${DISPLAY_FONT};color:${C.gold};">${escapeHtml(level)}</td>
                </tr>
              </table>

              ${weak && weakLabel ? `
              <div style="margin:22px 0 0;padding:16px 18px;background:${C.paper};border:1px solid ${C.rule};border-radius:12px;">
                <p style="margin:0 0 4px;font:700 12px/1.4 ${BODY_FONT};color:${SIGNAL_COLOUR[weak.level] ?? C.ink};letter-spacing:.04em;text-transform:uppercase;">${escapeHtml(t.mostExposed(weakLabel))}</p>
                <p style="margin:0;font:400 13px/1.6 ${BODY_FONT};color:${C.inkSoft};">${escapeHtml(lang === "de" ? HACK_COACHING_DE[weak.hackKey as HackTrigger].insight : weak.insight)}</p>
                <p style="margin:8px 0 0;font:400 13px/1.6 ${BODY_FONT};color:${C.ink};"><strong>${escapeHtml(t.practise)}</strong> ${escapeHtml(lang === "de" ? HACK_COACHING_DE[weak.hackKey as HackTrigger].practice : weak.practice)}</p>
              </div>` : ""}

              <p style="margin:26px 0 2px;font:700 12px/1.4 ${BODY_FONT};color:${C.ink};letter-spacing:.06em;text-transform:uppercase;">${escapeHtml(t.hackProfileHeading)}</p>
              <p style="margin:0 0 4px;font:400 12px/1.6 ${BODY_FONT};color:${C.muted};">${escapeHtml(t.hackProfileSubtext)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${barsHtml}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;">
                <tr><td style="border-top:1px solid ${C.rule};font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <div style="margin:24px 0 0;">
                ${convBlock}
              </div>

            </td>
          </tr>

          <tr>
            <td style="padding:22px 6px 0;">
              <p style="margin:0 0 4px;font:600 13px/1.5 ${BODY_FONT};color:${C.ink};">${escapeHtml(t.yourAccount)}</p>
              <p style="margin:0;font:400 13px/1.6 ${BODY_FONT};color:${C.muted};">
                <a href="${escapeHtml(input.accountUrl)}" target="_blank" style="color:${C.gold};font-weight:600;text-decoration:none;">${escapeHtml(t.seeResultsAnyDevice)}</a>
                &nbsp;${escapeHtml(t.noPasswordNote)}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:26px 6px 0;">
              <p style="margin:0;font:400 11px/1.7 ${BODY_FONT};color:${C.soft};">
                ${escapeHtml(t.sentTo(input.toEmail))}
                <a href="${escapeHtml(input.unsubscribeUrl)}" target="_blank" style="color:${C.soft};text-decoration:underline;">${escapeHtml(t.unsubscribe)}</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(APP_URL)}${lang === "de" ? "/de/datenschutz" : "/privacy-policy"}" target="_blank" style="color:${C.soft};text-decoration:underline;">${escapeHtml(t.privacy)}</a>
              </p>
              <p style="margin:8px 0 0;font:400 11px/1.7 ${BODY_FONT};color:${C.soft};">${escapeHtml(t.tagline)}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
