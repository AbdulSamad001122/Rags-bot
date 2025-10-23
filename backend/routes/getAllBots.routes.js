import dotenv from "dotenv";
import express from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import prisma from "../db.js";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = getAuth(req).userId;
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized User" });
    }

    const allBots = await prisma.bot.findMany({
      where: {
        userId: userId,
      },
    });

    console.log("Found bots:", allBots);
    return res.status(200).json(allBots);
  } catch (error) {
    console.error("Error fetching bots:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

export default router;