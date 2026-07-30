const { getDashboardSummary, listTickets } = require("../services/ticket.service");
const { sendError, sendOk } = require("../utils/response");

function handleDashboardRoutes(req, res) {
  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only GET is allowed");
    return;
  }

  sendOk(res, {
    summary: getDashboardSummary(),
    tickets: listTickets()
  });
}

module.exports = {
  handleDashboardRoutes
};
