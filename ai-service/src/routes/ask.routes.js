const { findCitation } = require("../services/citation.service");
const { labelConcept } = require("../services/concept-label.service");
const { generateTutorAnswer } = require("../services/llm.service");
const { buildTutorPrompt } = require("../services/prompt.service");
const { decideGuardrail } = require("../services/guardrail.service");
const { retrieveContext } = require("../services/document-index.service");
const { readJson, sendError, sendOk } = require("../utils/response");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function toCitation(chunk) {
  return {
    source: chunk.metadata.filename,
    section: chunk.metadata.title,
    page: chunk.metadata.page || null,
    chunkIndex: chunk.metadata.chunkIndex,
    quote: chunk.text.slice(0, 180),
    retrieval: "sqlite"
  };
}

async function handleAskRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);

    if (!isNonEmptyString(payload.question)) {
      sendError(res, 400, "VALIDATION_ERROR", "question la bat buoc");
      return;
    }

    // Always retrieve first for an uploaded lesson. The old demo guardrails remain
    // only as a fallback when this lesson has no indexed material.
    const relevantChunks = await retrieveContext(payload.question, payload.lessonId, payload.selectedText, payload.selectedPages || []);
    const guardrail = decideGuardrail(payload);
    if (guardrail.handled && relevantChunks.length === 0) {
      sendOk(res, {
        answer: guardrail.answer,
        citation: findCitation({ ...payload, selectedText: payload.selectedText || "No student-selected text" }),
        conceptId: guardrail.conceptId,
        conceptLabel: guardrail.conceptLabel,
        confidence: guardrail.confidence,
        decision: "guardrail"
      });
      return;
    }

    const prompt = buildTutorPrompt({ ...payload, relevantChunks });
    const tutorAnswer = await generateTutorAnswer(prompt);
    const label = await labelConcept(payload);

    const citations = relevantChunks.slice(0, 2).map(toCitation);
    sendOk(res, {
      answer: tutorAnswer.answer,
      citation: citations[0] || findCitation(payload),
      citations,
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
