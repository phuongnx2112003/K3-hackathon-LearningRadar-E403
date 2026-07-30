const { labelConcept } = require("../services/concept-label.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleLabelRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    sendOk(res, labelConcept(payload));
  } catch (error) {
    sendError(res, 500, "AI_LABEL_FAILED", error.message);
  }
}

module.exports = {
  handleLabelRoute
};
