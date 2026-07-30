const { generateQuiz } = require("./ai-client.service");
const { getQuizByConcept, hideCorrectAnswers } = require("../data/mock-quiz");

async function getQuiz(conceptId = "concept-dropout-01", context = {}) {
  const generatedQuiz = await generateQuiz({ conceptId, ...context });

  if (generatedQuiz?.questions?.length) {
    return hideCorrectAnswers(generatedQuiz);
  }

  return hideCorrectAnswers(getQuizByConcept(conceptId));
}

function submitQuiz(payload) {
  const conceptId = payload.conceptId || "concept-dropout-01";
  const quiz = getQuizByConcept(conceptId);
  const answers = Array.isArray(payload.answers) ? payload.answers : [];

  const score = answers.reduce((total, answer) => {
    const question = quiz.questions.find((item) => item.id === answer.questionId);
    return total + (question && question.correctIndex === answer.selectedIndex ? 1 : 0);
  }, 0);

  const total = quiz.questions.length;
  const passThreshold = 3;

  return {
    score,
    total,
    passed: score >= passThreshold,
    passThreshold
  };
}

module.exports = {
  getQuiz,
  submitQuiz
};
