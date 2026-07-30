const { generateQuiz } = require("../services/quiz-generator.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleQuizRoute(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    const quiz = await generateQuiz(payload);
    sendOk(res, quiz);
  } catch (error) {
    sendError(res, 500, "AI_QUIZ_FAILED", error.message);
  }
}

module.exports = {
  handleQuizRoute
};
