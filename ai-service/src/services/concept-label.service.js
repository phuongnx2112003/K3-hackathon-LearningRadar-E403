const { generateStructuredResponse } = require("./llm.service");
const { buildLabelPrompt } = require("./prompt.service");

async function labelConcept(payload = {}) {
  const result = await generateStructuredResponse(buildLabelPrompt(payload), "Concept label");

  if (
    typeof result.conceptId !== "string" ||
    typeof result.conceptLabel !== "string" ||
    !Number.isFinite(result.confidence)
  ) {
    throw new Error("Concept label response has an invalid format");
  }

  return {
    conceptId: result.conceptId,
    conceptLabel: result.conceptLabel,
    confidence: Math.max(0, Math.min(1, result.confidence))
  };
}

module.exports = {
  labelConcept
};
