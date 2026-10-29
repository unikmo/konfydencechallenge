# Konfydence live database security fix — 29 October 2026

Verified mapping: konfydence.com -> Vercel 05a.konfydencechallenge -> Supabase yctigbbvtzteplvzhhgo. Vercel production POSTGRES_HOST and NEXT_PUBLIC_SUPABASE_URL identify that project; POSTGRES_USER is postgres. Only these non-secret endpoint/role values were inspected. The deployed application health reports release 796612dfba8d0916b45ce44530e28ad741fda11d; pilot PR #160 is still not deployed.

The signed-in organisation zppfzkvzxhtjxdizseqa contains Konfydence and a paused database project named Tichi Ventures (phhpiqwvgwlgjmyiksqe). The latter was not resumed, deleted, renamed or moved. Organisation title currently appears as mbanwie@hotmail.com's Org.

## Finding and live fix
The advisor initially reported 17 errors. A metadata query showed 34 public tables, 15 with RLS disabled, all owned by postgres. Tables named LoginCode and order tables appeared in the disabled-RLS findings. The repository uses server-side Prisma; no direct browser Supabase table client was found in app/components/lib/package.json.

Applied one transaction through the signed-in Supabase SQL Editor: enable RLS on every public table; revoke public/anon/authenticated table and sequence privileges; revoke future default grants for objects created by postgres. The existing server/table-owner role and service-role explicit privileges were retained. No tables or records were deleted and no customer record contents were selected.

## Verification
A metadata query returned: tables=34, rls_missing=0, anon_access=0, client_access=0, server_access=34. A fresh dashboard linter run reported zero errors, zero warnings and 34 informational RLS-enabled-without-policy suggestions. Those are intentional default-deny client access for this server-only architecture, not grants to add blindly.

Live https://konfydence.com/api/health/backend returned ready=true, database=ok, and all 240 canonical scenarios. https://konfydence.com/api/health/comasy returned ready=true and database=available. These smoke checks verify database-backed reads, not complete login/purchase/administrator acceptance.

## Follow-up
The accompanying idempotent migration and production bootstrap entry preserve the fix in future deployments, including customer PostgreSQL without Supabase roles. Run migrations under the table-owning server role, explicitly enable RLS for any future new table and review grants whenever browser Data API access is introduced. This change is not a full application security audit or proof that historical access never happened. Review retained Data API logs and active-session/login-code exposure separately; no credentials or customer sessions were rotated in this task.
