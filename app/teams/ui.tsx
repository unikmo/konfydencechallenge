"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";
import type { UiLang } from "@/lib/challenge/uiStrings";

const UI = {
  en: {
    copied: "Copied",
    copy: "Copy link",
    inviteLabel: "Invite by email — one per line, or comma-separated",
    inviteErr: "Could not send invites.",
    invited: (n: number) => `Invited ${n}.`,
    skipped: (n: number) => `${n} already on the team.`,
    noCap: (n: number) => `${n} need more seats.`,
    done: "Done.",
    net: "Network error. Try again.",
    sending: "Sending…",
    send: "Send invites",
    placeholder: "alex@company.com\nsam@company.com",
    seatsErr: "Could not change seats.",
    noChange: "No change.",
    updated: "Updated — Stripe will invoice the difference.",
    totalSeats: "Total seats",
    saving: "Saving…",
    update: "Update seats",
    confirmRemove: (e: string) => `Remove ${e} from the team? Their access ends immediately and the seat frees up.`,
    thisMember: "this member",
    remove: "Remove",
  },
  de: {
    copied: "Kopiert",
    copy: "Link kopieren",
    inviteLabel: "Per E-Mail einladen – eine Adresse pro Zeile oder durch Komma getrennt",
    inviteErr: "Die Einladungen konnten nicht verschickt werden.",
    invited: (n: number) => (n === 1 ? "1 Person eingeladen." : `${n} Personen eingeladen.`),
    skipped: (n: number) => (n === 1 ? "1 Person gehört schon zum Team." : `${n} Personen gehören schon zum Team.`),
    noCap: (n: number) => (n === 1 ? "Für 1 Person fehlt ein Platz." : `Für ${n} Personen fehlen Plätze.`),
    done: "Erledigt.",
    net: "Netzwerkfehler. Bitte versuch es noch einmal.",
    sending: "Wird gesendet …",
    send: "Einladungen senden",
    placeholder: "alex@firma.de\nsam@firma.de",
    seatsErr: "Die Anzahl der Plätze konnte nicht geändert werden.",
    noChange: "Keine Änderung.",
    updated: "Aktualisiert – Stripe stellt die Differenz in Rechnung.",
    totalSeats: "Plätze insgesamt",
    saving: "Wird gespeichert …",
    update: "Plätze aktualisieren",
    confirmRemove: (e: string) => `${e} aus dem Team entfernen? Der Zugang endet sofort und der Platz wird wieder frei.`,
    thisMember: "dieses Mitglied",
    remove: "Entfernen",
  },
} as const;

const field: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(11,27,43,0.20)",
  fontSize: 14,
  fontFamily: "inherit",
};
const btn: React.CSSProperties = {
  minHeight: 42,
  padding: "10px 16px",
  borderRadius: 999,
  border: "none",
  background: tokens.btnBlack,
  color: tokens.textOnDark,
  fontWeight: 900,
  fontSize: 13,
  cursor: "pointer",
};

export function CopyLink({ url, lang = "en" }: { url: string; lang?: UiLang }) {
  const t = UI[lang];
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <code style={{ ...field, width: "auto", flex: "1 1 260px", overflowX: "auto", whiteSpace: "nowrap" }}>{url}</code>
      <button
        type="button"
        style={{ ...btn, background: "transparent", color: tokens.btnBlack, border: `2px solid ${tokens.btnBlack}` }}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard blocked — the link is still selectable */
          }
        }}
      >
        {copied ? t.copied : t.copy}
      </button>
    </div>
  );
}

export function InviteForm({ lang = "en" }: { lang?: UiLang }) {
  const t = UI[lang];
  const router = useRouter();
  const [emails, setEmails] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, lang }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg((lang === "en" && data.error) || t.inviteErr);
      } else {
        const parts: string[] = [];
        if (data.invited?.length) parts.push(t.invited(data.invited.length));
        if (data.skipped?.length) parts.push(t.skipped(data.skipped.length));
        if (data.noCapacity?.length) parts.push(t.noCap(data.noCapacity.length));
        setMsg(parts.join(" ") || t.done);
        setEmails("");
        router.refresh();
      }
    } catch {
      setMsg(t.net);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label style={{ fontWeight: 800, fontSize: 13, display: "block", marginBottom: 6 }}>
        {t.inviteLabel}
      </label>
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        rows={3}
        placeholder={t.placeholder}
        style={{ ...field, resize: "vertical" }}
      />
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
        <button type="submit" style={btn} disabled={busy}>
          {busy ? t.sending : t.send}
        </button>
        {msg ? <span style={{ fontSize: 12, fontWeight: 700, color: tokens.textMuted }}>{msg}</span> : null}
      </div>
    </form>
  );
}

export function AddSeatsForm({ current, lang = "en" }: { current: number; lang?: UiLang }) {
  const t = UI[lang];
  const router = useRouter();
  const [seats, setSeats] = useState(current);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/teams/add-seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seats }),
      });
      const data = await res.json();
      if (!res.ok) setMsg((lang === "en" && data.error) || t.seatsErr);
      else {
        setMsg(data.unchanged ? t.noChange : t.updated);
        router.refresh();
      }
    } catch {
      setMsg(t.net);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <label style={{ fontWeight: 800, fontSize: 13 }}>{t.totalSeats}</label>
      <input
        type="number"
        min={3}
        max={500}
        value={seats}
        onChange={(e) => setSeats(Math.max(3, Math.min(500, Number(e.target.value) || 0)))}
        style={{ ...field, width: 90 }}
      />
      <button type="submit" style={btn} disabled={busy || seats === current}>
        {busy ? t.saving : t.update}
      </button>
      {msg ? <span style={{ fontSize: 12, fontWeight: 700, color: tokens.textMuted }}>{msg}</span> : null}
    </form>
  );
}

export function RemoveSeatButton({ seatId, email, lang = "en" }: { seatId: string; email: string; lang?: UiLang }) {
  const t = UI[lang];
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!window.confirm(t.confirmRemove(email))) return;
    setBusy(true);
    try {
      const res = await fetch("/api/teams/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      style={{
        background: "none",
        border: "none",
        color: "#8a2b2b",
        fontWeight: 800,
        fontSize: 12,
        cursor: "pointer",
        textDecoration: "underline",
      }}
    >
      {busy ? "…" : t.remove}
    </button>
  );
}
