import type { Metadata } from "next";
import { OrderPageView } from "@/components/lockscreens/OrderPageView";

export const metadata: Metadata = {
  alternates: {
    languages: {
      en: "https://konfydence.com/lockscreens/workplace/order",
      de: "https://konfydence.com/de/lockscreens/workplace/order",
    },
  },
};

export default function WorkplaceLockscreenOrderPage() {
  return <OrderPageView tier="workplace" lang="en" />;
}
