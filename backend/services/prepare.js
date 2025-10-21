import dotenv from "dotenv";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"; // optional Gemini
import { CohereEmbeddings } from "@langchain/cohere"; // fallback

dotenv.config();

/* ==================  CONFIG  ================== */

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Toggle embedding model
const useGemini = false; // change to false if Gemini not available

export const embeddings = useGemini
  ? new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    })
  : new CohereEmbeddings({
      model: "embed-english-v3.0",
      apiKey: process.env.COHERE_API_KEY,
    });

/* ==================  TEXT DOCUMENT CREATOR  ================== */

function createDocumentsFromText(text) {
  // Split text into pages or sections (simulating PDF pages)
  // Split by double newlines or create chunks of ~1000 characters
  const sections = [];

  // If text is very long, split it into chunks
  if (text.length > 2000) {
    // Split by paragraphs (double newlines)
    const paragraphs = text.split("\n\n");
    let currentSection = "";

    for (const paragraph of paragraphs) {
      if (currentSection.length + paragraph.length < 1500) {
        currentSection += paragraph + "\n\n";
      } else {
        if (currentSection) sections.push(currentSection.trim());
        currentSection = paragraph + "\n\n";
      }
    }

    if (currentSection) sections.push(currentSection.trim());
  } else {
    // For shorter texts, just use as is
    sections.push(text);
  }

  const documents = [];
  sections.forEach((section, index) => {
    if (section.trim()) {
      documents.push(
        new Document({
          pageContent: section.trim(),
          metadata: { pageNumber: index + 1 },
        })
      );
    }
  });

  return documents;
}

/* ==================  INDEXING FUNCTION  ================== */

export async function IndexDoc(
  input,
  namespace = "Atomix-growth",
  isText = false
) {
  console.log(`📄 Indexing text content for namespace: ${namespace}`);

  // Handle text input from frontend
  const docs = createDocumentsFromText(input);

  console.log("📜 Extracted pages preview:\n");
  docs.slice(0, 2).forEach((d, i) => {
    console.log(`Page ${i + 1}:\n`, d.pageContent.slice(0, 300), "\n---");
  });

  // Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // Create or update Qdrant collection
  const collectionName = `user_${namespace}`;
  const vectorStore = await QdrantVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      client: qdrantClient,
      collectionName,
    }
  );

  console.log(`✅ Indexed ${splitDocs.length} chunks into ${collectionName}`);
}

/* ==================  EXISTING COLLECTION FOR CHAT  ================== */

export async function getVectorStore(namespace = "Atomix-growth") {
  const collectionName = `user_${namespace}`;
  return await QdrantVectorStore.fromExistingCollection(embeddings, {
    client: qdrantClient,
    collectionName,
  });
}
