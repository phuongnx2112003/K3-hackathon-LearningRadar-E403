const { generateStructuredResponse } = require("./llm.service");
const { buildLabelPrompt } = require("./prompt.service");

async function labelConcept(payload = {}) {
  const result = await generateStructuredResponse(
    `${buildLabelPrompt(payload)}\n\nTra ve JSON duy nhat: {"conceptId":"string", "conceptLabel":"string", "confidence":0.0}.`,
    "Concept label"
  );

  if (result !== null) {
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

  return {
    conceptId: "concept-dropout-01",
    conceptLabel: "Phan biet Dropout luc train va inference",
    confidence: 0.82
  };
}

module.exports = {
  labelConcept
};
