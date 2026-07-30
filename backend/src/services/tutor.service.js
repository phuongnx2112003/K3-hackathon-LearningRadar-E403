const { askTutor } = require("./ai-client.service");

function validateTutorQuestion(payload) {
  if (!payload.selectedText || !payload.question) {
    return "selectedText va question la bat buoc";
  }

  return null;
}

async function ask(payload) {
  const validationError = validateTutorQuestion(payload);

  if (validationError) {
    const error = new Error(validationError);
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const aiResult = await askTutor(payload);

  return {
    answerId: `answer-${Date.now()}`,
    lessonId: payload.lessonId || "lesson-01",
    studentId: payload.studentId || "student-demo-01",
    selectedText: payload.selectedText,
    question: payload.question,
    answer: aiResult.answer,
    citation: aiResult.citation,
    conceptId: aiResult.conceptId || "concept-dropout-01",
    conceptLabel: aiResult.conceptLabel,
    confidence: aiResult.confidence,
    fallback: Boolean(aiResult.fallback)
  };
}

module.exports = {
  ask
};
