import { getAuth } from "@clerk/express";
import { type Request, type Response, type NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      if (process.env.NODE_ENV !== "production" && !process.env.CLERK_SECRET_KEY) {
        // Fallback for local development if Clerk is not configured
        (req as any).auth = { userId: "local-demo-user" };
        return next();
      }
      res.status(401).json({ error: "Authentication is required." });
      return;
    }
    next();
  } catch (err) {
    if (process.env.NODE_ENV !== "production" && !process.env.CLERK_SECRET_KEY) {
      (req as any).auth = { userId: "local-demo-user" };
      return next();
    }
    res.status(401).json({ error: "Authentication is required." });
  }
};

export const getUserId = (req: Request): string => {
  const auth = getAuth(req);
  if (auth && auth.userId) {
    return auth.userId;
  }
  if (process.env.NODE_ENV !== "production" && !process.env.CLERK_SECRET_KEY) {
    return "local-demo-user";
  }
  throw new Error("Unauthorized");
};
