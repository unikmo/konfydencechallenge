import { createHash } from "crypto";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth/email";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { UNSUBSCRIBE_STRINGS } from "@/lib/challenge/accountStrings";

export const metadata: Metadata = {
  title: { absolute: "Unsubscribe | Konfydence" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function expectedSig(email: string): string {
  return createHash("sha256")
    .update(`${process.env.AUTH_SECRET || process.env.DATABASE_URL || "kf"}\0unsub\0${email}`)
    .digest("base64url")
    .slice(0, 24);
}

export default async function UnsubscribePage(props: {
  searchParams: Promise<{ e?: string; s?: string; lang?: string }>;
}) {
  const sp = await props.searchParams;
  const lang: UiLang = sp.lang === "de" ? "de" : "en";
  const t = UNSUBSCRIBE_STRINGS[lang];
  const email = normalizeEmail(sp.e ?? "");
  const ok = email && sp.s && sp.s === expectedSig(email);

  let done = false;
  if (ok) {
    const account = await prisma.account.findUnique({ where: { email }, select: { id: true } });
    if (account) {
      await prisma.account.update({ where: { id: account.id }, data: { emailOptOut: true } });
    }
    done = true;
  }

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <p className="k-kicker">{t.kicker}</p>
        {done ? (
          <>
            <h1>{t.doneHeading}</h1>
            <p>{t.doneBody(email)}</p>
          </>
        ) : (
          <>
            <h1>{t.invalidHeading}</h1>
            <p>{t.invalidBody}</p>
          </>
        )}
        <Link className="k-button" href="/">{t.backHome}</Link>
      </section>
    </main>
  );
}
