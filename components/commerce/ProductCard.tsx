import React from "react";
import { tokens } from "@/lib/theme/tokens";

type Props = {
  name: string;
  price?: string;
  image?: string;
  description?: string;
  cta: React.ReactNode;
  variant?: "paid" | "free";
};

export function ProductCard({
  name,
  price,
  image,
  description,
  cta,
  variant = "paid",
}: Props) {
  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    padding: "20px 16px",
    borderRadius: 14,
    background: "#ffffff",
    border: `1px solid rgba(255, 255, 255, 0.12)`,
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    marginBottom: 4,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
    color: "#102344",
    margin: 0,
  };

  const priceStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 900,
    color: tokens.accentAmber,
    margin: 0,
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 6,
    background: tokens.badgeBlue,
    color: "#102344",
    fontSize: 11,
    fontWeight: 800,
    margin: 0,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#526b93",
    margin: 0,
    lineHeight: 1.4,
  };

  return (
    <div style={cardStyle}>
      {image && <img src={image} alt={name} style={imageStyle} />}
      <h3 style={nameStyle}>{name}</h3>

      {variant === "paid" && price && (
        <p style={priceStyle}>{price}</p>
      )}

      {variant === "free" && (
        <p style={badgeStyle}>Free addon</p>
      )}

      {description && <p style={descriptionStyle}>{description}</p>}

      <div style={{ width: "100%", marginTop: "auto" }}>{cta}</div>
    </div>
  );
}
