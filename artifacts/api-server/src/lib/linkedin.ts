import crypto from "node:crypto";

// ---------------------------------------------------------------------------
// LinkedIn "Sign in with LinkedIn" (OpenID Connect) OAuth 2.0 helpers.
//
// Flow: /api/auth/linkedin/start  -> 302 to LinkedIn authorization page
//       LinkedIn                 -> 302 to /api/auth/linkedin/callback?code=..&state=..
//       callback exchanges code  -> fetches the member's verified identity
//                                   (OpenID Connect userinfo), maps it to the
//                                   ResumeGPT profile shape, and saves it to
//                                   the Clerk-scoped workspace.
//
// Requires env: LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET,
//               LINKEDIN_REDIRECT_URI (optional; derived from the request
//               host when omitted).
// ---------------------------------------------------------------------------

const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

// Scopes for modern LinkedIn Sign-In (OpenID Connect). "openid profile email"
// returns: sub, name, given_name, family_name, picture, email, email_verified.
const LINKEDIN_SCOPES = ["openid", "profile", "email"];

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type PendingState = {
  clerkUserId: string;
  returnTo: string;
  origin: string;
  expiresAt: number;
};

// In-memory CSRF state store. Fine for single-instance deployments; swap for
// a signed cookie or Redis if the API server is ever scaled horizontally.
const pendingStates = new Map<string, PendingState>();

function getClientConfig(): { clientId: string; clientSecret: string } {
  const clientId = process.env.LINKEDIN_CLIENT_ID?.trim();
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "LinkedIn sign-in is not configured. Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to the environment.",
    );
  }
  return { clientId, clientSecret };
}

/** Default redirect URI: request host + callback path (overridable via env). */
export function getLinkedInRedirectUri(host: string): string {
  const configured = process.env.LINKEDIN_REDIRECT_URI?.trim();
  if (configured) return configured;
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${proto}://${host}/api/auth/linkedin/callback`;
}

function generateState(): string {
  return crypto.randomBytes(24).toString("base64url");
}

/** Store a pending OAuth state bound to a workspace key and return it. */
export function createOAuthState(clerkUserId: string, returnTo: string, origin: string): string {
  const state = generateState();
  pendingStates.set(state, {
    clerkUserId,
    returnTo,
    origin,
    expiresAt: Date.now() + OAUTH_STATE_TTL_MS,
  });
  return state;
}

/** Validate and consume a state value; returns the bound workspace/returnTo. */
export function consumeOAuthState(state: string): PendingState | null {
  const pending = pendingStates.get(state);
  if (!pending) return null;
  pendingStates.delete(state);
  if (Date.now() > pending.expiresAt) return null;
  return pending;
}

/** Build the LinkedIn authorization URL the user is redirected to. */
export function buildLinkedInAuthUrl(state: string, redirectUri: string): string {
  const { clientId } = getClientConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: LINKEDIN_SCOPES.join(" "),
  });
  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

/** Exchange the authorization code for an access token. */
export async function exchangeLinkedInCode(code: string, redirectUri: string): Promise<string> {
  const { clientId, clientSecret } = getClientConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });
  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error(
      typeof data.error_description === "string"
        ? `LinkedIn authorization failed: ${data.error_description}`
        : "LinkedIn authorization failed. Try again.",
    );
  }
  return data.access_token;
}

export type LinkedInUserInfo = {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
};

/** Fetch the authenticated member's identity via the OIDC userinfo endpoint. */
export async function fetchLinkedInUserInfo(accessToken: string): Promise<LinkedInUserInfo> {
  const response = await fetch(LINKEDIN_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok || typeof data.sub !== "string") {
    throw new Error(
      typeof data.message === "string"
        ? `Unable to load LinkedIn profile: ${data.message}`
        : "Unable to load LinkedIn profile.",
    );
  }
  return {
    sub: data.sub as string,
    name: typeof data.name === "string" ? data.name : undefined,
    given_name: typeof data.given_name === "string" ? data.given_name : undefined,
    family_name: typeof data.family_name === "string" ? data.family_name : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
    email_verified: typeof data.email_verified === "boolean" ? data.email_verified : undefined,
    picture: typeof data.picture === "string" ? data.picture : undefined,
  };
}

/**
 * Map LinkedIn's verified identity to the ResumeGPT profile shape.
 * The OIDC scopes only expose basic identity (name, email, picture) —
 * experience/education/skills are not available via Sign-In scopes, so they
 * are left empty for the user to complete (or via an authorized profile
 * export). LinkedIn member URL is derived from the numeric `sub`.
 */
export function linkedinUserInfoToProfile(info: LinkedInUserInfo): Record<string, unknown> {
  const name =
    info.name?.trim() ||
    [info.given_name, info.family_name].filter(Boolean).join(" ").trim();
  return {
    name,
    title: "",
    summary: "Imported from LinkedIn after account authorization.",
    contact: {
      email: info.email ?? "",
      phone: "",
      location: "",
      linkedin: `https://www.linkedin.com/in/${info.sub}`,
    },
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: [],
    skills: [],
    extractedKeywords: [],
    source: "linkedin-oauth",
    linkedInId: info.sub,
    photoUrl: info.picture ?? "",
  };
}
