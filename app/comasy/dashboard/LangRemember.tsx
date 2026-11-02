"use client";

import { useEffect } from "react";

// The workspace language lives in ?lang=; this keeps it in a cookie so form
// posts and redirects (which don't carry the query string) land in the same
// language. The server reads the same cookie (lib/comasyDashboardStrings.ts).
export function LangRemember({ lang }: { lang: "en" | "de" }) {
  useEffect(() => {
    try {
      document.cookie = `kf_lang=${lang}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* cookies blocked — the ?lang= links still carry the language */
    }
  }, [lang]);
  return null;
}
