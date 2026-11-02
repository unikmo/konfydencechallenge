import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Geschenkcode einlösen | Konfydence Challenge" },
  description: "Du hast eine Konfydence Challenge geschenkt bekommen? Hier kannst du deinen Geschenkcode einlösen und mit dem Training beginnen.",
  alternates: {
    canonical: "/de/geschenk/einloesen",
    languages: { en: "https://konfydence.com/gift/redeem", de: "https://konfydence.com/de/geschenk/einloesen" },
  },
};

export default function GeschenkEinloesenLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
