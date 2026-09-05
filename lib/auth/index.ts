// Unified accounts — public surface (docs/UNIFIED_ACCOUNTS_PLAN.md).

export {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  SESSION_RENEW_WITHIN_MS,
  generateSessionToken,
  hashSessionToken,
  hashIp,
  sessionCookieOptions,
} from "./tokens";

export { normalizeEmail, isValidEmail } from "./email";

export {
  createSession,
  validateSessionToken,
  invalidateSession,
  invalidateAllSessions,
  invalidateOtherSessions,
  pruneExpiredSessions,
  setSessionCookie,
  clearSessionCookie,
  getSessionTokenFromCookie,
  getAccount,
  getSession,
  type CreatedSession,
  type SessionValidation,
} from "./session";

export {
  findOrCreateAccount,
  findAccountByEmail,
  markEmailVerified,
} from "./account";

export {
  issueLoginCode,
  verifyLoginCode,
  verifyLoginLink,
  type IssueResult,
  type VerifyResult,
} from "./loginCode";

export { consumeRateLimit, rateLimitKey, pruneRateLimits } from "./rateLimit";
export { getClientIp } from "./request";
