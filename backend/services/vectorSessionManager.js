// vectorSessionManager.js
import { getVectorStore } from "./prepare.js";

// In-memory cache for vector store connections
const sessionVectorStores = new Map();

/**
 * Get or create a vector store for a specific user (namespace)
 * @param {string} namespace
 * @returns {Promise<any>} vectorStore
 */
export async function getOrCreateVectorStore(namespace) {
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
