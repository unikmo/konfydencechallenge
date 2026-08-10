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
      document.body.style.paddingBottom = "clamp(92px, 10vw, 116px)";
      setShowConsent(true);
    } else if (consentGiven === "accepted") {
      document.body.style.paddingBottom = "0px";
      // Consent Mode defaults analytics_storage to "denied" on every page load
      // (see app/layout.tsx) — without this, a returning visitor who already
      // accepted would still have analytics silently blocked on every visit
      // after the first, since the "granted" update was only ever sent once.
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
      });
    } else {
      document.body.style.paddingBottom = "0px";
    }

    return () => {
      document.body.style.paddingBottom = "0px";
    };
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("analytics-consent", "true");
    document.body.style.paddingBottom = "0px";
    setShowConsent(false);
    // Enable analytics
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
    });
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("analytics-consent", "false");
    document.body.style.paddingBottom = "0px";
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
    padding: "8px 16px calc(8px + env(safe-area-inset-bottom))",
    zIndex: 9999,
    maxWidth: "100%",
    maxHeight: "88px",
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: 1040,
    margin: "0 auto",
    display: "grid",
  };

  const textStyle: React.CSSProperties = {
    fontSize: 12,
    lineHeight: 1.35,
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
    gap: 8,
    flexWrap: "nowrap",
    justifyContent: "flex-end",
  };

  const buttonStyle = (variant: "primary" | "secondary"): React.CSSProperties => ({
    padding: "7px 12px",
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
    <>
      <div className="cookie-banner" style={containerStyle}>
      <div className="cookie-content" style={contentStyle}>
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
        <div className="cookie-buttons" style={buttonContainerStyle}>
          <button style={buttonStyle("secondary")} onClick={handleRejectAll}>
            Reject All
          </button>
          <button style={buttonStyle("primary")} onClick={handleAcceptAll}>
            Accept All
          </button>
        </div>
      </div>
      </div>
      <style>{`
        .cookie-content{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;max-width:1040px;margin:0 auto}
        .cookie-buttons{display:flex;gap:8px;flex-wrap:nowrap;justify-content:flex-end}
        @media(max-width:720px){.cookie-banner{max-height:112px!important}.cookie-content{grid-template-columns:1fr;gap:6px}.cookie-buttons{justify-content:flex-start}}
      `}</style>
    </>
  );
}
