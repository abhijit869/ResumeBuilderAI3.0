import { Router, type IRouter } from "express";
import { Webhook } from "svix";
import express from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/webhooks/clerk", express.raw({ type: "application/json" }), async (req, res) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    logger.warn("CLERK_WEBHOOK_SECRET not set, cannot verify webhook");
    res.status(500).json({ error: "Configuration error" });
    return;
  }

  const payload = req.body;
  const headers = req.headers;

  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({ error: "Missing svix headers" });
    return;
  }

  const wh = new Webhook(SIGNING_SECRET);

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const eventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address || "";
    const name = [first_name, last_name].filter(Boolean).join(" ");
    
    try {
      await db.insert(usersTable).values({
        clerkUserId: id,
        email: email,
        name: name,
        avatarUrl: image_url,
      }).onConflictDoUpdate({
        target: usersTable.clerkUserId,
        set: { email, name, avatarUrl: image_url }
      });
      res.json({ success: true });
    } catch (dbErr) {
      logger.error({ err: dbErr }, "Failed to sync user to database");
      res.status(500).json({ error: "Database error" });
    }
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;
    try {
      await db.delete(usersTable).where(eq(usersTable.clerkUserId, id));
      res.json({ success: true });
    } catch (dbErr) {
      logger.error({ err: dbErr }, "Failed to delete user from database");
      res.status(500).json({ error: "Database error" });
    }
  } else {
    res.json({ success: true });
  }
});

export default router;
