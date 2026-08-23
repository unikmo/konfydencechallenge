# Independent QA and Production Release Gates

Konfydence uses separate build, QA, hardening and live-acceptance controls. The build workflow is not allowed to self-certify the production website.

## Separation of responsibilities

| Control | Purpose | May certify its own build? |
| --- | --- | --- |
| Build / quality gate | Compile, unit-test, lint, type-check and build the application | No |
| Independent QA Agent | Break what builders believe is finished | Independent gate only |
| Production Hardening Agent | Measure performance, SEO, accessibility, security and compliance | Independent gate only |
| Live Acceptance Agent | Verify the exact deployed SHA, production integrations, analytics and customer journeys | Independent gate only |
| Production Monitor | Detect degradation after release | Operational control |

## Independent QA Agent

Mission:

> Break what the builders believe is finished.

### QA matrix

| Area | Tests |
| --- | --- |
| Functional | routes, links, buttons, customer auth, checkout handoff |
| Responsive | phone, tablet, desktop; overflow and touch targets |
| Browsers | Chromium, WebKit/Safari engine, Firefox |
| Navigation | main menu, CoMaSy entry, internal links, browser back behaviour |
| Forms | empty, valid structure, invalid email, unusual/long input |
| Integrations | database, CoMaSy CRM write, Resend delivery probe, Shopify, analytics; Stripe reported separately when not the active provider |
| Content | missing titles, broken images, broken CSS background assets |
| Animation | reduced-motion preference |
| Accessibility | axe serious/critical findings, heading structure, labels and browser keyboard semantics |
| Errors | 404, browser console/page errors, API failure states |
| State | loading/error checkout state, unauthenticated dashboard state, form validation state |

### Severity gate

A release fails independent QA if there is **any Critical or High severity defect**.

Medium and Low defects remain measurable and visible, but do not by themselves block the release unless they are explicitly upgraded.

### Defect lifecycle

Every QA defect follows:

```text
DISCOVERED
   ↓
REPRODUCED
   ↓
FIXED
   ↓
RETESTED
   ↓
CLOSED
```

Never:

```text
FIXED → CLOSED
```

The repository enforces this with `qa-defect-lifecycle.yml`: a QA issue closed without `qa:retested` is reopened automatically. The build team may apply `qa:fixed`; only a later successful Independent QA run moves the issue through `qa:retested` and closes it.

## Step 9 — Production Hardening

The production hardening gate asks:

> Can this safely and efficiently survive real users?

### Five production gates

| Gate | Measured checks |
| --- | --- |
| Performance | Lighthouse performance, lab LCP, CLS, TBT, direct video asset size, production static asset delivery |
| SEO | page titles, descriptions, canonicals, sitemap, robots, internal route availability |
| Accessibility | Lighthouse accessibility plus independent axe/browser checks |
| Security | production dependency audit, CSP, HSTS, content-type protection, referrer policy, permissions policy |
| Compliance | privacy, cookie policy, terms, imprint, consent behaviour and analytics-before-consent test |

### Mandatory media rule

Directly loaded video sources larger than **2 MB** fail the production performance gate as High severity. Video compression is a production rule, not an optional recommendation.

### Core Web Vitals

The hardening artifact records Lighthouse lab LCP/CLS/TBT. These are not mislabeled as field Core Web Vitals. Real-user CWV requires field telemetry (for example GA4 Web Vitals/CrUX/RUM) after sufficient traffic exists.

### Evidence

Each hardening run uploads:

- raw Lighthouse JSON for homepage, CoMaSy and pilot pages;
- `production-hardening-report.json`;
- `production-hardening-report.md`.

The gate is based on measured output, not visual opinion.

## Step 10 — Deploy → Instrument → Live Acceptance

Delivery pipeline:

```text
LOCAL
  ↓
DEV
  ↓
STAGING / PREVIEW
  ↓
PRODUCTION
```

GitHub/Vercel deployment is the beginning of live acceptance, not the end.

### Infrastructure acceptance

The Live Acceptance Agent verifies:

- exact production commit SHA through `/api/health/comasy`;
- HTTPS availability;
- HTTP → HTTPS redirect;
- DNS resolution;
- CDN/static asset delivery and cache headers;
- protected production integration probes.

Environment secrets remain server-side. QA integration diagnostics are accessible only with a signed GitHub Actions OIDC token bound to this exact repository identity and main branch.

### Analytics instrumentation

Production analytics is consent-aware. Google Analytics is not loaded until explicit analytics consent is granted.

Instrumented events include:

- page views through GA configuration after consent;
- acquisition/landing attribution;
- CTA clicks;
- CoMaSy pilot CTA clicks;
- challenge CTA clicks;
- form start;
- form submit;
- form abandonment;
- challenge funnel events;
- `begin_checkout` for commerce;
- report-export clicks.

### Lead-generation live journey

The automated production journey validates:

```text
Landing page
→ CoMaSy CTA
→ pilot page
→ form validation
→ CRM database write probe
→ attribution activity write
→ Resend test delivery
→ analytics instrumentation
```

The integration probe creates only synthetic QA records and removes them in the same run.

### Commerce live journey

Automated acceptance validates:

```text
Products
→ purchase CTA / cart-create API
→ Shopify Storefront API
→ HTTPS checkout URL
→ analytics begin_checkout
```

Automated QA **does not charge a real payment instrument**. A full payment → order → confirmation test must use a designated Shopify test order before a major commerce launch. The system reports this as an explicit manual-required item rather than manufacturing a pass.

Stripe is not treated as a required integration while the active checkout path is Shopify. If Stripe is later activated, the integration probe can validate it.

## Production monitoring

A scheduled production monitor runs every six hours and checks:

- homepage, CoMaSy, products and backend health uptime;
- response-time degradation;
- pilot validation failure path;
- checkout validation failure path;
- browser console/page errors;
- broken image assets;
- database, CRM, email, analytics and Shopify integration health.

A failure opens or updates a `production:incident` issue. A later successful recheck records recovery before closing the incident.

## Release statuses

A production release should be considered accepted only when the same production SHA has the applicable green controls:

1. **Konfydence Production Quality Gate** — builder compile/test gate;
2. **Vercel** — deployment succeeded;
3. **CoMaSy Release E2E** — persisted customer/report/practice happy path;
4. **Independent QA Gate** — zero Critical/High adversarial defects;
5. **Production Hardening Gate** — zero Critical/High performance/SEO/accessibility/security/compliance defects;
6. **Live Acceptance Gate** — infrastructure, required integrations, analytics and live customer journeys passed.

A green builder gate alone is never website certification.
