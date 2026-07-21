import React from "react";
import type { HackTrigger } from "@/lib/challenge/labels";

interface HackIconProps {
  trigger: HackTrigger;
  size?: number;
  color?: string;
}

// Small glyph per HACK pressure-tactic trigger (Hurry / Authority / Connection /
// Kill-switch) so callouts read faster than plain text alone.
export function HackIcon({ trigger, size = 22, color = "#FFB31D" }: HackIconProps) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" };

  switch (trigger) {
    case "H": // Hurry — clock with a fast-forward tick
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
          <path d="M12 7v5l3.5 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "A": // Authority — badge/star
      return (
        <svg {...common}>
          <path
            d="M12 3l2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.6 5-.7L12 3z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "C": // Connection — linked circles
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="5" stroke={color} strokeWidth="2" />
          <circle cx="15" cy="15" r="5" stroke={color} strokeWidth="2" />
        </svg>
      );
    case "K": // Kill-switch — power glyph
      return (
        <svg {...common}>
          <path d="M12 4v7" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M7 6.5a7 7 0 1 0 10 0"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
  }
}
