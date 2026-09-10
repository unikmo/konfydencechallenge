"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";

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

export function CopyLink({ url }: { url: string }) {
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
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

export function InviteForm() {
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
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Could not send invites.");
      } else {
        const parts: string[] = [];
        if (data.invited?.length) parts.push(`Invited ${data.invited.length}.`);
        if (data.skipped?.length) parts.push(`${data.skipped.length} already on the team.`);
        if (data.noCapacity?.length) parts.push(`${data.noCapacity.length} need more seats.`);
        setMsg(parts.join(" ") || "Done.");
        setEmails("");
        router.refresh();
      }
    } catch {
      setMsg("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label style={{ fontWeight: 800, fontSize: 13, display: "block", marginBottom: 6 }}>
        Invite by email — one per line, or comma-separated
      </label>
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        rows={3}
        placeholder="alex@company.com&#10;sam@company.com"
        style={{ ...field, resize: "vertical" }}
      />
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
        <button type="submit" style={btn} disabled={busy}>
          {busy ? "Sending…" : "Send invites"}
        </button>
        {msg ? <span style={{ fontSize: 12, fontWeight: 700, color: tokens.textMuted }}>{msg}</span> : null}
      </div>
    </form>
  );
}

export function AddSeatsForm({ current }: { current: number }) {
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
      if (!res.ok) setMsg(data.error || "Could not change seats.");
      else {
        setMsg(data.unchanged ? "No change." : "Updated — Stripe will invoice the difference.");
        router.refresh();
      }
    } catch {
      setMsg("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <label style={{ fontWeight: 800, fontSize: 13 }}>Total seats</label>
      <input
        type="number"
        min={3}
        max={500}
        value={seats}
        onChange={(e) => setSeats(Math.max(3, Math.min(500, Number(e.target.value) || 0)))}
        style={{ ...field, width: 90 }}
      />
      <button type="submit" style={btn} disabled={busy || seats === current}>
        {busy ? "Saving…" : "Update seats"}
      </button>
      {msg ? <span style={{ fontSize: 12, fontWeight: 700, color: tokens.textMuted }}>{msg}</span> : null}
    </form>
  );
}

export function RemoveSeatButton({ seatId, email }: { seatId: string; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!window.confirm(`Remove ${email} from the team? Their access ends immediately and the seat frees up.`)) return;
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
      {busy ? "…" : "Remove"}
    </button>
  );
}
