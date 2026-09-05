import { CHALLENGE_COOKIE, CHALLENGE_TTL_SECONDS } from "./webauthn";

export { CHALLENGE_COOKIE, CHALLENGE_TTL_SECONDS };

export function challengeCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: CHALLENGE_TTL_SECONDS,
  };
}
