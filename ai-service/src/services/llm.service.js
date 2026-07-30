const { mockAiAnswer } = require("../data/mock-ai-responses");

async function generateTutorAnswer() {
  return {
    answer: mockAiAnswer.answer,
    confidence: mockAiAnswer.confidence
  };
}

module.exports = {
  generateTutorAnswer
};
