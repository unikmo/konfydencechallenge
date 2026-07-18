/**
 * Konfydence event tracking stubs.
 * Replace the `pushEvent` body with your analytics adapter (Segment, PostHog, etc.).
 */

type KonfydenceEvent =
  | { name: "path_selected"; path_type: "safety_suite" | "challenge" }
  | { name: "diagnostic_started"; edition: string; mode: string; session_id: string }
  | { name: "scenario_viewed"; session_id: string; scenario_index: number; total: number }
  | { name: "scenario_answered"; session_id: string; scenario_index: number; answer_key: string }
  | { name: "diagnostic_completed"; session_id: string; edition: string; mode: string }
  | { name: "result_viewed"; session_id: string; krs_score: number; pressure_pattern: string }
  | { name: "cta_clicked"; session_id: string; cta_label: string }
  | { name: "purchase_handoff_initiated"; session_id: string; edition: string; plan: string };

function pushEvent(event: KonfydenceEvent): void {
  if (typeof window === "undefined") return;
  // Stub: log to console. Wire to real analytics here.
  console.log("[konfydence:event]", event);
  // Example: window.analytics?.track(event.name, event);
  // Example: window.posthog?.capture(event.name, event);
}

export function trackPathSelected(path_type: "safety_suite" | "challenge"): void {
  pushEvent({ name: "path_selected", path_type });
}

export function trackDiagnosticStarted(session_id: string, edition: string, mode: string): void {
  pushEvent({ name: "diagnostic_started", edition, mode, session_id });
}

export function trackScenarioViewed(session_id: string, scenario_index: number, total: number): void {
  pushEvent({ name: "scenario_viewed", session_id, scenario_index, total });
}

export function trackScenarioAnswered(session_id: string, scenario_index: number, answer_key: string): void {
  pushEvent({ name: "scenario_answered", session_id, scenario_index, answer_key });
}

export function trackDiagnosticCompleted(session_id: string, edition: string, mode: string): void {
  pushEvent({ name: "diagnostic_completed", session_id, edition, mode });
}

export function trackResultViewed(session_id: string, krs_score: number, pressure_pattern: string): void {
  pushEvent({ name: "result_viewed", session_id, krs_score, pressure_pattern });
}

export function trackCtaClicked(session_id: string, cta_label: string): void {
  pushEvent({ name: "cta_clicked", session_id, cta_label });
}

export function trackPurchaseHandoffInitiated(session_id: string, edition: string, plan: string): void {
  pushEvent({ name: "purchase_handoff_initiated", session_id, edition, plan });
}
