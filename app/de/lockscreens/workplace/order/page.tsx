import type { Metadata } from "next";
import { OrderPageView } from "@/components/lockscreens/OrderPageView";

export const metadata: Metadata = {
  title: { absolute: "Lockscreens für Unternehmen: Sofort-Angebot | Konfydence" },
  description: "Sofort-Angebot und nummerierte Bestellung für Konfydence Lockscreens.",
  alternates: {
    canonical: "/de/lockscreens/workplace/order",
    languages: {
      en: "https://konfydence.com/lockscreens/workplace/order",
      de: "https://konfydence.com/de/lockscreens/workplace/order",
    },
  },
};

export default function WorkplaceBestellungPage() {
  return <OrderPageView tier="workplace" lang="de" />;
}
