import React from "react";
import { tokens } from "@/lib/theme/tokens";
import { CheckoutRedirectButton } from "./CheckoutRedirectButton";

type Props = {
  product: "wallet" | "magnet";
};

const productDetails = {
  wallet: {
    name: "KonfyGuard Wallet Card",
    price: "$14.99",
    description: "Pocket-sized HACK pressure reminder. Keep it where you keep your credit cards.",
    sku: "KG-WALLET",
  },
  magnet: {
    name: "KonfyGuard Fridge Magnet",
    price: "$9.99",
    description: "Household reminder for the whole family. Quick reference for HACK pressure tactics.",
    sku: "KG-MAGNET",
  },
};

export function CrossSellStrip({ product }: Props) {
  const details = productDetails[product];

  const containerStyle: React.CSSProperties = {
    padding: "20px",
    background: tokens.bgCardDark,
    borderRadius: 12,
    border: `1px solid rgba(255, 255, 255, 0.12)`,
    maxWidth: 320,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
    color: tokens.accentAmber,
    margin: "0 0 4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 900,
    color: tokens.textOnDark,
    margin: "0 0 4px",
  };

  const priceStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
    color: tokens.textOnDark,
    margin: "0 0 8px",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: 13,
    color: tokens.textMuted,
    margin: "0 0 12px",
    lineHeight: 1.4,
  };

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>Build your armor</p>
      <h3 style={nameStyle}>{details.name}</h3>
      <p style={priceStyle}>{details.price}</p>
      <p style={descriptionStyle}>{details.description}</p>
      <CheckoutRedirectButton
        sku={details.sku}
        label={`Add to cart — ${details.price}`}
      />
    </div>
  );
}
