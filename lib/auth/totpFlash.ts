export const TOTP_RECOVERY_FLASH_COOKIE = "kf_totp_recovery";

export function totpFlashCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/account/security",
    maxAge: 300,
  };
}
