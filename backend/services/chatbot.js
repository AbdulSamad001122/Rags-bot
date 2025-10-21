import Groq from "groq-sdk";
import dotenv from "dotenv";
import { getOrCreateVectorStore } from "./vectorSessionManager.js";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory chat histories (per bot/user namespace)
const chatHistories = {};

export async function askChatbot(question, userNamespace) {
  if (!question || question.trim() === "") return "Please provide a question.";

  // Get or create chat history for this namespace
  if (!chatHistories[userNamespace]) {
    chatHistories[userNamespace] = [];
  }

  // 1️⃣ Retrieve relevant chunks from vector store
  const vectorStore = await getOrCreateVectorStore(userNamespace);
  const relevantChunks = await vectorStore.similaritySearch(question, 10);
  const context = relevantChunks.map((chunk) => chunk.pageContent).join("\n\n");

  // 2️⃣ Create system message
  const SYSTEM_PROMPT = `
You are an intelligent RAG-based assistant. 
Use the provided context to help answer the user’s question accurately.
If the answer is not in the context, rely on the conversation history.
If you still don't know, say "I don't know."
Maintain a friendly and professional tone.
  `;

  // 3️⃣ Build full conversation messages
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: `Relevant context:\n${context}` },
    ...chatHistories[userNamespace], // 🔥 include full history here
    { role: "user", content: question },
  ];

  // 4️⃣ Call Groq model
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    messages,
  });

  const reply = completion.choices[0].message.content;

  // 5️⃣ Update full chat history
  chatHistories[userNamespace].push(
    { role: "user", content: question },
    { role: "assistant", content: reply }
  );

  console.log(`💬 ${userNamespace} => ${question}`);
  console.log(`🤖 ${reply}`);

  return reply;
}
