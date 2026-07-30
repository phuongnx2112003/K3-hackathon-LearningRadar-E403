const { createTicket } = require("../services/ticket.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleTicketRoutes(req, res) {
  if (req.method !== "POST") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
    return;
  }

  try {
    const payload = await readJson(req);
    const ticket = createTicket(payload);
    sendOk(res, { ticket }, 201);
  } catch (error) {
    const code = error.code || "CREATE_TICKET_FAILED";
    const statusCode = code === "VALIDATION_ERROR" ? 400 : 500;
    sendError(res, statusCode, code, error.message);
  }
}

module.exports = {
  handleTicketRoutes
};
