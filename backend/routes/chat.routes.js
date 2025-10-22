import express from "express";
import { streamChatbotResponse } from "../services/chatbot.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, userNamespace } = req.body;

    if (!question || !userNamespace) {
      return res
        .status(400)
        .json({ error: "Message and userNamespace are required" });
    }

    const response = await askChatbot(question, userNamespace);
    res.json({ response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while sending question" });
  }
});

// Streaming endpoint for real-time responses
router.post("/stream", async (req, res) => {
  try {
    const { question, userNamespace } = req.body;

    if (!question || !userNamespace) {
      return res
        .status(400)
        .json({ error: "Message and userNamespace are required" });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    // Stream the response
    await streamChatbotResponse(question, userNamespace, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while sending question" });
  }
});

export default router;