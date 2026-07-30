const pdf = require("pdf-parse");
const { embedTexts } = require("./embedding.service");
const { addChunks, deleteChunksByDocument, queryChunks } = require("./vector-store.service");

function chunkText(text, size = 1100, overlap = 180) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  const chunks = [];
  for (let start = 0; start < clean.length; start += size - overlap) {
    const end = Math.min(clean.length, start + size);
    let chunk = clean.slice(start, end);
    if (end < clean.length) chunk = chunk.slice(0, Math.max(chunk.lastIndexOf(". "), chunk.lastIndexOf(" ")) + 1 || chunk.length);
    if (chunk.trim().length >= 80) chunks.push(chunk.trim());
    if (end === clean.length) break;
  }
  return chunks;
}

async function extractPdfPages(buffer) {
  const pages = [];
  let pageNumber = 0;
  await pdf(buffer, {
    pagerender: async (pageData) => {
      pageNumber += 1;
      const content = await pageData.getTextContent({ normalizeWhitespace: true, disableCombineTextItems: false });
      const text = content.items.map((item) => item.str).join(" ");
      pages.push({ page: pageNumber, text });
      return text;
    }
  });
  return pages;
}

async function indexPdf({ documentId, lessonId, title, filename, fileBase64 }) {
  if (!documentId || !lessonId || !fileBase64) throw Object.assign(new Error("documentId, lessonId and fileBase64 are required"), { code: "VALIDATION_ERROR" });
  const pages = await extractPdfPages(Buffer.from(fileBase64, "base64"));
  const chunks = pages.flatMap(({ page, text }) => chunkText(text).map((chunk) => ({ page, text: chunk })));
  if (!chunks.length) throw Object.assign(new Error("No readable text was found in this PDF"), { code: "PDF_TEXT_NOT_FOUND" });
  const embeddings = await embedTexts(chunks.map((chunk) => chunk.text), "RETRIEVAL_DOCUMENT");
  // Re-indexing the same document must not retain stale chunks/metadata from
  // an older parser version (for example chunks whose page was NULL).
  await deleteChunksByDocument(documentId);
  await addChunks(chunks.map((chunk, index) => ({ id: `${documentId}:chunk:${index}`, text: chunk.text, embedding: embeddings[index], metadata: { documentId, lessonId: String(lessonId), title: title || filename || "PDF", filename: filename || "PDF", page: chunk.page, chunkIndex: index } })));
  return { documentId, chunkCount: chunks.length, pageCount: pages.length };
}

async function retrieveContext(question, lessonId, selectedText = "", selectedPages = []) {
  try {
    const retrievalQueries = [
      String(question || '').trim(),
      String(selectedText || '').trim(),
      [question, selectedText].filter(Boolean).join("\n\nSelected course material:\n")
    ].filter(Boolean);
    const embeddings = await embedTexts(retrievalQueries, "RETRIEVAL_QUERY");
    const candidates = await Promise.all(embeddings.map((embedding, index) => (
      queryChunks(embedding, lessonId, 6, selectedPages, retrievalQueries[index])
    )));
    const merged = new Map();
    candidates.flat().forEach((chunk) => {
      const key = `${chunk.metadata.documentId}:${chunk.metadata.chunkIndex}`;
      const existing = merged.get(key);
      if (!existing || chunk.rank < existing.rank) merged.set(key, chunk);
    });
    return Array.from(merged.values())
      .sort((left, right) => left.rank - right.rank)
      .slice(0, Number(process.env.RAG_CONTEXT_LIMIT) || 6);
  } catch (error) {
    console.warn(`RAG retrieval unavailable: ${error.message}`);
    return [];
  }
}
async function removeDocumentIndex(documentId) {
  if (!documentId) throw Object.assign(new Error("documentId is required"), { code: "VALIDATION_ERROR" });
  return { documentId, deletedChunks: await deleteChunksByDocument(documentId) };
}
module.exports = { indexPdf, retrieveContext, removeDocumentIndex, chunkText, extractPdfPages };
