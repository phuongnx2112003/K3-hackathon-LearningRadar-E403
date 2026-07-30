require("./utils/env").loadEnv();

const http = require("http");
const { handleAskRoute } = require("./routes/ask.routes");
const { handleLabelRoute } = require("./routes/label.routes");
const { handleQuizRoute } = require("./routes/quiz.routes");
const { sendError, sendOk, sendOptions } = require("./utils/response");

const PORT = Number(process.env.PORT) || 4000;

const routes = {
  "/ai/ask": handleAskRoute,
  "/ai/quiz": handleQuizRoute,
  "/ai/label": handleLabelRoute
};

async function requestHandler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    sendOptions(res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendOk(res, {
      service: "ai-service",
      message: "LearningRadar AI service is running",
      status: "ok"
    });
    return;
  }

  const routeHandler = routes[url.pathname];
  if (routeHandler) {
    await routeHandler(req, res);
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
    console.log(`LearningRadar AI service running at http://localhost:${PORT}`);
  });
}

module.exports = {
  requestHandler,
  server
};
