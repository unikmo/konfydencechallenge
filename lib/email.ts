const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "concierge@konfydence.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "The Konfydence Team";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Send one transactional email via Brevo. Returns false (and logs) if not configured or on failure. */
export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  tags?: string[];
}): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY not configured; email not sent");
    return false;
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        to: [{ email: input.to }],
        ...(input.replyTo ? { replyTo: { email: input.replyTo } } : {}),
        subject: input.subject,
        htmlContent: input.html,
        tags: input.tags || ["konfydence"],
      }),
    });
    if (!response.ok) {
      console.error("Brevo transactional email failed:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Brevo transactional email error:", error);
    return false;
  }
}
