"use client";

import React, { useState } from "react";
import { tokens } from "@/lib/theme/tokens";
import { trackCheckoutStarted } from "@/lib/events";

type Props = {
  sku: string;
  label: string;
  variant?: "primary" | "outline";
};

export function CheckoutRedirectButton({
  sku,
  label,
  variant = "primary",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    trackCheckoutStarted(sku, label);

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sku }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create checkout");
        setLoading(false);
        return;
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: "11px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 900,
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "opacity 0.15s, transform 0.15s",
    opacity: loading ? 0.7 : 1,
    transform: loading ? "scale(0.98)" : "scale(1)",
  };

  if (variant === "primary") {
    buttonStyle.background = tokens.btnBlack;
    buttonStyle.color = tokens.textOnDark;
  } else {
    buttonStyle.background = "transparent";
    buttonStyle.color = tokens.btnBlack;
    buttonStyle.border = `2px solid ${tokens.btnBlack}`;
  }

  return (
    <div>
      <button style={buttonStyle} onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : label}
      </button>
      {error && (
        <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  );
}
