"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { persist } from "./persist";
import type { UiLang } from "@/lib/challenge/uiStrings";

const T = {
  en: {
    base: "/play",
    back: "← Konfydence Challenge",
    backHref: "/challenge",
    kicker: "Play with friends",
    h1: "Same scam. Same room. See who reads the pressure best.",
    lede:
      "Start a room, share the link, and everyone answers the same six scenarios together — near or far. A running leaderboard, and a winner at the end.",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Sam",
    hostFallback: "Host",
    start: "Start a room",
    starting: "Starting…",
    or: "or join one",
    codePlaceholder: "ROOM CODE",
    join: "Join",
    errStart: "Couldn't start a game just now. Try again.",
    errCode: "Enter the 4-letter room code.",
  },
  de: {
    base: "/de/spielen",
    back: "← Konfydence Challenge",
    backHref: "/de/challenge",
    kicker: "Gemeinsam spielen",
    h1: "Sechs Situationen. Ein Spiel. Wer entscheidet am sichersten?",
    lede:
      "Erstelle einen Spielraum und teile den Link. Alle spielen dieselben sechs Situationen durch – gemeinsam vor Ort oder von verschiedenen Orten aus. Die Rangliste zeigt, wer am Ende die sichersten Entscheidungen getroffen hat.",
    nameLabel: "Dein Name",
    namePlaceholder: "z. B. Sam",
    hostFallback: "Gastgeber",
    start: "Spielraum erstellen",
    starting: "Wird gestartet …",
    or: "Oder einem bestehenden Spiel beitreten",
    codePlaceholder: "RAUMCODE",
    join: "Beitreten",
    errStart: "Das Spiel konnte gerade nicht gestartet werden. Versuch es bitte noch einmal.",
    errCode: "Gib den vierstelligen Raumcode ein.",
  },
} as const;

export default function PlayLanding({ lang }: { lang: UiLang }) {
  const t = T[lang];
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setBusy("create");
    setError(null);
    try {
      const res = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      persist(data.code, data.playerId, name.trim() || t.hostFallback);
      router.push(`${t.base}/${data.code}`);
    } catch {
      setError(t.errStart);
      setBusy(null);
    }
  }

  function join() {
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setError(t.errCode);
      return;
    }
    router.push(`${t.base}/${c}`);
  }

  return (
    <main className="pl-wrap">
      <div className="pl-card">
        <Link href={t.backHref} className="pl-back">{t.back}</Link>
        <p className="pl-kicker">{t.kicker}</p>
        <h1>{t.h1}</h1>
        <p className="pl-lede">{t.lede}</p>

        <label htmlFor="pl-name">{t.nameLabel}</label>
        <input
          id="pl-name"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          autoComplete="off"
        />

        <button className="pl-btn" onClick={create} disabled={busy !== null}>
          {busy === "create" ? t.starting : t.start}
        </button>

        <div className="pl-or"><span>{t.or}</span></div>

        <div className="pl-join">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t.codePlaceholder}
            maxLength={4}
            autoCapitalize="characters"
            autoComplete="off"
          />
          <button className="pl-btn pl-btn-quiet" onClick={join} disabled={busy !== null}>{t.join}</button>
        </div>

        {error ? <p className="pl-error" role="alert">{error}</p> : null}
      </div>
    </main>
  );
}
