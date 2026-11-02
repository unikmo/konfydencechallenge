import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Your Konfydence screen" },
  robots: { index: false, follow: false },
};

const PERSONAL_TRACKS = new Set(["home", "teen"]);

// Phone-only viewer for the Personal engine (Home/Teen Home). This is the
// page the onboarding and fortnightly digest emails link to -- the
// delivery mechanism itself, since there's no MDM to push the image
// automatically to a personal device. The image src is the stateless
// rotating resolver, so this page never goes stale on its own.
export default async function LockscreenViewerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tenant = await prisma.lockscreenTenant.findUnique({ where: { token } });

  if (!tenant || !PERSONAL_TRACKS.has(tenant.kind) || tenant.tokenStatus !== "active") {
    notFound();
  }

  const imageSrc = `/api/l/${token}/current/phone`;
  // Home/Teen buyers who checked out in German get the German viewer (the emailed link is the same URL).
  const de = tenant.lang === "de";
  const t = de
    ? {
        h1: "Dein aktueller Screen",
        lede: "Speichere ihn als Sperrbildschirm deines Handys. In zwei Wochen schicken wir dir den nächsten – dieser Link zeigt immer den Screen, der gerade aktuell ist.",
        alt: "Dein aktueller Konfydence-Sperrbildschirm",
        iphone: "iPhone:",
        iphoneBody: "Halte das Bild oben gedrückt, tippe auf „Bild sichern“, dann Einstellungen → Hintergrundbild → Neues Hintergrundbild hinzufügen.",
        android: "Android:",
        androidBody: "Halte das Bild oben gedrückt, tippe auf „Herunterladen“, dann Einstellungen → Hintergrundbild → das gespeicherte Bild auswählen.",
        trouble: "Der Screen lädt nicht?",
        contact: "Schreib uns",
        contactHref: "/de/kontakt",
      }
    : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111417",
        color: "#fffdf9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 20px 40px",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#af8752", marginBottom: 6 }}>
        Konfydence
      </p>
      <h1 style={{ fontSize: 22, margin: "0 0 4px", textAlign: "center" }}>{t ? t.h1 : "Your current screen"}</h1>
      <p style={{ fontSize: 13, color: "#a8a49a", margin: "0 0 22px", textAlign: "center", maxWidth: 340 }}>
        {t
          ? t.lede
          : "Save this as your phone's lock screen. We'll email you the next one in two weeks — this link always shows whichever screen is current."}
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={t ? t.alt : "Your current Konfydence lock screen"}
        style={{
          width: "min(320px, 82vw)",
          aspectRatio: "9 / 16",
          objectFit: "cover",
          borderRadius: 18,
          boxShadow: "0 18px 40px rgba(0,0,0,.45)",
        }}
      />

      <div style={{ marginTop: 28, maxWidth: 360, fontSize: 13, color: "#d8d4c9", lineHeight: 1.6 }}>
        <p style={{ margin: "0 0 10px" }}>
          <strong style={{ color: "#fffdf9" }}>{t ? t.iphone : "iPhone:"}</strong>{" "}
          {t ? t.iphoneBody : "press and hold the image above, tap “Save Image,” then Settings → Wallpaper → Add New Wallpaper."}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: "#fffdf9" }}>{t ? t.android : "Android:"}</strong>{" "}
          {t ? t.androidBody : "tap and hold the image above, tap “Download,” then Settings → Wallpaper → pick the saved image."}
        </p>
      </div>

      <p style={{ marginTop: 30, fontSize: 12, color: "#66645f" }}>
        {t ? t.trouble : "Trouble loading your screen?"}{" "}
        <Link href={t ? t.contactHref : "/contact"} style={{ color: "#af8752" }}>{t ? t.contact : "Contact us"}</Link>.
      </p>
    </main>
  );
}
