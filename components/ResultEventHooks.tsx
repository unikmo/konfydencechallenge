"use client";

import { useEffect } from "react";
import { trackResultViewed, trackCtaClicked, trackPurchaseHandoffInitiated } from "@/lib/events";

interface ResultViewProps {
  sessionId: string;
  krsScore: number;
  pressurePattern: string;
}

export function ResultViewedHook({ sessionId, krsScore, pressurePattern }: ResultViewProps) {
  useEffect(() => {
    trackResultViewed(sessionId, krsScore, pressurePattern);
  }, [sessionId, krsScore, pressurePattern]);

  return null;
}

interface CtaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sessionId: string;
  ctaLabel: string;
  edition?: string;
  plan?: string;
  isPurchase?: boolean;
  children: React.ReactNode;
}

export function TrackedCtaButton({
  sessionId,
  ctaLabel,
  edition,
  plan,
  isPurchase,
  onClick,
  children,
  ...rest
}: CtaButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    trackCtaClicked(sessionId, ctaLabel);
    if (isPurchase && edition && plan) {
      trackPurchaseHandoffInitiated(sessionId, edition, plan);
    }
    onClick?.(e);
  }

  return (
    <button {...rest} onClick={handleClick}>
      {children}
    </button>
  );
}
