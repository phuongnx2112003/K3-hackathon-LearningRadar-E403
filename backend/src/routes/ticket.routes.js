// Ticket Routes - POST /api/tickets (tạo) & PATCH /api/tickets (cập nhật status)
// Tuân thủ policy.md Section 7.7 & 9.1

const { createTicket, updateTicketStatus } = require("../services/ticket.service");
const { readJson, sendError, sendOk } = require("../utils/response");

async function handleTicketRoutes(req, res) {
  if (req.method === "POST") {
    // POST /api/tickets — Tạo ticket mới
    try {
      const payload = await readJson(req);
      const ticket = createTicket(payload);
      sendOk(res, { ticket }, 201);
    } catch (error) {
      const code = error.code || "CREATE_TICKET_FAILED";
      const statusCode = code === "VALIDATION_ERROR" ? 400 : 500;
      sendError(res, statusCode, code, error.message);
    }
    return;
  }

  if (req.method === "PATCH") {
    // PATCH /api/tickets — Cập nhật trạng thái ticket (Giảng viên dùng)
    // Body: { "id": "ticket-001", "status": "reviewed" }
    try {
      const payload = await readJson(req);
      if (!payload.id || !payload.status) {
        sendError(res, 400, "VALIDATION_ERROR", "id va status la bat buoc");
        return;
      }
      const ticket = updateTicketStatus(payload.id, payload.status);
      sendOk(res, { ticket });
    } catch (error) {
      const code = error.code || "UPDATE_TICKET_FAILED";
      const statusCode = code === "NOT_FOUND" ? 404 : code === "VALIDATION_ERROR" ? 400 : 500;
      sendError(res, statusCode, code, error.message);
    }
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Chi ho tro POST va PATCH");
}

module.exports = {
  handleTicketRoutes
};
