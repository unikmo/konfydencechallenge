// Neutral age screen for the one place the free challenge asks for an email
// address (/challenge/register).
//
// Design rules (children's-data practice, GDPR Art. 8 / COPPA-style screens):
//  - neutral: free entry of birth month and year, no pre-selected answer and no
//    "are you over 13?" tick box that tells a child what to type;
//  - minimal: the birth date is never stored. Only a coarse age band is kept,
//    in a short-lived httpOnly cookie, so the screen cannot be re-taken with a
//    different answer on the back button;
//  - conservative: the age is computed as if the person were born on the last
//    day of the month they gave, so a borderline answer is treated as younger;
//  - tiered: under 13 cannot give an email address at all; 13 to 15 can only
//    register a parent or guardian's address; 16 and over register their own.
//
// Self-declaration is a proportionate control here because the only data
// collected is an email address for a progress link. It is not a verification
// of age, and the privacy policy says so.

export const AGE_BAND_COOKIE = "kf_age_band";
export const AGE_BAND_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export type AgeBand = "under13" | "13to15" | "16plus";

export const AGE_BANDS: readonly AgeBand[] = ["under13", "13to15", "16plus"];

export function isAgeBand(value: unknown): value is AgeBand {
  return typeof value === "string" && (AGE_BANDS as readonly string[]).includes(value);
}

/** Returns null when the month/year are missing or implausible. */
export function ageBandFromBirthMonth(month: number, year: number, now: Date = new Date()): AgeBand | null {
  if (!Number.isInteger(month) || !Number.isInteger(year)) return null;
  if (month < 1 || month > 12) return null;
  const thisYear = now.getUTCFullYear();
  if (year < thisYear - 110 || year > thisYear) return null;

  // Youngest the person could be: born on the last day of the stated month.
  const lastDay = new Date(Date.UTC(year, month, 0));
  let age = now.getUTCFullYear() - lastDay.getUTCFullYear();
  const hadBirthday =
    now.getUTCMonth() > lastDay.getUTCMonth() ||
    (now.getUTCMonth() === lastDay.getUTCMonth() && now.getUTCDate() >= lastDay.getUTCDate());
  if (!hadBirthday) age -= 1;
  if (age < 0) return null;

  if (age < 13) return "under13";
  if (age < 16) return "13to15";
  return "16plus";
}

export function readAgeBand(cookieHeader: string | null | undefined): AgeBand | null {
  const match = (cookieHeader ?? "").match(new RegExp(`(?:^|;\\s*)${AGE_BAND_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return isAgeBand(value) ? value : null;
}
