import { Router } from "express";
import { requireAuth, getUserId } from "../middlewares/auth.js";
import { db, usersTable, workspaceProfilesTable, jobAnalysesTable, resumeVersionsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { clerkClient } from "@clerk/express";

const router = Router();

const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = getUserId(req);
    // In a real app, you would verify this user has an 'admin' role in your DB or Clerk
    // For this prototype, we'll assume any authenticated user who accesses this is an admin, 
    // or we could hardcode a specific admin user ID if provided via env.
    if (process.env.ADMIN_USER_ID && userId !== process.env.ADMIN_USER_ID) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

router.get("/admin/metrics", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  try {
    const [usersCount] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(usersTable);
    const [profilesCount] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(workspaceProfilesTable);
    const [jobsCount] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(jobAnalysesTable);
    const [resumesCount] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(resumeVersionsTable);

    res.json({
      users: usersCount?.count || 0,
      profiles: profilesCount?.count || 0,
      jobsAnalyzed: jobsCount?.count || 0,
      resumesGenerated: resumesCount?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin metrics" });
  }
});

export { router as adminRouter };
