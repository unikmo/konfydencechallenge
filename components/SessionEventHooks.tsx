"use client";

import { useEffect, useRef } from "react";
import {
  trackDiagnosticStarted,
  trackScenarioViewed,
  trackScenarioAnswered,
  trackDiagnosticCompleted,
} from "@/lib/events";

interface Props {
  sessionId: string;
  edition: string;
  mode: string;
  scenarioIndex: number;
  totalScenarios: number;
  isFirstScenario: boolean;
  isComplete?: boolean;
}

export function SessionEventHooks({
  sessionId,
  edition,
  mode,
  scenarioIndex,
  totalScenarios,
  isFirstScenario,
  isComplete,
}: Props) {
  const firedStart = useRef(false);

  useEffect(() => {
    if (isComplete) {
      trackDiagnosticCompleted(sessionId, edition, mode);
      return;
    }
    if (isFirstScenario && !firedStart.current) {
      firedStart.current = true;
      trackDiagnosticStarted(sessionId, edition, mode);
    }
    trackScenarioViewed(sessionId, scenarioIndex, totalScenarios);
  }, [sessionId, edition, mode, scenarioIndex, totalScenarios, isFirstScenario, isComplete]);

  return null;
}

interface AnswerTrackerProps {
  sessionId: string;
  scenarioIndex: number;
}

export function AnswerTrackerForm({
  sessionId,
  scenarioIndex,
  children,
}: AnswerTrackerProps & { children: React.ReactNode }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const selected = (form.querySelector('input[name="selectedAnswerKey"]:checked') as HTMLInputElement | null)?.value;
    if (selected) {
      trackScenarioAnswered(sessionId, scenarioIndex, selected);
    }
  }

  return (
    <form
      method="post"
      action={`/challenge/session/${sessionId}/submit`}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}
