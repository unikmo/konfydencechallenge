import Image from "next/image";
import React from "react";
import { tokens } from "@/lib/theme/tokens";

type Props = {
  name: string;
  price?: string;
  image?: string;
  description?: string;
  cta: React.ReactNode;
  variant?: "paid" | "free";
};

export function ProductCard({ name, price, image, description, cta, variant = "paid" }: Props) {
  return (
    <article style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, padding: "20px 16px", borderRadius: 14, background: "#fff", border: "1px solid rgba(16,35,68,.08)" }}>
      {image ? (
        <Image src={image} alt={name} width={720} height={480} sizes="(max-width: 720px) 100vw, 320px" style={{ width: "100%", height: "auto", borderRadius: 10, marginBottom: 4 }} />
      ) : null}
      <h3 style={{ fontSize: 14, fontWeight: 800, color: "#102344", margin: 0 }}>{name}</h3>
      {variant === "paid" && price ? <p style={{ fontSize: 16, fontWeight: 900, color: tokens.accentAmber, margin: 0 }}>{price}</p> : null}
      {variant === "free" ? <p style={{ display: "inline-block", padding: "4px 8px", borderRadius: 6, background: tokens.badgeBlue, color: "#102344", fontSize: 11, fontWeight: 800, margin: 0 }}>Free addon</p> : null}
      {description ? <p style={{ fontSize: 12, color: "#526b93", margin: 0, lineHeight: 1.4 }}>{description}</p> : null}
      <div style={{ width: "100%", marginTop: "auto" }}>{cta}</div>
    </article>
  );
}
