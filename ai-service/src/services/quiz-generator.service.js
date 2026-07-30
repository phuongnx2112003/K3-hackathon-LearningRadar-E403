const { mockQuiz } = require("../data/mock-ai-responses");
const { generateStructuredResponse } = require("./llm.service");
const { buildQuizPrompt } = require("./prompt.service");

async function generateQuiz(payload = {}) {
  const result = await generateStructuredResponse(
    `${buildQuizPrompt(payload)}\n\nTra ve JSON duy nhat: {"conceptId":"string", "conceptLabel":"string", "questions":[{"id":"q1", "question":"string", "options":["A","B","C","D"], "correctIndex":0}]}. Tao dung 5 cau hoi va moi options co dung 4 phan tu.`,
    "Quiz"
  );

  if (result !== null) {
    if (!Array.isArray(result.questions) || result.questions.length !== 5) {
      throw new Error("Quiz response must contain exactly 5 questions");
    }

    return {
      conceptId: typeof result.conceptId === "string" ? result.conceptId : payload.conceptId || mockQuiz.conceptId,
      conceptLabel:
        typeof result.conceptLabel === "string"
          ? result.conceptLabel
          : payload.conceptLabel || mockQuiz.conceptLabel,
      questions: result.questions
    };
  }

  return {
    conceptId: payload.conceptId || mockQuiz.conceptId,
    conceptLabel: payload.conceptLabel || mockQuiz.conceptLabel,
    questions: mockQuiz.questions
  };
}

module.exports = {
  generateQuiz
};
