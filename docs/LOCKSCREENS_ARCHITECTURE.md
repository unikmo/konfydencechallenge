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

---

## 2. Pricing

| Tier | Price | Notes |
| --- | --- | --- |
| Home | $19.99 year 1 → $14.99 / year renewal | All household devices, all tracks |
| Teen Home | $19.99 year 1 → $14.99 / year renewal | Teen/student content track |
| Schools | $2 / managed computer / year | Apply a minimum (~$150) |
| Workplace | $4 / employee / year | **$300 minimum annual licence** |

Workplace examples: 50 emp → $300 (min) · 200 → $600 · 1,000 → $3,000 · 5,000 → $15,000.

**Workplace licence is per employee, all their devices** (matches CoMaSy, easier sell) — not per device.

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
  seats         Int?                   // per-seat billing basis
  track         String                 // "adult" | "teen"
  branding      Json?                  // { logoUrl, helpdeskPhone }
  authOrgId     String?                // link to CoMaSy-style workspace auth
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
  anchor      DateTime                 // sequence position 0 starts here
  timezone    String   @default("UTC")
  loop        Boolean  @default(true)
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
- Shopify subscriptions: native Shopify Subscriptions vs Recharge vs Stripe Billing for the
  annual renewal (current checkout is one-time cart only).
- Whether B2B ever gets instant self-serve billing or stays quote/PO.
- CDN choice for the asset origin + purge API (Vercel, Cloudflare, Bunny…).
- Teen track content ownership (who writes the ~26/yr teen prompts).
- Naming: "Home / Teen Home / Schools / Workplace" collides with the Challenge editions
  ("Family", "Workplace") and CoMaSy. Consider context names — Personal / Household / School / Team.
