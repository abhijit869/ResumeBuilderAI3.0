import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workspaceRouter from "./workspace";
import webhooksRouter from "./webhooks";
import { exportRouter } from "./export";
import { adminRouter } from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(workspaceRouter);
router.use(webhooksRouter);
router.use(exportRouter);
router.use(adminRouter);

router.get("/", (_req, res) => {
  res.json({
    service: "ResumeGPT API",
    status: "ok",
    routes: [
      "/api/healthz",
      "/api/workspace/profile",
      "/api/workspace/state",
      "/api/workspace/jobs/analyze",
      "/api/workspace/resumes/generate",
    ],
  });
});

export default router;
