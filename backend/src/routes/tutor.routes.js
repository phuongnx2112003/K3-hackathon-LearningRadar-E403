const { ask } = require("../services/tutor.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleTutorRoutes(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    const data = await ask(payload);
    sendOk(res, data);
  } catch (error) {
    const code = error.code || "TUTOR_ASK_FAILED";
    const statusCode = code === "VALIDATION_ERROR" ? 400 : 500;
    sendError(res, statusCode, code, error.message);
  }
}

module.exports = {
  handleTutorRoutes
};
