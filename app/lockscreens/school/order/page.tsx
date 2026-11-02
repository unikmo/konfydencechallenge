import type { Metadata } from "next";
import { OrderPageView } from "@/components/lockscreens/OrderPageView";

export const metadata: Metadata = {
  alternates: { canonical: "/lockscreens/school/order",
    languages: {
      en: "https://konfydence.com/lockscreens/school/order",
      de: "https://konfydence.com/de/lockscreens/school/order",
    },
  },
};

export default function SchoolLockscreenOrderPage() {
  return <OrderPageView tier="school" lang="en" />;
}
