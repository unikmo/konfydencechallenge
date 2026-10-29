# Customer-managed deployment and integration boundary

Goal: employee identity, authored scenarios, individual decisions and detailed evidence remain in the organisation's systems. Konfydence receives only an organisation-level summary if its administrator explicitly chooses to share it.

A customer-managed runtime mode and customer-owned transactional mail gateway adapter are implemented. Entra ID, Google Workspace directory sync and LMS connectors are not implemented; those require a separately scoped integration.

## Inside the customer boundary

Run the Next.js application, PostgreSQL database, backups, authentication and email delivery in customer-controlled infrastructure. Administration, invitations, participant pages and detailed evidence are served there. Use the customer's identity provider, mail relay, encryption keys, logs and retention/deletion process. Production telemetry, external analytics, error payloads, support access, remote assets and outbound integration calls must be audited and disabled or customer-controlled. The account email-code flow uses the organisation-owned transactional mail gateway. Provider SSO requires a separate adapter; vendor-owned mail credentials would violate this boundary.

## Optional outbound boundary

A minimal aggregate export is implemented as an explicit administrator download, with no automatic transmission. It uses an allowlisted schema, a five-respondent threshold, count bands and rounded overall percentages. No names, employee IDs, emails, individual answers, scenario content, cohort labels or exact timestamps are included. The export excludes H.A.C.K. slices because their participant denominators may be too small. A future connector should accept only that aggregate schema, have tenant-scoped authentication, rate limits and explicit sharing controls. Repeated or overlapping summaries can still allow inference; review disclosure policy before enabling recurring sharing.

## Integration work to confirm

Identify Microsoft 365/Entra ID, Google Workspace or a customer-managed server as the first deployment target. Specify identity claims, admin provisioning, directory permissions, invite delivery, network egress policy, update distribution, support access and reporting destination. Use minimum permissions; directory sync must not upload employee records to the vendor. SSO alone only changes authentication, not data residency. No specific employee information should be required for billing: agree organisation-level licensed seat counts separately.


## Implemented private-mode controls

Set NEXT_PUBLIC_CUSTOMER_HOSTED=1 at both build and runtime. Build a separate customer deployment; do not flip the setting on an existing hosted build. Use an organisation-controlled DATABASE_URL and DIRECT_URL; vendor integration variables no longer override them. Configure NEXT_PUBLIC_APP_URL to the customer hostname, AUTH_SECRET to a customer-owned signing secret, and ADMIN_USER/ADMIN_PASSWORD for the customer operator. Set NEXT_TELEMETRY_DISABLED=1 during builds and operation.

Set TRANSACTIONAL_EMAIL_GATEWAY_URL to a customer-owned HTTPS endpoint and TRANSACTIONAL_EMAIL_GATEWAY_TOKEN to its server-side credential. The adapter sends POST JSON containing to, subject, html and tags, requires a 2xx response, disables redirects and times out after ten seconds. In customer mode it fails closed without a gateway and never falls back to the vendor mail provider. Loopback HTTP is permitted only for non-production tests. Configure the gateway to use the organisation mail system.

Private builds disable the GA scripts/instrumentation and use same-origin browser script/image/connection policy. Public lead collection is disabled. An optional shareable-summary download sends nothing to Konfydence. Operate a customer-managed outbound firewall allowlist; application configuration does not replace infrastructure egress controls. Review customer-specific legal notices, subprocessors, backup/restore and deletion procedures before release.

QA validates the local gateway, identity flow, private-mode guards and aggregate schema. It cannot establish acceptance of an unspecified customer identity provider or production infrastructure. Those checks remain deployment-specific.
