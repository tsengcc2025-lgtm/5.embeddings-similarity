import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config.js";

export const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 120_000,
});

export const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embedTexts(texts) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

/** 餘弦相似度（越接近 1 越相似） */
export function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
