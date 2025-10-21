import dotenv from "dotenv";
import express from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import prisma from "../db.js";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = getAuth(req).userId;
    console.log(userId)

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized User" });
    }

    const allBots = await prisma.bot.findMany({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json(allBots);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

export default router;