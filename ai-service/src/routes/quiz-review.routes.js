const { generateQuizReview } = require("../services/quiz-review.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleQuizReviewRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    const review = await generateQuizReview(payload);
    sendOk(res, review);
  } catch (error) {
    const isInvalidJson = error instanceof SyntaxError;
    sendError(
      res,
      isInvalidJson ? 400 : 500,
      isInvalidJson ? "INVALID_JSON" : "AI_QUIZ_REVIEW_FAILED",
      isInvalidJson ? "Request body must be valid JSON" : error.message
    );
  }
}

module.exports = {
  handleQuizReviewRoute
};
