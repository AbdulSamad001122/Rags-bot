// vectorSessionManager.js
import { getVectorStore } from "./prepare.js";

// In-memory cache for vector store connections
const sessionVectorStores = new Map();
// Track last access time for each namespace
const lastAccessTimes = new Map();
// Set TTL to 30 minutes (1800000 ms)
const TTL = 30 * 60 * 1000;

// Periodically clean up expired vector stores
setInterval(() => {
  const now = Date.now();
  for (const [namespace, lastAccess] of lastAccessTimes.entries()) {
    if (now - lastAccess > TTL) {
      sessionVectorStores.delete(namespace);
      lastAccessTimes.delete(namespace);
      console.log(`🧹 Evicted expired vector store for ${namespace}`);
    }
  }
}, 60000); // Check every minute

/**
 * Get or create a vector store for a specific user (namespace)
 * @param {string} namespace
 * @returns {Promise<any>} vectorStore
 */
export async function getOrCreateVectorStore(namespace) {
  // Update last access time
  lastAccessTimes.set(namespace, Date.now());
  
  // Check if already exists in memory
  if (sessionVectorStores.has(namespace)) {
    console.log(`🔁 Using cached vector store for ${namespace}`);
    return sessionVectorStores.get(namespace);
  }

  // Otherwise, create new connection
  console.log(`⚙️ Connecting to Qdrant collection for ${namespace}...`);
  const vectorStore = await getVectorStore(namespace);

  // Save it in memory for next time
  sessionVectorStores.set(namespace, vectorStore);

  console.log(`✅ Connected to vector store for ${namespace}`);
  return vectorStore;
}