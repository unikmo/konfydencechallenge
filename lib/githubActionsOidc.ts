import { createPublicKey, verify } from "node:crypto";

const ISSUER = "https://token.actions.githubusercontent.com";
const AUDIENCE = "konfydence-comasy-e2e";
const REPOSITORY = "unikmo/konfydencechallenge";
const MAIN_REF = "refs/heads/main";

type GitHubOidcClaims = {
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  repository?: string;
  ref?: string;
  event_name?: string;
  sub?: string;
};

type JwkSet = { keys: Array<JsonWebKey & { kid?: string; alg?: string }> };

let cachedJwks: { expiresAt: number; value: JwkSet } | null = null;

function decodeJson<T>(segment: string): T {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as T;
}

async function getJwks() {
  const now = Date.now();
  if (cachedJwks && cachedJwks.expiresAt > now) return cachedJwks.value;

  const configResponse = await fetch(`${ISSUER}/.well-known/openid-configuration`, { cache: "no-store" });
  if (!configResponse.ok) throw new Error("github_oidc_configuration_unavailable");
  const config = (await configResponse.json()) as { jwks_uri?: string };
  if (!config.jwks_uri?.startsWith(`${ISSUER}/`)) throw new Error("github_oidc_invalid_jwks_uri");

  const jwksResponse = await fetch(config.jwks_uri, { cache: "no-store" });
  if (!jwksResponse.ok) throw new Error("github_oidc_jwks_unavailable");
  const value = (await jwksResponse.json()) as JwkSet;
  cachedJwks = { expiresAt: now + 10 * 60 * 1000, value };
  return value;
}

export async function verifyGitHubActionsOidc(authorization: string | null) {
  if (!authorization?.startsWith("Bearer ")) throw new Error("github_oidc_missing_token");
  const token = authorization.slice("Bearer ".length).trim();
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("github_oidc_malformed_token");

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = decodeJson<{ alg?: string; kid?: string }>(encodedHeader);
  if (header.alg !== "RS256" || !header.kid) throw new Error("github_oidc_invalid_header");

  const jwks = await getJwks();
  const jwk = jwks.keys.find((key) => key.kid === header.kid && (!key.alg || key.alg === "RS256"));
  if (!jwk) throw new Error("github_oidc_unknown_key");

  const key = createPublicKey({ key: jwk, format: "jwk" });
  const signatureValid = verify(
    "RSA-SHA256",
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    key,
    Buffer.from(encodedSignature, "base64url"),
  );
  if (!signatureValid) throw new Error("github_oidc_invalid_signature");

  const claims = decodeJson<GitHubOidcClaims>(encodedPayload);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : claims.aud ? [claims.aud] : [];

  if (claims.iss !== ISSUER) throw new Error("github_oidc_invalid_issuer");
  if (!audiences.includes(AUDIENCE)) throw new Error("github_oidc_invalid_audience");
  if (!claims.exp || claims.exp < nowSeconds - 30) throw new Error("github_oidc_expired");
  if (claims.nbf && claims.nbf > nowSeconds + 30) throw new Error("github_oidc_not_yet_valid");
  if (claims.iat && claims.iat > nowSeconds + 30) throw new Error("github_oidc_invalid_iat");
  if (claims.repository !== REPOSITORY) throw new Error("github_oidc_invalid_repository");
  if (claims.ref !== MAIN_REF) throw new Error("github_oidc_invalid_ref");
  if (claims.event_name !== "push") throw new Error("github_oidc_invalid_event");
  if (claims.sub !== `repo:${REPOSITORY}:ref:${MAIN_REF}`) throw new Error("github_oidc_invalid_subject");

  return claims;
}
