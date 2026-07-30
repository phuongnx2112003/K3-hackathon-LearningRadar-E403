const { mockTickets } = require("../data/mock-tickets");

const allowedReasons = new Set(["not_understood", "quiz_failed"]);

function createTicket(payload) {
  if (!payload.selectedText || !payload.question || !payload.conceptLabel || !payload.reason) {
    const error = new Error("selectedText, question, conceptLabel va reason la bat buoc");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  if (!allowedReasons.has(payload.reason)) {
    const error = new Error("reason phai la not_understood hoac quiz_failed");
    error.code = "VALIDATION_ERROR";
    throw error;
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
    createdAt: new Date().toISOString()
  };

  mockTickets.push(ticket);

  return ticket;
}

function listTickets() {
  return mockTickets;
}

function getDashboardSummary() {
  const counts = new Map();

  for (const ticket of mockTickets) {
    counts.set(ticket.conceptLabel, (counts.get(ticket.conceptLabel) || 0) + 1);
  }

  const topConcepts = Array.from(counts.entries())
    .map(([conceptLabel, count]) => ({ conceptLabel, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalTickets: mockTickets.length,
    openTickets: mockTickets.filter((ticket) => ticket.status === "open").length,
    topConcepts
  };
}

module.exports = {
  createTicket,
  getDashboardSummary,
  listTickets
};
