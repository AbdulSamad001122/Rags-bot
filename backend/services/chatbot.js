import Groq from "groq-sdk";
import dotenv from "dotenv";
import { getOrCreateVectorStore } from "./vectorSessionManager.js";
import { Redis } from "@upstash/redis";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize Upstash Redis client
let redisClient;
if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  console.log("Connected to Upstash Redis");
} else {
  console.log("Upstash Redis not configured. Caching will be disabled.");
  redisClient = null;
}

// In-memory chat histories (per bot/user namespace)
const chatHistories = {};

// New function for streaming responses

export async function streamChatbotResponse(question, userNamespace, res) {
  if (!question || question.trim() === "") {
    res.write(`data: ${JSON.stringify({ error: "Please provide a question." })}\n\n`);
    return;
  }

  // Create cache key
  const cacheKey = `response:${userNamespace}:${question}`;
  
  // Try to get cached response
  if (redisClient) {
    try {
      const cachedResponse = await redisClient.get(cacheKey);
      if (cachedResponse) {
        console.log(`Cache hit for question: ${question}`);
        // Send cached response as a stream
        let sentLength = 0;
        const chunkSize = 50; // Send in small chunks for better UX
        
        // Send content in chunks
        for (let i = 0; i < cachedResponse.length; i += chunkSize) {
          const chunk = cachedResponse.substring(i, Math.min(i + chunkSize, cachedResponse.length));
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
          // Small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // Send completion signal
        res.write(`data: ${JSON.stringify({ done: true, finalContent: cachedResponse })}\n\n`);
        res.end();
        return;
      }
    } catch (error) {
      console.log("Redis cache error:", error);
    }
  }

  try {
    // Get or create chat history for this namespace
    if (!chatHistories[userNamespace]) {
      chatHistories[userNamespace] = [];
    }

    // 1️⃣ Retrieve relevant chunks from vector store
    const vectorStore = await getOrCreateVectorStore(userNamespace);
    // Optimize: Reduce from 10 to 5 chunks and add scoring threshold
    const relevantChunks = await vectorStore.similaritySearch(question, 5);
    // Filter out low-relevance chunks (if scores are available)
    const filteredChunks = relevantChunks.filter(chunk => 
      !chunk.score || chunk.score > 0.7
    );
    const context = filteredChunks.map((chunk) => chunk.pageContent).join("\n\n");

    // 2️⃣ Create system message
    const SYSTEM_PROMPT = `
You are an intelligent RAG-based assistant. 
Use the provided context to help answer the user's question accurately.
If the answer is not in the context, rely on the conversation history.
If you still don't know, say "I don't know."
Maintain a friendly and professional tone.
    `;

    // 3️⃣ Build conversation messages with limited history
    // Optimize: Only include last 3 exchanges (6 messages) to reduce context size
    const recentHistory = chatHistories[userNamespace].slice(-6);
    
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Relevant context:\n${context}` },
      ...recentHistory,
      { role: "user", content: question },
    ];

    // 4️⃣ Call Groq model with streaming
    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 2000,
      messages,
      stream: true, // This enables streaming
    });

    let fullResponse = "";

    // 5️⃣ Process stream and send chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        // Send each token/content chunk to the client
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // 6️⃣ Update chat history with complete response
    chatHistories[userNamespace].push(
      { role: "user", content: question },
      { role: "assistant", content: fullResponse }
    );

    // 7️⃣ Cache the response for 1 hour
    if (redisClient) {
      try {
        await redisClient.setex(cacheKey, 3600, fullResponse);
      } catch (error) {
        console.log("Redis cache error:", error);
      }
    }

    // 8️⃣ Send completion signal
    res.write(`data: ${JSON.stringify({ done: true, finalContent: fullResponse })}\n\n`);
    res.end();

    console.log(`💬 ${userNamespace} => ${question}`);
    console.log(`🤖 ${fullResponse}`);
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(`data: ${JSON.stringify({ error: "Error processing your request" })}\n\n`);
    res.end();
  }
}