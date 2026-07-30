const { findCitation } = require("../services/citation.service");
const { labelConcept } = require("../services/concept-label.service");
const { generateTutorAnswer } = require("../services/llm.service");
const { buildTutorPrompt } = require("../services/prompt.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleAskRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);

    if (!payload.selectedText || !payload.question) {
      sendError(res, 400, "VALIDATION_ERROR", "selectedText va question la bat buoc");
      return;
    }

    const prompt = buildTutorPrompt(payload);
    const tutorAnswer = await generateTutorAnswer(prompt);
    const label = labelConcept(payload);

    sendOk(res, {
      answer: tutorAnswer.answer,
      citation: findCitation(payload),
      conceptId: label.conceptId,
      conceptLabel: label.conceptLabel,
      confidence: tutorAnswer.confidence
    });
  } catch (error) {
    sendError(res, 500, "AI_ASK_FAILED", error.message);
  }
}

module.exports = {
  handleAskRoute
};
