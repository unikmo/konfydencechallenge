import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Product/legal copy intentionally includes human-readable apostrophes and quotations.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["app/admin/page.tsx"],
    rules: {
      // This is a force-dynamic server component. A request-time clock is required
      // for renewal windows and 30/60/90-day revenue forecasts and is never used
      // for client-side render state.
      "react-hooks/purity": "off",
    },
  },
  {
    files: ["scripts/**/*.cjs"],
    rules: {
      // These are intentionally Node/CommonJS operational scripts executed directly by `node`.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    ".konfydence_backup_*/**",
  ]),
]);
