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
  await addChunks(chunks.map((chunk, index) => ({ id: `${documentId}:chunk:${index}`, text: chunk.text, embedding: embeddings[index], metadata: { documentId, lessonId: String(lessonId), title: title || filename || "PDF", filename: filename || "PDF", page: chunk.page, chunkIndex: index } })));
  return { documentId, chunkCount: chunks.length, pageCount: pages.length };
}

async function retrieveContext(question, lessonId, selectedText = "", selectedPages = []) {
  try {
    const retrievalQuery = [question, selectedText].filter(Boolean).join("\n\nSelected course material:\n");
    const [embedding] = await embedTexts([retrievalQuery], "RETRIEVAL_QUERY");
    return await queryChunks(embedding, lessonId, 2, selectedPages);
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
