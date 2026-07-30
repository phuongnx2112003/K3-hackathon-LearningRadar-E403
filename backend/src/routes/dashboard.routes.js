// Dashboard Routes - GET /api/dashboard/tickets
// Tuân thủ policy.md Section 7.8 & 9.1

const { getDashboardSummary, listTickets } = require("../services/ticket.service");
const { sendError, sendOk } = require("../utils/response");

function handleDashboardRoutes(req, res) {
  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Chi ho tro GET");
    return;
  }

  // Hỗ trợ filter: GET /api/dashboard/tickets?status=open
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const filterStatus = url.searchParams.get("status") || null;
  // A student sends only its browser-local anonymous ID. This is not an
  // authentication system; it merely keeps demo sessions on different devices separate.
  const studentId = url.searchParams.get("studentId") || null;

  sendOk(res, {
    summary: getDashboardSummary(),
    tickets: listTickets(filterStatus, studentId)
  });
}

module.exports = {
  handleDashboardRoutes
};
