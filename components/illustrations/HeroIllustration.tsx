import React from "react";

// Abstract hero scene: a phone receiving a pressure-tactic message (the "stakes"),
// with a shield-checkmark resolving over it (the "empowerment" payoff). Built as
// plain geometric SVG shapes — no external image assets or generation tool available.
export function HeroIllustration({ size = 360 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "100%", height: "auto" }}
      role="img"
      aria-label="Phone showing a suspicious message, protected by a shield"
    >
      {/* soft glow backdrop */}
      <circle cx="180" cy="180" r="170" fill="url(#heroGlow)" />

      {/* pressure lines radiating from the message (urgency cue) */}
      <g stroke="#FF4D5E" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round">
        <line x1="150" y1="60" x2="132" y2="30" />
        <line x1="190" y1="55" x2="196" y2="22" />
        <line x1="222" y1="70" x2="248" y2="46" />
      </g>

      {/* phone body */}
      <rect x="108" y="70" width="128" height="230" rx="26" fill="#0B1F3A" stroke="#1E3A5F" strokeWidth="3" />
      <rect x="120" y="94" width="104" height="182" rx="10" fill="#0F2A4D" />
      <rect x="156" y="278" width="32" height="6" rx="3" fill="#1E3A5F" />

      {/* suspicious message bubble on screen */}
      <rect x="132" y="112" width="80" height="46" rx="12" fill="#FF4D5E" fillOpacity="0.16" stroke="#FF4D5E" strokeWidth="2" />
      <circle cx="150" cy="135" r="9" fill="#FF4D5E" />
      <text x="150" y="140" textAnchor="middle" fontSize="13" fontWeight="900" fill="#08111F">
        !
      </text>
      <rect x="168" y="127" width="34" height="6" rx="3" fill="#FF4D5E" fillOpacity="0.55" />
      <rect x="168" y="139" width="24" height="6" rx="3" fill="#FF4D5E" fillOpacity="0.35" />

      {/* calmer confirmed-safe line below, showing the "after" state */}
      <rect x="132" y="172" width="80" height="30" rx="10" fill="#22C55E" fillOpacity="0.14" stroke="#22C55E" strokeWidth="1.5" />
      <rect x="142" y="184" width="46" height="6" rx="3" fill="#22C55E" fillOpacity="0.6" />

      {/* shield badge overlapping the phone's bottom-right, the resolution/payoff */}
      <g transform="translate(206, 208)">
        <path
          d="M46 0 L88 16 V50 C88 82 68 100 46 112 C24 100 4 82 4 50 V16 Z"
          fill="#FFB31D"
          stroke="#08111F"
          strokeWidth="4"
        />
        <path
          d="M28 54 L40 66 L66 36"
          stroke="#08111F"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      <defs>
        <radialGradient id="heroGlow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#FFB31D" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FFB31D" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
