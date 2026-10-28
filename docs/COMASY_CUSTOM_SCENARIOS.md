# Self-service organisation pilot

Every organisation pilot is free for four weeks (28 days), with up to 20 participants and 12 distinct scenarios across all campaigns. At least one named administrator is required; administrators have separate access and are not counted as participant seats. The organisation's administrators write their own scenarios; Konfydence does not promise bespoke scenario writing. They may use existing Workplace/TravelSafe content, their own published content, or a mixture. There is no automatic paid conversion. A continued rollout needs an explicit agreement covering one-time implementation/onboarding and recurring per-seat charges. No rollout price is invented by the application.

## Identity and invitations

Customer administrators sign in through the existing verified-email Konfydence Account flow and select an organisation where they have an active ComasyAdministrator membership. The signed org cookie selects the workspace; it grants no access on its own. Shared workspace access codes no longer authenticate customer administrators. Existing workspaces need a named administrator provisioned through Internal Admin > Sales Accounts. New internally provisioned organisations create their first membership atomically. Pilot requesters remain leads; submitting a form does not grant access or create an administrator.

Administrators can add other named admins and revoke them, but the last active admin cannot be removed. Authenticated administrators invite participants, optionally assign a cohort, resend an invitation or revoke a private link. Invitations use the shared transactional mail service: the organisation gateway when configured, or Brevo in hosted mode. A missing or failed provider is shown as not sent; a secure manual link is available. The participant page is separate from administration and lists only assigned campaigns, completion and availability. Participant access links are bearer credentials; use HTTPS and do not forward them. Revoking participation rotates the token.

## Pilot operations

Record objectives, evidence owner and data-handling confirmation in Compliance & evidence. This records the organisation's acknowledgement and does not create a legal agreement. Start free pilot sets a 28-day end date once. Before activation the admin can prepare drafts; invitations and live practice require activation. After expiry, invitation, authoring and campaign changes stop; reports and recorded evidence remain readable. No automatic billing or renewal is enabled.

The backend serializes participant allocation and campaign scenario allocation with an organisation row lock. The limit is 20 distinct participant records, including previously disabled records. The 12-scenario programme limit counts distinct selected IDs across campaigns, including historical campaigns. Admins may prepare up to 12 custom drafts/published scenarios; choosing standard scenarios consumes the same programme allocation when assigned. Scenarios remain organisation-owned, isolated from public challenges and group play. Drafts can be edited/deleted; published content and classification are frozen and version-snapshotted so evidence remains stable.

## Reporting

Overview starts with programme status, limits and evidence gaps. Compliance & evidence shows a summary, then checklist, recorded objectives/review and recent administrative events. Participation, baseline/follow-up, pressure patterns and CSV/PDF exports support a human review. Records and counts are not proof of legal compliance, validated psychology, or causal effectiveness. Scenario mix and difficulty affect comparisons. The activity list is not a tamper-proof audit trail. Retention is a stored policy value; an automated deletion worker is not implemented.

## Deployment and employee privacy

The hosted application stores participant identities and responses in its configured database. Do not claim that hosted SSO keeps employee data inside the customer network. See CUSTOMER_HOSTED_ARCHITECTURE.md for the implemented private runtime controls, customer mail gateway and integration prerequisites.

An administrator can explicitly download a shareable summary JSON. The allowlisted payload excludes names, emails, identifiers, individual answers, scenario text, cohort labels and exact timestamps. It suppresses the whole summary until at least five unique participants have responded, groups respondent counts into bands, and rounds metrics to five percentage points. It does not send data to Konfydence. This is minimisation, not a guarantee against re-identification when combined with other information. Avoid repeated overlapping disclosures.

## Deployment

Apply both 20261027090000_custom_scenarios and 20261028100000_self_service_pilot migrations before running the new app, then generate Prisma Client. The bootstrap includes them. The second migration resets organisation plans to FREE, preserves historical quoted pilot fees, adds named admins and evidence fields. Do not copy live participant data into tests.

Verification: unit tests, ESLint, TypeScript, content audits and production build. scripts/test-custom-scenarios.cjs requires a disposable loopback TEST_DATABASE_URL and test app. Disable outbound mail while running integration fixtures.
