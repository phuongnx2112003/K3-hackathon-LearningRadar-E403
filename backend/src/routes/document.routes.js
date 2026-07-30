const fs = require("fs");
const path = require("path");
const { createDocument, deleteDocument, findDocument, listDocuments, storageDir } = require("../services/document.service");
const { readJson, readMultipartPdf, sendError, sendOk } = require("../utils/response");

function buildPdfContentDisposition(filename) {
  const original = String(filename || "document.pdf");
  const asciiFallback = original
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "-")
    .replace(/[\\"]/g, "-") || "document.pdf";
  return `inline; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(original)}`;
}

async function handleDocumentRoutes(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/documents") return sendOk(res, { documents: listDocuments() });
  const fileMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/file$/);
  if (req.method === "GET" && fileMatch) {
    const document = findDocument(decodeURIComponent(fileMatch[1]));
    const filePath = document && path.join(storageDir, document.filename);
    if (!filePath || !fs.existsSync(filePath)) return sendError(res, 404, "DOCUMENT_NOT_FOUND", "Document not found");
    const body = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": "application/pdf", "Content-Length": body.length, "Content-Disposition": buildPdfContentDisposition(document.originalFilename), "Access-Control-Allow-Origin": "*" });
    return res.end(body);
  }
  const deleteMatch = url.pathname.match(/^\/api\/documents\/([^/]+)$/);
  if (req.method === "DELETE" && deleteMatch) {
    try {
      const payload = await readJson(req);
      if (payload.role !== "lapcoach") return sendError(res, 403, "FORBIDDEN", "Only lapcoach can delete documents");
      return sendOk(res, await deleteDocument(decodeURIComponent(deleteMatch[1])));
    } catch (error) {
      return sendError(res, error.code === "DOCUMENT_NOT_FOUND" ? 404 : 500, error.code || "DOCUMENT_DELETE_FAILED", error.message);
    }
  }
  if (req.method !== "POST" || url.pathname !== "/api/documents") return sendError(res, 405, "METHOD_NOT_ALLOWED", "Only GET and POST are allowed");
  try {
    const { fields, file } = await readMultipartPdf(req);
    if (fields.role !== "lapcoach") return sendError(res, 403, "FORBIDDEN", "Only lapcoach can upload documents");
    const document = await createDocument({ lessonId: fields.lessonId?.trim(), title: fields.title?.trim(), uploadedBy: fields.uploadedBy?.trim() || "Lab Coach", file });
    sendOk(res, { document }, 201);
  } catch (error) {
    sendError(res, error.code === "VALIDATION_ERROR" ? 400 : error.code === "PAYLOAD_TOO_LARGE" ? 413 : 500, error.code || "DOCUMENT_UPLOAD_FAILED", error.message);
  }
}
module.exports = { handleDocumentRoutes };
