"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";

interface Entitlement {
  tier: "single" | "unlimited";
  edition: string | null;
}

export default function ClaimPage() {
  return (
    <Suspense fallback={null}>
      <ClaimContent />
    </Suspense>
  );
}

function ClaimContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const sessionId = searchParams.get("sessionId");
  const edition = searchParams.get("edition");

  useEffect(() => {
    const checkEntitlements = async () => {
      try {
        const response = await fetch("/api/entitlements/me");
        if (!response.ok) throw new Error("Failed to fetch entitlements");

        const data = await response.json();
        setEntitlements(data.entitlements);

        // Check if purchased entitlement is present
        if (data.entitlements && data.entitlements.length > 0) {
          const purchased = data.entitlements.find(
            (e: Entitlement) =>
              e.tier === "unlimited" ||
              (e.tier === "single" && edition && e.edition === edition)
          );

          if (purchased) {
            // Redirect to challenge start
            if (purchased.tier === "unlimited") {
              // User purchased unlimited, let them pick an edition
              setTimeout(() => router.push("/challenge"), 1000);
            } else {
              // User purchased a specific edition
              setTimeout(
                () => router.push(`/challenge/${purchased.edition}/start?mode=full`),
                1000
              );
            }
            return;
          }
        }

        setPollCount((prev) => prev + 1);

        // Poll for up to 10 attempts (~15 seconds)
        if (pollCount < 10) {
          setTimeout(checkEntitlements, 1500);
        } else {
          setError("Entitlement processing took too long. Please refresh or contact support.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking entitlements:", err);
        setPollCount((prev) => prev + 1);

        if (pollCount < 10) {
          setTimeout(checkEntitlements, 1500);
        } else {
          setError("Error verifying purchase. Please refresh or contact support.");
          setLoading(false);
        }
      }
    };

    // Start polling immediately
    checkEntitlements();
  }, [pollCount, edition, router]);

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: tokens.bgCanvas,
    color: tokens.textOnDark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 500,
    width: "100%",
    textAlign: "center",
  };

  const spinnerStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    border: `3px solid rgba(255, 255, 255, 0.1)`,
    borderTopColor: tokens.accentAmber,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 900,
    margin: "0 0 12px",
  };

  const textStyle: React.CSSProperties = {
    fontSize: 14,
    color: tokens.textMuted,
    margin: "0 0 24px",
    lineHeight: 1.6,
  };

  const errorBoxStyle: React.CSSProperties = {
    padding: 16,
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    marginBottom: 16,
  };

  const errorTitleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
    color: "#ef4444",
    margin: "0 0 8px",
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: 13,
    color: tokens.textMuted,
    margin: 0,
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 800,
    border: "none",
    background: tokens.accentAmber,
    color: tokens.textOnLight,
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={cardStyle}>
        {loading && !error ? (
          <>
            <div style={spinnerStyle} />
            <h1 style={titleStyle}>Processing your purchase</h1>
            <p style={textStyle}>
              We're verifying your entitlement with Shopify. This typically takes less than 30 seconds.
            </p>
            <p style={textStyle}>(Attempt {pollCount + 1})</p>
          </>
        ) : error ? (
          <>
            <div style={errorBoxStyle}>
              <h2 style={errorTitleStyle}>⚠ Processing delayed</h2>
              <p style={errorTextStyle}>{error}</p>
            </div>
            <button style={buttonStyle} onClick={() => window.location.reload()}>
              Refresh and retry
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h1 style={titleStyle}>Purchase complete!</h1>
            <p style={textStyle}>
              Your access is being set up. You'll be redirected to your challenge momentarily.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
