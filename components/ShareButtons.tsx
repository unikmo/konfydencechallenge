"use client";

import { useMemo, useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
  text: string;
};

export function ShareButtons({ url, title, text }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return url;
    return new URL(url, window.location.origin).toString();
  }, [url]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // The player may have cancelled the native share sheet.
      }
    }
    await copyLink();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy your Konfydence link:", shareUrl);
    }
  }

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    borderRadius: 9,
    padding: "8px 11px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#102344",
    fontSize: 12,
    fontWeight: 850,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #dce5f0" }}>
      <p style={{ margin: "0 0 10px", color: "#365477", fontSize: 13, fontWeight: 900 }}>
        Know someone who would enjoy this? Share the challenge.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" onClick={nativeShare} style={{ ...buttonStyle, background: "#ff584c", borderColor: "#ff584c", color: "#ffffff" }}>
          Share
        </button>
        <a style={buttonStyle} href={"https://wa.me/?text=" + encodedText + "%20" + encodedUrl} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a style={buttonStyle} href={"https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl} target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a style={buttonStyle} href={"https://twitter.com/intent/tweet?text=" + encodedText + "&url=" + encodedUrl} target="_blank" rel="noreferrer">
          X
        </a>
        <a style={buttonStyle} href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <button type="button" onClick={copyLink} style={buttonStyle}>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
