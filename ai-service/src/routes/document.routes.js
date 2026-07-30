const { indexPdf, removeDocumentIndex } = require("../services/document-index.service");
const { readJson, sendError, sendOk } = require("../utils/response");
async function handleDocumentIndexRoute(req, res) {
  if (req.method !== "POST") return sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
  try { sendOk(res, await indexPdf(await readJson(req)), 201); }
  catch (error) { sendError(res, error.code === "VALIDATION_ERROR" || error.code === "PDF_TEXT_NOT_FOUND" ? 400 : 503, error.code || "DOCUMENT_INDEX_FAILED", error.message); }
}
async function handleDocumentDeleteRoute(req, res) {
  if (req.method !== "POST") return sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
  try { sendOk(res, await removeDocumentIndex((await readJson(req)).documentId)); }
  catch (error) { sendError(res, error.code === "VALIDATION_ERROR" ? 400 : 500, error.code || "DOCUMENT_DELETE_FAILED", error.message); }
}
module.exports = { handleDocumentIndexRoute, handleDocumentDeleteRoute };
