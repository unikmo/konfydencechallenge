import { escapeHtml } from "@/lib/email";
import { EDITION_LABELS, HACK_LABELS, type ChallengeEdition, type HackTrigger } from "@/lib/challenge/labels";
import { computeChallengeTotals, type HackProfile } from "@/lib/scoring/scoringEngine";

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
  const editionLabel = EDITION_LABELS[input.edition];
  const totals = computeChallengeTotals({ scoreTotal: input.scoreTotal, scoreMax: input.scoreMax });
  const pct = Math.round(totals.totalPercent);
  const isDiagnostic = input.mode === "diagnostic";

  const weak = input.hackProfile.primaryVulnerability;
  const weakLabel = weak ? HACK_LABELS[weak.hackKey as HackTrigger].short : null;

  const resultsUrl = `${APP_URL}${input.resultsPath}`;
  const fullChallengeUrl = `${APP_URL}/pricing?edition=${input.edition}`;
  const packUrl = `${APP_URL}/pricing`;
  const lockscreensUrl = `${APP_URL}/lockscreens`;

  const subject = isDiagnostic
    ? `Your ${editionLabel} Readiness Score: ${pct}% — ${totals.level}`
    : `Your ${editionLabel} Challenge result: ${pct}% — ${totals.level}`;

  const preheader = weakLabel
    ? `${pct}% — ${totals.level}. You're most exposed to ${weakLabel} pressure. Here's what that means.`
    : `${pct}% — ${totals.level}. Your full H.A.C.K. profile is inside.`;

  const barsHtml = input.hackProfile.dimensions
    .map((d) => bar(HACK_LABELS[d.hackKey as HackTrigger].short, d.pct, d.level, d.levelLabel))
    .join("");

  const convBlock = isDiagnostic
    ? `
      <p style="margin:0 0 6px;font:400 13px/1.4 ${BODY_FONT};color:${C.soft};letter-spacing:.08em;text-transform:uppercase;">The next step</p>
      <h2 style="margin:0 0 12px;font:400 22px/1.25 ${DISPLAY_FONT};color:${C.ink};">You've seen the free check. The full ${escapeHtml(editionLabel)} Challenge is the practice.</h2>
      <p style="margin:0 0 20px;font:400 14px/1.7 ${BODY_FONT};color:${C.inkSoft};">
        40+ real situations, balanced across all four pressure tactics${weakLabel ? ` — including more of the ${escapeHtml(weakLabel)} scenarios you found hardest` : ""}.
        You work through them in short rounds, and your Readiness Score updates as you go. About 20 minutes to start.
      </p>
      ${button(fullChallengeUrl, `Take the full ${editionLabel} Challenge — $6.99`)}
      <p style="margin:16px 0 0;font:400 13px/1.6 ${BODY_FONT};color:${C.muted};">
        More than one situation to prepare for? <a href="${escapeHtml(packUrl)}" target="_blank" style="color:${C.ink};font-weight:600;text-decoration:none;">All five editions are $24.99</a>.
      </p>`
    : `
      <p style="margin:0 0 6px;font:400 13px/1.4 ${BODY_FONT};color:${C.soft};letter-spacing:.08em;text-transform:uppercase;">Keep it sharp</p>
      <h2 style="margin:0 0 12px;font:400 22px/1.25 ${DISPLAY_FONT};color:${C.ink};">A score fades. The habit is what lasts.</h2>
      <p style="margin:0 0 20px;font:400 14px/1.7 ${BODY_FONT};color:${C.inkSoft};">
        Replay the ${escapeHtml(editionLabel)} rounds any time — the engine serves the scenarios you've seen least first.
        And if you want the reminder somewhere you can't scroll past it, Konfydence Lockscreens puts one Pause · Assess · Talk prompt on your phone, refreshed every two weeks.
      </p>
      ${button(resultsUrl, "Replay a round")}
      <p style="margin:16px 0 0;font:400 13px/1.6 ${BODY_FONT};color:${C.muted};">
        <a href="${escapeHtml(lockscreensUrl)}" target="_blank" style="color:${C.ink};font-weight:600;text-decoration:none;">See Konfydence Lockscreens →</a>
      </p>`;

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
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

              <p style="margin:0 0 4px;font:400 12px/1.4 ${BODY_FONT};color:${C.soft};letter-spacing:.1em;text-transform:uppercase;">${escapeHtml(editionLabel)} · ${isDiagnostic ? "Free readiness check" : "Full challenge"}</p>
              <h1 style="margin:0 0 18px;font:400 20px/1.3 ${DISPLAY_FONT};color:${C.ink};">Your Readiness Score</h1>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font:400 52px/1 ${DISPLAY_FONT};color:${C.ink};padding-right:16px;">${pct}<span style="font-size:22px;color:${C.muted};">%</span></td>
                  <td style="font:400 20px/1.2 ${DISPLAY_FONT};color:${C.gold};">${escapeHtml(totals.level)}</td>
                </tr>
              </table>

              ${weak && weakLabel ? `
              <div style="margin:22px 0 0;padding:16px 18px;background:${C.paper};border:1px solid ${C.rule};border-radius:12px;">
                <p style="margin:0 0 4px;font:700 12px/1.4 ${BODY_FONT};color:${SIGNAL_COLOUR[weak.level] ?? C.ink};letter-spacing:.04em;text-transform:uppercase;">Most exposed to — ${escapeHtml(weakLabel)}</p>
                <p style="margin:0;font:400 13px/1.6 ${BODY_FONT};color:${C.inkSoft};">${escapeHtml(weak.insight)}</p>
                <p style="margin:8px 0 0;font:400 13px/1.6 ${BODY_FONT};color:${C.ink};"><strong>Practise:</strong> ${escapeHtml(weak.practice)}</p>
              </div>` : ""}

              <p style="margin:26px 0 2px;font:700 12px/1.4 ${BODY_FONT};color:${C.ink};letter-spacing:.06em;text-transform:uppercase;">Your H.A.C.K. profile</p>
              <p style="margin:0 0 4px;font:400 12px/1.6 ${BODY_FONT};color:${C.muted};">How you held up against each of the four pressure tactics.</p>
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
              <p style="margin:0 0 4px;font:600 13px/1.5 ${BODY_FONT};color:${C.ink};">This email is your Konfydence account.</p>
              <p style="margin:0;font:400 13px/1.6 ${BODY_FONT};color:${C.muted};">
                <a href="${escapeHtml(input.accountUrl)}" target="_blank" style="color:${C.gold};font-weight:600;text-decoration:none;">See your results on any device →</a>
                &nbsp;No password — this link signs you in.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:26px 6px 0;">
              <p style="margin:0;font:400 11px/1.7 ${BODY_FONT};color:${C.soft};">
                Sent to ${escapeHtml(input.toEmail)} because you asked for your Konfydence Challenge result.
                <a href="${escapeHtml(input.unsubscribeUrl)}" target="_blank" style="color:${C.soft};text-decoration:underline;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(APP_URL)}/privacy-policy" target="_blank" style="color:${C.soft};text-decoration:underline;">Privacy</a>
              </p>
              <p style="margin:8px 0 0;font:400 11px/1.7 ${BODY_FONT};color:${C.soft};">Konfydence · Confidence under pressure.</p>
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
