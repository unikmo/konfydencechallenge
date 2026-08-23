"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function analyticsAllowed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("analytics-consent") === "true";
}

function send(eventName: string, params: Record<string, string | number | boolean | undefined>) {
  if (!analyticsAllowed() || !window.gtag) return;
  const cleaned = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  window.gtag("event", eventName, cleaned);
}

function labelFor(target: Element | null) {
  if (!target) return "unknown";
  return (target.getAttribute("aria-label") || target.textContent || target.getAttribute("name") || "unknown")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 120);
}

export function AnalyticsInstrumentation() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const attribution = {
      source: params.get("utm_source") || undefined,
      medium: params.get("utm_medium") || undefined,
      campaign: params.get("utm_campaign") || undefined,
      referrer: document.referrer || undefined,
      landing_path: window.location.pathname,
    };

    if (attribution.source || attribution.medium || attribution.campaign || attribution.referrer) {
      send("landing_attribution", attribution);
    }

    const startedForms = new WeakSet<HTMLFormElement>();
    const submittedForms = new WeakSet<HTMLFormElement>();

    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      const form = target?.closest("form") as HTMLFormElement | null;
      if (!form || startedForms.has(form)) return;
      startedForms.add(form);
      send("form_start", {
        form_action: form.getAttribute("action") || window.location.pathname,
        form_name: form.getAttribute("name") || form.id || "unnamed",
        page_path: window.location.pathname,
      });
    };

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      submittedForms.add(form);
      send("form_submit", {
        form_action: form.getAttribute("action") || window.location.pathname,
        form_name: form.getAttribute("name") || form.id || "unnamed",
        page_path: window.location.pathname,
      });
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const actionable = target?.closest("a,button");
      if (!actionable) return;
      const href = actionable instanceof HTMLAnchorElement ? actionable.getAttribute("href") || undefined : undefined;
      const text = labelFor(actionable);
      const lower = `${text} ${href || ""}`.toLowerCase();
      const eventName = lower.includes("pilot")
        ? "pilot_cta_click"
        : lower.includes("challenge") || lower.includes("readiness") || lower.includes("test yourself")
          ? "challenge_cta_click"
          : lower.includes("report") || lower.includes("csv") || lower.includes("pdf")
            ? "report_export_click"
            : "cta_click";
      send(eventName, { label: text, destination: href, page_path: window.location.pathname });
    };

    const onPageHide = () => {
      document.querySelectorAll("form").forEach((form) => {
        const typed = form as HTMLFormElement;
        if (startedForms.has(typed) && !submittedForms.has(typed)) {
          send("form_abandon", {
            form_action: typed.getAttribute("action") || window.location.pathname,
            form_name: typed.getAttribute("name") || typed.id || "unnamed",
            page_path: window.location.pathname,
          });
        }
      });
    };

    document.addEventListener("focusin", onFocus);
    document.addEventListener("submit", onSubmit);
    document.addEventListener("click", onClick);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("submit", onSubmit);
      document.removeEventListener("click", onClick);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
