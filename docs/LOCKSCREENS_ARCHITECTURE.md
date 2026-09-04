# Konfydence Lockscreens — Product & Build Architecture

Status: **design agreed, not built.** The `/lockscreens` marketing page is live and routes
all tiers to `/contact`. Nothing below exists in code yet.

---

## 1. What the product is

A **lock-screen reminder service**, not a wallpaper download. The screen keeps
**Pause. Think. Call.** (P.T.A.) in front of the user, with a discreet **H.A.C.K.** cue
(Hurry · Authority · Comfort · Kill-Switch), and the design **rotates on a schedule** so the
wording and the scam patterns stay current.

One content system underneath. **Two delivery engines** on top.

| Customer | Default delivery | Buyer |
| --- | --- | --- |
| Workplace | Managed Deployment Engine (IT / MDM) | Organisation |
| Schools | Managed Deployment Engine (school IT / MDM) | School / district |
| Home | Personal Delivery Engine (Shortcut / app) | Individual |
| Teen Home | Personal Delivery Engine (Shortcut / app) | Parent, for a teen |

**BYOD exception:** personal devices inside a company or school are never treated as managed.
Those users may opt into the Personal Delivery Engine **with individual consent** only.

### Device scope by tier

| Tier | Phones | Computers / laptops | Tablets |
| --- | --- | --- | --- |
| Workplace | **No** — computer-first by design | Yes | Yes (managed) |
| Schools | **No** | Yes | Yes (managed) |
| Home | Yes — **primary surface** | Yes | Yes (iPad — matters for older relatives) |
| Teen Home | Yes — **primary surface** | Optional (gaming PC) | — |

Rationale: the scam decisions that cost **companies** money (invoice fraud, exec-impersonation
payments, phishing links, urgent Teams/Slack messages) happen **at the desk**. Managed company
phones are a messy minority (work-profile Android can't set wallpaper; lots of BYOD). "Keeps the
pause in view on every work computer" is a clean, deliverable promise.
Consumer scam pressure is overwhelmingly **on the phone** (parcel-fee SMS, fake bank text/call,
"family member needs money" messages, marketplace / romance scams).

---

## 2. Pricing

| Tier | Price | Billing basis | Notes |
| --- | --- | --- | --- |
| Home | $19.99 year 1 → $14.99 / year renewal | flat, per household | All household devices, adult track |
| Teen Home | $19.99 year 1 → $14.99 / year renewal | flat, per household | Teen/student track |
| Schools | $2 / **managed computer** / year | per managed computer | Apply a minimum (~$150) |
| Workplace | $4 / **employee** / year | per head | **$300 minimum annual licence** |

Workplace examples: 50 emp → $300 (min) · 200 → $600 · 1,000 → $3,000 · 5,000 → $15,000.

### Why the B2B units differ

- **Workplace = per head.** Matches CoMaSy (a customer buying both reconciles one unit, not two),
  headcount is the number HR already has, and a knowledge worker with laptop + tablet is one
  licence — marginal cost of serving 2 URLs vs 1 is zero.
- **Schools = per managed computer.** Schools licence everything this way (Chromebooks, lab PCs);
  student headcount is fuzzy and lab/library machines are shared.

### Tracking the billing basis

There is **no reliable per-device metering without a managed agent** (a much bigger build and a
bigger ask of IT than "reference a wallpaper URL"). So:

- **Declared count** — the admin sets "licensed heads / computers" in the workspace. That is the
  billing basis.
- **Fetch-log cross-check** — every rendering device hits `/l/{token}/current/{device}.png`.
  Distinct-source counts are fuzzy (NAT hides an office behind one IP) but shown alongside the
  declared number: *"licensed 340 · seen ~310–370 distinct sources this cycle."*
- If declared drifts well below observed for **two consecutive cycles**, flag a true-up
  conversation — never auto-charge on telemetry (creates disputes).
- A device check-in agent can be a later "Pro" option for customers who need exact compliance
  numbers.

### Self-serve count changes

The admin adjusts the **licensed count** (not individual device registrations). The calculator
prorates live for the remainder of the term.

- **Increase** → billed immediately, prorated to renewal → generates an invoice line (B2B) or a
  charge (consumer / self-serve B2B if enabled).
- **Decrease** → takes effect at the next renewal, not mid-term (standard SaaS).

### Auto cost calculator (shown live in the self-serve admin)

```
annual  = base
        + libraryUpgrade      # 27 screens incl · 54 = +X · 60 = +Y
        + cadenceUpgrade      # fortnightly incl · weekly = +Z
        + brandingAddon       # co-branded templates, flat +$/yr
one_off = bespokeScreens * designFee   # fully bespoke custom art
```

- `base` = seats × per-seat rate (or the consumer flat price).
- **Custom sequence / re-ordering is included** once a plan is above base — cheap to allow,
  high perceived value, and it is what makes the price feel like a product.
- **Default path** (27 screens, fortnightly, pre-selected order, no branding) = `base` only,
  zero configuration. Most customers never open the calculator.

### Renewal story

Year 1 includes onboarding + the full prompt set. The renewal keeps the fortnightly updates,
new scam patterns, and continued access. **This only holds if the content pipeline actually
ships new screens.** A wallpaper does not visibly expire, so a stalled pipeline = brutal churn.
The content operation *is* the product commitment.

---

## 3. Content system (shared by both engines)

- **Library of 60 assets.** Each has a `number` (1–60) and belongs to a `track`.
- **Tracks:** `adult`, `teen`. (Teen Home and Schools both use `teen`; do not split into 4.)
- **Formats per asset:** rendered to every device class —
  `iphone`, `ipad`, `android`, `windows`, `macos`, `chromeos`
  (macOS = desktop picture + login-window text, see §6).
- **Templated pipeline, not bespoke art.** The design is text + layout on a fixed system.
  60 designs × ~6 formats ≈ 360 renders up front — only feasible as a script/template job.
  Build the renderer so adding an asset = fill fields → emit all formats.
- **Coverage:** 60 screens ≈ 2.3 years fortnightly / ~1.15 years weekly before repeat.
  Keep adding to the 60 over time; existing plans get a richer library at renewal.

### Design philosophy — one spine, a few treatments

Keep the Konfydence aesthetic: **minimal, calm, light, legible.** A calm screen is the correct
medium for a "pause" reminder — a loud wallpaper manufactures the exact urgency the product
interrupts. The lock screen is not brand marketing: the P.T.A. message dominates, the wordmark
is small. This is also what keeps the renderer economical.

Each asset renders in a small set of **treatment presets** from the *same* template system —
near-zero marginal cost, selected per plan:

| Treatment | Availability | Why |
| --- | --- | --- |
| Light | default | the brand |
| Dark | standard | near-mandatory for phone wallpapers; a bright screen clashes with dark UIs |
| High-contrast / large-type | standard | older relatives, low vision, glare |
| Teen | standard (teen track) | same system, more energy — bolder weight, tighter, a live accent |

`treatment` is a plan-level setting; the resolver serves the plan's treatment for the requested
device. Consumers pick; a fleet is assigned one.

**What is an extra (paid) request:**

- **Co-branded** — customer logo + IT helpdesk number merged into the standard templates.
  Auto-renders all formats. Flat annual add-on. *(High margin — the B2B sweet spot.)*
- **Fully bespoke design language** — "make it look like *our* brand, not Konfydence", custom
  illustration, different typographic voice, motion. Real design hours → per-screen `designFee`,
  enters the tenant's private library.

Rule: **visual treatment = free and standard; design-system change = bespoke and priced.**

### Asset scope

| `scope` | Meaning |
| --- | --- |
| `global` | Part of the shared 1–60 library, visible to every plan |
| `tenant:{id}` | Private to one customer (co-branded or fully bespoke), visible only in their admin |

**Co-branded** = customer logo + IT helpdesk number merged into standard templates. Auto-renders
all formats, near-zero marginal cost, sell as a flat annual add-on. High margin — the sweet spot.

**Fully bespoke** = custom scenario / custom art. Real design hours; all ~6 formats must be
produced or approved. One-off `designFee` per screen (or a pack), then it enters the tenant's
private library.

### Content voice & format (Workplace track)

Every screen follows **Hook → Message → Action**, not a dry instruction:

> ✗ "Check the sender. Verify the domain. Report suspicious emails."
> ✓ "Your CEO needs €8,400. Right now. The strange part? He apparently forgot every approval
>   rule in the company. Pause. Verify outside the message."

**Two densities per screen, same idea** (resolves the "rich vs. glanceable" tension):

| Surface | Density |
| --- | --- |
| Lock / login screen (the moment of transition — arriving, back from a meeting) | Full Hook → Message → Action narrative |
| Desktop wallpaper (behind windows, rarely the focus) | One-line distillation of the same message |

Plus a **"plain mode" treatment** for conservative/regulated customers — same content stripped
to the message line, removes the "is this too jokey for us" sales objection.

**Deliberately varied formats** so employees never know what's next (kills banner-blindness):
mini-mystery, choice, accuracy check, reputation, wellness/attention-break, H.A.C.K. spotting,
P.T.A. reinforcement, physical/device security, data-handling.

**60-screen library = 52 scheduled + 8 flex.** Flex slots replace a normal week for: holiday
scams, tax season, a new scam pattern, a company-specific incident, travel season, AI/deepfake
developments, wellness periods, internal campaigns. Flex is where the "current" value lives —
and the part most likely to slip, so it needs a content owner.

**Strategic mix (indicative, mixed not blocked):** ~25 security/fraud/social-engineering ·
10 accuracy/quality · 8 reputation/client-trust · 5 wellbeing/attention · 5 privacy/data ·
4 physical/device · 3 H.A.C.K./P.T.A. reinforcement.

> **Positioning note:** ~half the screens being non-scam (accuracy, reputation, wellbeing) is a
> deliberate move toward "workplace decision hygiene" / human-risk framing, which is the
> language security-awareness and NIS2 buyers already use. Name this as a choice — keep
> security/fraud the clear plurality so the product doesn't drift.

### Quarterly pulse (Workplace tier — evidence layer)

A lock screen alone produces no evidence, which is exactly what a B2B buyer needs to justify the
spend. Add a **quarterly 5-question pulse** (email link or SSO'd microsite):

- Participation rate + a behavioural-signal trend over the year (pause / verify answers improving?)
- Documents "repeated awareness activity + defined effectiveness evidence" — the NIS2 Article 20
  awareness-training language.
- Bridges to CoMaSy: pulse = the light version, CoMaSy = the deep version. Clean product ladder.
- Needs a delivery + reporting build — scope as a Workplace-tier feature, not core.

### Tracks

`workplace` (the format taxonomy above) · `personal` (Home — shorter, phone-first, calmer) ·
`teen` (Teen Home + Schools — gaming/social/peer-pressure). Three tracks, not four tiers.

---

## 4. The rotating-URL resolver (core backend — build first)

One stateless service. Every engine and pricing tier consumes it.

### URL shape

```
https://cdn.konfydence.com/l/{tenantToken}/current/{deviceClass}.png
```

- `tenantToken` — opaque per-customer key (one DB row). 500 customers = 500 tokens.
  Conceptually one link per customer; ~6 device sub-paths behind it.
- Churned customer → token flips to `expired` → URL serves an "expired" notice screen.

### Resolution (per request, no cron)

```
plan        = lookup(tenantToken)                     # sequence, cadence, anchor, track, timezone
elapsed     = now(plan.timezone) - plan.anchor
index       = floor(elapsed / plan.cadence)
position    = plan.loop ? index % plan.sequence.length
                        : min(index, plan.sequence.length - 1)
assetNumber = plan.sequence[position]
asset       = resolveAsset(assetNumber, plan.track, tenantToken)   # tenant-private wins over global
serve( asset.format[deviceClass] )
```

Stateless: current screen is a pure function of elapsed time. No scheduler, no per-flip job.

### Caching

- `Cache-Control: public, max-age=<fraction of cadence>` (e.g. 6h for fortnightly, 1h for weekly),
  **or** a CDN purge triggered at each computed flip boundary.
- Trade-off: shorter TTL = tighter flips, more origin hits. Fortnightly can afford 6–12h.

### Plan changes

- Default: **apply at next flip** (clean — devices change on schedule, not instantly).
- `applyNow` override for urgent cases (re-anchors the plan to now).

---

## 5. Self-serve admin

Reuse the **CoMaSy customer-workspace auth pattern** (`lib/comasyAuth`, org slug + access code,
server-side tenant isolation).

Workspace shows:

- **Library grid** — global assets available to the plan (27 / 54 / 60) + tenant-private assets.
- **Playlist** — drag to order; length must match the plan's screen count.
- **Cadence** — weekly / fortnightly / monthly (with the MDM-refresh warning, §6).
- **Calendar preview** — "14 Oct → screen #4", "28 Oct → screen #2", …
- **Live status** — "currently showing #2 · next flip in 6 days".
- **Delivery** — the device URLs + copy-paste MDM config snippets (per MDM, §6).
- **Cost calculator** — live total as options change; "request this configuration" action.
- **Branding** — upload logo, set helpdesk number (co-branded add-on).
- **Bespoke request** — submit a brief; becomes a `tenant:{id}` asset once produced.

B2B purchase / renewal still routes through **quote → invoice / PO** at first; the calculator
produces the number, not instant billing. Consumers bill instantly (Shopify, §7).

---

## 6. Managed Deployment Engine (Workplace / Schools)

IT references the rotating URL **once** in an MDM policy. Konfydence rotates the target every
cycle — invisible to IT. That is the entire B2B pitch: *"set it once, we keep it current."*

### Platform capability matrix — communicate honestly

| Platform | Managed lock screen? | Mechanism |
| --- | --- | --- |
| iOS / iPadOS (supervised) | **Yes — real lock screen** | MDM `Wallpaper` command / declarative config |
| iOS / iPadOS (unsupervised) | Limited | Not reliable — recommend Personal engine |
| Windows | **Yes — real lock screen** | Intune `PersonalizationCSP` (LockScreenImage / DesktopImage) |
| ChromeOS | **Yes — real, refreshes well** | Google Admin device wallpaper policy — best fit for weekly |
| Android (fully managed / kiosk) | **Yes** | Android Enterprise / EMM wallpaper policy |
| Android (work profile only) | **No** — cannot touch personal wallpaper | Recommend Personal engine |
| macOS | **Partial** — desktop picture + login-window message, **not** a true lock-screen image | Jamf / Intune config profile (`com.apple.desktop`, `LoginwindowText`) |

Sales copy must say this per platform. Do **not** claim "lock screen on every device".

### Cadence vs MDM refresh

MDM re-applies policy on its own cycle (hours, sometimes on-network only). If a customer wants
**weekly** but their MDM refreshes fortnightly, half the flips never display.
Weekly is honest on **ChromeOS and actively-managed Intune/Jamf fleets**; elsewhere fortnightly
is the real maximum. The admin should warn when weekly is selected.

### Config recipes

Ship a short KB article + snippet per MDM for the **2–3 the first customers actually use**
(likely Intune, Jamf/Jamf School, Google Admin), not all of them.

### Reporting

Lean on the customer's MDM compliance report for "policy applied" coverage. Optionally surface a
rough per-tenant fetch-log dashboard (device classes seen, request volume) for the
compliance/effectiveness-evidence pitch.

---

## 7. Personal Delivery Engine (Home / Teen Home)

Buy → onboarding link → choose device → install once → screens update automatically.
Never a ZIP of 180 files.

- **iOS** — Shortcut with a "Set Wallpaper" action that fetches `.../current/iphone.png` and a
  time-of-day Automation. Caveats: Apple has toggled the wallpaper-set confirmation prompt across
  iOS versions — test on current iOS; the "add shortcut → allow → set automation" flow is a real
  onboarding hurdle → needs an excellent guided walkthrough.
- **Android** — small app: `WallpaperManager` + `WorkManager` periodic fetch. Easy; straightforward
  Play review. Preferred over a Shortcut equivalent.
- **Windows / macOS (personal)** — a login-item / scheduled task that swaps the wallpaper file,
  or simply the fortnightly email with a one-click "set this" download. Desktop matters less than
  the phone lock screen for in-the-moment scam pressure.
- **Native app (iOS + Android)** — cleaner long-term: auto-update, "new screen ready" push,
  device management, store billing (but 15–30% cut vs Shopify). **Plan: Shortcut/app-lite MVP,
  native app later.**

### Fortnightly email drip

- Resend (already configured for CoMaSy pilots) + a Vercel Cron.
- "Your next Konfydence screen is ready" → tokenised one-click download of the current asset for
  the subscriber's chosen device(s).
- Reads the **same plan object** as the resolver — consumers can have a lite custom sequence too
  ("pick your 27" / "shuffle") for near-zero cost.
- Unsubscribe + manage-devices page.

---

## 8. Data model sketch (Prisma)

```prisma
model LockscreenAsset {
  id        String   @id @default(cuid())
  number    Int?                     // 1..60 for global; null for tenant-private
  track     String                   // "adult" | "teen"
  scope     String                   // "global" | "tenant:{lockscreenTenantId}"
  formats   Json                     // { iphone: url, ipad: url, android: url, windows: url, macos: url, chromeos: url }
  status    String   @default("draft") // draft | live | retired
  createdAt DateTime @default(now())
}

model LockscreenTenant {
  id            String   @id @default(cuid())
  kind          String                 // "workplace" | "school" | "home" | "teen"
  name          String
  token         String   @unique       // opaque, in the CDN URL
  tokenStatus   String   @default("active") // active | expired
  licensedCount Int?                   // declared billing basis: heads (workplace) or computers (school)
  observedLow   Int?                   // fetch-log cross-check, updated per cycle
  observedHigh  Int?
  track         String                 // "adult" | "teen"
  branding      Json?                  // { logoUrl, helpdeskPhone } — co-branded add-on
  authOrgId     String?                // link to CoMaSy-style workspace auth
  termStart     DateTime?
  termEnd       DateTime?
  createdAt     DateTime @default(now())
  plan          LockscreenPlan?
}

model LockscreenPlan {
  id          String   @id @default(cuid())
  tenantId    String   @unique
  tenant      LockscreenTenant @relation(fields: [tenantId], references: [id])
  sequence    Int[]                    // ordered asset numbers, length = screenCount
  screenCount Int      @default(27)    // 27 | 54 | 60
  cadence     String   @default("fortnightly") // weekly | fortnightly | monthly
  treatment   String   @default("light")       // light | dark | contrast | teen
  deviceScope String[]                 // which device classes this plan serves
  anchor      DateTime                 // sequence position 0 starts here
  timezone    String   @default("UTC")
  loop        Boolean  @default(true)
  pendingChange Json?                  // staged edit that applies at next flip
  updatedAt   DateTime @updatedAt
}

model LockscreenSubscriber {          // Personal engine only
  id         String   @id @default(cuid())
  email      String   @unique
  tenantId   String                   // their own single-seat tenant
  devices    Json                     // ["iphone", "windows"]
  lastSentAt DateTime?
  status     String   @default("active")
}
```

---

## 9. Build sequencing

1. **Content renderer + 60-asset library** (templated pipeline, both tracks, all formats).
2. **Resolver + CDN URL** (`/l/{token}/current/{device}.png`, stateless, caching).
3. **Tenant + plan model + minting** (create tenant → token → default plan).
4. **Personal engine MVP**: onboarding page (device picker + install steps), Resend + Cron drip,
   Shopify one-time → annual product for Home / Teen Home.
5. **Self-serve admin**: library grid, playlist, cadence, calendar preview, cost calculator.
6. **Managed engine**: MDM KB articles + snippets (Intune, Jamf/Jamf School, Google Admin),
   expired-token screen, optional fetch-log dashboard.
7. **Co-branding** (template field merge) then **bespoke request** flow.
8. **Native app** (later, if consumer volume justifies it).

Steps 1–3 are the shared core and unblock everything else.

---

## 10. Open decisions

- Exact upgrade deltas: X (54 screens), Y (60 screens), Z (weekly cadence), co-brand annual add-on,
  per-bespoke design fee.
- School minimum licence value (~$150?).
- Whether `$14.99` renewal stays or moves closer to `$19.99` (25% off is generous vs. norms).
- Which treatment presets ship at launch (light + dark for sure; contrast + teen + plain from day one?).
- Wellbeing screen count (5 here vs. 8 proposed) — how far to lean into "decision hygiene" vs. stay a scam product.
- Quarterly pulse: build now (Workplace evidence story) or after first customers.
- Weekly cadence: offer it (premium tier) knowing MDM refresh lag makes it unreliable off ChromeOS, or cap Workplace at fortnightly.
- Shopify subscriptions: native Shopify Subscriptions vs Recharge vs Stripe Billing for the
  annual renewal (current checkout is one-time cart only).
- Whether B2B ever gets instant self-serve billing or stays quote/PO.
- CDN choice for the asset origin + purge API (Vercel, Cloudflare, Bunny…).
- Teen track content ownership (who writes the ~26/yr teen prompts).
- Naming: "Home / Teen Home / Schools / Workplace" collides with the Challenge editions
  ("Family", "Workplace") and CoMaSy. Consider context names — Personal / Household / School / Team.
