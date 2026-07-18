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
    padding: "10px 12px",
    borderRadius: 12,
    background: "#ffb31d",
    border: "1px solid rgba(0,0,0,0.05)",
    color: "#08111f",
    fontWeight: 950,
    marginTop: 10,
    cursor: "pointer",
  },
  buttonOutline: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#fff",
    border: "1px solid rgba(11,27,43,0.14)",
    color: "#0b1b2b",
    fontWeight: 950,
    marginTop: 10,
    cursor: "pointer",
  },
};
