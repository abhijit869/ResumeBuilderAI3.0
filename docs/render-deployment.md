# Render deployment

This app needs a **Node web service**, because it has server-side API routes.
The repository's `render.yaml` uses Node 24, installs locked dependencies with
`npm ci --include=dev`, builds Next.js standalone output, and copies public/static
assets into that output. Render supplies `PORT`; `HOSTNAME=0.0.0.0` binds publicly.

## Create the service

1. Commit and push these changes to your GitHub repository.
2. In Render, choose **New → Blueprint** and connect this repository. Select the
   branch containing `render.yaml` and review the free web service configuration.
3. Enter `GEMINI_API_KEY` and `MONGODB_URI` when prompted. Keep them in Render's
   environment settings, never in Git. The database defaults to `resumebuilderai_db`.
4. Deploy. Check build logs and open the assigned `https://…onrender.com` URL.
5. Add that hostname to Firebase Authentication's **Authorized domains**. Enable
   Email/Password and each social provider you intend to offer. GitHub and LinkedIn
   also need their provider credentials/callback configuration in Firebase.
6. Allow the service's Render outbound IP ranges in MongoDB Atlas Network Access,
   and use a database user with access to the application database.

The checked-in Firebase client configuration is used by default. To use another
Firebase project, set the `NEXT_PUBLIC_FIREBASE_*` overrides from `.env.example`
before building, and deploy this repository's Firestore rules to that project.
Public environment variables are baked into the browser bundle: rebuild after
changing them. If the browser API key is HTTP-referrer restricted, set
`FIREBASE_AUTH_API_KEY` to a server-compatible key from the **same project**, with
the Identity Toolkit API enabled. Tokens are verified through Firebase's
`accounts:lookup` endpoint before MongoDB requests are allowed.

Render's Blueprint enables Firebase email auth, but it cannot enable the provider
in your Firebase console. Local fallback accounts do not establish Firebase
sessions and cannot access cloud data; their data stays on that browser/device.

For a custom domain, set `APP_URL=https://your-domain` and rebuild. Otherwise,
robots/sitemap use Render's automatic `RENDER_EXTERNAL_URL`. Do not copy a local
`APP_URL=http://localhost:3000` into Render.

## Verify the live service

```bash
BASE_URL=https://YOUR-SERVICE.onrender.com npm run test:routes
BASE_URL=https://YOUR-SERVICE.onrender.com npm run test:api
```

`/api/health` is process liveness and is Render's health-check target.
`/api/db/health` reports database diagnostics: require `connected: true`, not
merely HTTP 200. A green Render health check does not prove Firebase, Atlas, or
Gemini is configured correctly.

In a browser, verify a real Firebase sign-in, create and edit a resume, reload it,
sign in from another browser to check cloud persistence, export PDF/text/JSON,
generate a cover letter and AI rewrite, and open a published portfolio while
signed out. Check mobile layout and the browser console. Local fallback success
does not establish that external integrations are working.

Free instances can sleep when idle; filesystem writes do not provide durable user
storage. Keep persistent records in Atlas/Firestore. No Render account resources
are created simply by adding this configuration.

References: [Render Next.js deployment](https://render.com/docs/deploy-nextjs-app),
[Blueprint specification](https://render.com/docs/blueprint-spec),
[Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth).
