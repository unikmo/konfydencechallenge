# German (de) scenario content — seeded into production

Wired into `prisma/seed.ts`: every JSON file here is upserted as a `Scenario`
row with `lang: "de"` on every production deploy, the same way
`data/scenarios/` seeds the English (`lang: "en"`) bank.

**All five editions shipped (2026-09-10 → 2026-09-12).** Each is 48 scored
cards (12/12/12/12 H·A·C·K, 2 diagnostic per trigger) + 2 wild cards:

- **`family/`** — `scripts/gen-german-familie-draft.py`. Enkeltrick, "Hallo
  Mama"-Betrug, falsche Polizei, Finanzamt/ELSTER-Phishing, Kleinanzeigen,
  AnyDesk-Fernzugriff, Vignetten-/Maut-Phishing.
- **`school/`** — `scripts/gen-german-school-draft.py`. Discord/Gaming,
  WhatsApp-Klassenchat, IServ/Schulcloud, TikTok/Instagram, Klassenfahrt,
  Deepfakes, LKA-Cybercrime-Impostoren.
- **`university/`** — `scripts/gen-german-university-draft.py`.
  WG-Zimmer-Betrug, BAföG-Phishing, Ausländerbehörde-Impostoren, Hiwi-Jobs,
  Prüfungsamt/Rückmeldung, Fachschaft/Vereinskasse, Studierendenwerk.
- **`travelsafe/`** — `scripts/gen-german-travelsafe-draft.py`.
  Ferienwohnungs-Betrug, ADAC-Impostoren, falsche Grenzpolizei/
  Bundespolizei, Auswärtiges Amt, Zoll, Deutsche Bahn, Geldautomaten-Fallen.
- **`workplace/`** — `scripts/gen-german-workplace-draft.py`. Chef-Betrug
  (CEO-Fraud) mit geänderter Bankverbindung, Deepfake-Stimme/-Video der
  Geschäftsführung, IT-Support-Impostoren, DSGVO-Auskunftsanfragen,
  Lohnbuchhaltung, Wirtschaftsprüfer, OAuth-/Cloud-Admin-Phishing.

Edit the generator script and re-run it rather than hand-editing the JSON —
each script asserts the H/A/C/K/diagnostic counts (12/12/12/12, 2 diagnostic
per trigger) and the 16/16/16 answer-position balance before writing files.

**Voice decisions every deck follows** (approved by Tichi, 2026-09-10/11,
reinforced 2026-09-11 as a standing rule for every future edition —
"language is always native natural in du casual form, never just translate
and miss context"): **"du"** throughout; **"H.A.C.K."** kept untranslated
as a brand term with German trigger glosses (H–Hetze, A–Autorität,
C–Vertrautheit, K–Notbremse); the response framework **P.A.T. → "Anhalten ·
Abklären · Ansprechen"**. Scenarios are **culturally adapted, not
translated** — each deck was invented around German-specific institutions,
apps and scam patterns, not carried over from the English deck's US
context (which is why English titles and German titles rarely match 1:1).

**Answer-position balance:** the first deck (Familie) needed a post-hoc
rebalance; School's first draft was ~47/48 answers in slot B before a fix.
Every deck since University fixes this at write time — the generator
pre-shuffles a target letter (16×A, 16×B, 16×C) per card index before any
content is written, so the correct answer's position is decided before the
scenario text is, not defaulted out of habit.

`id` scheme: `<edition>-de-<code>-NN` (e.g. `family-de-fam-01`,
`workplace-de-wrk-01`) — mirrors the English `<edition>-<code>-NN` pattern,
`-de-` marks the language. `externalId` stays globally unique across
languages since every id is prefixed per language.

A player's session is generated from one language pool at a time
(`generateChallengeSessionPlan(edition, mode, userId, lang)`), so German
and English "seen" history never mix even though they share one
`ChallengeSession.edition` value. Queries that count or list scenarios
across a whole edition (health checks, admin dashboards, play-with-friends)
must filter by `lang` explicitly — several did not by default and had to be
fixed when the German banks were seeded (see `lib/backendHealth.ts`,
`lib/play/room.ts`).

**The full completion flow is now bilingual** (2026-09-12): session play,
results, certificate, and per-question feedback all render in German for a
German session — see `lib/challenge/uiStrings.ts` (session play) and
`lib/challenge/resultStrings.ts` (results/certificate/feedback/the
free-diagnostic email gate). Both translate the fixed vocabulary
`lib/scoring/scoringEngine.ts` generates in English (KRS level names,
H.A.C.K. signal labels, per-dimension coaching insight/practice) via a
lookup keyed by the English value, so the shared, edition-agnostic scoring
engine itself never needs to know about locale.

**The whole German-reachable surface is now bilingual (2026-09-12 audit).**
Per Tichi's instruction "we cannot have geman version with english texts.
fix everything" — every page a German player can reach was swept, not just
the session/results flow:

- The **results email** (`lib/challenge/resultsEmail.ts`) and the
  **login-code email** (`lib/auth/loginEmail.ts`) render fully in German —
  both determine `lang` the same way as the in-browser pages, from the
  session's own scenario rows.
- **Sign-in, the account dashboard, security/passkeys/2FA settings, and the
  post-purchase claim page** (`app/account/**`, `app/challenge/claim`) have
  no `scenario.lang` to peg off, so a German visitor is carried through them
  via an explicit `?lang=de` query parameter — threaded through every
  redirect, hidden form field, and form action from the moment
  `lib/challenge/startHandler.ts` first sends someone to sign in. See
  `lib/challenge/accountStrings.ts` for the string tables and the
  architecture note at its top.
- A real bug was fixed in the same pass: full-mode/round-2 gating redirected
  to `/de/account/sign-in`, a route that doesn't exist — now `/account/sign-in`
  (shared across locales) with `&lang=de`.
- The checkout `success_url` for a German purchase carries `&lang=de` into
  `/challenge/claim` (see `app/api/checkout/create/route.ts`, keyed off the
  same `locale: "de"` the Stripe Checkout session itself uses).

Still genuinely out of scope, not translation gaps: the gift flow stays
USD-only (inline Stripe `price_data`, no `currency_options`); a lawyer's
review of the AGB Widerrufsrecht section before real German consumer sales
(see `app/de/agb/page.tsx`); German marketing/SEO pages beyond the core
funnel (home, challenge, pricing, legal), per Tichi's "focused funnel"
decision; and the Teams tier (`/teams`), which has no German copy at all yet.
