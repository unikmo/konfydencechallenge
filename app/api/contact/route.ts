import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

// Messages are sent through the team@konfydence.com mailbox over SMTP (port 465)
// and delivered to that same mailbox. The recipient is fixed by configuration,
// never by the visitor. If delivery is not configured or fails, the visitor
// sees an error instead of a false "message received".
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

function mailConfig() {
  const user = process.env.CONTACT_SMTP_USER?.trim() || "";
  return {
    host: process.env.CONTACT_SMTP_HOST?.trim() || "",
    user,
    pass: process.env.CONTACT_SMTP_PASSWORD?.replace(/\s/g, "") || "",
    to: process.env.CONTACT_TO_EMAIL?.trim() || user,
  };
}

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
}): Promise<"sent" | "not-configured" | "failed"> {
  const c = mailConfig();
  if (!c.host || !c.user || !c.pass || !emailPattern.test(c.to)) return "not-configured";

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

  try {
    const transport = nodemailer.createTransport({
      host: c.host,
      port: 465,
      secure: true,
      auth: { user: c.user, pass: c.pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const subjectTopic = (payload.topic || "general").replace(/[\r\n]+/g, " ").slice(0, 60);
    const result = await transport.sendMail({
      from: { name: "Konfydence contact form", address: c.user },
      to: c.to,
      replyTo: { name: payload.name.replace(/[<>"\r\n]/g, "").slice(0, 100), address: payload.email },
      subject: `New ${subjectTopic} inquiry from ${payload.name.replace(/[\r\n]+/g, " ").slice(0, 100)}`,
      html,
    });
    if (!result.accepted?.length || result.rejected?.length) throw new Error("Delivery not accepted");
    return "sent";
  } catch (error) {
    const code = (error as { code?: unknown })?.code;
    console.error("contact-mail-failed", typeof code === "string" ? code : "UNKNOWN");
    return "failed";
  }
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

    if (typeof email !== "string" || !emailPattern.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const outcome = await sendContactEmail({
      name: String(name).slice(0, 100),
      email: email.trim().slice(0, 254),
      organization: String(organization || "Not provided").slice(0, 200),
      seatCount: seatCount ? String(seatCount).slice(0, 20) : undefined,
      message: String(message).slice(0, 5000),
      topic: typeof topic === "string" ? topic : undefined,
    });

    if (outcome === "not-configured") {
      console.error("contact-mail-not-configured");
      return NextResponse.json(
        { error: "Message delivery is temporarily unavailable. Please email team@konfydence.com." },
        { status: 503 }
      );
    }
    if (outcome === "failed") {
      return NextResponse.json(
        { error: "Your message could not be sent. Please try again or email team@konfydence.com." },
        { status: 502 }
      );
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
