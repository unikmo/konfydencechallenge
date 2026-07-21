/**
 * QA matrix — webhook/entitlement test cases TC-03, TC-04, TC-05, TC-07
 * (docs/UX_UI_COMMERCE_SPEC_V1.docx §8).
 *
 * WHY THIS IS A STANDALONE SCRIPT RUN LOCALLY, NOT SOMETHING RUN FROM CHAT:
 * verifying these test cases requires (a) sending real, correctly-HMAC-signed
 * requests to the LIVE production webhook endpoint, and (b) reading the real
 * production database afterward to confirm the right rows were written. Doing
 * that requires Prisma actually working and a DATABASE_URL connection — this
 * only works on your machine, not in the assistant's sandbox.
 *
 * WHAT IT DOES: fires synthetic (but validly signed) webhook payloads at
 * https://konfydence.com/api/webhooks/shopify-purchase using clearly-marked
 * test data (a "qa-<timestamp>" prefix on every id/email), checks the
 * resulting database state via Prisma, prints PASS/FAIL per test case, and
 * deletes every row it created in a `finally` block — so it's safe to run
 * against production and leaves no trace afterward, pass or fail.
 *
 * HOW TO RUN:
 *   npx ts-node --transpile-only scripts/qa-webhook-matrix.ts
 *
 * Requires SHOPIFY_WEBHOOK_SECRET and DATABASE_URL to already be set in your
 * local .env (they are, per earlier setup).
 */

import { createHmac } from "crypto";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Minimal .env loader (no dotenv dependency in this project) — ts-node alone
// won't pick up .env automatically the way `next dev`/prisma CLI do.
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnv();

const BASE_URL = "https://konfydence.com";
const WEBHOOK_URL = `${BASE_URL}/api/webhooks/shopify-purchase`;
const SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

if (!SECRET) {
  console.error("SHOPIFY_WEBHOOK_SECRET not found in .env — aborting.");
  process.exit(1);
}

const prisma = new PrismaClient();

function sign(body: string): string {
  return createHmac("sha256", SECRET!).update(body, "utf8").digest("base64");
}

async function postWebhook(topic: string, payload: unknown) {
  const body = JSON.stringify(payload);
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Topic": topic,
      "X-Shopify-Hmac-Sha256": sign(body),
    },
    body,
  });
  return { status: res.status, body: await res.text() };
}

const RUN_ID = `qa-${Date.now()}`;
const results: { name: string; pass: boolean; detail: string }[] = [];

function report(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name} — ${detail}`);
}

async function main() {
  console.log(`\nRun ID: ${RUN_ID}\nTarget: ${WEBHOOK_URL}\n`);

  // Cleanup tracking
  const createdOrderIds: string[] = [];
  const createdEmails: string[] = [];
  const createdUserIds: string[] = [];

  try {
    // ---- TC-03: existing visitor (known kf_uid) buys a single edition ----
    // Simulates a real returning visitor: a User row already exists with this
    // id (mirrors createChallengeSessionForVisitor's upsert-by-kf_uid pattern).
    const tc03KfUid = `${RUN_ID}-tc03-kfuid`;
    const tc03OrderId = `${RUN_ID}-tc03-order`;
    createdUserIds.push(tc03KfUid);
    createdOrderIds.push(tc03OrderId);

    await prisma.user.create({
      data: { id: tc03KfUid, email: `guest-${tc03KfUid}@local.konfydence` },
    });

    await postWebhook("orders/paid", {
      id: tc03OrderId,
      note_attributes: [{ name: "konfydenceUserId", value: tc03KfUid }],
      line_items: [{ sku: "CHAL-SINGLE-SCHOOL" }],
    });

    const tc03Entitlement = await prisma.entitlement.findUnique({
      where: { shopifyOrderId: tc03OrderId },
    });
    report(
      "TC-03 (single-edition purchase creates entitlement)",
      !!tc03Entitlement &&
        tc03Entitlement.userId === tc03KfUid &&
        tc03Entitlement.tier === "single" &&
        tc03Entitlement.edition === "school" &&
        tc03Entitlement.status === "active",
      tc03Entitlement
        ? `tier=${tc03Entitlement.tier} edition=${tc03Entitlement.edition} status=${tc03Entitlement.status} userId=${tc03Entitlement.userId}`
        : "no entitlement row found"
    );

    // ---- TC-04: no kf_uid cookie at checkout — falls back to email ----
    const tc04Email = `${RUN_ID}-tc04@konfydence-test.invalid`;
    const tc04OrderId = `${RUN_ID}-tc04-order`;
    createdEmails.push(tc04Email);
    createdOrderIds.push(tc04OrderId);

    await postWebhook("orders/paid", {
      id: tc04OrderId,
      customer: { email: tc04Email },
      line_items: [{ sku: "CHAL-SINGLE-UNIVERSITY" }],
    });

    const tc04User = await prisma.user.findUnique({ where: { email: tc04Email } });
    const tc04Entitlement = tc04User
      ? await prisma.entitlement.findUnique({ where: { shopifyOrderId: tc04OrderId } })
      : null;
    if (tc04User) createdUserIds.push(tc04User.id);
    report(
      "TC-04 (email fallback attaches entitlement to a User)",
      !!tc04User && !!tc04Entitlement && tc04Entitlement.userId === tc04User.id,
      tc04User
        ? `user created by email, entitlement=${tc04Entitlement ? "present" : "MISSING"}`
        : "no user created by email at all"
    );

    // ---- TC-05: refund/cancel flips entitlement to revoked ----
    await postWebhook("orders/cancelled", { id: tc03OrderId });
    const tc05Entitlement = await prisma.entitlement.findUnique({
      where: { shopifyOrderId: tc03OrderId },
    });
    report(
      "TC-05 (cancel/refund revokes entitlement)",
      tc05Entitlement?.status === "revoked",
      `status=${tc05Entitlement?.status ?? "not found"}`
    );

    // ---- TC-07: physical merch purchase writes zero Entitlement rows ----
    const tc07OrderId = `${RUN_ID}-tc07-order`;
    const tc07Email = `${RUN_ID}-tc07@konfydence-test.invalid`;
    createdOrderIds.push(tc07OrderId);
    createdEmails.push(tc07Email);

    await postWebhook("orders/paid", {
      id: tc07OrderId,
      customer: { email: tc07Email },
      line_items: [{ sku: "KG-WALLET" }, { sku: "KG-MAGNET" }],
    });

    const tc07Entitlement = await prisma.entitlement.findUnique({
      where: { shopifyOrderId: tc07OrderId },
    });
    report(
      "TC-07 (physical merch creates no entitlement)",
      tc07Entitlement === null,
      tc07Entitlement ? "an entitlement WAS created — bug" : "no entitlement row, as expected"
    );
  } finally {
    // ---- Cleanup: delete every row this script created, pass or fail ----
    console.log("\nCleaning up test data...");
    await prisma.entitlement.deleteMany({ where: { shopifyOrderId: { in: createdOrderIds } } });

    const emailUsers = await prisma.user.findMany({
      where: { email: { in: createdEmails } },
      select: { id: true },
    });
    const allUserIds = [...new Set([...createdUserIds, ...emailUsers.map((u) => u.id)])];
    await prisma.user.deleteMany({ where: { id: { in: allUserIds } } });

    console.log(`Deleted ${allUserIds.length} test user(s) and their entitlements.`);
    await prisma.$disconnect();
  }

  console.log("\n--- Summary ---");
  for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}`);
  const allPassed = results.every((r) => r.pass);
  console.log(allPassed ? "\nAll test cases passed." : "\nSome test cases FAILED — see above.");
  process.exit(allPassed ? 0 : 1);
}

main().catch(async (err) => {
  console.error("Script error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
