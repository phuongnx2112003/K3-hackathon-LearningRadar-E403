const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const databasePath = process.env.RAG_DATABASE_PATH || path.resolve(__dirname, "../../../data/local-rag.sqlite");
fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec(`
  CREATE TABLE IF NOT EXISTS rag_chunks (
    id TEXT PRIMARY KEY, document_id TEXT NOT NULL, lesson_id TEXT NOT NULL,
    title TEXT NOT NULL, filename TEXT NOT NULL, page INTEGER, chunk_index INTEGER NOT NULL,
    text TEXT NOT NULL, embedding TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_rag_chunks_lesson_id ON rag_chunks(lesson_id);
`);
const columnNames = db.prepare("PRAGMA table_info(rag_chunks)").all().map((column) => column.name);
if (!columnNames.includes("page")) db.exec("ALTER TABLE rag_chunks ADD COLUMN page INTEGER");

function cosineDistance(left, right) {
  if (left.length !== right.length) return Number.POSITIVE_INFINITY;
  let dot = 0; let leftNorm = 0; let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index]; leftNorm += left[index] ** 2; rightNorm += right[index] ** 2;
  }
  return 1 - dot / ((Math.sqrt(leftNorm) * Math.sqrt(rightNorm)) || 1);
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLocaleLowerCase('vi-VN')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function keywordScore(query, text) {
  const queryTerms = new Set(normalizeSearchText(query).match(/[a-z0-9]{2,}/g) || []);
  const textTerms = new Set(normalizeSearchText(text).match(/[a-z0-9]{2,}/g) || []);
  if (!queryTerms.size || !textTerms.size) return 0;
  let matches = 0;
  queryTerms.forEach((term) => { if (textTerms.has(term)) matches += 1; });
  return matches / queryTerms.size;
}

async function addChunks(chunks) {
  const insert = db.prepare(`INSERT OR REPLACE INTO rag_chunks
    (id, document_id, lesson_id, title, filename, page, chunk_index, text, embedding)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  db.exec("BEGIN");
  try {
    for (const chunk of chunks) insert.run(chunk.id, chunk.metadata.documentId, chunk.metadata.lessonId, chunk.metadata.title, chunk.metadata.filename, chunk.metadata.page || null, chunk.metadata.chunkIndex, chunk.text, JSON.stringify(chunk.embedding));
    db.exec("COMMIT");
  } catch (error) { db.exec("ROLLBACK"); throw error; }
}

async function queryChunks(embedding, lessonId, limit = 6, preferredPages = [], queryText = '') {
  const preferredPageSet = new Set(preferredPages.map(Number).filter(Number.isFinite));
  const rows = db.prepare("SELECT text, document_id, title, filename, page, chunk_index, embedding FROM rag_chunks WHERE lesson_id = ?").all(String(lessonId));
  const ranked = rows
    .map((row) => {
      const distance = cosineDistance(embedding, JSON.parse(row.embedding));
      const isPreferredPage = preferredPageSet.has(Number(row.page));
      const lexical = keywordScore(queryText, row.text);
      // Combine semantic similarity and exact keyword overlap. Exact terms are
      // especially important for Vietnamese technical names and acronyms.
      const rank = distance - lexical * 0.28 - (isPreferredPage ? 0.18 : 0);
      return { text: row.text, metadata: { documentId: row.document_id, lessonId: row.lesson_id, title: row.title, filename: row.filename, page: row.page, chunkIndex: row.chunk_index }, distance, lexical, rank, isPreferredPage };
    })
    .filter((chunk) => Number.isFinite(chunk.distance))
    .sort((left, right) => left.rank - right.rank);
  if (!ranked.length) return [];
  const bestRank = ranked[0].rank;
  return ranked
    .filter((chunk) => chunk.isPreferredPage || chunk.rank <= bestRank + 0.3)
    .slice(0, limit);
}

async function deleteChunksByDocument(documentId) {
  const result = db.prepare("DELETE FROM rag_chunks WHERE document_id = ?").run(String(documentId));
  return result.changes;
}

function hasDocumentChunks(documentId) {
  const row = db.prepare("SELECT COUNT(*) AS count FROM rag_chunks WHERE document_id = ?").get(String(documentId));
  return Number(row?.count || 0) > 0;
}

module.exports = { addChunks, databasePath, deleteChunksByDocument, hasDocumentChunks, queryChunks };
