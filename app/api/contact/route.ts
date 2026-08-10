import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Submissions previously only ever hit console.log on Vercel — every
// school/university/workplace inquiry through this form was going nowhere.
// Guarded by env vars (same pattern as GA4 in app/layout.tsx): if Resend
// isn't configured yet, this quietly falls back to the old console.log
// behavior instead of throwing, so the form still "works" from the visitor's
// point of view while you finish setting up email.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendContactEmail(payload: {
  name: string;
  email: string;
  organization: string;
  seatCount?: string;
  message: string;
  topic?: string;
}): Promise<boolean> {
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return false;

  // All fields are attacker-controlled input landing in an HTML email body —
  // escape before interpolating to avoid HTML/content injection in the inbox.
  const safe = {
    name: escapeHtml(payload.name),
    email: escapeHtml(payload.email),
    organization: escapeHtml(payload.organization),
    seatCount: payload.seatCount ? escapeHtml(payload.seatCount) : "—",
    message: escapeHtml(payload.message).replace(/\n/g, "<br/>"),
    topic: payload.topic ? escapeHtml(payload.topic) : "general",
  };

  const html = `
    <h2>New ${safe.topic} inquiry — Konfydence contact form</h2>
    <p><strong>Name:</strong> ${safe.name}<br/>
    <strong>Email:</strong> ${safe.email}<br/>
    <strong>Organization:</strong> ${safe.organization}<br/>
    <strong>Seat count:</strong> ${safe.seatCount}</p>
    <p><strong>Message:</strong><br/>${safe.message}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      reply_to: payload.email,
      subject: `New ${safe.topic} inquiry from ${payload.name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend send failed:", res.status, await res.text());
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Open, unauthenticated POST endpoint — cap submissions per IP so it
    // can't be scripted into spamming the business inbox once email is wired.
    const { allowed } = rateLimit(`contact:${getClientIp(request)}`, 5, 10 * 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, organization, seatCount, message, topic, consent } = body;

    // Validate required fields
    if (!name || !email || (!organization && topic !== "travel-check-in") || !message || consent !== true) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sent = await sendContactEmail({ name, email, organization: organization || "Not provided", seatCount, message, topic });

    if (!sent) {
      // Fallback so submissions are still visible somewhere (Vercel logs)
      // until RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL are set.
      console.log("Contact form submission (email not configured):", {
        name,
        email,
        organization,
        seatCount,
        message,
        topic,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
