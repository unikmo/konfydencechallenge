const ISSUER = "https://token.actions.githubusercontent.com";
const AUDIENCE = "konfydence-comasy-e2e";
const REPOSITORY = "unikmo/konfydencechallenge";
const REPOSITORY_ID = "1275860671";
const REPOSITORY_OWNER_ID = "261606017";
const MAIN_REF = "refs/heads/main";

type GitHubOidcClaims = {
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  repository?: string;
  repository_id?: string;
  repository_owner_id?: string;
  ref?: string;
  event_name?: string;
  sub?: string;
};

type GitHubJwk = JsonWebKey & { kid?: string; alg?: string; use?: string };
type JwkSet = { keys: GitHubJwk[] };

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

async function verifySignature(jwk: GitHubJwk, signingInput: string, encodedSignature: string) {
  const key = await globalThis.crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const data = new TextEncoder().encode(signingInput);
  const signature = Uint8Array.from(Buffer.from(encodedSignature, "base64url"));
  return globalThis.crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, data);
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
  const jwk = jwks.keys.find(
    (candidate) => candidate.kid === header.kid && (!candidate.alg || candidate.alg === "RS256"),
  );
  if (!jwk) throw new Error("github_oidc_unknown_key");

  const signatureValid = await verifySignature(
    jwk,
    `${encodedHeader}.${encodedPayload}`,
    encodedSignature,
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

  // Bind the token to this exact repository identity, branch and event.
  // The stable numeric IDs remain valid across repository/owner renames and
  // avoid relying on GitHub's evolving `sub` string serialization.
  if (claims.repository !== REPOSITORY) throw new Error("github_oidc_invalid_repository");
  if (claims.repository_id !== REPOSITORY_ID) throw new Error("github_oidc_invalid_repository_id");
  if (claims.repository_owner_id !== REPOSITORY_OWNER_ID) throw new Error("github_oidc_invalid_owner_id");
  if (claims.ref !== MAIN_REF) throw new Error("github_oidc_invalid_ref");
  if (claims.event_name !== "push") throw new Error("github_oidc_invalid_event");

  return claims;
}
