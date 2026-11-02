import type { Metadata } from "next";
import { OrderPageView } from "@/components/lockscreens/OrderPageView";

export const metadata: Metadata = {
  title: { absolute: "Lockscreens für Schulen: Sofort-Angebot | Konfydence" },
  description: "Sofort-Angebot und nummerierte Bestellung für Konfydence Lockscreens.",
  alternates: {
    canonical: "/de/lockscreens/school/order",
    languages: {
      en: "https://konfydence.com/lockscreens/school/order",
      de: "https://konfydence.com/de/lockscreens/school/order",
    },
  },
};

export default function SchoolBestellungPage() {
  return <OrderPageView tier="school" lang="de" />;
}
