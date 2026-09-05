import { createHash } from "crypto";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth/email";

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
  searchParams: Promise<{ e?: string; s?: string }>;
}) {
  const sp = await props.searchParams;
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
        <p className="k-kicker">Email preferences</p>
        {done ? (
          <>
            <h1>You&rsquo;re unsubscribed.</h1>
            <p>
              We won&rsquo;t send <strong>{email}</strong> non-essential email. You&rsquo;ll still get things you
              directly ask for, like a sign-in code.
            </p>
          </>
        ) : (
          <>
            <h1>That link didn&rsquo;t check out.</h1>
            <p>The unsubscribe link may be old or altered. Contact us and we&rsquo;ll sort it.</p>
          </>
        )}
        <Link className="k-button" href="/">Back to Konfydence</Link>
      </section>
    </main>
  );
}
