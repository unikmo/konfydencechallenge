"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, type CSSProperties } from "react";
import {
  MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST,
  SCAM_SAFETY_RESOURCES,
  type ScamSafetyResource,
  type ScamSafetyResourceKind,
} from "@/lib/scamSafetyResources";

const GROUPS: Array<{
  kind: ScamSafetyResourceKind;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  {
    kind: "protocol",
    eyebrow: "Household protocol",
    title: "Emergency Scam Protocol",
    description: "The printable Pause · Ask · Think response sheet for the household. Free.",
  },
];

function previewStyle(resource: ScamSafetyResource): CSSProperties {
  if (resource.kind === "protocol") {
    return {
      backgroundImage: 'url("/resources/scam-safety/protocol-preview.webp")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
    };
  }

  const index = Math.max(0, Number.parseInt(resource.id.split("-")[1] || "1", 10) - 1);
  const columns = 4;
  const rows = resource.kind === "phone" ? 3 : 2;
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = columns > 1 ? (column * 100) / (columns - 1) : 0;
  const y = rows > 1 ? (row * 100) / (rows - 1) : 0;

  return {
    backgroundImage: `url("/resources/scam-safety/${resource.kind}-sprite.webp")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `${x}% ${y}%`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
  };
}

function ResourceCard({
  resource,
  selected,
  atLimit,
  onToggle,
}: {
  resource: ScamSafetyResource;
  selected: boolean;
  atLimit: boolean;
  onToggle: (resource: ScamSafetyResource) => void;
}) {
  return (
    <button
      type="button"
      className={`k-resource-choice ${resource.kind === "protocol" ? "is-protocol" : ""} ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
      aria-disabled={atLimit && !selected}
      aria-label={`${selected ? "Remove" : "Choose"} ${resource.label}`}
      onClick={() => onToggle(resource)}
    >
      <span className="k-resource-image-wrap" aria-hidden="true">
        <span
          className={`k-resource-preview k-resource-preview-${resource.kind}`}
          style={previewStyle(resource)}
        />
      </span>
      <span className="k-resource-choice-copy">
        <small>{resource.kind === "protocol" ? "PDF" : resource.kind === "phone" ? "Phone" : "Computer"}</small>
        <strong>{resource.shortLabel}</strong>
        <span>{selected ? "Selected" : atLimit ? "3 selected" : "Choose"}</span>
      </span>
    </button>
  );
}

export function ScamSafetyPack({ source = "site" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedResources = useMemo(
    () => SCAM_SAFETY_RESOURCES.filter((resource) => selectedIds.includes(resource.id)),
    [selectedIds]
  );

  const atLimit = selectedIds.length >= MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST;

  function toggleResource(resource: ScamSafetyResource) {
    if (status === "submitting") return;

    setMessage("");
    setStatus("idle");

    if (selectedIds.includes(resource.id)) {
      setSelectedIds((current) => current.filter((id) => id !== resource.id));
      return;
    }

    if (atLimit) {
      setMessage(`Choose a maximum of ${MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST} resources per request.`);
      return;
    }

    setSelectedIds((current) => [...current, resource.id]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (selectedIds.length === 0) {
      setStatus("error");
      setMessage("Choose at least one resource first.");
      return;
    }

    if (selectedIds.length > MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST) {
      setStatus("error");
      setMessage(`Choose no more than ${MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST} resources.`);
      return;
    }

    setStatus("submitting");

    const form = new FormData(event.currentTarget);
    const honeypot = String(form.get("website") || "");

    try {
      const response = await fetch("/api/resources/scam-safety-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          marketingConsent,
          source,
          selections: selectedIds,
          website: honeypot,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Unable to prepare your resources right now.");
      }

      setStatus("success");
      setMessage(
        payload.emailSent
          ? "Your selected files are ready below and have also been sent to your inbox."
          : "Your selected files are ready below. Email delivery is temporarily unavailable."
      );

      const analyticsWindow = window as unknown as {
        gtag?: (...args: unknown[]) => void;
      };
      analyticsWindow.gtag?.("event", "generate_lead", {
        lead_type: "scam_safety_resources",
        lead_source: source,
        resources_requested: selectedIds.join(","),
        resource_count: selectedIds.length,
        marketing_opt_in: marketingConsent,
        email_delivery: payload.emailSent === true,
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="free-scam-safety-pack" className="k-shell k-free-pack" aria-labelledby={`free-pack-title-${source}`}>
      <div className="k-free-pack-head">
        <div>
          <p className="k-kicker">Free household resource</p>
          <h2 id={`free-pack-title-${source}`} className="k-display-sm">The one reminder every household should have.</h2>
        </div>
        <div>
          <p className="k-copy">
            The Emergency Scam Protocol is a free, printable Pause · Ask · Think response sheet. Pick it below and we&apos;ll email it to you. Looking for phone and desktop lock screens? Those are now the <Link href="/lockscreens">Konfydence Lockscreens</Link> service.
          </p>
        </div>
      </div>

      <div className="k-resource-groups">
        {GROUPS.map((group) => {
          const resources = SCAM_SAFETY_RESOURCES.filter((resource) => resource.kind === group.kind);
          return (
            <section key={group.kind} className={`k-resource-group k-resource-group-${group.kind}`} aria-labelledby={`${source}-${group.kind}-title`}>
              <header>
                <div>
                  <small>{group.eyebrow}</small>
                  <h3 id={`${source}-${group.kind}-title`}>{group.title}</h3>
                </div>
                <p>{group.description}</p>
              </header>
              <div className="k-resource-rail">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    selected={selectedIds.includes(resource.id)}
                    atLimit={atLimit}
                    onToggle={toggleResource}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {status === "success" ? (
        <div className="k-pack-success" role="status" aria-live="polite">
          <div>
            <p className="k-kicker">Ready</p>
            <strong>{message}</strong>
          </div>
          <div className="k-pack-downloads">
            {selectedResources.map((item) => (
              <a key={item.id} href={item.downloadPath}>
                <span>{item.kind === "protocol" ? "PDF" : item.kind.toUpperCase()}</span>
                <b>{item.label}</b>
                <small>{item.detail}</small>
              </a>
            ))}
          </div>
          <button
            type="button"
            className="k-button-quiet"
            onClick={() => {
              setStatus("idle");
              setMessage("");
              setSelectedIds([]);
              setEmail("");
              setMarketingConsent(false);
            }}
          >
            Choose another set
          </button>
        </div>
      ) : (
        <form className="k-pack-form k-pack-form-selection" onSubmit={handleSubmit}>
          <div className="k-pack-form-summary">
            <div>
              <small>Your selection</small>
              <strong>
                {selectedResources.length > 0
                  ? selectedResources.map((resource) => resource.shortLabel).join(" · ")
                  : "Select the protocol above"}
              </strong>
            </div>
          </div>

          <label htmlFor={`pack-email-${source}`}>Email address</label>
          <div className="k-pack-form-row">
            <input
              id={`pack-email-${source}`}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="k-button" type="submit" disabled={status === "submitting" || selectedIds.length === 0}>
              {status === "submitting" ? "Sending…" : "Email my selected files"}
            </button>
          </div>

          <label className="k-pack-optin">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
            />
            <span>Also send me occasional scam-safety tips from Konfydence. Optional.</span>
          </label>

          <input className="k-pack-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <p className="k-pack-privacy">
            We use your email to deliver the resources you request. Marketing is separate and optional. See our <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>
          {message ? <p className={status === "error" ? "k-pack-error" : "k-pack-note"} role={status === "error" ? "alert" : "status"}>{message}</p> : null}
        </form>
      )}
    </section>
  );
}
