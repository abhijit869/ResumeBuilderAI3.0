import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import linkedInAuthRouter from "./routes/linkedinAuth";
import { logger } from "./lib/logger";
import { CLERK_PROXY_PATH, clerkProxyMiddleware, getClerkProxyHost } from "./middlewares/clerkProxyMiddleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.CLERK_SECRET_KEY || process.env.CLERK_PUBLISHABLE_KEY) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(getClerkProxyHost(req) ?? "", process.env.CLERK_PUBLISHABLE_KEY),
    })),
  );
} else {
  app.use((_req, _res, next) => next());
}

import { requestContext } from "./lib/context";

app.use((req, res, next) => {
  const key = req.headers["x-gemini-api-key"] as string | undefined;
  requestContext.run({ geminiApiKey: key }, () => {
    next();
  });
});


app.get("/", (_req, res) => {
  res.json({
    service: "ResumeGPT API",
    status: "ok",
    health: "/api/healthz",
  });
});

app.use("/api", router);
app.use("/api", linkedInAuthRouter);

export default app;
