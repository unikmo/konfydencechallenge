# Konfydence — Current Setup

This repository is the production source for **konfydence.com**.

## Project identity

- GitHub: `unikmo/konfydencechallenge`
- Vercel project: `05a.konfydencechallenge`
- Database: **PostgreSQL via Supabase**
- Prisma datasource: `postgresql`
- Do not use MongoDB or SQLite for this application.

## Challenge architecture

Konfydence has five editions:

- TravelSafe
- Family
- School
- University
- Workplace

Each edition has **48 active scored scenarios**, balanced across H/A/C/K:

- 12 Hurry
- 12 Authority
- 12 Comfort
- 12 Kill-Switch

Playable scored scenarios have **exactly three choices: A/B/C**. There is no playable D answer.

Session sizes:

- Free Readiness Check: short run, 2 each H/A/C/K (internal: 8 cards)
- Full Challenge: short rounds of 12, 3 each H/A/C/K per round. Four rounds clear the 48-card bank before anything repeats.

Selection is unseen-first while retaining H/A/C/K balance.

## Environment

The application requires PostgreSQL connection strings:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`DATABASE_URL` is the application connection string. `DIRECT_URL` is used by Prisma for direct database operations/migrations.

Do **not** add `MONGODB_URI` to Konfydence.

## Install and validate

```bash
npm install
npm run audit:scenarios
npm run report:decks
npm run build
```

The scenario audit must report:

- 240 scored scenarios total
- 48 scenarios per edition
- 12 H / 12 A / 12 C / 12 K per edition
- exactly three playable answers per scored scenario
- one unique strongest answer

## Seed the database

After `DATABASE_URL` and `DIRECT_URL` point to the intended Konfydence PostgreSQL database:

```bash
npm run seed
```

The seed process upserts the scenario files from `data/scenarios`, retires stale scored cards without deleting historical session records, and activates the current bank.

## Run locally

```bash
npm run dev
```

Open:

- Home: `http://localhost:3000`
- TravelSafe free check: `http://localhost:3000/challenge/travelsafe/start?mode=diagnostic`

A fresh TravelSafe diagnostic must show **01 / 08** and only **A/B/C** choices.

## Production validation

After deployment, verify a **new** session rather than reusing an old session ID.

Expected production behavior:

- premium dark/editorial challenge shell
- `01 / 08` for the free diagnostic
- exactly A/B/C choices
- no D choice
- current scenario bank
- full challenge is played in short balanced rounds over the whole 40+ bank

Legacy in-progress sessions created under obsolete card counts are redirected into a fresh current-format session.

## Deployment rule

A GitHub push is **not** considered production-complete until the Vercel status for that commit is successful. If Vercel reports failure, inspect the build log and fix the build before validating konfydence.com.

## Database safety

Konfydence must use its own dedicated Supabase/PostgreSQL database. Do not point it at databases belonging to CruiseConnect, Connect Experiences, DEngine, UNIKMO/Madonna, or other projects.
