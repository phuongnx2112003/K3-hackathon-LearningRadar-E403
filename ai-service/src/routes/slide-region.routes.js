const { analyzeSlideRegion } = require("../services/slide-region-vision.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleSlideRegionRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    const result = await analyzeSlideRegion(payload);
    sendOk(res, result);
  } catch (error) {
    const isInvalidJson = error instanceof SyntaxError;
    const code = error.code || (isInvalidJson ? "INVALID_JSON" : "AI_SLIDE_REGION_FAILED");
    sendError(
      res,
      code === "VALIDATION_ERROR" || isInvalidJson ? 400 : 500,
      code,
      isInvalidJson ? "Request body must be valid JSON" : error.message
    );
  }
}

module.exports = {
  handleSlideRegionRoute
};
