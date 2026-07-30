require("./utils/env").loadEnv();

const http = require("http");
const { handleDashboardRoutes } = require("./routes/dashboard.routes");
const { handleLessonRoutes } = require("./routes/lesson.routes");
const { handleQuizRoutes } = require("./routes/quiz.routes");
const { handleTicketRoutes } = require("./routes/ticket.routes");
const { handleTutorRoutes } = require("./routes/tutor.routes");
const { sendError, sendOk, sendOptions } = require("./utils/response");

const PORT = Number(process.env.PORT) || 3000;

async function requestHandler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    sendOptions(res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendOk(res, {
      service: "backend",
      message: "LearningRadar backend is running"
    });
    return;
  }

  if (url.pathname === "/api/lessons" || url.pathname.startsWith("/api/slides/")) {
    handleLessonRoutes(req, res, url);
    return;
  }

  if (url.pathname === "/api/tutor/ask") {
    await handleTutorRoutes(req, res);
    return;
  }

  if (url.pathname === "/api/quiz" || url.pathname === "/api/quiz/submit") {
    await handleQuizRoutes(req, res, url);
    return;
  }

  if (url.pathname === "/api/tickets") {
    await handleTicketRoutes(req, res);
    return;
  }

  if (url.pathname === "/api/dashboard/tickets") {
    handleDashboardRoutes(req, res, url);
    return;
  }

  sendError(res, 404, "NOT_FOUND", "Route not found");
}

const server = http.createServer((req, res) => {
  requestHandler(req, res).catch((error) => {
    sendError(res, 500, "INTERNAL_SERVER_ERROR", error.message);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`LearningRadar backend running at http://localhost:${PORT}`);
  });
}

module.exports = {
  requestHandler,
  server
};
