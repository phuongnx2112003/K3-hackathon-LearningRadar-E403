const { generateStructuredResponse } = require("./llm.service");
const { buildQuizReviewPrompt } = require("./prompt.service");

function buildLocalReview(payload = {}) {
  const selectedText = String(payload.selectedText || "").trim();
  const contextHint = selectedText ? ` Ý trong tài liệu liên quan: "${selectedText.slice(0, 180)}".` : "";

  return (payload.review || []).map((item) => {
    const selected = item.selectedOption || "Chưa chọn";
    const correct = item.correctOption || "Không xác định";
    const question = item.question || "câu hỏi này";

    if (item.isCorrect) {
      return {
        questionId: item.questionId,
        explanation: `Bạn chọn đúng vì "${correct}" trả lời trực tiếp cho câu "${question}".${contextHint}`
      };
    }

    return {
      questionId: item.questionId,
      explanation: `Bạn chọn "${selected}", nhưng lựa chọn này chưa giải quyết đúng trọng tâm của câu "${question}". Đáp án đúng là "${correct}" vì nó khớp với ý chính cần kiểm tra trong đoạn học liệu.${contextHint}`
    };
  });
}

async function generateQuizReview(payload = {}) {
  const localReview = buildLocalReview(payload);
  const result = await generateStructuredResponse(buildQuizReviewPrompt(payload), "QuizReview");
  const review = Array.isArray(result.review) ? result.review : [];
  const normalizedReview = review
    .filter((item) => typeof item.questionId === "string" && typeof item.explanation === "string")
    .map((item) => ({
      questionId: item.questionId,
      explanation: item.explanation.trim()
    }));

  if (normalizedReview.length !== localReview.length) {
    return {
      review: localReview,
      fallback: true
    };
  }

  return {
    review: normalizedReview,
    fallback: false
  };
}

module.exports = {
  generateQuizReview
};
