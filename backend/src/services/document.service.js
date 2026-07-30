const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { deleteDocumentIndex, indexDocument } = require("./ai-client.service");

const storageDir = path.resolve(__dirname, "../../../data/uploaded-materials");
const manifestPath = path.join(storageDir, "manifest.json");

function ensureStorage() { fs.mkdirSync(storageDir, { recursive: true }); }
function readManifest() {
  ensureStorage();
  try { return JSON.parse(fs.readFileSync(manifestPath, "utf8")); } catch { return { documents: [] }; }
}
function writeManifest(manifest) { ensureStorage(); fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2)); }
function safeFileName(name) { return path.basename(String(name || "lesson.pdf")).replace(/[^a-zA-Z0-9._-]/g, "-"); }

function listDocuments() { return readManifest().documents; }
function findDocument(id) { return listDocuments().find((document) => document.id === id); }

async function createDocument({ lessonId, title, uploadedBy, file }) {
  if (!lessonId || !title) throw Object.assign(new Error("lessonId and title are required"), { code: "VALIDATION_ERROR" });
  if (!file || !file.buffer?.length || !/\.pdf$/i.test(file.filename) || !/pdf/i.test(file.contentType || "application/pdf")) {
    throw Object.assign(new Error("A PDF file is required"), { code: "VALIDATION_ERROR" });
  }
  const id = `doc-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const filename = `${id}-${safeFileName(file.filename)}`;
  const filePath = path.join(storageDir, filename);
  ensureStorage();
  fs.writeFileSync(filePath, file.buffer);
  try {
    const indexed = await indexDocument({
      documentId: id, lessonId, title, filename: file.filename,
      fileBase64: file.buffer.toString("base64")
    });
    const document = { id, lessonId, title, filename, originalFilename: file.filename, uploadedBy, createdAt: new Date().toISOString(), chunkCount: indexed.chunkCount };
    const manifest = readManifest();
    manifest.documents.unshift(document);
    writeManifest(manifest);
    return document;
  } catch (error) {
    fs.rmSync(filePath, { force: true });
    throw error;
  }
}

async function deleteDocument(id) {
  const document = findDocument(id);
  if (!document) throw Object.assign(new Error("Document not found"), { code: "DOCUMENT_NOT_FOUND" });
  const indexResult = await deleteDocumentIndex(document.id);
  const manifest = readManifest();
  manifest.documents = manifest.documents.filter((item) => item.id !== document.id);
  writeManifest(manifest);
  fs.rmSync(path.join(storageDir, document.filename), { force: true });
  return { documentId: document.id, deletedChunks: indexResult.deletedChunks };
}

function toLessons() {
  return listDocuments().map((document) => ({
    lessonId: document.lessonId,
    title: document.title,
    source: document.originalFilename,
    slideFile: document.originalFilename,
    slideUrl: `/api/documents/${document.id}/file`,
    paragraphs: [],
    uploaded: true,
    documentId: document.id,
    chunkCount: document.chunkCount
  }));
}

module.exports = { createDocument, deleteDocument, findDocument, listDocuments, storageDir, toLessons };
