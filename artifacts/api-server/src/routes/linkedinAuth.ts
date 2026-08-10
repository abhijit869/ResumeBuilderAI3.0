import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import {
  buildLinkedInAuthUrl,
  consumeOAuthState,
  createOAuthState,
  exchangeLinkedInCode,
  fetchLinkedInUserInfo,
  getLinkedInRedirectUri,
  linkedinUserInfoToProfile,
} from "../lib/linkedin";
import { saveProfile } from "../lib/workspace";

const router: IRouter = Router();

/**
 * GET /api/auth/linkedin/start
 * Requires a Clerk session (browser cookie). Redirects the signed-in user to
 * LinkedIn's authorization page. The CSRF state binds the OAuth round-trip to
 * the user's workspace so the callback saves to the right account.
 */
router.get("/auth/linkedin/start", (req, res): void => {
  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).json({ error: "Authentication is required." });
    return;
  }
  try {
    const clerkUserId = userId;
    if (!clerkUserId) {
      res.status(500).json({ error: "Unable to resolve your workspace." });
      return;
    }
    const returnTo =
      typeof req.query.returnTo === "string" && req.query.returnTo.startsWith("/")
        ? req.query.returnTo
        : "/create";
    // The frontend origin the callback should redirect back to. In production
    // the frontend and API share an origin; in local dev they differ, so the
    // frontend passes its own origin explicitly.
    const rawOrigin = typeof req.query.origin === "string" ? req.query.origin : "";
    let origin = "";
    if (rawOrigin) {
      try {
        const parsed = new URL(rawOrigin);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          origin = parsed.origin;
        }
      } catch {
        origin = "";
      }
    }
    const state = createOAuthState(clerkUserId, returnTo, origin);
    const redirectUri = getLinkedInRedirectUri(req.get("host") ?? "localhost");
    res.redirect(buildLinkedInAuthUrl(state, redirectUri));
  } catch (error) {
    res.status(501).json({
      error: error instanceof Error ? error.message : "LinkedIn sign-in is not configured.",
    });
  }
});

/**
 * GET /api/auth/linkedin/callback
 * LinkedIn redirects here after the user authorizes. The Clerk session cookie
 * is preserved across the redirect, so the callback can resolve the workspace
 * key for the same user who started the flow.
 */
router.get("/auth/linkedin/callback", async (req, res): Promise<void> => {
  const userId = getAuth(req).userId;
  const code = typeof req.query.code === "string" ? req.query.code : "";
  const state = typeof req.query.state === "string" ? req.query.state : "";
  const errorParam = typeof req.query.error === "string" ? req.query.error : "";

  const pending = consumeOAuthState(state);
  const fallbackReturn = "/create";

  const redirectWithStatus = (status: string, message: string) => {
    const returnTo = pending?.returnTo || fallbackReturn;
    // Redirect back to the frontend. When the frontend passed its own origin
    // (local dev), use it; otherwise fall back to the request host (same-origin
    // production deployment).
    const baseOrigin = pending?.origin || `http://${req.get("host") ?? "localhost"}`;
    const target = new URL(returnTo, baseOrigin);
    target.searchParams.set("linkedin", status);
    target.searchParams.set("linkedinMessage", message.slice(0, 200));
    res.redirect(target.toString());
  };

  if (errorParam) {
    redirectWithStatus("error", `LinkedIn authorization was declined. ${errorParam}`);
    return;
  }
  if (!userId) {
    redirectWithStatus("error", "Your session expired during LinkedIn sign-in. Sign in to ResumeGPT again and retry.");
    return;
  }
  if (!pending) {
    redirectWithStatus("error", "This LinkedIn sign-in link is invalid or expired. Please try again.");
    return;
  }
  if (!code) {
    redirectWithStatus("error", "LinkedIn did not return an authorization code. Please try again.");
    return;
  }

  try {
    const redirectUri = getLinkedInRedirectUri(req.get("host") ?? "localhost");
    const accessToken = await exchangeLinkedInCode(code, redirectUri);
    const info = await fetchLinkedInUserInfo(accessToken);
    const profile = linkedinUserInfoToProfile(info);
    await saveProfile(pending.clerkUserId, `linkedin://${info.sub}`, profile, "linkedin");
    redirectWithStatus("success", "LinkedIn profile imported.");
  } catch (error) {
    redirectWithStatus("error", error instanceof Error ? error.message : "LinkedIn sign-in failed. Please try again.");
  }
});

export default router;
