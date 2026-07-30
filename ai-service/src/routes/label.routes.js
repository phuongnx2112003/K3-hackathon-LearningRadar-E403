const { labelConcept } = require("../services/concept-label.service");
const { readJson, sendError, sendOk } = require("../utils/response");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function handleLabelRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    if (!isNonEmptyString(payload.selectedText)) {
      sendError(res, 400, "VALIDATION_ERROR", "selectedText la bat buoc");
      return;
    }

    sendOk(res, await labelConcept(payload));
  } catch (error) {
    const isInvalidJson = error instanceof SyntaxError;
    sendError(
      res,
      isInvalidJson ? 400 : 500,
      isInvalidJson ? "INVALID_JSON" : "AI_LABEL_FAILED",
      isInvalidJson ? "Request body must be valid JSON" : error.message
    );
  }
}

module.exports = {
  handleLabelRoute
};
