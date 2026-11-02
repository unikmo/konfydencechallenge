import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const safe = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70) || "organisation";
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const personalDomains = new Set(["gmail.com","googlemail.com","yahoo.com","outlook.com","hotmail.com","icloud.com","aol.com","proton.me","protonmail.com"]);

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) console.error("CoMaSy pilot email failed", res.status, await res.text());
  return res.ok;
}

export async function POST(request: NextRequest) {
  const preLang = new URL(request.url).searchParams.get("lang") === "de" ? "de" : "en";
  // Read before the body is consumed, since a rate-limit/validation bounce
  // needs to send a German visitor back to the German form, not the English
  // one — /de/comasy/pilotprojekt posts here with a hidden lang=de field.
  const pilotFormUrl = preLang === "de" ? "/de/comasy/pilotprojekt" : "/comasy/pilot";
  const { allowed } = rateLimit(`comasy-pilot:${getClientIp(request)}`, 5, 10 * 60_000);
  if (!allowed) return NextResponse.redirect(new URL(`${pilotFormUrl}?error=rate`, request.url), 303);
  const form = await request.formData();
  const lang = value(form, "lang") === "de" ? "de" : "en";
  const formUrl = lang === "de" ? (value(form, "audience") === "school" ? "/de/pilot/schulen" : "/de/comasy/pilotprojekt") : value(form, "audience") === "school" ? "/pilot/schools" : "/comasy/pilot";
  const firstName=value(form,"firstName"), lastName=value(form,"lastName"), workEmail=value(form,"workEmail").toLowerCase(), organizationName=value(form,"organization"), role=value(form,"role"), organizationSize=value(form,"organizationSize"), primaryObjective=value(form,"primaryObjective");
  if (!firstName || !lastName || !organizationName || !validEmail(workEmail) || !role || !organizationSize || !primaryObjective || value(form,"consent")!=="yes") {
    return NextResponse.redirect(new URL(`${formUrl}?error=validation`, request.url), 303);
  }

  const isSchool=value(form,"audience")==="school";
  // School requests carry the country and student age group so the data-protection
  // gate (age of digital consent, parental notice) can be checked before any scoping call.
  const schoolContext=isSchool?`School pilot · Country: ${value(form,"country")||"n/a"} · Student age group: ${value(form,"ageGroup")||"n/a"}`:"";
  const notes=[schoolContext,value(form,"notes")].filter(Boolean).join(" | ")||null;
  const emailDomain=workEmail.split("@")[1] || "";
  const source=value(form,"utm_source") || "Direct";
  const medium=value(form,"utm_medium") || null;
  const campaign=value(form,"utm_campaign") || null;
  const landingPage=value(form,"landingPage") || (isSchool?"/pilot/schools":"/comasy/pilot");
  const persona=role;
  let slug=slugify(organizationName);
  const existingBySlug=await prisma.comasyOrganization.findUnique({where:{slug}});
  if (existingBySlug && existingBySlug.name.toLowerCase()!==organizationName.toLowerCase()) slug=`${slug}-${emailDomain.split(".")[0]||Date.now()}`.slice(0,80);

  const organization = existingBySlug?.name.toLowerCase()===organizationName.toLowerCase()
    ? await prisma.comasyOrganization.update({where:{id:existingBySlug.id},data:{stage:existingBySlug.stage==="TARGET_ACCOUNT"?"PILOT_PROPOSED":existingBySlug.stage,source:existingBySlug.source||source,persona:existingBySlug.persona||persona,currentPlatform:value(form,"currentPlatform")||existingBySlug.currentPlatform,nextAction:"Review pilot request",lastContactAt:new Date()}})
    : await prisma.comasyOrganization.create({data:{name:organizationName,slug,source,persona,stage:"PILOT_PROPOSED",currentPlatform:value(form,"currentPlatform")||null,nextAction:"Review pilot request",lastContactAt:new Date(),customerHealth:"PROSPECT"}});

  let contact=await prisma.comasyContact.findFirst({where:{organizationId:organization.id,email:workEmail}});
  if(!contact) contact=await prisma.comasyContact.create({data:{organizationId:organization.id,firstName,lastName,email:workEmail,jobTitle:role,persona,buyingRole:"Pilot requester",champion:true,notes}});

  const [lead] = await prisma.$transaction([
    prisma.comasyLead.create({data:{organizationId:organization.id,firstName,lastName,workEmail,organizationName,role,organizationSize,primaryObjective,currentPlatform:value(form,"currentPlatform")||null,notes,source,medium,campaign,landingPage,status:"PILOT_REQUEST"}}),
    prisma.comasyActivity.create({data:{organizationId:organization.id,contactId:contact.id,type:"pilot_form_complete",source,medium,campaign,page:landingPage,persona,metadata:JSON.stringify({audience:isSchool?"school":"organisation",organizationSize,primaryObjective,workEmailType:personalDomains.has(emailDomain)?"personal-domain":"work-domain"})}}),
  ]);

  const activeOpportunity=await prisma.comasyOpportunity.findFirst({where:{organizationId:organization.id,stage:{notIn:["WON","LOST"]}}});
  if(!activeOpportunity) await prisma.comasyOpportunity.create({data:{organizationId:organization.id,name:`${organizationName} ${isSchool?"school pilot":"CoMaSy pilot"}`,stage:"PILOT_PROPOSED",probability:35,nextAction:"Qualify use case and agree cohort",owner:organization.accountOwner}});

  const internalHtml=`<h2>New ${isSchool?"school":"CoMaSy"} pilot request${lang==="de"?" (DE)":""}</h2>${isSchool?"<p><strong>Minors involved: check age of digital consent and DPA before scoping. No student data should be collected at this stage.</strong></p>":""}<p><strong>${safe(firstName)} ${safe(lastName)}</strong> · ${safe(role)}<br/>${safe(workEmail)}<br/>${safe(organizationName)} · ${safe(organizationSize)}</p><p><strong>Objective:</strong> ${safe(primaryObjective)}<br/><strong>Current platform:</strong> ${safe(value(form,"currentPlatform")||"Not provided")}<br/><strong>Notes:</strong> ${safe(notes||"—")}</p><p>Source: ${safe([source,medium,campaign].filter(Boolean).join(" / "))}</p>`;
  const customerHtml = lang === "de"
    ? (isSchool ? `<h2>Deine Schul-Pilotanfrage ist da.</h2><p>Hallo ${safe(firstName)},</p><p>Wir prüfen deine Anfrage und melden uns, um Klasse oder Jahrgang, den Risikofokus und das Datenmodell zu vereinbaren. <strong>In dieser Phase werden keine Schülerdaten benötigt oder erhoben</strong>, und sie werden erst verwendet, wenn ein Auftragsverarbeitungsvertrag vorliegt.</p>` : `<h2>Deine CoMaSy-Pilotanfrage ist da.</h2><p>Hallo ${safe(firstName)},</p><p>Wir prüfen den Anwendungsfall, vereinbaren die Zielkohorte und den Risikofokus, legen die Pilot-Kennzahlen fest und konfigurieren das Programm — vor jeder Entscheidung über eine Skalierung.</p><p><strong>Definierte Kohorte. Definierte Kennzahlen. Definierter Entscheidungspunkt.</strong></p>`)
    : isSchool
    ? `<h2>Your school pilot request is in.</h2><p>Hi ${safe(firstName)},</p><p>We will review your request and get in touch to agree the class or year group, the risk focus and the data model. <strong>No student data is needed or collected at this stage</strong>, and none is used until a data-processing agreement is in place.</p>`
    : `<h2>Your CoMaSy pilot request is in.</h2><p>Hi ${safe(firstName)},</p><p>We will review the use case, agree the target cohort and risk focus, establish the pilot measures, and configure the programme before any scale decision.</p><p><strong>Defined cohort. Defined metrics. Defined decision point.</strong></p>`;
  await Promise.all([
    CONTACT_TO_EMAIL ? sendEmail(CONTACT_TO_EMAIL,`${isSchool?"School":"CoMaSy"} pilot request — ${organizationName}`,internalHtml,workEmail):Promise.resolve(false),
    sendEmail(workEmail, lang === "de" ? (isSchool ? "Deine Schul-Pilotanfrage ist da" : "Deine CoMaSy-Pilotanfrage ist da") : isSchool ? "Your school pilot request is in" : "Your CoMaSy pilot request is in", customerHtml),
  ]);
  console.log("CoMaSy pilot request recorded", { leadId: lead.id, organizationId: organization.id, emailConfigured: Boolean(RESEND_API_KEY&&CONTACT_FROM_EMAIL) });
  return NextResponse.redirect(new URL(`/comasy/pilot/thank-you?org=${encodeURIComponent(organizationName)}${lang === "de" ? "&lang=de" : ""}`, request.url),303);
}
