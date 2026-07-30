const { mockQuiz } = require("../data/mock-ai-responses");

async function generateQuiz(payload = {}) {
  return {
    conceptId: payload.conceptId || mockQuiz.conceptId,
    conceptLabel: payload.conceptLabel || mockQuiz.conceptLabel,
    questions: mockQuiz.questions
  };
}

module.exports = {
  generateQuiz
};
