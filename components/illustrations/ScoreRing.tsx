import React from "react";

interface ScoreRingProps {
  percent: number; // 0-100
  color: string;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  children?: React.ReactNode;
}

// Circular progress ring used to make the readiness score feel like a reveal
// moment instead of a plain "63%" text line. Pure SVG, no client JS required
// (safe to render inside server components like the results page).
export function ScoreRing({
  percent,
  color,
  size = 132,
  strokeWidth = 10,
  trackColor = "rgba(15, 23, 42, 0.10)",
  children,
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
