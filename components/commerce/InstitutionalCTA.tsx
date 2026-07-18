import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export function InstitutionalCTA() {
  const containerStyle: React.CSSProperties = {
    padding: "16px 20px",
    background: `rgba(${parseInt(tokens.badgeBlue.slice(1, 3), 16)}, ${parseInt(tokens.badgeBlue.slice(3, 5), 16)}, ${parseInt(tokens.badgeBlue.slice(5, 7), 16)}, 0.08)`,
    borderRadius: 10,
    border: `1px solid ${tokens.badgeBlue}`,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    color: tokens.badgeBlue,
    margin: "0 0 4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const textStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: tokens.textOnDark,
    margin: 0,
  };

  const linkStyle: React.CSSProperties = {
    color: tokens.badgeBlue,
    textDecoration: "none",
    fontWeight: 800,
    borderBottom: `2px solid ${tokens.badgeBlue}`,
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <p style={labelStyle}>For Schools & Teams</p>
      <p style={textStyle}>
        Bring Konfydence to your organization.{" "}
        <Link href="/contact?topic=schools-teams" style={linkStyle}>
          Request a quote
        </Link>
      </p>
    </div>
  );
}
