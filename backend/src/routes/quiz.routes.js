const { getQuiz, submitQuiz } = require("../services/quiz.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleQuizRoutes(req, res, url) {
  try {
    if (req.method === "GET" && url.pathname === "/api/quiz") {
      const conceptId = url.searchParams.get("conceptId") || "concept-dropout-01";
      const data = await getQuiz(conceptId);
      sendOk(res, data);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/quiz") {
      const payload = await readJson(req);
      const data = await getQuiz(payload);
      sendOk(res, data);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/quiz/submit") {
      const payload = await readJson(req);
      const data = await submitQuiz(payload);
      sendOk(res, data);
      return;
    }

    sendError(res, 405, "METHOD_NOT_ALLOWED", "Unsupported quiz route");
  } catch (error) {
    const code = error.code || "QUIZ_ROUTE_FAILED";
    const statusCode = code === "VALIDATION_ERROR" ? 400 : 500;
    sendError(res, statusCode, code, error.message);
  }
}

module.exports = {
  handleQuizRoutes
};
