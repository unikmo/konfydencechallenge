import type { Metadata } from "next";
import "@/app/play/play.css";

export const metadata: Metadata = {
  title: { absolute: "Gemeinsam spielen | Konfydence Challenge" },
  description:
    "Eröffne einen Raum, teile den Link und spielt dieselben Betrugsszenarien gemeinsam – ob im selben Zimmer oder weit voneinander entfernt. Mit laufender Rangliste und einer Siegerin oder einem Sieger am Ende.",
  alternates: {
    canonical: "/de/spielen",
    languages: { en: "https://konfydence.com/play", de: "https://konfydence.com/de/spielen" },
  },
  robots: { index: true, follow: true },
};

export default function SpielenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
