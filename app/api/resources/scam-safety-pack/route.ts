import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import {
  MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST,
  SCAM_SAFETY_RESOURCE_MAP,
  type ScamSafetyResource,
} from "@/lib/scamSafetyResources";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "concierge@konfydence.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "The Konfydence Team";
const BREVO_MARKETING_LIST_ID = Number(process.env.BREVO_MARKETING_LIST_ID || 0) || null;
const BREVO_DOI_TEMPLATE_ID = Number(process.env.BREVO_DOI_TEMPLATE_ID || 0) || null;
const BREVO_DOI_REDIRECT_URL = process.env.BREVO_DOI_REDIRECT_URL || "https://konfydence.com/free-scam-safety-pack?marketing=confirmed";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://konfydence.com").replace(/\/$/, "");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resourceUrl(resource: ScamSafetyResource) {
  return `${SITE_URL}${resource.downloadPath}`;
}

async function brevoRequest(path: string, init: RequestInit) {
  if (!BREVO_API_KEY) {
    return { ok: false, status: 0, body: "BREVO_API_KEY is not configured" };
  }

  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY,
      ...(init.headers || {}),
    },
  });

  const body = await response.text();
  return { ok: response.ok, status: response.status, body };
}

async function sendBrevoEmail(input: { to: string; subject: string; html: string; tags?: string[] }) {
  if (!BREVO_API_KEY) return false;

  const result = await brevoRequest("/smtp/email", {
    method: "POST",
    body: JSON.stringify({
      sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to: [{ email: input.to }],
      subject: input.subject,
      htmlContent: input.html,
      tags: input.tags || ["konfydence-resource-delivery"],
    }),
  });

  if (!result.ok) {
    console.error("Brevo transactional email failed:", result.status, result.body);
    return false;
  }

  return true;
}

async function registerMarketingConsent(email: string) {
  if (!BREVO_API_KEY || !BREVO_MARKETING_LIST_ID) {
    return { recorded: false, mode: "not-configured" as const };
  }

  if (BREVO_DOI_TEMPLATE_ID) {
    const doi = await brevoRequest("/contacts/doubleOptinConfirmation", {
      method: "POST",
      body: JSON.stringify({
        email,
        includeListIds: [BREVO_MARKETING_LIST_ID],
        redirectionUrl: BREVO_DOI_REDIRECT_URL,
        templateId: BREVO_DOI_TEMPLATE_ID,
      }),
    });

    if (!doi.ok) {
      console.error("Brevo DOI registration failed:", doi.status, doi.body);
      return { recorded: false, mode: "doi-failed" as const };
    }

    return { recorded: true, mode: "double-opt-in" as const };
  }

  const contact = await brevoRequest("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      listIds: [BREVO_MARKETING_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (!contact.ok) {
    console.error("Brevo marketing contact registration failed:", contact.status, contact.body);
    return { recorded: false, mode: "contact-failed" as const };
  }

  return { recorded: true, mode: "explicit-opt-in" as const };
}

function renderResourceList(resources: ScamSafetyResource[]) {
  return resources
    .map(
      (resource) => `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid #e8e2d8">
            <div style="font-size:12px;color:#806941;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px">${escapeHtml(resource.kind)}</div>
            <div style="font-size:17px;font-weight:700;color:#111417;margin-bottom:6px">${escapeHtml(resource.label)}</div>
            <a href="${resourceUrl(resource)}" style="display:inline-block;color:#0b5aa5;font-weight:700;text-decoration:none">Download file</a>
          </td>
        </tr>`
    )
    .join("");
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
    const requestedIds: string[] = Array.isArray(body.selections)
      ? Array.from(new Set<string>(body.selections.map((value: unknown) => String(value))))
      : [];

    if (website) {
      return NextResponse.json({ success: true, emailSent: false, resources: [] });
    }

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (requestedIds.length < 1 || requestedIds.length > MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Choose between 1 and ${MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST} resources.` },
        { status: 400 }
      );
    }

    const resources = requestedIds
      .map((id) => SCAM_SAFETY_RESOURCE_MAP.get(id))
      .filter((resource): resource is ScamSafetyResource => Boolean(resource));

    if (resources.length !== requestedIds.length) {
      return NextResponse.json({ error: "One or more selected resources are not available." }, { status: 400 });
    }

    const emailSent = await sendBrevoEmail({
      to: email,
      subject: resources.length === 1 ? "Your free Konfydence resource" : "Your free Konfydence resources",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111417;max-width:620px;margin:auto;padding:28px">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#806941;margin-bottom:20px">Konfydence</div>
          <h1 style="font-family:Georgia,serif;font-size:34px;line-height:1.08;font-weight:400;margin:0 0 16px">Your selected scam-safety resources</h1>
          <p style="font-size:16px;color:#5e5a55;margin:0 0 20px">Keep the response simple when a message feels urgent, emotional or threatening: <strong>Pause. Verify. Call.</strong></p>
          <table role="presentation" style="width:100%;border-collapse:collapse">${renderResourceList(resources)}</table>
          <p style="font-size:12px;color:#77716a;margin-top:24px">You requested these files from Konfydence. This delivery email is transactional. Marketing messages are separate and only enabled when you explicitly opt in.</p>
        </div>
      `,
      tags: ["konfydence-resource-delivery", `source-${source.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 40)}`],
    });

    const marketing = marketingConsent
      ? await registerMarketingConsent(email)
      : { recorded: false, mode: "not-requested" as const };

    if (CONTACT_TO_EMAIL && BREVO_API_KEY) {
      await sendBrevoEmail({
        to: CONTACT_TO_EMAIL,
        subject: "New Konfydence resource request",
        html: `
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Source:</strong> ${escapeHtml(source)}</p>
          <p><strong>Resources:</strong> ${resources.map((resource) => escapeHtml(resource.label)).join(", ")}</p>
          <p><strong>Marketing opt-in requested:</strong> ${marketingConsent ? "yes" : "no"}</p>
          <p><strong>Brevo marketing status:</strong> ${escapeHtml(marketing.mode)}</p>
          <p><strong>Captured:</strong> ${new Date().toISOString()}</p>
        `,
        tags: ["konfydence-resource-lead"],
      });
    }

    console.log("Konfydence resource request:", {
      email,
      source,
      resources: resources.map((resource) => resource.id),
      marketingConsent,
      marketingMode: marketing.mode,
      emailSent,
      provider: "brevo",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      emailSent,
      provider: "brevo",
      marketing: marketing.mode,
      resources: resources.map((resource) => ({
        id: resource.id,
        label: resource.label,
        downloadUrl: resourceUrl(resource),
      })),
    });
  } catch (error) {
    console.error("Scam Safety resource capture error:", error);
    return NextResponse.json({ error: "Unable to prepare the resources right now." }, { status: 500 });
  }
}
