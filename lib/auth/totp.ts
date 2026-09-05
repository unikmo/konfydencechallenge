import { createHash, randomInt } from "crypto";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { encryptSecret, decryptSecret } from "./secretCrypto";

// Unified accounts — TOTP 2FA (docs/UNIFIED_ACCOUNTS_PLAN.md, stage 6).
// Opt-in second factor on top of email-code sign-in. Passkey sign-in already
// carries user verification and is not additionally challenged.

const ISSUER = "Konfydence";
const RECOVERY_CODE_COUNT = 10;

function totp(secretBase32: string, label: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
}

function hashRecovery(code: string): string {
  const pepper = process.env.AUTH_SECRET || process.env.DATABASE_URL || "kf-recovery";
  return createHash("sha256").update(`${pepper}\0recovery\0${code.replace(/[\s-]/g, "").toLowerCase()}`).digest("hex");
}

function makeRecoveryCode(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const pick = () => alphabet[randomInt(0, alphabet.length)];
  return `${Array.from({ length: 5 }, pick).join("")}-${Array.from({ length: 5 }, pick).join("")}`;
}

export async function accountHasTotp(accountId: string): Promise<boolean> {
  const row = await prisma.totpCredential.findUnique({ where: { accountId }, select: { confirmedAt: true } });
  return Boolean(row?.confirmedAt);
}

export async function beginTotpEnrolment(account: Account): Promise<{ otpauthUri: string; secret: string; qrDataUrl: string }> {
  const secret = new OTPAuth.Secret({ size: 20 }).base32;
  await prisma.totpCredential.upsert({
    where: { accountId: account.id },
    update: { secret: encryptSecret(secret), confirmedAt: null, recoveryCodeHashes: [] },
    create: { accountId: account.id, secret: encryptSecret(secret), recoveryCodeHashes: [] },
  });
  const uri = totp(secret, account.email).toString();
  const qrDataUrl = await QRCode.toDataURL(uri, { margin: 1, width: 200 });
  return { otpauthUri: uri, secret, qrDataUrl };
}

export async function confirmTotpEnrolment(
  account: Account,
  code: string,
): Promise<{ ok: true; recoveryCodes: string[] } | { ok: false }> {
  const row = await prisma.totpCredential.findUnique({ where: { accountId: account.id } });
  if (!row || row.confirmedAt) return { ok: false };
  const secret = decryptSecret(row.secret);
  if (!secret) return { ok: false };
  const delta = totp(secret, account.email).validate({ token: code.replace(/\s/g, ""), window: 1 });
  if (delta === null) return { ok: false };

  const recoveryCodes = Array.from({ length: RECOVERY_CODE_COUNT }, makeRecoveryCode);
  await prisma.totpCredential.update({
    where: { accountId: account.id },
    data: { confirmedAt: new Date(), recoveryCodeHashes: recoveryCodes.map(hashRecovery) },
  });
  return { ok: true, recoveryCodes };
}

export async function verifyTotpForAccount(accountId: string, input: string): Promise<boolean> {
  const row = await prisma.totpCredential.findUnique({ where: { accountId } });
  if (!row?.confirmedAt) return false;

  const cleaned = input.trim();
  if (/^\d{6}$/.test(cleaned)) {
    const secret = decryptSecret(row.secret);
    if (secret) {
      const acct = await prisma.account.findUnique({ where: { id: accountId }, select: { email: true } });
      const delta = totp(secret, acct?.email ?? "").validate({ token: cleaned, window: 1 });
      if (delta !== null) return true;
    }
  }

  // Recovery code (single use).
  const h = hashRecovery(cleaned);
  if (row.recoveryCodeHashes.includes(h)) {
    await prisma.totpCredential.update({
      where: { accountId },
      data: { recoveryCodeHashes: row.recoveryCodeHashes.filter((x) => x !== h) },
    });
    return true;
  }
  return false;
}

export async function disableTotp(accountId: string): Promise<void> {
  await prisma.totpCredential.deleteMany({ where: { accountId } });
}

export async function totpStatus(accountId: string): Promise<{ enabled: boolean; recoveryRemaining: number }> {
  const row = await prisma.totpCredential.findUnique({
    where: { accountId },
    select: { confirmedAt: true, recoveryCodeHashes: true },
  });
  return {
    enabled: Boolean(row?.confirmedAt),
    recoveryRemaining: row?.recoveryCodeHashes.length ?? 0,
  };
}
