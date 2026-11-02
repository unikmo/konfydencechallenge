import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Challenge verschenken – Betrugsmaschen erkennen | Konfydence" },
  description: "Verschenke eine Konfydence Challenge mit realistischen Übungen zum Erkennen von Betrugsversuchen. Persönlicher Geschenkcode per E-Mail.",
  alternates: {
    canonical: "/de/geschenk",
    languages: { en: "https://konfydence.com/gift", de: "https://konfydence.com/de/geschenk" },
  },
};

export default function GeschenkLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
