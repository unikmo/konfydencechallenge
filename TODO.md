# Konfydence Challenge V1 — Implementation Checklist

## Approved scope (App Router only; no multiplayer, game board, animations, timers, avatars, leaderboards, SSO, SCORM/LMS, or department-specific curricula)

### 0. Foundation
- [ ] App shell: Next.js + TypeScript + Prisma SQLite (local V1), using existing folder structure

### 1. Data model
- [ ] Prisma schema for: User (minimal), Scenario, ChallengeSession, ChallengeAnswerResponse

### 2. Scenario JSON model & import pipeline
- [ ] Ensure normalized playable scenarios use `data/scenarios/scenario.schema.example.json` schema
- [ ] Create importer script: read JSON from `data/scenarios/` and seed/upsert into Prisma
- [ ] (Optional later) raw source storage under `data/import/raw/` (no live PDF parsing)
- [ ] Seed scenario import wired to `prisma db seed` or npm script

### 3. Challenge engine
- [ ] Challenge session generator: fixed section order A→B→C→D, randomize cards within each section per session
- [ ] Persist generated order in `ChallengeSession` so refresh does not reshuffle mid-game

### 4. Scoring
- [ ] Scoring engine: map selected answer to 0–4 via scenario `scores`, compute per-section score and overall score %, compute result level via README thresholds

### 5. Screens
- [ ] Scenario screen (present question, submit answer)
- [ ] Feedback screen (immediate feedback + explanation)
- [ ] Results screen (overall % + level + section completion summary)
- [ ] Certificate placeholder page

### 6. Admin placeholder
- [ ] Basic admin dashboard placeholder (scenario manager + challenge sessions placeholder)

### 7. Future extension notes
- [ ] Add TODO comments indicating where future AI/PDF extraction could be added later (NOT implemented in V1)


