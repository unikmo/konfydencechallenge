import type { Metadata } from "next";
import type { ReactNode } from "react";

// See app/pricing/layout.tsx for why this file exists — contact/page.tsx is
// "use client" and can't export metadata directly.
export const metadata: Metadata = {
  title: "Contact | Konfydence",
  description:
    "Get in touch with the Konfydence team — schools, universities, workplaces, and families asking about bulk licensing or partnerships welcome.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
