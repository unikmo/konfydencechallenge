# Konfydence UX & Product Specification v1.0

Single source of truth before another line of code is written.

This is the canonical spec referenced throughout `HANDOFF.md`. Where this
document conflicts with `README.md`, `docs/BUILD_BRIEF.md`, or
`docs/PRODUCT_ARCHITECTURE.md`, this document wins — those files were
only partially updated to match it during the initial claude.ai build
session.

## 0) Executive verdict

Current site must be rebuilt around the online challenge. It still sells a
physical/family kit and uses language like "physical, social card system,"
"Get Your Family Kit," and "$49," which conflicts with the new online-only
model.

The product is now stronger than the website. The attached gameplay
direction is excellent: scenario → answer → feedback → dashboard →
certificate.

Best positioning:

> The Duolingo of Scam Readiness.

Main product promise:

> Play real scam scenarios. Discover your pressure weaknesses. Build your
> Konfydence Readiness Score™.

Do not overcomplicate V1. No physical cards, no lectures, no "cybersecurity
training" heaviness, no unnecessary corporate jargon.

## 1) Current website diagnosis

What must be deleted or replaced:

| Current issue | Why it fails | Exact action |
|---|---|---|
| "Get Your Family Kit" CTA | Wrong product model | Replace with Start Free Challenge |
| "Latest Products" physical kit framing | Outdated | Delete |
| "Shop" navigation | Implies physical store | Replace with Pricing |
| "Products" navigation | Too vague | Replace with Challenges |
| "Scenario Lab" | Sounds B2B/tooling, not consumer-friendly | Rename to For Work or Team Training |
| "Resource Hub" | Secondary | Move to footer |
| "Education" | Too broad | Split into Schools and Universities if needed |
| "Konfydence begins as a physical, social card system" | Directly contradicts online-only | Delete entirely |
| "For just $49" | Wrong pricing | Replace with new pricing model |
| "CoMasi" on Scenario Lab | Brand inconsistency | Replace with Konfydence or delete |
| NIS2/ISO badges on general homepage | Too corporate for consumer | Move to Workplace / Company page only |

Current site is also internally mixed: homepage targets families, students,
and teams at once, while products still refer to family kits and physical
card systems.

## 2) Design principles — non-negotiable

These guide every screen.

- Challenge before teaching — Users learn through decisions, not lectures.
- One decision at a time — One scenario, four choices, one click.
- Explain after commitment — Feedback only appears after the user chooses.
- Encourage, don't shame — Even 0-point answers should motivate improvement.
- HACK stays behind the scenes during play — Show HACK analysis mainly in dashboard/report.
- Every interaction reduces friction — No unnecessary account creation before free challenge.
- Premium, calm, authoritative — Not childish. Not corporate. Not noisy.
- Dashboard is the product moat — The game is fun; the dashboard makes it valuable.
- Every deck must feel niche-native — School must feel like school. TravelSafe must feel like travel. Workplace must feel like work.
- No physical-card language — Online-only from homepage to checkout.

## 3) Product vision

Mission: Konfydence helps people recognize manipulation before pressure
turns into a bad click, payment, reply, or disclosure.

Positioning: The Duolingo of Scam Readiness. But do not overuse it
everywhere — use it as internal positioning and selective marketing copy.

Public-facing one-liner: Play real-life scam scenarios. Discover your
pressure weaknesses. Build your Konfydence Readiness Score™.

Core value proposition:

| Audience | They want | Konfydence gives them |
|---|---|---|
| Consumers | "Can I spot scams before I fall for them?" | Fast diagnostic + practical training |
| Families | "How do we talk about scams without nagging?" | Shared game + family risk conversation |
| Students | "What scams target my daily life?" | Housing, jobs, tuition, campus, social pressure scenarios |
| Travellers | "What can go wrong before/during travel?" | Flights, refunds, taxis, hotels, WiFi, documents |
| Employees | "How do I avoid being the weak link?" | Workplace pressure simulation + certificate |
| Companies | "Where is our human risk?" | Completion, weak triggers, team reports, certificates |

## 4) Final product architecture

Konfydence has 5 distinct online decks:

| Deck | Public name | Core promise |
|---|---|---|
| School | School Scam Challenge | Spot manipulation, fake links, risky messages, pressure, and unsafe digital choices. |
| University | University Scam Challenge | Train against housing, jobs, tuition, campus, travel, identity, and money scams. |
| Family | Family Scam Challenge | Help families talk about scams, requests, devices, elder protection, and money pressure. |
| TravelSafe | TravelSafe Scam Challenge | Avoid travel scams around flights, hotels, refunds, taxis, WiFi, SIMs, rentals, and tourist traps. |
| Workplace | Workplace Scam Challenge | Practice phishing, fake invoices, executive pressure, AI voice scams, data requests, and payment fraud. |

Workbook/content status: 260 total cards, 5 decks, 52 cards per deck.
Each deck contains 50 scenario Q&A cards + 2 online wild/recap cards. "Why"
fields are unique across all 260 rows. HACK distribution is intentionally
uneven per niche (confirmed by the user in chat, not a data quality issue) —
the only applied rule is a minimum of 5 scored cards per trigger per deck.

## 5) HACK framework

Internal behavioral engine:

| Letter | Name | Meaning | Example scam pressure |
|---|---|---|---|
| H | Hurry | Urgency, deadlines, panic, "act now" | "Your flight refund expires today." |
| A | Authority | Fake official, boss, bank, teacher, airline, parent, platform | "This is from IT/security/payroll." |
| C | Connection | Trust, friendship, family, romance, familiar channels | "It's me, I lost my phone." |
| K | Kill-Switch | The moment you override doubt and act | clicking, paying, sharing code, downloading, replying |

Important wording: Do not make "Kill-Switch" sound like hacking jargon
on consumer screens.

- Public dashboard label: K — Critical Action Moment
- Internal/admin label: Kill-Switch

This keeps the framework ownable without confusing normal users.

## 6) Scoring system

Full deck: 50 scored scenarios, max 4 per question, max score 200.
Free diagnostic: 5 questions, max 4 per question, max score 20.

Score name: Replace "Scam Readiness Score" with Konfydence Readiness
Score™. Short form: KRS.

Full KRS bands (50-question deck, max 200):

| Score | Label | Meaning |
|---|---|---|
| 180–200 | Scam-Strong | Excellent instincts. You spot pressure quickly and choose safe channels. |
| 140–179 | On Track | Good awareness. Keep practicing to avoid risky shortcuts. |
| 100–139 | Needs Practice | You understand some risks, but pressure can still pull you into unsafe actions. |
| 0–99 | High Risk | Scammers could pressure you into clicking, paying, replying, or sharing information. |

Free 5-question score bands (max 20):

| Score | Label | Sales message |
|---|---|---|
| 18–20 | Sharp Spotter | Strong start. Now test whether you stay sharp across the full challenge. |
| 14–17 | Almost Safe | You spotted some risks but missed key pressure signals. |
| 9–13 | Easy to Pressure | Scammers rely on exactly these hesitation moments. |
| 0–8 | High Risk | You need pattern training before real pressure hits. |

## 7) Gameplay UX specification

V1 game loop:

```
Choose challenge
↓
Choose free test or full deck
↓
Scenario screen
↓
Player chooses A/B/C/D
↓
Feedback screen
↓
Next question
↓
Final score
↓
Dashboard insight
↓
Certificate
↓
Upgrade/share/replay
```

### Screen 1 — Deck selection

Title: Choose your challenge.

Subtitle: Start with 5 real-life scenarios. See what pressure patterns could
catch you.

Each deck card should show: icon, short promise, "Start 5-question test",
"Full challenge available".

CTA: Start Free Challenge

### Screen 2 — Scenario card

Use the dark navy/gold visual direction from the reference mockups.

| Element | Rule |
|---|---|
| Deck name | Top center |
| Question count | "Question 12 of 50" |
| Progress bar | Gold segments |
| Scenario title | Short, specific |
| Scenario mockup | Email/chat/payment/booking/card visual |
| Question | "What should you do?" |
| Answers | A/B/C/D |
| CTA behavior | Answer click immediately locks and reveals feedback |

Do not show on this screen: HACK trigger, full explanation, score
theory, dashboard hint, long teaching text.

### Screen 3 — Feedback card

Keep the structure from the reference mockups.

- **0 points** — "Risky choice." / 0 points / "Scammers count on urgency,
  trust, or fear to make you act before verifying." / WHY THIS MATTERS
  [specific why from card] / SAFER OPTIONS [safe option(s)] / button: Next
  Question
- **1 point** — "Still risky." / 1 point / "You noticed something, but the
  action still leaves you exposed." / WHY THIS MATTERS [specific why] / SAFER
  OPTION [best safe option]
- **2–3 points** — "Close — but not safest." / 2–3 points / "This might work,
  but it still leaves room for impersonation, pressure, or a risky shortcut."
  / WHY THIS MATTERS [specific why] / SAFER OPTION [best safe option]
- **4 points** — "Good call." / 4 points / "You chose the safest option and
  avoided the pressure trap." / WHY THIS MATTERS [specific why]

### Screen 4 — Explanation & takeaway

Use only after certain questions, or after every 5 questions. Do not
over-teach after every single answer.

Title: Key Takeaway

Sections: KEY TAKEAWAY [one sentence] / SCAM TYPE [Phishing / impersonation
/ fake payment / data request / social pressure] / HACK REALITY [one
sentence explaining the pressure pattern] / PRO TIP [specific pro tip]

Button: Continue

## 8) Dashboard specification

The dashboard is the product moat. It turns a game into a diagnostic.

Consumer dashboard main components: KRS score (overall readiness), HACK
breakdown (where user is vulnerable), best category (positive
reinforcement), weakest trigger (clear next training recommendation),
progress (completed/total), recent performance (trend line), certificate
(download/share), recommended next deck (upgrade path).

Main dashboard copy:

```
Your Konfydence Readiness Score™
152 / 200
Scammers evolve. You stay ready.
```

HACK breakdown example:

```
Hurry: 31 / 50
Authority: 46 / 50
Connection: 49 / 50
Critical Action Moment: 26 / 50
```

Note: these example numbers assume equal 50-question exposure per trigger,
which the real content does NOT have (see §5 / HANDOFF.md §2.3). Show each
bar as % of that trigger's own available points, not out of a uniform 50.

Interpretation card:

```
Your weakest pressure pattern: Hurry
You are most vulnerable when a message creates urgency, deadlines, or fear
of missing out.
Recommendation: Practice 5 more Hurry scenarios.
```

Button: Train this weakness

## 9) Certificate specification

Certificate title: Konfydence Readiness Certified

Certificate fields:

| Field | Example |
|---|---|
| Name | Alex Johnson |
| Deck | TravelSafe Challenge |
| Score | 152 / 200 |
| KRS band | On Track |
| Date | 13 Jun 2026 |
| Certificate ID | KRS-TRAVEL-2026-000124 |

Certificate copy:

> This certifies that Alex Johnson completed the TravelSafe Challenge and
> demonstrated practical scam-readiness skills under real-life pressure
> scenarios.

Share CTAs: Download Certificate / Share Certificate / Add to LinkedIn

Edition-specific download button copy:

- School/University: "Download Completion Certificate"
- Workplace: "Download Compliance Certificate"

Certificates are completion-based, not score-gated (no minimum-KRS
threshold specified for issuance).

## 10) Company dashboard specification

Audience: HR, compliance, cybersecurity, school/university admin, team
leads.

Company dashboard modules: Completion (employees invited/started/
completed), average KRS (overall readiness), weakest HACK trigger (main
pressure vulnerability), department comparison (Sales vs Finance vs HR vs
IT), high-risk group (users/departments below threshold), certificates
(completed users), export reports (CSV/PDF), training recommendations
(which micro-challenge next).

Company dashboard language: Avoid "your employees are weak." Use "Your
team's highest pressure exposure is Hurry," not "Your team is bad at
urgency scams."

Company score bands:

| Score | Label |
|---|---|
| 180–200 | Strong human layer |
| 140–179 | Improving readiness |
| 100–139 | Needs targeted reinforcement |
| 0–99 | High exposure |

## 11) Website IA — new structure

Replace current navigation:

Current: Home, Products, Scenario Lab, Education, Resource Hub, Shop, Blog,
About, Contact, Login, Shop Now

Replace with: Challenges, For Teams, Schools, Pricing, FAQ, Login, Start
Free Challenge

Recommended sitemap:

```
/                       Homepage
/challenges             All 5 decks
/challenge/school       School deck landing page
/challenge/university   University deck landing page
/challenge/family       Family deck landing page
/challenge/travelsafe   TravelSafe deck landing page
/challenge/workplace    Workplace deck landing page
/free-scam-test         Free 5-question challenge
/pricing                Consumer + unlimited + team pricing
/for-teams              Company portal
/schools                Schools and classrooms
/universities           University orientation / student safety
/dashboard              User dashboard after login
/certificate            Certificate view/share
/faq                    Friction removal
/blog                   SEO support
/contact                Support/sales
/legal/privacy
/legal/terms
/legal/imprint
```

## 12) Homepage specification

Goal: Get visitors into the free challenge within 5 seconds.

Section order: Header, Hero, Choose your challenge, How it works, What
your dashboard reveals, 5 decks, Pricing teaser, For teams/schools,
Certificate proof, FAQ teaser, Final CTA, Footer.

Hero — delete current hero ("Outsmart Scams. Build Real Confidence.").
Replace with:

> Can you spot the scam before it works?

Subheadline:

> Play 5 real-life scenarios. Get your Konfydence Readiness Score™. See
> which pressure tricks could catch you.

Primary CTA: Start Free Challenge
Secondary CTA: Explore the 5 Challenges
Trust line: No lectures. No jargon. Just real choices under pressure.

Choose your challenge section — Title: "Choose your world." Subtitle:
"Every deck is built around the scams, pressure moments, and decisions that
matter in that niche."

| Deck | Card copy | CTA |
|---|---|---|
| School | Fake links, gaming pressure, group chats, accounts, risky sharing. | Try School |
| University | Housing, jobs, tuition, campus, identity, travel, money requests. | Try University |
| Family | Money requests, elder scams, child accounts, shared devices, family pressure. | Try Family |
| TravelSafe | Flights, refunds, hotels, taxis, WiFi, SIMs, rentals, tourist traps. | Try TravelSafe |
| Workplace | Phishing, invoices, payroll, executive pressure, AI voice, data requests. | Try Workplace |

How it works: 1. Pick a challenge · 2. Answer 5 real-life scenarios ·
3. Get your KRS score · 4. See your weakest pressure pattern · 5. Unlock the
full deck

Dashboard reveal section — Title: "The score is only the start."
Subtitle: "Your dashboard shows how scammers are most likely to pressure
you — urgency, authority, connection, or the critical action moment."

Cards: Your Konfydence Readiness Score™, HACK pressure breakdown, Weakest
trigger, Best category, Certificate, Recommended next challenge.

Pricing teaser — "Start free. Upgrade only when you want the full
challenge."

| Plan | Price | Includes |
|---|---:|---|
| Free Test | €0 | 5-question diagnostic |
| Single Edition | $4.99 | One full 50-question deck, replay up to 5 times |
| Unlimited | $19.99 | All 5 decks, dashboards, certificates |
| Teams/Schools | Custom | Admin dashboard, reports, certificates |

## 13) Pricing specification

| Product | Price | Rule |
|---|---:|---|
| Free 5-question test | €0 | No payment |
| Single deck | $4.99 | 50 questions, 5 replays |
| Unlimited access | $19.99 | All 5 decks, dashboard, certificates |
| Bundle upgrade | $15 credit logic | If user paid $4.99, upgrade to Unlimited for $15 |

Important wording: Do not say "One play only." Say "Includes 5 complete
runs of this challenge." This gives value without making unlimited
unnecessary.

## 14) UX flow — exact visitor journey

```
Homepage
↓
Start Free Challenge
↓
Choose deck
↓
5-question test
↓
Free KRS score /20
↓
Weakest pressure pattern
↓
Unlock full challenge
↓
Checkout
↓
Full 50-question deck
↓
KRS /200
↓
Dashboard
↓
Certificate
↓
Upgrade to Unlimited
```

Critical conversion moment — after the free score, show:

```
Your weakest pressure pattern: Authority
You were most at risk when a message looked official or came from
someone in charge.
Unlock the full [deck] challenge to train this pattern across 50
real-life scenarios.
```

CTA: Unlock Full Challenge — $4.99
Secondary: Get All 5 Challenges — $19.99

## 15) Microcopy library

| Context | Button |
|---|---|
| Homepage hero | Start Free Challenge |
| Deck card | Try This Challenge |
| Free result | Unlock Full Challenge |
| Paid upsell | Get All 5 Challenges |
| Gameplay answer | No separate CTA; click answer |
| Feedback | Next Question |
| Dashboard | Train This Weakness |
| Certificate | Download Certificate |
| Certificate share | Share Certificate |
| Team page | Request Team Demo |
| School page | Request School Pilot |

Empty states: "No challenge completed yet. Start your first 5-question
diagnostic."

Error states: "Something went wrong. Your progress is safe. Try again."

Encouragement after low score: "This is exactly why practice matters.
Scammers win when pressure feels normal. You just made the pattern
visible."

Encouragement after high score: "Strong instincts. Now test whether
they hold across the full challenge."

## 16) Visual system

Keep: dark navy background, gold accent, green/orange/red feedback
states, premium dashboard cards, certificate visual, mobile-first gameplay
card layout, clean icon system.

Avoid: childish gamification, cartoon scams, excessive confetti,
corporate stock photography, cluttered dashboards, long educational blocks
during play.

Color system:

| Purpose | Color |
|---|---|
| Background | Deep navy / near-black |
| Primary accent | Gold |
| Safe/success | Green |
| Warning | Amber |
| Risk | Red |
| Text | White / soft grey |
| Borders | Gold or muted blue-grey |

Confirmed actual brand hex values (sampled from the real logo files, not
guessed): primary blue `#035494`, gold accent `#ffb31d`. Use these, not
generic navy/amber placeholders.

Interaction feel:

| Interaction | Behavior |
|---|---|
| Answer select | subtle glow + lock |
| Feedback reveal | smooth vertical transition |
| Score update | small animated count |
| Progress bar | gold fill |
| Dashboard charts | calm, not flashy |
| Certificate | premium, official |

## 17) SEO strategy

Core SEO position: Konfydence should rank for scam awareness training,
phishing simulation game, online safety game, family scam prevention,
student scam awareness, travel scam prevention, and workplace phishing
training.

Homepage SEO:

- Title: Konfydence | Scam Readiness Game & Online Scam Training
- Meta description: Play real-life scam scenarios, get your Konfydence Readiness Score, and train yourself, your family, students, or team to spot scams before pressure hits.
- H1: Can you spot the scam before it works?
- H2s: Choose your challenge / How Konfydence works / What your dashboard reveals / Five scam-readiness decks / Start free, upgrade when ready / For families, schools, universities, travellers, and teams

Deck landing page SEO:

| Page | SEO title |
|---|---|
| /challenge/family | Family Scam Prevention Game \| Konfydence |
| /challenge/school | Online Safety Game for Schools \| Konfydence |
| /challenge/university | Student Scam Awareness Challenge \| Konfydence |
| /challenge/travelsafe | Travel Scam Prevention Challenge \| Konfydence |
| /challenge/workplace | Workplace Phishing & Scam Training Game \| Konfydence |

Blog/resource pages to create: how-to-spot-a-scam-email, travel-scams-to-avoid,
student-housing-scams, fake-invoice-scams, grandparent-scams,
phishing-training-that-works, why-people-click-on-scams.

Schema to add: Organization, WebSite, SoftwareApplication, Product,
FAQPage, Course/EducationalOccupationalProgram (for schools/workplace),
BreadcrumbList.

## 18) Exact delete / replace / add list

Delete: Shop, Shop Now, Get Your Family Kit, Family Scam Survival Kit,
physical card system, physical/social card system, $49 family kit, Latest
Products, "Konfydence begins as a physical...", CoMasi, NIS2/ISO badges
from homepage, "From family tables to corporate firewalls."

Replace: Products→Challenges, Shop→Pricing, Scenario Lab→For Teams,
Education→Schools/Universities, "Outsmart Scams. Build Real Confidence."→
"Can you spot the scam before it works?", "Get Your Family Kit"→"Start Free
Challenge", homepage "Request Demo"→For Teams/Schools only, "Scam Readiness
Score"→"Konfydence Readiness Score™", "Physical cards"→"Online challenge
decks", "Long science explanation"→"5-question diagnostic".

Add: Start Free Challenge, Choose your challenge, KRS dashboard
preview, HACK pressure breakdown, Free 5-question diagnostic, Single
Edition $4.99, Unlimited $19.99, Certificate preview, Deck landing pages,
Pricing page, FAQ page, Team dashboard preview, School/university pilot
page.

## 19) Admin / backend requirements

Admin can manage: Decks (add/edit), Questions (add/edit scenario,
answers, scores, why, pro tip, HACK trigger), Free challenge (choose which
5 questions appear), Pricing (single deck / unlimited), Users (view
purchases and progress), Certificates (issue/revoke/download), Companies
(create organization accounts), Reports (export CSV/PDF), Localization
(future country packs).

Content fields per question: Deck, Question ID, Category, Title,
Scenario, Option A-D, Score A-D, Safe Action, Why This Matters, Pro Tip,
Primary HACK Trigger, Scam Type, Difficulty, Free Test Eligible,
Active/Inactive.

## 20) V1 roadmap

Build now: Online gameplay, 5 decks, free 5-question diagnostic, paid
single deck, unlimited bundle, KRS score, HACK dashboard, certificate,
basic user account, Stripe checkout, admin content manager, deck landing
pages, SEO metadata.

Later: Country packs, monthly scenario drops, AI scam pack,
leaderboard, family mode, classroom mode, company department comparisons,
LinkedIn certificate sharing, team competitions, white-label company
portals, multilingual versions.

## 21) Final build instruction

Do not write another line of code until these are locked: online-only
product model, 5 decks, free 5-question diagnostic, KRS score, HACK
dashboard, $4.99 single deck (5 runs), $19.99 unlimited, certificate, no
physical-card wording, new website IA, SEO landing pages, design system
based on the reference dark navy/gold gameplay mockups.

Final positioning to use:

> Konfydence is an online scam-readiness game that trains people through
> real-life decisions, reveals their pressure weaknesses, and helps them
> build a measurable Konfydence Readiness Score™.

Final homepage headline: Can you spot the scam before it works?

Final CTA: Start Free Challenge
