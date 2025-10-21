import express from "express";
import { askChatbot } from "../services/chatbot.js";
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

export default router