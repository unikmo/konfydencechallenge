"use client";

import React from "react";

export function DownloadCertificateButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} style={styles.button}>
      {label}
    </button>
  );
}

export function ShareCertificateButton({ certificateUrl, shareText }: { certificateUrl: string; shareText: string }) {
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Konfydence Readiness Certified", text: shareText, url: certificateUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(certificateUrl);
      window.alert("Certificate link copied to clipboard.");
    }
  };

  return (
    <button type="button" onClick={handleShare} style={styles.buttonOutline}>
      Share Certificate
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 48,
    padding: "12px 15px",
    borderRadius: 999,
    background: "var(--k-ink)",
    border: "1px solid var(--k-ink)",
    color: "#fff",
    fontWeight: 650,
    marginTop: 12,
    cursor: "pointer",
  },
  buttonOutline: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 46,
    padding: "11px 14px",
    borderRadius: 999,
    background: "transparent",
    border: "1px solid var(--k-line)",
    color: "var(--k-ink)",
    fontWeight: 600,
    marginTop: 10,
    cursor: "pointer",
  },
};
