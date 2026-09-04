# Konfydence

Konfydence is scenario-based scam-readiness training. Instead of asking whether someone knows scams exist, it puts realistic decisions under pressure in front of the player, scores the quality of the next move, and teaches a reusable verification rule immediately after each answer.

## Product model

Konfydence ships five challenge editions:

- **Family** — impersonation, payment requests, shared devices, account access and emotional pressure.
- **School** — gaming, social platforms, fake links, account takeover and peer pressure for ages 12–18.
- **University** — housing, jobs, tuition, identity, international-student and campus impersonation scenarios.
- **Workplace** — invoices, payroll, executive impersonation, phishing and sensitive-data requests.
- **TravelSafe** — flights, refunds, hotels, taxis, QR codes, Wi-Fi, payments, documents and travel pressure.

Each edition has a source bank of **40+ scored scenarios** (added to regularly) balanced across the H.A.C.K. pressure framework:

- **H — Hurry**: urgency, deadlines, scarcity or fear of missing out.
- **A — Authority**: official-looking requests, status, titles, uniforms or institutional pressure.
- **C — Comfort**: familiarity, trust, routine or emotion that lowers scrutiny.
- **K — Kill-Switch**: the critical action moment where the requester pushes a click, payment, credential, approval, share or reply while independent verification is being cut off.

### Session structure

- **Free readiness check:** a short scored run, balanced 2 each across H/A/C/K (internal: 8 cards).
- **Full challenge:** played in short balanced rounds, 3 each across H/A/C/K per round (internal: 12 cards), working through the whole 40+ bank before repeating.
- Round size is game design and is deliberately kept out of product copy — see `scripts/validate-product-claims.cjs`.
- Session generation prioritizes unseen cards while preserving pressure-pattern balance.
- Every scored scenario has exactly three plausible actions with one unique strongest move.
- Results show a Konfydence Readiness Score and a separate H.A.C.K. vulnerability profile so an overall percentage cannot hide a repeatable weak pattern.

## Commercial model

- Free readiness check: **$0**
- Single full challenge: **$6.99**
- All five challenges: **$24.99**
- Shopify handles checkout. Paid access is granted from signed Shopify purchase webhooks and represented by server-side entitlements.

The free result is useful on its own. Paid conversion is based on deeper practice and broader scenario coverage, not on withholding the diagnostic insight needed to understand the result.

## Technology

- **Next.js 16.3.1 Active LTS**
- **React 19.2**
- TypeScript with strict checking
- Prisma 5
- PostgreSQL / Supabase
- Shopify Storefront checkout + signed purchase webhook processing
- Vercel production deployment
- Optional GA4 analytics behind explicit consent

Admin routes are protected by fail-closed Basic Auth through `proxy.ts`. Security headers are configured in `next.config.mjs`.

## Local development

Requirements:

- Node.js 20.9 or newer (Node 22 recommended)
- PostgreSQL/Supabase database
- environment variables based on `.env.example`

```bash
npm ci
npx prisma generate
npm run dev
```

The local app is available at `http://localhost:3000` by default.

## Production quality gates

The repository treats scenario content as production code. Every release to `main` is checked for:

1. locked dependency installation (`npm ci`)
2. production dependency security audit (`npm audit --omit=dev --audit-level=high`)
3. five complete 40-card scenario banks
4. 10/10/10/10 H/A/C/K balance per edition
5. 8 curated diagnostic cards per edition, 2 per pressure dimension
6. exactly three playable choices per scored scenario
7. one unique strongest answer and valid 0–4 scoring
8. duplicate scenario/title protection
9. minimum explanation, rule and category coverage quality
10. canonical **Comfort** source metadata for C-pattern cards
11. public 8/24/40 product-claim consistency
12. unit tests
13. ESLint with zero warnings
14. strict TypeScript
15. a full Next.js production build

Vercel deployment status is checked separately for the same `main` commit before a release is treated as live.

Useful commands:

```bash
npm run audit:scenarios
npm run audit:claims
npm run audit:production
npm test -- --runInBand
npm run lint -- --max-warnings=0
npx tsc --noEmit
npm run build
```

## Scenario source

Canonical source cards live in `data/scenarios/`. The Prisma seed imports these into the database. Do not bypass the source-card quality gate by editing production scenario rows manually without updating the corresponding source file.

The runtime fields use `hackKey` (`H`, `A`, `C`, `K`). C-pattern source metadata must use `hackTrigger: "Comfort"`.

## Important product boundaries

- The readiness score is a training signal, not a guarantee that a person will avoid scams.
- Konfydence teaches safer decision processes; it does not provide legal, financial or cybersecurity incident-response advice.
- Public claims must match the implemented session model. The claim regression gate intentionally blocks stale 50-scenario and four-answer language.

## Production

Primary site: `https://konfydence.com`

Repository: `unikmo/konfydencechallenge`
