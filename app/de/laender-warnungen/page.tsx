import type { Metadata } from "next";
import LaenderPage from "../countries/page";

export const metadata: Metadata = {
  title: { absolute: "Betrugswarnungen nach Ländern | Konfydence" },
  description: "Reiseziel-spezifische Touristenfallen, Zahlungsrisiken und Druckmaschen, gestützt auf offizielle Reisehinweise.",
  alternates: {
    canonical: "/de/laender-warnungen",
    languages: { en: "https://konfydence.com/country-alerts", de: "https://konfydence.com/de/laender-warnungen" },
  },
};

export default LaenderPage;
