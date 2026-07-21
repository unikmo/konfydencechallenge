import React from "react";

type FeatureIconKind = "score" | "framework" | "travel" | "reminder";

// Replaces raw emoji in the homepage "Why Konfydence" grid with a consistent,
// on-brand icon badge (gradient circle + simple glyph).
export function FeatureIcon({ kind, size = 44 }: { kind: FeatureIconKind; size?: number }) {
  const glyphSize = Math.round(size * 0.5);
  const glyph = (() => {
    const common = { width: glyphSize, height: glyphSize, viewBox: "0 0 24 24", fill: "none" };
    switch (kind) {
      case "score":
        return (
          <svg {...common}>
            <path d="M5 19V11" stroke="#08111F" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M12 19V5" stroke="#08111F" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M19 19v-8" stroke="#08111F" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        );
      case "framework":
        return (
          <svg {...common}>
            <circle cx="12" cy="12" r="8.5" stroke="#08111F" strokeWidth="2.2" />
            <circle cx="12" cy="12" r="3" fill="#08111F" />
          </svg>
        );
      case "travel":
        return (
          <svg {...common}>
            <path
              d="M3 13l7-2 3-8 2 .5-1.5 8L21 10l.5 2-7.5 3-1 5-2-.5.5-4-6 1.5-1.5-2z"
              fill="#08111F"
            />
          </svg>
        );
      case "reminder":
        return (
          <svg {...common}>
            <rect x="4" y="6" width="16" height="12" rx="2.5" stroke="#08111F" strokeWidth="2.2" />
            <path d="M4 9h16" stroke="#08111F" strokeWidth="2.2" />
          </svg>
        );
    }
  })();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(145deg, #FFB31D, #FFD166)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
        boxShadow: "0 6px 16px rgba(255, 179, 29, 0.28)",
      }}
    >
      {glyph}
    </div>
  );
}
