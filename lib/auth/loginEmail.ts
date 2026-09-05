import { escapeHtml } from "@/lib/email";

// The sign-in email: a 6-digit code plus a one-tap magic link. Deliberately
// plain — a login email that looks like marketing gets filtered.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
const BODY_FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

export function renderLoginCodeEmail(input: { code: string; magicLinkUrl: string }): { subject: string; html: string } {
  const subject = `Your Konfydence sign-in code: ${input.code}`;
  const spaced = input.code.split("").join(" ");
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#F6F3EC;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Your code is ${escapeHtml(input.code)}. It expires in 10 minutes.</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F3EC;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="width:480px;max-width:100%;">
        <tr><td style="padding:0 4px 16px;font:700 13px/1 ${BODY_FONT};letter-spacing:.22em;color:#14171A;">KONFYDENCE</td></tr>
        <tr><td style="background:#FFFFFF;border:1px solid #E6E1D6;border-radius:16px;padding:30px;">
          <p style="margin:0 0 6px;font:400 14px/1.6 ${BODY_FONT};color:#3B3A36;">Enter this code to sign in:</p>
          <p style="margin:0 0 4px;font:700 30px/1.2 ${BODY_FONT};letter-spacing:.28em;color:#14171A;">${escapeHtml(spaced)}</p>
          <p style="margin:0 0 22px;font:400 12px/1.6 ${BODY_FONT};color:#6E6B64;">It expires in 10 minutes and can be used once.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="border-radius:10px;background:#14171A;">
              <a href="${escapeHtml(input.magicLinkUrl)}" target="_blank" style="display:inline-block;padding:12px 24px;font:700 14px/1 ${BODY_FONT};color:#FFFDF9;text-decoration:none;">Or tap here to sign in</a>
            </td></tr>
          </table>
          <p style="margin:20px 0 0;font:400 12px/1.6 ${BODY_FONT};color:#94908A;">If you didn't ask to sign in, you can ignore this email — no account changes were made.</p>
        </td></tr>
        <tr><td style="padding:18px 6px 0;font:400 11px/1.7 ${BODY_FONT};color:#94908A;">
          <a href="${escapeHtml(APP_URL)}" target="_blank" style="color:#94908A;text-decoration:none;">konfydence.com</a> · Confidence under pressure.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  return { subject, html };
}
