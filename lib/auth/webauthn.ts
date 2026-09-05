import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Unified accounts — passkeys / WebAuthn (docs/UNIFIED_ACCOUNTS_PLAN.md, stage 5).
// Phishing-resistant sign-in. The challenge for each ceremony is held in a
// short-lived httpOnly cookie (see the passkey API routes); this module is the
// ceremony logic only.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
const RP_NAME = "Konfydence";

function rpConfig(): { rpID: string; origin: string } {
  try {
    const u = new URL(APP_URL);
    return { rpID: u.hostname, origin: u.origin };
  } catch {
    return { rpID: "konfydence.com", origin: "https://konfydence.com" };
  }
}

export const CHALLENGE_COOKIE = "kf_wa_chl";
export const CHALLENGE_TTL_SECONDS = 300;

// --- registration (signed-in account adds a passkey) ----------------------

export async function passkeyRegistrationOptions(account: Account) {
  const { rpID } = rpConfig();
  const existing = await prisma.passkey.findMany({
    where: { accountId: account.id },
    select: { id: true, transports: true },
  });

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userName: account.email,
    userID: new TextEncoder().encode(account.id),
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
    excludeCredentials: existing.map((c) => ({
      id: c.id,
      transports: c.transports ? (c.transports.split(",") as AuthenticatorTransport[]) : undefined,
    })),
  });

  return { options, challenge: options.challenge };
}

export async function verifyPasskeyRegistration(params: {
  account: Account;
  response: RegistrationResponseJSON;
  expectedChallenge: string;
}): Promise<{ ok: boolean }> {
  const { rpID, origin } = rpConfig();
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: params.response,
      expectedChallenge: params.expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });
  } catch {
    return { ok: false };
  }
  if (!verification.verified || !verification.registrationInfo) return { ok: false };

  const cred = verification.registrationInfo.credential;
  await prisma.passkey.upsert({
    where: { id: cred.id },
    update: { counter: cred.counter, lastUsedAt: new Date() },
    create: {
      id: cred.id,
      accountId: params.account.id,
      publicKey: Buffer.from(cred.publicKey),
      counter: cred.counter,
      transports: cred.transports?.join(",") ?? null,
    },
  });
  return { ok: true };
}

// --- authentication (sign in with a passkey, usernameless) ----------------

export async function passkeyAuthenticationOptions() {
  const { rpID } = rpConfig();
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    // usernameless: let the authenticator offer its discoverable credentials
  });
  return { options, challenge: options.challenge };
}

export async function verifyPasskeyAuthentication(params: {
  response: AuthenticationResponseJSON;
  expectedChallenge: string;
}): Promise<{ ok: true; account: Account } | { ok: false }> {
  const { rpID, origin } = rpConfig();
  const passkey = await prisma.passkey.findUnique({
    where: { id: params.response.id },
    include: { account: true },
  });
  if (!passkey) return { ok: false };

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: params.response,
      expectedChallenge: params.expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: passkey.id,
        publicKey: new Uint8Array(passkey.publicKey),
        counter: passkey.counter,
        transports: passkey.transports ? (passkey.transports.split(",") as AuthenticatorTransport[]) : undefined,
      },
    });
  } catch {
    return { ok: false };
  }
  if (!verification.verified) return { ok: false };

  await prisma.passkey.update({
    where: { id: passkey.id },
    data: { counter: verification.authenticationInfo.newCounter, lastUsedAt: new Date() },
  });
  return { ok: true, account: passkey.account };
}

export async function listPasskeys(accountId: string) {
  return prisma.passkey.findMany({
    where: { accountId },
    select: { id: true, createdAt: true, lastUsedAt: true, transports: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function deletePasskey(accountId: string, passkeyId: string): Promise<void> {
  await prisma.passkey.deleteMany({ where: { id: passkeyId, accountId } });
}
