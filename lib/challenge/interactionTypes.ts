export type ChallengeInteractionType = "choice" | "completion";

const COMPLETION_IDS = new Set([
  "travelsafe-airline-refund-email-TRA-01",
  "travelsafe-award-seat-countdown-TRA-02",
  "travelsafe-miles-expiry-panic-TRA-06",
  "travelsafe-transfer-bonus-ad-TRA-07",
  "travelsafe-sim-card-kiosk-TRA-10",
  "travelsafe-atm-helper-TRA-18",
  "travelsafe-lost-passport-service-TRA-20",
  "travelsafe-qr-menu-payment-TRA-28",
  "travelsafe-fake-roaming-alert-TRA-43",
  "travelsafe-taxi-card-skimmer-TRA-50",
]);

const LIGHT_LINES: Record<string, string> = {
  "travelsafe-fake-taxi-qr-TRA-09": "A mystery QR code is not a VIP upgrade.",
  "travelsafe-atm-helper-TRA-18": "A helpful stranger at an ATM is not your new financial adviser.",
  "travelsafe-fake-roaming-alert-TRA-43": "Your phone has not developed a personal grudge against roaming.",
  "travelsafe-fake-event-ticket-abroad-TRA-35": "A last-minute bargain is still allowed to wait for verification.",
};

export function getScenarioInteraction(externalId: string): {
  type: ChallengeInteractionType;
  lightLine?: string;
} {
  return {
    type: COMPLETION_IDS.has(externalId) ? "completion" : "choice",
    lightLine: LIGHT_LINES[externalId],
  };
}
