"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type ConsentState = "accepted" | "rejected" | "unset" | "server";
const CONSENT_EVENT = "konfydence-cookie-consent";

function getConsentSnapshot(): ConsentState {
  if (typeof window === "undefined") return "server";
  const value = window.localStorage.getItem("cookie-consent");
  return value === "accepted" || value === "rejected" ? value : "unset";
}

function subscribeToConsent(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(CONSENT_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CONSENT_EVENT, handleChange);
  };
}

function publishConsentChange() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => "server");
  const showConsent = consent === "unset";

  useEffect(() => {
    if (consent === "server") return;

    document.body.style.paddingBottom = showConsent ? "clamp(92px, 10vw, 116px)" : "0px";
    if (consent === "accepted") {
      window.gtag?.("consent", "update", { analytics_storage: "granted" });
    } else if (consent === "rejected") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
    }

    return () => {
      document.body.style.paddingBottom = "0px";
    };
  }, [consent, showConsent]);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("analytics-consent", "true");
    publishConsentChange();
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("analytics-consent", "false");
    publishConsentChange();
  };

  if (!showConsent) return null;

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.bgCanvas,
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
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
      ? { background: tokens.accentAmber, color: tokens.textOnLight }
      : {
          background: "transparent",
          color: tokens.textOnDark,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }),
  });

  return (
    <>
      <div className="cookie-banner" style={containerStyle} role="dialog" aria-label="Cookie preferences">
        <div className="cookie-content" style={contentStyle}>
          <div style={textStyle}>
            Optional analytics cookies are off until you choose Accept All. Choose Accept All or Reject All, or read our{" "}
            <Link href="/privacy-policy" style={linkStyle}>Privacy Policy</Link>{" "}
            and{" "}<Link href="/cookie-policy" style={linkStyle}>Cookie Policy</Link>.
          </div>
          <div className="cookie-buttons" style={buttonContainerStyle}>
            <button type="button" style={buttonStyle("secondary")} onClick={handleRejectAll}>Reject All</button>
            <button type="button" style={buttonStyle("primary")} onClick={handleAcceptAll}>Accept All</button>
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
