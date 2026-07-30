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

    if (req.method === "POST" && url.pathname === "/api/quiz/submit") {
      const payload = await readJson(req);
      const data = submitQuiz(payload);
      sendOk(res, data);
      return;
    }

    sendError(res, 405, "METHOD_NOT_ALLOWED", "Unsupported quiz route");
  } catch (error) {
    sendError(res, 500, "QUIZ_ROUTE_FAILED", error.message);
  }
}

module.exports = {
  handleQuizRoutes
};
