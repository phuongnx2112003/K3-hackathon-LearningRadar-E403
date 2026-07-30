const { generateVisionStructuredResponse } = require("./llm.service");
const { buildSlideRegionVisionPrompt } = require("./prompt.service");

function normalizeVisionResult(result = {}) {
  const selectedText = String(result.selectedText || "").trim();
  const description = String(result.description || "").trim();

  return {
    selectedText: selectedText || description,
    description: description || selectedText,
    regionType: ["text", "diagram", "mixed", "unclear"].includes(result.regionType)
      ? result.regionType
      : "mixed",
    confidence: Number.isFinite(result.confidence) ? Math.max(0, Math.min(1, result.confidence)) : 0.5,
    mode: "vision"
  };
}

async function analyzeSlideRegion(payload = {}) {
  if (!payload.imageDataUrl || typeof payload.imageDataUrl !== "string") {
    const error = new Error("imageDataUrl la bat buoc");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const result = await generateVisionStructuredResponse(
    buildSlideRegionVisionPrompt(payload),
    payload.imageDataUrl,
    "SlideRegionVision"
  );

  return normalizeVisionResult(result);
}

module.exports = {
  analyzeSlideRegion
};
