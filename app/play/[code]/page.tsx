"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { persist } from "../page";

type AnswerKey = "A" | "B" | "C";
type State = {
  code: string;
  status: "lobby" | "playing" | "revealed" | "finished";
  index: number;
  total: number;
  you: { id: string; name: string; isHost: boolean } | null;
  players: { id: string; name: string; score: number; answered: boolean; isHost: boolean }[];
  scenario: { prompt: string; hackKey: string | null; options: { key: AnswerKey; text: string }[] } | null;
  reveal: {
    bestKey: AnswerKey;
    scores: Record<AnswerKey, number>;
    explanation: string | null;
    proTip: string | null;
    picks: { name: string; key: AnswerKey | null; points: number }[];
  } | null;
  yourAnswer: AnswerKey | null;
};

const POLL_MS = 1600;
const HACK = { H: "Hurry", A: "Authority", C: "Comfort", K: "Kill-Switch" } as const;

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const CODE = code.toUpperCase();

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [state, setState] = useState<State | null>(null);
  const [gone, setGone] = useState(false);
  const [joinBusy, setJoinBusy] = useState(false);
  const [joinErr, setJoinErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const acting = useRef(false);

  // Recover this room's identity from localStorage (client-only store) once.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(`kf_play_${CODE}`);
    } catch {
      return;
    }
    if (!raw) return;
    try {
      const v = JSON.parse(raw) as { playerId?: string; name?: string };
      if (v?.playerId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage
        setPlayerId(v.playerId);
        setName(v.name ?? "");
      }
    } catch {
      /* ignore corrupt entry */
    }
  }, [CODE]);

  const poll = useCallback(async () => {
    try {
      const q = playerId ? `?p=${encodeURIComponent(playerId)}` : "";
      const res = await fetch(`/api/play/${CODE}${q}`, { cache: "no-store" });
      if (res.status === 404) {
        setGone(true);
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as State;
        setState(data);
        // our stored id no longer matches a player (room reset) — drop it
        if (playerId && data.you == null && data.status !== "lobby") setPlayerId(null);
      }
    } catch {
      /* transient */
    }
  }, [CODE, playerId]);

  useEffect(() => {
    // Poll the room API — the external system this effect subscribes to. Both
    // calls run from timer callbacks, so no setState fires synchronously here.
    const first = setTimeout(() => void poll(), 0);
    const iv = setInterval(() => void poll(), POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(iv);
    };
  }, [poll]);

  async function act(body: Record<string, unknown>) {
    if (acting.current) return;
    acting.current = true;
    try {
      const res = await fetch(`/api/play/${CODE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, playerId }),
      });
      const data = await res.json().catch(() => ({}));
      await poll();
      return { ok: res.ok, data };
    } finally {
      acting.current = false;
    }
  }

  async function doJoin() {
    const n = name.trim();
    if (n.length < 1) {
      setJoinErr("Enter a name.");
      return;
    }
    setJoinBusy(true);
    setJoinErr(null);
    try {
      const res = await fetch(`/api/play/${CODE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", name: n }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinErr(
          data.error === "name_taken" ? "That name's taken in this room." :
          data.error === "room_started" ? "This room has already started." :
          data.error === "room_full" ? "This room is full." :
          data.error === "room_not_found" ? "No room with that code." :
          "Couldn't join. Try again."
        );
        setJoinBusy(false);
        return;
      }
      persist(CODE, data.playerId, n);
      setPlayerId(data.playerId);
      await poll();
    } catch {
      setJoinErr("Couldn't join. Try again.");
    }
    setJoinBusy(false);
  }

  function copyLink() {
    const url = `${location.origin}/play/${CODE}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (gone) {
    return (
      <Shell>
        <h1>Room closed.</h1>
        <p className="pl-lede">This room has ended or the code is wrong.</p>
        <Link className="pl-btn" href="/play" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Start a new one
        </Link>
      </Shell>
    );
  }

  // not in the room yet -> join form
  if (!state || state.you == null) {
    const canJoin = !state || state.status === "lobby";
    return (
      <Shell>
        <p className="pl-kicker">Join room {CODE}</p>
        <h1>{canJoin ? "What should we call you?" : "This room has started"}</h1>
        {canJoin ? (
          <>
            <label htmlFor="jn">Your name</label>
            <input id="jn" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sam" autoComplete="off" />
            <button className="pl-btn" onClick={doJoin} disabled={joinBusy}>{joinBusy ? "Joining…" : "Join the room"}</button>
          </>
        ) : (
          <Link className="pl-btn" href="/play" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>Start your own</Link>
        )}
        {joinErr ? <p className="pl-error" role="alert">{joinErr}</p> : null}
      </Shell>
    );
  }

  const me = state.you;
  const rank = state.players.findIndex((p) => p.id === me.id) + 1;

  return (
    <Shell>
      <div className="pl-top">
        <Link href="/play" className="pl-back">← Leave</Link>
        {state.status === "playing" || state.status === "revealed" ? (
          <span className="pl-progress">Scenario {state.index + 1} / {state.total}</span>
        ) : null}
      </div>

      {state.status === "lobby" ? (
        <>
          <p className="pl-kicker">Room</p>
          <div className="pl-share">
            <span className="pl-code">{CODE}</span>
            <button className="pl-copy" onClick={copyLink}>{copied ? "Copied ✓" : "Copy link"}</button>
          </div>
          <p className="pl-lede">Share the link or code. When everyone's in, {me.isHost ? "start the round." : "the host starts the round."}</p>
          <Players state={state} meId={me.id} />
          {me.isHost ? (
            <button className="pl-btn" onClick={() => act({ action: "start" })} disabled={state.players.length < 1}>
              Start the round{state.players.length < 2 ? " (solo)" : ""}
            </button>
          ) : (
            <p className="pl-wait">Waiting for {state.players.find((p) => p.isHost)?.name ?? "the host"} to start…</p>
          )}
          <p className="pl-hint">Six scenarios. Everyone answers the same one, then a reveal.</p>
        </>
      ) : null}

      {state.status === "playing" && state.scenario ? (
        <>
          {state.scenario.hackKey && HACK[state.scenario.hackKey as keyof typeof HACK] ? (
            <p className="pl-kicker">{HACK[state.scenario.hackKey as keyof typeof HACK]} pressure</p>
          ) : null}
          <p className="pl-prompt">{state.scenario.prompt}</p>
          <div className="pl-opts">
            {state.scenario.options.map((o) => (
              <button
                key={o.key}
                className={`pl-opt ${state.yourAnswer === o.key ? "picked" : ""}`}
                disabled={state.yourAnswer != null}
                onClick={() => act({ action: "answer", index: state.index, key: o.key })}
              >
                <span className="pl-optk">{o.key}</span>{o.text}
              </button>
            ))}
          </div>
          {state.yourAnswer != null ? (
            <p className="pl-wait">
              Locked in. Waiting for {state.players.filter((p) => !p.answered).map((p) => p.name).join(", ") || "the reveal"}…
            </p>
          ) : null}
          {me.isHost && state.players.some((p) => p.answered) ? (
            <button className="pl-btn pl-btn-quiet" style={{ width: "100%", marginTop: 14 }} onClick={() => act({ action: "reveal" })}>
              Reveal now
            </button>
          ) : null}
          <Players state={state} meId={me.id} compact />
        </>
      ) : null}

      {state.status === "revealed" && state.scenario && state.reveal ? (
        <>
          <p className="pl-kicker">Reveal</p>
          <p className="pl-prompt">{state.scenario.prompt}</p>
          <div className="pl-opts">
            {state.scenario.options.map((o) => {
              const isBest = o.key === state.reveal!.bestKey;
              const mine = state.yourAnswer === o.key;
              return (
                <div key={o.key} className={`pl-opt ${isBest ? "best" : ""} ${mine ? "picked" : ""}`}>
                  <span className="pl-optpts">+{state.reveal!.scores[o.key]}</span>
                  <span className="pl-optk">{o.key}</span>{o.text}
                </div>
              );
            })}
          </div>
          {state.reveal.explanation ? <p className="pl-explain">{state.reveal.explanation}</p> : null}
          {state.reveal.proTip ? <p className="pl-explain"><strong>Rule:</strong> {state.reveal.proTip}</p> : null}
          <div className="pl-picks">
            {state.reveal.picks.map((pk) => (
              <span key={pk.name} className="pl-pick">{pk.name}: {pk.key ?? "—"} (+{pk.points})</span>
            ))}
          </div>
          <Players state={state} meId={me.id} />
          <button className="pl-btn" onClick={() => act({ action: "next" })}>
            {state.index + 1 >= state.total ? "See final scores" : "Next scenario →"}
          </button>
        </>
      ) : null}

      {state.status === "finished" ? (
        <>
          <div className="pl-win">
            <div className="pl-trophy">🏆</div>
            <h2>{state.players[0]?.name} wins</h2>
            <p>{state.players[0]?.score} points across {state.total} scenarios</p>
          </div>
          <Players state={state} meId={me.id} />
          <p className="pl-hint">You placed #{rank} of {state.players.length}.</p>
          <div className="pl-cta">
            <Link className="primary" href="/pricing">Get the full Challenge</Link>
            <Link className="quiet" href="/account">Keep my score</Link>
          </div>
          <p className="pl-hint"><Link href="/play" style={{ color: "#8a8378", fontWeight: 800 }}>Play another round</Link></p>
        </>
      ) : null}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="pl-wrap">
      <div className="pl-card">{children}</div>
    </main>
  );
}

function Players({ state, meId, compact }: { state: State; meId: string; compact?: boolean }) {
  return (
    <div className="pl-players" style={compact ? { marginTop: 18 } : undefined}>
      {state.players.map((p, i) => (
        <div key={p.id} className={`pl-player ${p.id === meId ? "me" : ""}`}>
          <span style={{ display: "flex", alignItems: "center" }}>
            {(state.status === "playing" || state.status === "lobby") ? (
              <span className={`pl-dot ${state.status === "lobby" ? "on" : p.answered ? "on" : ""}`} />
            ) : (
              <span className="pl-rank">{i + 1}</span>
            )}
            <span className="pl-pname">{p.name}</span>
            {p.isHost ? <span className="pl-pmeta">&nbsp;· host</span> : null}
          </span>
          {state.status === "lobby" ? (
            <span className="pl-pmeta">{p.answered ? "" : "in"}</span>
          ) : (
            <span className="pl-score">{p.score}</span>
          )}
        </div>
      ))}
    </div>
  );
}
