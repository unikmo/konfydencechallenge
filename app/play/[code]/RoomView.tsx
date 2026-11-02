"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { persist } from "../persist";
import { HACK_LABELS_DE } from "@/lib/challenge/resultStrings";
import type { HackTrigger } from "@/lib/challenge/labels";
import type { UiLang } from "@/lib/challenge/uiStrings";

type AnswerKey = "A" | "B" | "C";
type State = {
  code: string;
  lang: UiLang;
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
const HACK_EN = { H: "Hurry", A: "Authority", C: "Comfort", K: "Kill-Switch" } as const;

const T = {
  en: {
    base: "/play",
    pricing: "/pricing",
    account: "/account",
    roomClosed: "Room closed.",
    roomClosedBody: "This room has ended or the code is wrong.",
    startNew: "Start a new one",
    joinRoom: (c: string) => `Join room ${c}`,
    whatName: "What should we call you?",
    started: "This room has started",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Sam",
    joinBtn: "Join the room",
    joining: "Joining…",
    startOwn: "Start your own",
    errName: "Enter a name.",
    errNameTaken: "That name's taken in this room.",
    errStarted: "This room has already started.",
    errFull: "This room is full.",
    errNoRoom: "No room with that code.",
    errJoin: "Couldn't join. Try again.",
    leave: "← Leave",
    scenarioOf: (i: number, n: number) => `Scenario ${i} / ${n}`,
    room: "Room",
    copied: "Copied ✓",
    copyLink: "Copy link",
    shareHost: "Share the link or code. When everyone's in, start the round.",
    shareGuest: "Share the link or code. When everyone's in, the host starts the round.",
    startRound: "Start the round",
    solo: " (solo)",
    waitingHost: (n: string) => `Waiting for ${n} to start…`,
    theHost: "the host",
    hint: "Six scenarios. Everyone answers the same one, then a reveal.",
    lockedIn: (names: string) => `Locked in. Waiting for ${names}…`,
    theReveal: "the reveal",
    revealNow: "Reveal now",
    reveal: "Reveal",
    rule: "Rule:",
    finalScores: "See final scores",
    next: "Next scenario →",
    wins: (n: string) => `${n} wins`,
    points: (p: number, n: number) => `${p} points across ${n} scenarios`,
    placed: (r: number, n: number) => `You placed #${r} of ${n}.`,
    fullChallenge: "Get the full Challenge",
    keepScore: "Keep my score",
    again: "Play another round",
    host: "host",
    inLobby: "in",
  },
  de: {
    base: "/de/spielen",
    pricing: "/de/pricing",
    account: "/account?lang=de",
    roomClosed: "Raum geschlossen.",
    roomClosedBody: "Dieser Raum ist beendet oder der Code stimmt nicht.",
    startNew: "Neuen Raum eröffnen",
    joinRoom: (c: string) => `Raum ${c} beitreten`,
    whatName: "Wie sollen wir dich nennen?",
    started: "Dieser Raum hat bereits begonnen",
    nameLabel: "Dein Name",
    namePlaceholder: "z. B. Sam",
    joinBtn: "Dem Raum beitreten",
    joining: "Tritt bei …",
    startOwn: "Eigenen Raum eröffnen",
    errName: "Gib einen Namen ein.",
    errNameTaken: "Diesen Namen gibt es in diesem Raum schon.",
    errStarted: "Dieser Raum hat bereits begonnen.",
    errFull: "Dieser Raum ist voll.",
    errNoRoom: "Zu diesem Code gibt es keinen Raum.",
    errJoin: "Der Beitritt hat nicht geklappt. Versuch es bitte noch einmal.",
    leave: "← Verlassen",
    scenarioOf: (i: number, n: number) => `Szenario ${i} / ${n}`,
    room: "Raum",
    copied: "Kopiert ✓",
    copyLink: "Link kopieren",
    shareHost: "Teile den Link oder den Code. Sind alle da, startest du die Runde.",
    shareGuest: "Teile den Link oder den Code. Sind alle da, startet die Gastgeberin oder der Gastgeber die Runde.",
    startRound: "Runde starten",
    solo: " (allein)",
    waitingHost: (n: string) => `Warten, bis ${n} die Runde startet …`,
    theHost: "die Gastgeberin oder der Gastgeber",
    hint: "Sechs Szenarien. Alle beantworten dasselbe, danach folgt die Auflösung.",
    lockedIn: (names: string) => `Antwort steht. Warten auf ${names} …`,
    theReveal: "die Auflösung",
    revealNow: "Jetzt auflösen",
    reveal: "Auflösung",
    rule: "Regel:",
    finalScores: "Endstand ansehen",
    next: "Nächstes Szenario →",
    wins: (n: string) => `${n} gewinnt`,
    points: (p: number, n: number) => `${p} Punkte in ${n} Szenarien`,
    placed: (r: number, n: number) => `Du bist Platz ${r} von ${n}.`,
    fullChallenge: "Zur vollen Challenge",
    keepScore: "Meinen Punktestand behalten",
    again: "Noch eine Runde spielen",
    host: "Gastgeber",
    inLobby: "dabei",
  },
} as const;

type Strings = (typeof T)[UiLang];

function hackName(key: string, lang: UiLang): string | null {
  if (lang === "de") return HACK_LABELS_DE[key as HackTrigger]?.public ?? null;
  const n = HACK_EN[key as keyof typeof HACK_EN];
  return n ? `${n} pressure` : null;
}

export default function RoomView({ params, lang: routeLang = "en" }: { params: Promise<{ code: string }>; lang?: UiLang }) {
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

  // The room carries its own language (its deck is single-language); the route's
  // language holds until the first poll lands.
  const lang: UiLang = state?.lang ?? routeLang;
  const t: Strings = T[lang];

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
      setJoinErr(t.errName);
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
          data.error === "name_taken" ? t.errNameTaken :
          data.error === "room_started" ? t.errStarted :
          data.error === "room_full" ? t.errFull :
          data.error === "room_not_found" ? t.errNoRoom :
          t.errJoin
        );
        setJoinBusy(false);
        return;
      }
      persist(CODE, data.playerId, n);
      setPlayerId(data.playerId);
      await poll();
    } catch {
      setJoinErr(t.errJoin);
    }
    setJoinBusy(false);
  }

  function copyLink() {
    const url = `${location.origin}${t.base}/${CODE}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (gone) {
    return (
      <Shell>
        <h1>{t.roomClosed}</h1>
        <p className="pl-lede">{t.roomClosedBody}</p>
        <Link className="pl-btn" href={t.base} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          {t.startNew}
        </Link>
      </Shell>
    );
  }

  // not in the room yet -> join form
  if (!state || state.you == null) {
    const canJoin = !state || state.status === "lobby";
    return (
      <Shell>
        <p className="pl-kicker">{t.joinRoom(CODE)}</p>
        <h1>{canJoin ? t.whatName : t.started}</h1>
        {canJoin ? (
          <>
            <label htmlFor="jn">{t.nameLabel}</label>
            <input id="jn" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} autoComplete="off" />
            <button className="pl-btn" onClick={doJoin} disabled={joinBusy}>{joinBusy ? t.joining : t.joinBtn}</button>
          </>
        ) : (
          <Link className="pl-btn" href={t.base} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>{t.startOwn}</Link>
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
        <Link href={t.base} className="pl-back">{t.leave}</Link>
        {state.status === "playing" || state.status === "revealed" ? (
          <span className="pl-progress">{t.scenarioOf(state.index + 1, state.total)}</span>
        ) : null}
      </div>

      {state.status === "lobby" ? (
        <>
          <p className="pl-kicker">{t.room}</p>
          <div className="pl-share">
            <span className="pl-code">{CODE}</span>
            <button className="pl-copy" onClick={copyLink}>{copied ? t.copied : t.copyLink}</button>
          </div>
          <p className="pl-lede">{me.isHost ? t.shareHost : t.shareGuest}</p>
          <Players state={state} meId={me.id} t={t} />
          {me.isHost ? (
            <button className="pl-btn" onClick={() => act({ action: "start" })} disabled={state.players.length < 1}>
              {t.startRound}{state.players.length < 2 ? t.solo : ""}
            </button>
          ) : (
            <p className="pl-wait">{t.waitingHost(state.players.find((p) => p.isHost)?.name ?? t.theHost)}</p>
          )}
          <p className="pl-hint">{t.hint}</p>
        </>
      ) : null}

      {state.status === "playing" && state.scenario ? (
        <>
          {state.scenario.hackKey && hackName(state.scenario.hackKey, lang) ? (
            <p className="pl-kicker">{hackName(state.scenario.hackKey, lang)}</p>
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
              {t.lockedIn(state.players.filter((p) => !p.answered).map((p) => p.name).join(", ") || t.theReveal)}
            </p>
          ) : null}
          {me.isHost && state.players.some((p) => p.answered) ? (
            <button className="pl-btn pl-btn-quiet" style={{ width: "100%", marginTop: 14 }} onClick={() => act({ action: "reveal" })}>
              {t.revealNow}
            </button>
          ) : null}
          <Players state={state} meId={me.id} t={t} compact />
        </>
      ) : null}

      {state.status === "revealed" && state.scenario && state.reveal ? (
        <>
          <p className="pl-kicker">{t.reveal}</p>
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
          {state.reveal.proTip ? <p className="pl-explain"><strong>{t.rule}</strong> {state.reveal.proTip}</p> : null}
          <div className="pl-picks">
            {state.reveal.picks.map((pk) => (
              <span key={pk.name} className="pl-pick">{pk.name}: {pk.key ?? "—"} (+{pk.points})</span>
            ))}
          </div>
          <Players state={state} meId={me.id} t={t} />
          <button className="pl-btn" onClick={() => act({ action: "next" })}>
            {state.index + 1 >= state.total ? t.finalScores : t.next}
          </button>
        </>
      ) : null}

      {state.status === "finished" ? (
        <>
          <div className="pl-win">
            <div className="pl-trophy">🏆</div>
            <h2>{t.wins(state.players[0]?.name ?? "")}</h2>
            <p>{t.points(state.players[0]?.score ?? 0, state.total)}</p>
          </div>
          <Players state={state} meId={me.id} t={t} />
          <p className="pl-hint">{t.placed(rank, state.players.length)}</p>
          <div className="pl-cta">
            <Link className="primary" href={t.pricing}>{t.fullChallenge}</Link>
            <Link className="quiet" href={t.account}>{t.keepScore}</Link>
          </div>
          <p className="pl-hint"><Link href={t.base} style={{ color: "#8a8378", fontWeight: 800 }}>{t.again}</Link></p>
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

function Players({ state, meId, compact, t }: { state: State; meId: string; compact?: boolean; t: Strings }) {
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
            {p.isHost ? <span className="pl-pmeta">&nbsp;· {t.host}</span> : null}
          </span>
          {state.status === "lobby" ? (
            <span className="pl-pmeta">{p.answered ? "" : t.inLobby}</span>
          ) : (
            <span className="pl-score">{p.score}</span>
          )}
        </div>
      ))}
    </div>
  );
}
