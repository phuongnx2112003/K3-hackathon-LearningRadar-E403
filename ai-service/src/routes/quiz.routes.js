const { generateQuiz } = require("../services/quiz-generator.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleQuizRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    if (payload.conceptId !== undefined && typeof payload.conceptId !== "string") {
      sendError(res, 400, "VALIDATION_ERROR", "conceptId phai la chuoi");
      return;
    }

    if (payload.conceptLabel !== undefined && typeof payload.conceptLabel !== "string") {
      sendError(res, 400, "VALIDATION_ERROR", "conceptLabel phai la chuoi");
      return;
    }

    const quiz = await generateQuiz(payload);
    sendOk(res, quiz);
  } catch (error) {
    const isInvalidJson = error instanceof SyntaxError;
    sendError(
      res,
      isInvalidJson ? 400 : 500,
      isInvalidJson ? "INVALID_JSON" : "AI_QUIZ_FAILED",
      isInvalidJson ? "Request body must be valid JSON" : error.message
    );
  }
}

module.exports = {
  handleQuizRoute
};
