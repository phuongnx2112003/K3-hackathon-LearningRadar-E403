// Ticket Service - Quản lý tạo / đọc / cập nhật Ticket
// Tuân thủ Contract trong policy.md (Section 7.7 & 10)

const { mockTickets } = require("../data/mock-tickets");

const allowedReasons = new Set(["not_understood", "quiz_failed"]);
const allowedStatuses = new Set(["open", "reviewed", "closed"]);

function buildTeacherReply(payload) {
  const message = String(payload.teacherFeedback || payload.feedbackMessage || payload.message || "").trim();
  if (!message) return null;

  return {
    id: `reply-${Date.now()}`,
    teacherName: payload.teacherName || "Giang vien/TA",
    message,
    createdAt: new Date().toISOString()
  };
}

/**
 * POST /api/tickets - Tạo ticket mới
 * Ticket được tạo khi: sinh viên bấm "Chưa hiểu" (reason: not_understood)
 * hoặc fail quiz dưới 3/5 (reason: quiz_failed)
 */
function createTicket(payload) {
  // Validate bắt buộc theo policy.md Section 7.7
  if (!payload.selectedText || !payload.question || !payload.conceptLabel || !payload.reason) {
    const error = new Error("selectedText, question, conceptLabel va reason la bat buoc");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  if (!allowedReasons.has(payload.reason)) {
    const error = new Error("reason phai la 'not_understood' hoac 'quiz_failed'");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  // Nếu reason là quiz_failed thì quizScore phải có và < 3
  if (payload.reason === "quiz_failed") {
    if (payload.quizScore === undefined || payload.quizScore === null) {
      const error = new Error("quizScore la bat buoc khi reason = quiz_failed");
      error.code = "VALIDATION_ERROR";
      throw error;
    }
  }

  const ticket = {
    id: `ticket-${String(mockTickets.length + 1).padStart(3, "0")}`,
    studentId: payload.studentId || "student-demo-01",
    lessonId: payload.lessonId || "lesson-01",
    selectedText: payload.selectedText,
    question: payload.question,
    conceptLabel: payload.conceptLabel,
    reason: payload.reason,
    quizScore: payload.quizScore ?? null,
    status: "open",
    teacherReplies: [],
    teacherFeedback: "",
    lastFeedbackAt: null,
    createdAt: new Date().toISOString()
  };

  mockTickets.push(ticket);

  return ticket;
}

/**
 * Lấy danh sách tickets, có thể filter theo status
 */
function listTickets(filterStatus) {
  if (filterStatus && allowedStatuses.has(filterStatus)) {
    return mockTickets.filter((t) => t.status === filterStatus);
  }
  return mockTickets;
}

/**
 * Cập nhật trạng thái ticket (Giảng viên dùng)
 * status: "open" | "reviewed" | "closed"
 */
function updateTicketStatus(ticketId, newStatus, updates = {}) {
  if (newStatus && !allowedStatuses.has(newStatus)) {
    const error = new Error("status phai la 'open', 'reviewed' hoac 'closed'");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const ticket = mockTickets.find((t) => t.id === ticketId);
  if (!ticket) {
    const error = new Error(`Khong tim thay ticket ${ticketId}`);
    error.code = "NOT_FOUND";
    throw error;
  }

  if (newStatus) {
    ticket.status = newStatus;
  }

  const reply = buildTeacherReply(updates);
  if (reply) {
    ticket.teacherReplies = Array.isArray(ticket.teacherReplies) ? ticket.teacherReplies : [];
    ticket.teacherReplies.push(reply);
    ticket.teacherFeedback = reply.message;
    ticket.lastFeedbackAt = reply.createdAt;
    if (ticket.status === "open") {
      ticket.status = "reviewed";
    }
  }

  return ticket;
}

/**
 * Thống kê tổng hợp cho Dashboard Giảng viên
 * policy.md Section 7.8: tổng ticket, ticket open, nhãn kiến thức yếu
 */
function getDashboardSummary() {
  const conceptCounts = new Map();
  const reasonCounts = { not_understood: 0, quiz_failed: 0 };

  for (const ticket of mockTickets) {
    conceptCounts.set(ticket.conceptLabel, (conceptCounts.get(ticket.conceptLabel) || 0) + 1);
    if (reasonCounts[ticket.reason] !== undefined) {
      reasonCounts[ticket.reason]++;
    }
  }

  const topConcepts = Array.from(conceptCounts.entries())
    .map(([conceptLabel, count]) => ({ conceptLabel, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalTickets: mockTickets.length,
    openTickets: mockTickets.filter((t) => t.status === "open").length,
    reviewedTickets: mockTickets.filter((t) => t.status === "reviewed").length,
    closedTickets: mockTickets.filter((t) => t.status === "closed").length,
    reasonBreakdown: reasonCounts,
    topConcepts
  };
}

module.exports = {
  createTicket,
  getDashboardSummary,
  listTickets,
  updateTicketStatus
};
