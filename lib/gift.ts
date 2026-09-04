import { randomInt } from "crypto";

// No 0/O/1/I to avoid transcription errors.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** A human-readable gift code, e.g. "KFY-7Q2M-9XKD". */
export function generateGiftCode(): string {
  const block = () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `KFY-${block()}-${block()}`;
}

export const GIFT_EDITIONS = [
  { key: "family", label: "Family" },
  { key: "school", label: "School" },
  { key: "university", label: "University" },
  { key: "workplace", label: "Workplace" },
  { key: "travelsafe", label: "TravelSafe" },
] as const;

export type GiftEditionKey = (typeof GIFT_EDITIONS)[number]["key"];

export function giftSkuFor(choice: "all" | GiftEditionKey): string {
  return choice === "all" ? "CHAL-UNLIMITED" : `CHAL-SINGLE-${choice.toUpperCase()}`;
}
