# Konfydence Challenge — Handoff to Claude Code

This document exists because the build moved from claude.ai chat to Claude Code.
Read this first — it captures every locked product decision made in the chat
build session, what's already implemented, and what's still open. Treat this
as the source of truth over your own assumptions about the codebase.

Repo root (local): `C:\Users\mbanw\konfydencechallenge`
GitHub: https://github.com/unikmo/konfydencechallenge

---

## 1. What this product is

**Konfydence Challenge** — an online, scenario-based scam-awareness game.
Positioning: "The Duolingo of Scam Readiness." Public one-liner: *"Play real
scam scenarios. Discover your pressure weaknesses. Build your Konfydence
Readiness Score™."*

Full canonical spec: see `docs/PRODUCT_SPEC_V1.md` (the "Konfydence UX &
Product Specification v1.0" doc — pasted in full there). That document
overrides anything older in `docs/BUILD_BRIEF.md` or `README.md` if they
conflict; older docs were partially updated during this session but the v1.0
spec is newer and more authoritative. If you find a contradiction, the v1.0
spec wins.

**Update, later session**: `docs/DEV_BRIEF_DIAGNOSTIC_UPGRADE.md` was added
after the v1.0 spec and **overrides it** on: free diagnostic size (10
questions/max 40, not 5/20), diagnostic KRS bands, homepage hero copy
("Think you can't be scammed?"), deck card copy/CTAs, and pricing-page
free-tier copy. Its own header spells out exactly which spec sections it
replaces. Full-deck (50-question) mechanics, HACK privacy rule, and
certificate behavior are unchanged. Per that doc's own instruction, it was
meant to be implemented before auth/Stripe/admin/company-dashboard work —
check with the user whether that's still done before continuing further
down the priority list in §4 below.

---

## 2. Locked decisions (do not re-litigate these without the user)

### 2.1 Five editions, not four
`school | university | family | travelsafe | workplace`. "Family" was added
late in the process — if you see any 4-edition assumption anywhere, it's
stale.

### 2.2 Deck structure
Each of the 5 editions has exactly:
- **50 scored "Scenario Q&A" cards** (`cardType: "scenario"`, `scored: true`)
- **2 "Online Wild" cards** (`cardType: "wild"`, `scored: false`)

Source of truth for content: `Konfydence_5_Decks_HACK_Min5_Reclassified.xlsx`
(the final, reclassified version — NOT the earlier
`Konfydence_5_Decks_HACK_Triggers_Specific_Why.xlsx`, which had uneven HACK
distribution that was fixed in the reclassified version). Both files were
uploaded to the chat; ask the user to supply the xlsx again if it's not in
the repo — it was used to generate `data/scenarios/*.json` (260 files) but
the source workbook itself was not committed to the repo by the chat session.

Column mapping in the workbook (confirmed correct, not by position):
`Deck, Card ID, Type, Category, Title, Scenario/Question, A, B, C, D,
Safe Action(s), Score A-D, Why, Pro Tip, Primary HACK Trigger, QA Status`.

### 2.3 HACK framework
Independent of `Category`. Every **scored** card has exactly one
`hackKey` ∈ `H | A | C | K`:

| Key | Internal name | Public dashboard label |
|---|---|---|
| H | Hurry | Hurry |
| A | Authority | Authority |
| C | Connection | Connection |
| K | Kill-Switch | **Critical Action Moment** (never show "Kill-Switch" on consumer screens — internal/admin only) |

HACK distribution is **intentionally uneven per niche** (e.g. TravelSafe
skews Authority-heavy, School skews Connection-heavy) — this is real signal
about each niche's dominant pressure pattern, not a data bug. The only rule
applied was a **minimum of 5 scored cards per trigger per deck** (already
satisfied in the reclassified workbook — verified programmatically).

Dashboard implication: HACK bars should be shown as **% of that trigger's
own available points**, not "X/50" uniformly — e.g. if School only has 5
Hurry-tagged cards, max Hurry score is 20, not 200. This has NOT been
implemented in the dashboard yet (dashboard doesn't exist yet — see §4).

### 2.4 Online Wild cards — final decision, do not revisit
- **Not part of V1 solo web gameplay.** Excluded from: free diagnostic, paid
  50-question deck, KRS scoring, HACK dashboard, certificate score, standard
  progress.
- **Not deleted.** Kept in the schema/data with `cardType: "wild"`,
  `scored: false`.
- They belong to a **future** product mode: "Konfydence Live" / "Host Mode"
  (host-led, 2–8 players, Zoom/classroom/workshop, timed answers). Roadmap
  placement: V1.5/V2, not V1.
- **Do not mention Wild cards / multiplayer / host mode anywhere on the V1
  consumer-facing site** (homepage, deck pages, marketing copy).

### 2.5 Scoring model
- **Konfydence Readiness Score (KRS)** — renamed from the old "Scam
  Readiness Score." Short form: KRS.
- Free diagnostic: 5 questions, max 20 points.
- Full deck: 50 scored questions, max 200 points.
- **KRS bands are by raw score, not percent**, and the two tiers (5-question
  vs 50-question) use DIFFERENT band tables — see `lib/scoring/scoringEngine.ts`
  (`computeKRSLevel`). Do not derive one from the other by simple
  proportionality; the spec gives both tables explicitly.
- **Certificates are completion-based, not score-gated** in the v1.0 spec —
  no minimum-KRS threshold to unlock a certificate was specified. The old
  per-edition pass-threshold logic (70%/75%/65%) was removed. If the user
  wants a minimum-score gate later, that's a product decision to confirm
  with them first, not something to silently reintroduce.

### 2.6 Pricing (per v1.0 spec §6, §13)
| Product | Price | Includes |
|---|---:|---|
| Free Test | €0 | 5-question diagnostic |
| Single Edition | $4.99 (or $1/student for School & University specifically) | One full 50-question deck, **5 replay runs included** |
| Unlimited | $19.99 | All 5 decks, dashboards, certificates |

The "5 replay runs" mechanic is **not yet implemented** — there's no
run-counting/entitlement logic in the schema yet. This needs a real design
pass (see §4).

Marketing copy rule: never say "one play only" — say "Includes 5 complete
runs of this challenge."

### 2.7 Brand colors — confirmed from actual logo files, not guessed
- Primary blue: `#035494`
- Gold/amber accent: `#ffb31d`
- Background: deep navy/near-black (kept as `#08111f`, matches the v1.0
  spec's "dark navy background, gold accent" direction)
- Logo files are in `public/brand/LOGO-01.png` through `LOGO-06.png`
  (vertical/horizontal × blue/black/white-transparent variants). Use
  `LOGO-05.png` (horizontal, blue) as the default header lockup — already
  wired into `app/challenge/page.tsx`.
- The live production site (konfydence.com) still has OLD copy/positioning
  (physical "Family Kit," $49, "CoMasi" branding) that the v1.0 spec
  explicitly says to delete. This repo is the rebuild target, not
  konfydence.com's current code.

### 2.8 Structural finding — flat 50-card deck, not 4 sections
The old game engine (built earlier in the chat session, before the real
content existed) assumed every edition had 4 fixed sections (A/B/C/D) with
scenarios grouped by section, shown as "Section A → B → C → D." **This is
wrong for the real content.** The actual data has no section concept at
all — it's a flat pool of 50 scored cards per deck, and the UI should show
flat progress like "Question 12 of 50" (see the reference mockup image,
described in §5).

**Current temporary state**: `lib/challenge/sessionGenerator.ts` routes ALL
scored/active scenarios for an edition through section `"A"` as a single
container (see the `TEMPORARY` comment in that file) purely so gameplay
doesn't return zero cards. Sections B/C/D are always empty. This is a hack
to keep the app functional, not the real design. **The proper fix is a
session-engine redesign** — see §4, this is the top implementation priority.

---

## 3. What's already built and working

- Next.js 14 + TypeScript + Prisma (SQLite) + no-enum schema convention
  (see comment at top of `prisma/schema.prisma`: "avoid enums and Json
  types" — keep following this for V1).
- Prisma schema: `User`, `Scenario` (now with `category`, `cardType`,
  `scored`, `hackKey`, legacy-optional `section`), `ChallengeSession`,
  `ChallengeSessionSection`, `ChallengeSessionSectionCard`,
  `ChallengeAnswerResponse`.
- **All 260 real cards** imported as `data/scenarios/*.json` (250 scored +
  10 wild, across all 5 editions), validated: every scored card has a
  4-point answer and a valid `hackKey`.
- Seed scripts (`prisma/seed.ts`, `scripts/force-seed-scenarios.cjs`) updated
  to carry all new fields through on import.
- Basic gameplay screens exist (`app/challenge/session/[sessionId]/page.tsx`,
  `feedback/page.tsx`, `results/page.tsx`, `certificate/page.tsx`) but were
  built against the old 4-section model — **these need to be reworked** for
  the flat 50-card model and the new feedback-card copy variants from the
  v1.0 spec (§7: 0pt / 1pt / 2-3pt / 4pt variants, distinct wording per tier).
- Landing page (`app/challenge/page.tsx`) shows all 5 editions with the real
  brand colors and logo, matches the v1.0 spec's hero copy ("Can you spot
  the scam before it works?").
- Scoring engine (`lib/scoring/scoringEngine.ts`) has the correct KRS band
  tables for both diagnostic and full-deck modes.

## 4. What's NOT built yet (priority order, roughly)

1. **Session-engine redesign for the flat 50-card model** (§2.8). This
   unblocks everything else. Needs: a `mode` concept (`"diagnostic"` = 5
   cards vs `"full"` = 50 cards), a run-counter for the 5-replay-run
   entitlement, and updated gameplay screens showing "Question X of 50"
   instead of section-based progress.
2. **Free diagnostic → paid unlock flow** (v1.0 spec §14, the exact UX flow
   including the "critical conversion moment" copy after the free score).
3. **HACK + KRS dashboard** (v1.0 spec §8) — doesn't exist yet. Needs the
   per-trigger normalization from §2.3.
4. **Certificate rework** — current certificate page is text-only and uses
   the old "Scam Readiness Certified" title/copy; needs the v1.0 spec's
   exact certificate fields, copy, and edition-specific download button text
   (§9).
5. **Real auth** (registration/login) — currently every player maps to one
   placeholder guest user.
6. **Stripe checkout** for Single Edition / Unlimited pricing tiers — env
   vars are stubbed, nothing wired.
7. **Admin content manager** (v1.0 spec §19) — CRUD for decks/questions,
   user/purchase view, certificate issue/revoke, org accounts, CSV/PDF
   export.
8. **Company dashboard** (v1.0 spec §10) for HR/school/university admins.
9. **Website IA rebuild** (v1.0 spec §11) — new nav, new sitemap
   (`/challenges`, `/for-teams`, `/schools`, `/pricing`, deck landing pages,
   etc.) — this repo currently only has the `/challenge/*` game routes, not
   a full marketing site.
10. **SEO landing pages + blog** (v1.0 spec §17).
11. **Konfydence Live / Host Mode** (uses the Wild cards) — explicitly V1.5/V2,
    not V1. Don't build this yet.

## 5. Reference visual mockups

Two mockup images were shared in chat (not committed to repo — ask the user
to re-share if needed, or check `C:\Users\mbanw\konfydencechallenge\assets`
locally):
- A gameplay flow mockup: scenario card → 4 feedback-state variants (0pt /
  1-2pt / 3-4pt / explanation-takeaway card) → dashboard → certificate, in
  dark navy/gold styling with rounded cards.
- A full homepage mockup matching the v1.0 spec's IA (§11-12): hero, 5 deck
  cards, "how it works" 5-step row, dashboard preview, pricing teaser,
  audience segments, footer.

Both should be treated as the authoritative visual direction. Match spacing,
card radii, color usage (dark navy bg / white cards / gold CTAs / green-amber-red
feedback states) as closely as practical in code.

## 6. Known environment note

Prisma's binary CDN (`binaries.prisma.sh`) was unreachable from the claude.ai
sandbox used to build this, so schema changes were made and validated by
hand/by reading, but `npx prisma generate` / `npx prisma migrate` were never
actually run end-to-end during this session. **Run and verify these
yourself as the first step** — there could be small issues (e.g. a missing
migration for the new `Scenario` fields) that only surface once the client
actually generates.

## 7. Everything delivered in chat, for reference

Two zip packages were built and delivered during the claude.ai session:
1. `konfydencechallenge-4-edition-update.zip` — the initial School/University/
   Workplace/TravelSafe restructuring (before Family was added, before real
   content existed). Superseded by #2 below but harmless if already applied.
2. `konfydencechallenge-5-deck-data-update.zip` — the real 260-card import,
   Family edition, brand colors, KRS scoring rewrite.

Both are bundled alongside this `HANDOFF.md` in the delivery package. Apply
#1 first, then #2, on top of the original cloned repo, in that order, before
starting new work — or if your local repo already has both applied, this
doc alone is enough context to continue.
