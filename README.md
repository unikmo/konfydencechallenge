# Konfydence Challenge

**Konfydence Challenge** is an online scenario-based decision game that helps users practice safer responses to real-world scams before they happen.

Core rule:

> **Pause → Verify → Ask**

For Workplace mode:

> **Pause → Verify → Report**

## Product Scope

This repository contains the digital platform for:

1. **TravelSafe Challenge**
   - Individual traveler refresher
   - Self-serve paid access
   - Price: **$4.99**

2. **Student Challenge**
   - Universities / schools
   - Price: **$1 per student / year**
   - Completion certificate and school dashboard

3. **Workplace Challenge**
   - Companies / organizations
   - Price: **$5 per employee / year**
   - Completion certificate and workplace dashboard

## What V1 Must Build

V1 is intentionally simple and credible.

Build:

- User registration/login
- TravelSafe self-serve access
- Student access via organization invite link
- Workplace access via organization invite link
- Scenario database
- Section-based challenge engine
- Fixed section order
- Randomized scenario cards inside each section
- Scoring
- Immediate answer feedback
- Results page
- Certificate generation
- Basic school/workplace dashboard
- CSV export
- Super admin content manager

Do **not** build in V1:

- Multiplayer
- Game board
- Animations
- Real-time rooms
- Avatars
- Countdown timers
- SSO
- LMS/SCORM integrations
- Department-specific curricula

## Gameplay Logic

Each challenge contains sections.

Sections must appear in fixed order:

```text
Section A → Section B → Section C → Section D
```

Cards inside each section must be randomized per session.

Example:

Section A contains scenario IDs:

```text
1, 2, 3, 4, 5, 6, 7, 8
```

User may see:

```text
7, 3, 6, 1, 8
```

Another user may see:

```text
4, 8, 2, 6, 3
```

Important:

- Store the generated card order for the user/session.
- Refreshing the page must not reshuffle mid-game.
- Restarting the full challenge may generate a new order.
- Sections stay fixed; only scenarios inside a section are shuffled.

## Scoring

Each answer receives a score from 0–4:

| Score | Meaning |
|---:|---|
| 4 | Safest / best answer |
| 3 | Safe but not ideal |
| 2 | Partially safe / incomplete |
| 1 | Weak or risky |
| 0 | Dangerous |

Some questions may have multiple safe answers.

Example:

```json
{
  "scores": {
    "A": 0,
    "B": 0,
    "C": 4,
    "D": 4
  },
  "safeActions": ["C", "D"]
}
```

## Result Levels

| Score % | Level |
|---:|---|
| 0–49% | At Risk |
| 50–69% | Learning Zone |
| 70–84% | Confident & Aware |
| 85–94% | Scam-Resistant |
| 95–100% | Konfydence Elite |

Certificates require:

- 100% required sections completed
- minimum pass threshold reached

Suggested pass thresholds:

| Challenge | Pass Threshold |
|---|---:|
| TravelSafe | 70% |
| Student | 70% |
| Workplace | 75% |

## Challenge Editions

### TravelSafe Challenge

Target: individual travelers  
Price: **$4.99**

Sections:

- **A: Booking & Airline Scams**
- **B: Airport & Transit Scams**
- **C: Hotel & Accommodation Scams**
- **D: Travel Money & Identity**

Completion certificate:

> TravelSafe Ready

### Student Challenge

Target: university students  
Price: **$1 per student / year**

Sections:

- **A: Student Accounts & University Messages**
- **B: Jobs, Internships & Career Scams**
- **C: Housing, Money & Marketplace**
- **D: Social, Travel & AI Scams**

Completion certificate:

> Student Safety Challenge Completed

### Workplace Challenge

Target: employees and organizations  
Price: **$5 per employee / year**

Sections:

- **A: Phishing & Account Access**
- **B: Money, Invoices & Payment Pressure**
- **C: Impersonation & Social Engineering**
- **D: AI, Deepfake & Modern Threats**

Completion certificate:

> Workplace Scam Awareness Completed

## Repository Structure

```text
app/                  Next.js app routes
components/           Reusable UI components
data/scenarios/       Seed scenario JSON files
docs/                 Product and build documentation
lib/                  Core business logic
prisma/               Database schema and seed scripts
public/               Public assets
scripts/              Import/export/maintenance scripts
tests/                Tests
types/                Shared TypeScript types
```

## Local Development

Target local folder:

```powershell
C:\Users\mbanw\konfydencechallenge
```

Recommended stack:

- Next.js
- TypeScript
- Prisma
- SQLite for local V1
- Stripe or Shopify checkout for TravelSafe later

## First Implementation Order

1. Create Next.js project structure
2. Add scenario data model
3. Add seed scenario JSON
4. Build challenge session generator
5. Build scenario screen
6. Build feedback screen
7. Build results screen
8. Build certificate page
9. Add admin dashboard
10. Add pricing pages
