const { execFileSync } = require("node:child_process");
const path = require("node:path");

const isVercelProduction = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

if (!isVercelProduction) {
  console.log("[comasy-bootstrap] skipped: not a Vercel production build");
  process.exit(0);
}

// Prefer credentials managed by the Vercel Supabase integration. The legacy
// variables can remain present during migration without sending production
// builds to a disconnected Supabase project.
if (process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
}
if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING;
}

if (!process.env.DATABASE_URL) {
  console.error("[comasy-bootstrap] DATABASE_URL is missing; refusing production build");
  process.exit(1);
}

const migrationFiles = [
  "prisma/migrations/20260822094500_comasy_platform/migration.sql",
  "prisma/migrations/20260822101500_comasy_tenant_guard/migration.sql",
  "prisma/migrations/20260822103000_comasy_tenant_guard_search_path/migration.sql",
  "prisma/migrations/20260822103100_comasy_covering_indexes/migration.sql",
  "prisma/migrations/20260904150000_lockscreen_workplace/migration.sql",
];

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const childOptions = { stdio: "inherit", env: process.env };

for (const relativeFile of migrationFiles) {
  const file = path.resolve(process.cwd(), relativeFile);
  console.log(`[comasy-bootstrap] applying ${relativeFile}`);
  execFileSync(
    npx,
    ["prisma", "db", "execute", "--file", file, "--schema", "prisma/schema.prisma"],
    childOptions,
  );
}

console.log("[comasy-bootstrap] CoMaSy schema ready");
console.log("[comasy-bootstrap] synchronizing canonical 240-card scored bank + wild cards");
execFileSync(npm, ["run", "db:seed"], childOptions);

console.log("[comasy-bootstrap] synchronizing Workplace + Schools lockscreen asset libraries");
execFileSync(npm, ["run", "db:seed:lockscreens"], childOptions);

console.log("[comasy-bootstrap] verifying production backend invariants");
execFileSync(npm, ["run", "db:verify"], childOptions);

console.log("[comasy-bootstrap] production database ready for deployment");
