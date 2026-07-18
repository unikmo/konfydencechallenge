import React from "react";
import { tokens } from "@/lib/theme/tokens";

type Props = {
  name: string;
  price: string;
  includes: string[];
  cta: React.ReactNode;
  description?: string;
};

export function PricingCard({
  name,
  price,
  includes,
  cta,
  description,
}: Props) {
  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
    padding: "24px 20px",
    borderRadius: 16,
    border: `1px solid rgba(255, 255, 255, 0.12)`,
    background: tokens.bgCardDark,
    minHeight: 320,
  };

  const priceStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 900,
    color: tokens.textOnDark,
    margin: 0,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 800,
    color: tokens.textOnDark,
    margin: "0 0 8px",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: 13,
    color: tokens.textMuted,
    margin: 0,
    lineHeight: 1.5,
  };

  const includesStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
    flex: 1,
  };

  const includeItemStyle: React.CSSProperties = {
    fontSize: 13,
    color: tokens.textOnDark,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const ctaWrapperStyle: React.CSSProperties = {
    width: "100%",
    marginTop: "auto",
  };

  return (
    <div style={cardStyle}>
      <div>
        <p style={priceStyle}>{price}</p>
        <h3 style={nameStyle}>{name}</h3>
        {description && <p style={descriptionStyle}>{description}</p>}
      </div>

      {includes && includes.length > 0 && (
        <ul style={includesStyle}>
          {includes.map((item, idx) => (
            <li key={idx} style={includeItemStyle}>
              <span>✓</span>
              {item}
            </li>
          ))}
        </ul>
      )}

      <div style={ctaWrapperStyle}>{cta}</div>
    </div>
  );
}
