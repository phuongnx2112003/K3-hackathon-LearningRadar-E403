const crypto = require("crypto");

const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";

function getEmbeddingProvider() {
  const configured = String(process.env.EMBEDDING_PROVIDER || "").toLowerCase();
  if (["gemini", "openai", "local"].includes(configured)) return configured;
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.AI_MODE !== "mock" && process.env.OPENAI_API_KEY) return "openai";
  return "local";
}

function fallbackEmbedding(text, dimensions = 384) {
  const vector = Array(dimensions).fill(0);
  for (const token of String(text || "").toLowerCase().match(/[\p{L}\p{N}_-]+/gu) || []) {
    const hash = crypto.createHash("sha256").update(token).digest();
    vector[hash.readUInt32BE(0) % dimensions] += hash[4] % 2 ? 1 : -1;
  }
  const length = Math.hypot(...vector) || 1;
  return vector.map((value) => value / length);
}

async function embedWithGemini(texts, taskType) {
  const model = process.env.GEMINI_EMBEDDING_MODEL || DEFAULT_GEMINI_EMBEDDING_MODEL;
  const baseUrl = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/, "");
  const embeddings = [];
  for (const text of texts) {
    const response = await fetch(`${baseUrl}/models/${encodeURIComponent(model)}:embedContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: `models/${model}`, content: { parts: [{ text }] }, taskType })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(payload.embedding?.values)) throw new Error(payload.error?.message || `Gemini embedding API responded with ${response.status}`);
    embeddings.push(payload.embedding.values);
  }
  return embeddings;
}

async function embedTexts(texts, taskType = "RETRIEVAL_DOCUMENT") {
  if (!Array.isArray(texts) || !texts.length) return [];
  const provider = getEmbeddingProvider();
  if (provider === "local") return texts.map((text) => fallbackEmbedding(text));
  if (provider === "gemini") {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required when EMBEDDING_PROVIDER=gemini");
    return embedWithGemini(texts, taskType);
  }
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL, input: texts, encoding_format: "float" })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || `Embedding API responded with ${response.status}`);
  return payload.data.sort((a, b) => a.index - b.index).map((item) => item.embedding);
}

module.exports = { embedTexts, fallbackEmbedding, getEmbeddingProvider };
