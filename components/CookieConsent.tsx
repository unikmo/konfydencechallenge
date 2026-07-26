"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem("cookie-consent");
    if (!consentGiven) {
      setShowConsent(true);
    } else if (consentGiven === "accepted") {
      // Consent Mode defaults analytics_storage to "denied" on every page load
      // (see app/layout.tsx) â€” without this, a returning visitor who already
      // accepted would still have analytics silently blocked on every visit
      // after the first, since the "granted" update was only ever sent once.
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("analytics-consent", "true");
    setShowConsent(false);
    // Enable analytics
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
    });
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("analytics-consent", "false");
    setShowConsent(false);
  };

  if (!mounted || !showConsent) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.bgCanvas,
    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
    padding: "20px",
    zIndex: 9999,
    maxWidth: "100%",
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: 1040,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 16,
    alignItems: "center",
  };

  const textStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1.5,
    color: tokens.textMuted,
  };

  const linkStyle: React.CSSProperties = {
    color: tokens.accentAmber,
    textDecoration: "none",
    borderBottom: `1px solid ${tokens.accentAmber}`,
    marginLeft: 4,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  };

  const buttonStyle = (variant: "primary" | "secondary"): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 800,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    ...(variant === "primary"
      ? {
          background: tokens.accentAmber,
          color: tokens.textOnLight,
        }
      : {
          background: "transparent",
          color: tokens.textOnDark,
          border: `1px solid rgba(255, 255, 255, 0.2)`,
        }),
  });

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={textStyle}>
          Optional analytics cookies are off until you choose Accept All. Choose Accept All or Reject All, or read our{" "}
          <Link href="/privacy-policy" style={linkStyle}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/cookie-policy" style={linkStyle}>
            Cookie Policy
          </Link>
          .
        </div>
        <div style={buttonContainerStyle}>
          <button style={buttonStyle("secondary")} onClick={handleRejectAll}>
            Reject All
          </button>
          <button style={buttonStyle("primary")} onClick={handleAcceptAll}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
