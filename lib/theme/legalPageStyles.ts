import type { CSSProperties } from "react";
import { tokens } from "@/lib/theme/tokens";

// Shared with app/imprint, app/privacy-policy, app/terms-of-service — the
// German legal pages (app/de/impressum, app/de/datenschutz, app/de/agb)
// reuse the same look so they read as the same site, not a bolted-on clone.
export const legalStyles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: tokens.bgCanvas,
    color: tokens.textOnDark,
    padding: "60px 20px 40px",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  content: { maxWidth: 800, margin: "0 auto" },
  title: { fontSize: 42, fontWeight: 900, marginBottom: 12 },
  update: { fontSize: 13, color: tokens.textMuted, marginBottom: 32 },
  section: { marginBottom: 32 },
  heading: { fontSize: 20, fontWeight: 900, marginBottom: 12, marginTop: 24 },
  paragraph: { fontSize: 15, lineHeight: 1.7, color: tokens.textMuted, marginBottom: 12 },
  list: { fontSize: 15, lineHeight: 1.7, color: tokens.textMuted, marginLeft: 20, marginBottom: 12 },
  link: { color: tokens.accentAmber, textDecoration: "none", borderBottom: `1px solid ${tokens.accentAmber}` },
  infoBox: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
};
