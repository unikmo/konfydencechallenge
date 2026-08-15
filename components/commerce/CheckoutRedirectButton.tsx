"use client";

import React, { useState } from "react";
import { tokens } from "@/lib/theme/tokens";
import { trackCheckoutStarted } from "@/lib/events";

type Props = { sku: string; label: string; variant?: "primary" | "outline" };

export function CheckoutRedirectButton({ sku, label, variant = "primary" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    trackCheckoutStarted(sku, label);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        setError(errorData.error || "Failed to create checkout");
        setLoading(false);
        return;
      }
      const { checkoutUrl } = (await response.json()) as { checkoutUrl?: string };
      if (!checkoutUrl) throw new Error("Checkout URL missing");
      window.location.assign(checkoutUrl);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 44,
    padding: "11px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 900,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "opacity .15s, transform .15s",
    opacity: loading ? .7 : 1,
    transform: loading ? "scale(.98)" : "scale(1)",
    background: variant === "primary" ? tokens.btnBlack : "transparent",
    color: variant === "primary" ? tokens.textOnDark : tokens.btnBlack,
    border: variant === "primary" ? "none" : `2px solid ${tokens.btnBlack}`,
  };

  return (
    <div>
      <button type="button" style={buttonStyle} onClick={handleClick} disabled={loading}>{loading ? "Opening checkout…" : label}</button>
      {error ? <p role="alert" style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>{error}</p> : null}
    </div>
  );
}
