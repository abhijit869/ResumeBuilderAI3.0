import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workspaceRouter from "./workspace";

const router: IRouter = Router();

router.use(healthRouter);
router.use(workspaceRouter);
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
