import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://konfydence.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(input: { to: string; subject: string; html: string }) {
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    console.error("Scam Safety Pack email failed:", response.status, await response.text());
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { allowed } = rateLimit(`scam-safety-pack:${getClientIp(request)}`, 8, 10 * 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "site").slice(0, 80);
    const marketingConsent = body.marketingConsent === true;
    const website = String(body.website || "");

    if (website) {
      return NextResponse.json({ success: true, emailSent: false });
    }

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const safeSource = escapeHtml(source);
    const protocolUrl = `${SITE_URL}/resources/emergency-scam-protocol`;
    const phoneUrl = `${SITE_URL}/resources/konfydence-phone-lock-screen.svg`;
    const desktopUrl = `${SITE_URL}/resources/konfydence-desktop-lock-screen.svg`;

    const emailSent = await sendEmail({
      to: email,
      subject: "Your free Konfydence Scam Safety Pack",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111417;max-width:620px;margin:auto">
          <h1 style="font-size:28px">Your Konfydence Scam Safety Pack</h1>
          <p>Keep the response simple when a message feels urgent, emotional or threatening: <strong>Pause. Verify. Call.</strong></p>
          <ul>
            <li><a href="${protocolUrl}">Emergency Scam Protocol (PDF)</a></li>
            <li><a href="${phoneUrl}">Phone screen locker (SVG)</a></li>
            <li><a href="${desktopUrl}">Computer screen locker (SVG)</a></li>
          </ul>
          <p style="font-size:13px;color:#666">You requested this resource from Konfydence. Marketing messages are only permitted when you separately opted in.</p>
        </div>
      `,
    });

    if (CONTACT_TO_EMAIL && RESEND_API_KEY && CONTACT_FROM_EMAIL) {
      await sendEmail({
        to: CONTACT_TO_EMAIL,
        subject: "New Konfydence Scam Safety Pack lead",
        html: `
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Source:</strong> ${safeSource}</p>
          <p><strong>Marketing opt-in:</strong> ${marketingConsent ? "yes" : "no"}</p>
          <p><strong>Captured:</strong> ${new Date().toISOString()}</p>
        `,
      });
    }

    console.log("Scam Safety Pack lead:", {
      email,
      source,
      marketingConsent,
      emailSent,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    console.error("Scam Safety Pack capture error:", error);
    return NextResponse.json({ error: "Unable to prepare the pack right now." }, { status: 500 });
  }
}
