const { findCitation } = require("../services/citation.service");
const { labelConcept } = require("../services/concept-label.service");
const { generateTutorAnswer } = require("../services/llm.service");
const { buildTutorPrompt } = require("../services/prompt.service");
const { decideGuardrail } = require("../services/guardrail.service");
const { readJson, sendError, sendOk } = require("../utils/response");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function handleAskRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);

    if (!isNonEmptyString(payload.selectedText) || !isNonEmptyString(payload.question)) {
      sendError(res, 400, "VALIDATION_ERROR", "selectedText va question la bat buoc");
      return;
    }

    const guardrail = decideGuardrail(payload);
    if (guardrail.handled) {
      sendOk(res, {
        answer: guardrail.answer,
        citation: findCitation(payload),
        conceptId: guardrail.conceptId,
        conceptLabel: guardrail.conceptLabel,
        confidence: guardrail.confidence,
        decision: "guardrail"
      });
      return;
    }

    const prompt = buildTutorPrompt(payload);
    const tutorAnswer = await generateTutorAnswer(prompt);
    const label = await labelConcept(payload);

    sendOk(res, {
      answer: tutorAnswer.answer,
      citation: findCitation(payload),
      conceptId: label.conceptId,
      conceptLabel: label.conceptLabel,
      confidence: tutorAnswer.confidence
    });
  } catch (error) {
    const isInvalidJson = error instanceof SyntaxError;
    sendError(
      res,
      isInvalidJson ? 400 : 500,
      isInvalidJson ? "INVALID_JSON" : "AI_ASK_FAILED",
      isInvalidJson ? "Request body must be valid JSON" : error.message
    );
  }
}

module.exports = {
  handleAskRoute
};
