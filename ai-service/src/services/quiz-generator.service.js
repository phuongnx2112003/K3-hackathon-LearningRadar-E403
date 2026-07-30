const { generateStructuredResponse } = require("./llm.service");
const { buildQuizPrompt } = require("./prompt.service");

async function generateQuiz(payload = {}) {
  const result = await generateStructuredResponse(buildQuizPrompt(payload), "Quiz");

  if (!Array.isArray(result.questions) || result.questions.length !== 5) {
    throw new Error("Quiz response must contain exactly 5 questions");
  }

  const questions = result.questions.map((question, index) => {
    const hasValidOptions =
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((option) => typeof option === "string" && option.trim());

    if (
      typeof question.question !== "string" ||
      !question.question.trim() ||
      !hasValidOptions ||
      !Number.isInteger(question.correctIndex) ||
      question.correctIndex < 0 ||
      question.correctIndex > 3
    ) {
      throw new Error(`Quiz question ${index + 1} has an invalid format`);
    }

    return {
      id: typeof question.id === "string" && question.id.trim() ? question.id : `q${index + 1}`,
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex
    };
  });

  return {
    conceptId: typeof result.conceptId === "string" ? result.conceptId : payload.conceptId || "concept-generated",
    conceptLabel:
      typeof result.conceptLabel === "string"
        ? result.conceptLabel
        : payload.conceptLabel || "Generated concept",
    questions
  };
}

module.exports = {
  generateQuiz
};
