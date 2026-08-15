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
