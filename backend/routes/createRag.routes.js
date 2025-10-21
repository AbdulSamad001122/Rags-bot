import dotenv from "dotenv";
import { IndexDoc } from "../services/prepare.js";
import express from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import prisma from "../db.js";

dotenv.config();

const router = express.Router();

// New route to handle extracted text from frontend
router.post("/process-text", async (req, res) => {
  try {
    // 👇 Get the user ID from the request
    const userId = getAuth(req).userId;

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized User" });
    }

    const user = await clerkClient.users.getUser(userId);
    const firstName = user.firstName;

    console.log(`User ID: ${userId}`);

    // ✅ Get extracted text and bot name from request body
    const { userNamespace, extractedText } = req.body;

    if (!userNamespace) {
      return res.status(400).json({ message: "User namespace is required" });
    }

    if (!extractedText) {
      return res.status(400).json({ message: "Extracted text is required" });
    }

    // Process the extracted text directly
    await IndexDoc(extractedText, userNamespace, true); // true indicates text input

    try {
      const newBot = await prisma.bot.create({
        data: {
          name: userNamespace,
          userId: userId,
        },
      });

      return res.status(200).json({
        message: "Bot created successfully with extracted text",
        bot: newBot,
      });
    } catch (err) {
      if (err.code === "P2003") {
        // Foreign key failed (user not found)
        // Create the user
        const newUser = await prisma.user.create({
          data: {
            id: userId,
            name: firstName,
          },
        });

        // Retry creating the bot
        const bot = await prisma.bot.create({
          data: {
            name: userNamespace,
            userId: userId,
          },
        });

        return res.json({ bot, message: "User created and bot created!" });
      }

      throw err; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.log("Error in process-text route:", error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
