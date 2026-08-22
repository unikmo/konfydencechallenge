const { execFileSync } = require("node:child_process");
const path = require("node:path");

const isVercelProduction = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

if (!isVercelProduction) {
  console.log("[comasy-bootstrap] skipped: not a Vercel production build");
  process.exit(0);
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
];

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

for (const relativeFile of migrationFiles) {
  const file = path.resolve(process.cwd(), relativeFile);
  console.log(`[comasy-bootstrap] applying ${relativeFile}`);
  execFileSync(
    npx,
    ["prisma", "db", "execute", "--file", file, "--schema", "prisma/schema.prisma"],
    { stdio: "inherit", env: process.env },
  );
}

console.log("[comasy-bootstrap] CoMaSy production schema is ready");
