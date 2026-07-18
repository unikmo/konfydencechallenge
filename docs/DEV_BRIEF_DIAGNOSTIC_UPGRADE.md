# Konfydence Developer Brief — Diagnostic Upgrade + Consumer Positioning

**Precedence note (read first):** This document is a targeted revision on
top of `docs/PRODUCT_SPEC_V1.md`, not a full replacement. Where the two
conflict, **this document wins**. It conflicts with and overrides these
specific parts of `PRODUCT_SPEC_V1.md`:

- §6 (Scoring system) — free diagnostic changes from 5 questions/max 20 to
  **10 questions/max 40**, with new band labels and cutoffs (see §2 below).
- §12 (Homepage specification) — hero H1 changes from "Can you spot the
  scam before it works?" to **"Think you can't be scammed?"**, plus new
  subheadline/support line, new deck-section headline, new "How it works"
  steps, new "What your score reveals" section.
- §7 Screen 1 (Deck selection) and §12 deck cards — "Start 5-question
  test" / "5 real-life scenarios" copy is replaced everywhere with
  "10-scenario readiness check" / "free 3-minute challenge" language, and
  deck card copy/CTAs are replaced with the painpoint-based versions below.
- §13 (Pricing specification) and the homepage pricing teaser — copy
  updated to reflect the 10-question free tier; the $4.99/$19.99 price
  points and "5 complete runs" language are unchanged.
- §14 (UX flow) "critical conversion moment" — copy strengthened per §11
  below, same underlying mechanic (unlock full deck after free result).

Everything else in `PRODUCT_SPEC_V1.md` not listed above still applies as
written — this is an upgrade to the free-tier/positioning layer, not a
redesign of the full-deck gameplay, HACK privacy rule, certificate, or
scoring mechanics for the paid 50-question deck.

**Sequencing**: per §18 below, implement this entire document **before**
auth, Stripe, admin tools, or the company dashboard — this was mid-priority
work already in flight when this brief arrived, and the brief explicitly
asks to finish it first.

---

## Objective

Update Konfydence from a functional scam-readiness game into a sharper
consumer-facing product that addresses the real user painpoint:

> Most people do not think they can be scammed — until pressure, urgency,
> emotion, or authority makes the situation feel real.

The next implementation must strengthen: consumer positioning, free
diagnostic credibility, free-to-paid conversion, marketing-site clarity,
SEO language, frictionless flow into the paid challenge.

---

## 1) Key product decision

**Change free diagnostic from 5 questions to 10 questions.**

The current 5-question diagnostic is too thin to support a meaningful
Konfydence Readiness Score™. It works as a teaser, but not as a credible
"readiness" result.

Update the free diagnostic to:
- 10 real-life scam scenarios
- 3-minute readiness check
- Mini Konfydence Readiness Score™
- Weakest pressure pattern
- Personalized conversion moment

**Reason**: A 10-question diagnostic gives enough variation to identify a
useful pressure pattern without giving away the full 50-question deck. The
free product should feel valuable, not fake.

---

## 2) Updated diagnostic scoring

Each scenario remains scored from 0–4 points.

- Free diagnostic: 10 questions × 4 points = **40 max points**
- Full deck: 50 questions × 4 points = 200 max points (unchanged)

**Free diagnostic KRS bands** (replaces the old 5-question/max-20 table in
`PRODUCT_SPEC_V1.md` §6):

| Score | Band |
|---|---|
| 36–40 | Sharp Spotter |
| 28–35 | Nearly Ready |
| 18–27 | Pressure-Prone |
| 0–17 | Needs Practice |

Avoid harsh language such as "High Risk" or "Easy to Pressure" for the free
tier specifically — use improvement-oriented language instead. (The
full-deck 200-point bands from spec §6 are unchanged and may still use
"High Risk" as their bottom band — that wording rule is for the free tier
only.)

---

## 3) Homepage positioning update

Replace the current hero positioning ("Can you spot the scam before it
works?") with the sharper consumer hook:

> Think you can't be scammed?

This directly addresses the consumer painpoint: overconfidence.

---

## 4) Final homepage hero copy

Use this exact copy:

- **H1**: Think you can't be scammed?
- **Subheadline**: Take the free 3-minute challenge with real-life
  scenarios and get your Konfydence Readiness Score™.
- **Support line**: Most scams work because they don't feel like scams in
  the moment. See how you react to urgency, authority, emotional pressure,
  and risky action moments before they happen in real life.
- **Primary CTA**: Start Free Challenge
- **Secondary CTA**: Explore the 5 Challenges
- **Trust line**: No lectures. No jargon. Just real choices under pressure.

---

## 5) Global copy replacement

Replace all references to "5-question test" / "5 real-life scenarios" /
"5-question diagnostic" with one of:
- 10-scenario readiness check
- 3-minute readiness check
- free 3-minute challenge
- 10 real-life scenarios

Preferred public phrase: **Free 3-minute challenge**
Preferred explanatory phrase: **10 real-life scenarios**

---

## 6) Homepage section order

Header → Hero → Choose your challenge → How it works → What your score
reveals → The 5 challenge decks → Pricing preview → For schools and teams →
Certificate proof → FAQ teaser → Final CTA → Footer

---

## 7) Challenge deck section

Change the deck-section headline to: **"Where could pressure catch you?"**

Each deck card gets a painpoint-based description and CTA:

| Deck | Description | CTA |
|---|---|---|
| Family | Money requests, elder scams, child accounts, shared devices, and emotional pressure. | Start Family Test |
| University | Housing scams, fake jobs, tuition pressure, identity risks, campus messages, and travel traps. | Start University Test |
| TravelSafe | Flights, hotels, taxis, WiFi, SIM cards, refunds, rentals, and tourist traps. | Start TravelSafe Test |
| Workplace | Phishing, fake invoices, payroll changes, executive pressure, AI voice scams, and data requests. | Start Workplace Test |
| School | Gaming pressure, fake links, group chats, account takeovers, and risky sharing. | Start School Test |

---

## 8) Updated "How it works" section

**Headline**: How Konfydence works

1. **Choose your challenge** — Pick the situation that fits your life:
   family, school, university, travel, or workplace.
2. **Face 10 real-life scenarios** — Make decisions under the same
   pressure scammers use in real life.
3. **Get your Konfydence Readiness Score™** — See your score, your
   weakest pressure pattern, and what to practice next.
4. **Unlock the full challenge** — Upgrade to the 50-scenario deck for the
   full KRS dashboard and certificate.

---

## 9) Score explanation section

**Headline**: What your score reveals

**Copy**: Your Konfydence Readiness Score™ is not just about right or
wrong answers. It shows how you react when a scam uses urgency, authority,
emotional connection, or a risky action moment.

**Cards**:
- Your score — How ready you are in real-life scam moments.
- Your weakest pressure pattern — The type of pressure most likely to make
  you act too fast.
- Your safer-action habits — What you already do well and what to
  practice next.

**Important**: Do not reveal HACK labels during gameplay. Pressure-pattern
analysis appears only after completion. (Same rule as spec §2/§13 — see
§13 below, unchanged, restated here for emphasis.)

---

## 10) Pricing copy update

Update the pricing page to reflect the 10-question diagnostic. Price
points ($0 / $4.99 / $19.99 / Custom) are unchanged from spec §13.

**Free Readiness Check — $0**
- 10 real-life scam scenarios
- Mini Konfydence Readiness Score™
- Weakest pressure pattern
- Personalized feedback
- CTA: Start Free Challenge

**Full Challenge — $4.99**
- One full 50-scenario challenge
- 5 complete runs
- Full KRS dashboard
- Certificate
- Weakness recommendation
- CTA: Unlock One Challenge
- Wording rule (unchanged from spec §13): say "Includes 5 complete runs of
  this challenge." Never say "one play only."

**Complete Scam-Readiness Pack — $19.99**
- All 5 challenge decks
- 250 real-life scenarios
- Full dashboards
- Certificates
- Best value
- CTA: Get All 5 Challenges

**Schools & Teams — Custom**
- For classrooms, workplaces, onboarding, compliance training, and
  workshops.
- CTA: Contact Us

---

## 11) Diagnostic dashboard conversion card

After a free 10-question diagnostic, show a stronger conversion card:

**Headline**: You found your pressure pattern. Now train it.

**Copy**: Your free readiness check shows where pressure could catch you.
The full challenge gives you 50 scenarios, a full KRS dashboard, and a
certificate.

**Show**: Mini KRS score, score band, weakest pressure pattern, best
answer habit, recommended full deck.

**CTAs**: Unlock Full Challenge — $4.99 / Get All 5 Challenges — $19.99

---

## 12) Full dashboard requirements

For full 50-question sessions, show: full KRS score, KRS band, best
category, weakest trigger, recommended training focus, certificate CTA,
replay CTA, next deck CTA. Keep existing certificate logic. (Unchanged
from spec §8.)

---

## 13) HACK privacy rule (non-negotiable, unchanged from spec)

During gameplay: do not show HACK trigger labels. Do not show Hurry,
Authority, Connection, Kill-Switch, or Critical Action Moment on question
screens or feedback screens. Only reveal pressure-pattern analysis on the
results/dashboard screen. Public-facing label for K remains "Critical
Action Moment," never "Kill-Switch."

---

## 14) Certificate behavior (unchanged — keep current implementation)

- Title: Konfydence Readiness Certified
- Required fields: Name, Deck, Score, KRS band, Date, Certificate ID
- Certificate ID format example: `KRS-WORK-2026-794861`
- Workplace button: Download Compliance Certificate
- Other decks: Download Certificate
- Keep: Share, Add to LinkedIn

---

## 15) SEO update

- Homepage title: `Konfydence | Scam Readiness Game & Online Scam Training`
- Homepage meta description: `Take a free 3-minute scam-readiness challenge
  with real-life scenarios, get your Konfydence Readiness Score, and learn
  which pressure tricks could catch you.`
- Homepage H1: Think you can't be scammed?
- Important SEO phrases to include naturally: scam readiness, online scam
  training, real-life scam scenarios, scam prevention game, phishing
  awareness, family scam prevention, student scam awareness, travel scam
  prevention, workplace scam training.

---

## 16) Legal / trust language

Add or preserve footer disclaimer:

> Konfydence is an educational scam-readiness game. It does not guarantee
> protection from fraud or financial loss.

**Avoid these claims**: scam-proof, guaranteed protection, prevents fraud,
certified fraud expert, compliance guaranteed.

**Use these terms instead**: readiness, awareness, practice, training,
simulated scenarios, pressure patterns.

---

## 17) Acceptance criteria

This implementation is complete only when:

- [ ] Free diagnostic uses 10 questions, not 5
- [ ] Free diagnostic max score is 40
- [ ] Free diagnostic score bands are updated (§2 table above)
- [ ] All 5-question copy is removed or replaced
- [ ] Homepage hero uses "Think you can't be scammed?"
- [ ] Homepage clearly explains the painpoint of overconfidence under
      pressure
- [ ] Deck cards use painpoint-based descriptions (§7 table above)
- [ ] Pricing page reflects 10 real-life scam scenarios for the free tier
- [ ] Diagnostic dashboard conversion card reflects the 10-question
      readiness check
- [ ] HACK labels remain hidden during gameplay
- [ ] Pressure-pattern analysis appears only after completion
- [ ] Certificate remains working
- [ ] SEO metadata is updated
- [ ] No physical-card language appears anywhere
- [ ] No fake payment/account claims are introduced

---

## 18) Final developer instruction

Implement this positioning and diagnostic upgrade **before** moving to
Stripe, auth, admin tools, or company dashboards. The priority is to make
the consumer-facing product feel credible, painpoint-sharp, SEO-aligned,
and conversion-ready. Increase the free diagnostic from 5 to 10 scenarios,
update scoring and copy accordingly, and replace the homepage positioning
with the "Think you can't be scammed?" concept. Preserve the completed
gameplay engine, feedback logic, HACK privacy rule, dashboard, pricing
tiers, and certificate functionality unless changes are explicitly
required above.
