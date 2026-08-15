# Konfydence — Production Backlog

The V1 implementation checklist is complete and has been retired. This file now contains only work that is genuinely beyond the current production baseline.

## Commercial validation

- [ ] Complete and document one end-to-end Shopify test purchase for a single challenge: checkout → signed webhook → entitlement → full challenge access.
- [ ] Complete and document one all-five purchase test.
- [ ] Verify cancellation/refund webhook revokes the corresponding entitlement in the Shopify test environment.
- [ ] Review conversion analytics after sufficient real traffic: readiness start → completion → result → checkout start → purchase.

## Institutional product

- [ ] Define organization-level reporting requirements before adding school/employer dashboards.
- [ ] Decide whether team purchasing remains Shopify-based or moves to invoiced contracts for larger cohorts.
- [ ] Add LMS/SCORM only if validated institutional demand justifies it; do not add it speculatively.

## Content operations

- [ ] Schedule periodic scenario-bank reviews against emerging scam patterns without weakening the 40-card/H.A.C.K. balance.
- [ ] Add new source cards only through the scenario-quality and product-claim gates.
- [ ] Review category coverage and diagnostic flagship cards using observed answer data once sample sizes are meaningful.

## Security / operations

- [ ] Rotate production secrets on the normal operator schedule.
- [ ] Review CSP and remove `unsafe-inline` only when the remaining inline-style / analytics bootstrap architecture is refactored to support nonces or external styles safely.
- [ ] Periodically review `npm audit --omit=dev` results and Next.js LTS status.

## Deliberately out of scope until validated

- Multiplayer / live game board
- Leaderboards
- Avatars
- Timers as a scoring mechanic
- SSO
- LMS/SCORM
- AI-generated live scenarios without editorial review

These items should not enter production merely because they are technically possible. The product goal remains decision rehearsal, measurable pressure-pattern readiness, and clear transfer to real-world behavior.
