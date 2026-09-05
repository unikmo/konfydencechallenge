# Konfydence unified accounts — build plan

Status: **approved in principle, not started.** This doc is the reference; each
stage ships as its own branch → gates → deploy, same as everything else.

## Goal

One passwordless Konfydence account per person that spans:

- **The Challenge game** — Readiness Score history + entitlements, on any device
  (replaces the anonymous `kf_uid` cookie as the identity).
- **Lockscreens self-serve admin** — Workplace / School / Home / Teen. The
  emailed magic-link admin token keeps working as a fallback; the account
  becomes the primary way in.

CoMaSy stays out of v1: its login is an org-level shared access code
(`ComasyOrganization.accessCodeHash`), not per-user, and it works. The new
session layer is built so CoMaSy can adopt per-user accounts later (stage 7).

## Gating model (updated per Tichi, 2026-09-05)

| Step | Gate |
| --- | --- |
| Start a free readiness check (round 1) | None — frictionless, anonymous `kf_uid` |
| **See / receive the result of a free check** | **Email required.** Result is delivered by email (the conversion email — see `lib/challenge/resultsEmail.ts`) and unlocked on-screen. The email address becomes the account. |
| Second free check | Email already on file → allowed (current behaviour) |
| Third+ free check | → `/pricing?reason=free-limit` (current behaviour) |
| Full challenge (any edition) | **Entitlement required** (purchase). Unchanged — already gated in `app/challenge/[edition]/start/route.ts`. |
| Manage a Lockscreens subscription without the emailed link | Signed-in account linked to that tenant |

The email-for-results moment **is** the account signup. No separate "create
account" step. Email is captured unverified so the result is not blocked on a
code round-trip; the "See your results on any device" link in the email is the
magic link that verifies the address and opens `/account`.

## Auth model

- **Primary:** sign in with email → 6-digit code (magic link in the same email).
  No passwords, ever, by default.
- **Upgrade:** passkeys / WebAuthn — "Add a passkey" after first sign-in,
  becomes the fast path on return. Phishing-resistant by design; this is the
  part that matters for a security brand.
- **Sessions:** DB-backed and revocable. An `AuthSession` row per login (token
  stored hashed, `expiresAt`, `userAgent`, `ipHash` for a "your sessions"
  list). Opaque cookie, `httpOnly` + `Secure` + `SameSite=Lax`, ~30-day sliding
  expiry. "Sign out everywhere" = delete rows.
- **TOTP 2FA:** offered, not forced, for consumer accounts; can be required for
  admin roles later.
- **Anti-abuse:** login-code requests rate-limited per email + per IP; generic
  "check your email" regardless of whether the account exists; single-use codes,
  10-minute TTL, attempt cap.

## Library choice

`@oslojs/crypto` + `@oslojs/encoding` + `@simplewebauthn/server` +
`@simplewebauthn/browser` + `otpauth` (TOTP). This is the stack Lucia's author
now recommends after sunsetting the Lucia package itself. ~120 lines of session
code we own and can audit; no heavy framework; clean with Next 16 / React 19
server actions.

Rejected: Auth.js v5 (heavy, its DB-session + passkey story is still rough on
Next 16), Lucia-the-package (deprecated), Clerk / WorkOS / Auth0 (third-party
dependency + cost + identity data leaves us — wrong for what we sell).

## Signing key (decision on open question #3)

**No new environment variable is required to launch.** The `AuthSession` cookie
is an opaque token checked against a hashed DB row, so it needs no signing key.
The only signed value is the magic-link token, and that is **also** backed by a
hashed `LoginCode` row — the DB row is the source of truth, the signature is
belt-and-braces.

Where a signed value is used, reuse the existing `authSecret()` derivation in
`lib/comasyAuth.ts` (`AUTH_SECRET` if set, else HMAC from `DATABASE_URL` with
domain separation — Vercel's connected API cannot write env vars). The code
prefers `AUTH_SECRET` automatically if it is ever added.

**Recommended (not blocking):** paste a dedicated rotatable `AUTH_SECRET` into
Vercel once. One paste, no code change, lets us rotate independently of the DB
credential.

WebAuthn RP ID = `"konfydence.com"` (a constant, not a secret). TOTP secret
encryption key = same `authSecret()` derivation.

## Schema (new Prisma models + idempotent migration, house `DO $$` guard)

```prisma
model Account {
  id              String   @id @default(cuid())
  email           String   @unique
  emailVerifiedAt DateTime?
  createdAt       DateTime @default(now())
  sessions        AuthSession[]
  passkeys        Passkey[]
  totp            TotpCredential?
}

model AuthSession {
  id         String   @id           // random; stored hashed
  accountId  String
  account    Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  lastSeenAt DateTime @default(now())
  userAgent  String?
  ipHash     String?
  @@index([accountId])
}

model LoginCode {
  id         String   @id @default(cuid())
  email      String
  codeHash   String
  expiresAt  DateTime
  attempts   Int      @default(0)
  consumedAt DateTime?
  createdAt  DateTime @default(now())
  @@index([email])
}

model Passkey {
  id         String   @id           // credential ID (base64url)
  accountId  String
  account    Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  publicKey  Bytes
  counter    Int
  transports String?
  createdAt  DateTime @default(now())
  lastUsedAt DateTime?
  @@index([accountId])
}

model TotpCredential {
  accountId   String   @id
  account     Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  secret      String            // encrypted at rest
  confirmedAt DateTime?
  createdAt   DateTime @default(now())
}
```

Plus, on existing models (both nullable — existing rows untouched until claimed):

- `User.accountId String? @unique` — the Challenge player behind an account.
- `LockscreenTenant.accountId String?` — the subscription / admin behind an account.

## Claiming existing data (on successful sign-in for email X)

1. Find or create the `Account` for X.
2. If the request carries a `kf_uid` cookie for an anonymous `User` with no
   `accountId`: attach that `User` to the account — its `ChallengeSession`s and
   `Entitlement`s come with it.
3. If X already has a **different** `User` row (from a past
   `/api/challenge/register`): merge — move sessions / entitlements onto the
   canonical user, delete the empty duplicate, dedupe entitlements by
   `shopifyOrderId`.
4. Any `LockscreenTenant` whose `contactEmail == X` and `accountId` is null:
   offer to link ("we found a Lockscreens subscription for this email").
5. Set the `AuthSession` cookie; keep `kf_uid` in sync during rollout so any
   code still reading it keeps working.

## Surfaces

- `/account` — new. Signed-out: sign in. Signed-in: Readiness Score history
  (moves the current `/dashboard` view here), linked Lockscreens subscriptions
  with a direct link into each admin, a "Security" tab (passkeys, 2FA, active
  sessions, sign out everywhere).
- `/account/sign-in` — email → code → done. `…/verify?token=` handles the
  magic link.
- `/dashboard` — 301 to `/account` (old URL stays alive).
- Lockscreens admin (`/lockscreens/{tier}/admin/[adminToken]`) — unchanged via
  token; if signed in and linked, shows a "signed in as X" bar.
- Free-check results — email wall before the result; result emailed via
  `renderChallengeResultsEmail` and unlocked on-screen.
- Checkout / register / gift-redeem — after payment, a non-blocking "keep your
  access on any device" account prompt.

## Rollout stages

Each is independently shippable and gated + deployed like everything else.

1. **Schema + session core** — models, migration, `lib/auth/` (session
   create / validate / invalidate, `getAccount()` helper). No UI. Safe no-op
   until used.
2. **Email-code sign-in + results email** — `/account/sign-in` flow,
   `LoginCode`, rate limiting, wire `renderChallengeResultsEmail` into free-check
   completion, `/account` shell showing "signed in as X".
3. **Claim / merge existing data** — the merge logic above, wired into sign-in;
   `/dashboard` → `/account`; move the results view.
4. **Lockscreens linking** — `LockscreenTenant.accountId`, "link this
   subscription" flow, `/account` lists subscriptions, admin pages show the
   signed-in bar.
   — **stages 1–4 = the "one login" + email-gated-results outcome.**
5. **Passkeys** — `@simplewebauthn`, register / authenticate, "Add a passkey".
6. **TOTP 2FA** — optional enrolment + challenge.
7. **(later) CoMaSy** — per-user accounts + org roles on the same session layer.

## Decision on open question #1

Ship stages **1–4 first** (the outcome Tichi asked for, plus the revenue-relevant
results email), then **5 (passkeys)** as an immediate fast-follow, then **6
(TOTP)**. Passkeys and 2FA are security hardening that matter but do not block
the customer journey — fast-follow, not deferred.

## Decision on open question #2 (settled by Tichi)

Free Challenge play is **not** gated at the start, but the **result is** — email
required to receive/see it. Full challenge stays entitlement-gated. Accounts are
otherwise opt-in.
