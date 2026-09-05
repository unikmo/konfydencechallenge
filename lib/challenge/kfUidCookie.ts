// The kf_uid cookie identifies the current challenge player row. After sign-in
// (stage 3) it is re-pointed at the account's consolidated player id so every
// existing cookie-based read keeps working.
export const KF_UID_COOKIE = "kf_uid";

export const KF_UID_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};
