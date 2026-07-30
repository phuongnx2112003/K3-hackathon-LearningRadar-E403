const { findCitation } = require("../services/citation.service");
const { generateTutorAnswer } = require("../services/llm.service");
const { buildTutorPrompt } = require("../services/prompt.service");
const { decideGuardrail } = require("../services/guardrail.service");
const { retrieveContext } = require("../services/document-index.service");
const { readJson, sendError, sendOk } = require("../utils/response");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function toCitation(chunk, lessonId) {
  const page = Number(chunk.metadata?.page);
  const chunkIndex = Number(chunk.metadata?.chunkIndex);
  return {
    source: chunk.metadata.filename,
    section: chunk.metadata.title,
    lessonId: chunk.metadata.lessonId || lessonId || null,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    chunkIndex: Number.isInteger(chunkIndex) && chunkIndex >= 0 ? chunkIndex : 0,
    quote: chunk.text.slice(0, 180),
    retrieval: "sqlite"
  };
}

function ensureCitationMarkers(answer, citations) {
  const text = String(answer || "").trim();
  if (!text || !citations.length || /\[\d+\]/.test(text)) return text;

  let citationIndex = 0;
  return text.split(/(\n\s*\n)/).map((part) => {
    if (!part.trim() || /^\n/.test(part)) return part;
    const marker = `[${(citationIndex % citations.length) + 1}]`;
    citationIndex += 1;
    return `${part.trimEnd()} ${marker}`;
  }).join("");
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
      const citation = findCitation({ ...payload, selectedText: payload.selectedText || "No student-selected text" });
      sendOk(res, {
        answer: ensureCitationMarkers(guardrail.answer, citation ? [citation] : []),
        citation,
        citations: citation ? [citation] : [],
        conceptId: guardrail.conceptId,
        conceptLabel: guardrail.conceptLabel,
        confidence: guardrail.confidence,
        decision: "guardrail"
      });
      return;
    }

    const prompt = buildTutorPrompt({ ...payload, relevantChunks });
    const tutorAnswer = await generateTutorAnswer(prompt);
    const citations = relevantChunks.slice(0, 6).map((chunk) => toCitation(chunk, payload.lessonId));
    sendOk(res, {
      answer: ensureCitationMarkers(tutorAnswer.answer, citations),
      citation: citations[0] || findCitation(payload),
      citations,
      conceptId: tutorAnswer.conceptId,
      conceptLabel: tutorAnswer.conceptLabel,
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
