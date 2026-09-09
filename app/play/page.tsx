"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PlayLandingPage() {
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
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      persist(data.code, data.playerId, name.trim() || "Host");
      router.push(`/play/${data.code}`);
    } catch {
      setError("Couldn't start a game just now. Try again.");
      setBusy(null);
    }
  }

  function join() {
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setError("Enter the 4-letter room code.");
      return;
    }
    router.push(`/play/${c}`);
  }

  return (
    <main className="pl-wrap">
      <div className="pl-card">
        <Link href="/challenge" className="pl-back">← Konfydence Challenge</Link>
        <p className="pl-kicker">Play with friends</p>
        <h1>Same scam. Same room. See who reads the pressure best.</h1>
        <p className="pl-lede">
          Start a room, share the link, and everyone answers the same six scenarios together — near or far.
          A running leaderboard, and a winner at the end.
        </p>

        <label htmlFor="pl-name">Your name</label>
        <input
          id="pl-name"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sam"
          autoComplete="off"
        />

        <button className="pl-btn" onClick={create} disabled={busy !== null}>
          {busy === "create" ? "Starting…" : "Start a room"}
        </button>

        <div className="pl-or"><span>or join one</span></div>

        <div className="pl-join">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ROOM CODE"
            maxLength={4}
            autoCapitalize="characters"
            autoComplete="off"
          />
          <button className="pl-btn pl-btn-quiet" onClick={join} disabled={busy !== null}>Join</button>
        </div>

        {error ? <p className="pl-error" role="alert">{error}</p> : null}
      </div>
    </main>
  );
}

export function persist(code: string, playerId: string, name: string) {
  try {
    localStorage.setItem(`kf_play_${code}`, JSON.stringify({ code, playerId, name }));
  } catch {
    /* private mode — the room still works for this tab via state */
  }
}
