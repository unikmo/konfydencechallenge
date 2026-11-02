import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Kontakt und Pilotprojekte | Konfydence" },
  description: "Fragen zur Konfydence Challenge, zu Sicherheitsschulungen oder einem Pilotprojekt für Schulen und Unternehmen? Hier erreichst du uns.",
  alternates: {
    canonical: "/de/kontakt",
    languages: { en: "https://konfydence.com/contact", de: "https://konfydence.com/de/kontakt" },
  },
};

export default function KontaktLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
