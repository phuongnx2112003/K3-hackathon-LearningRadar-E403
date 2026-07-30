const mockQuizModule = require("../data/mock-quiz");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:4000";

function getFallbackQuiz(conceptId = "concept-dropout-01") {
  if (typeof mockQuizModule.getQuizByConcept === "function") {
    return mockQuizModule.getQuizByConcept(conceptId);
  }

  const sourceQuestions = mockQuizModule.mockQuizzes?.["lesson-01"] || [];

  if (!sourceQuestions.length) {
    return {
      conceptId,
      conceptLabel: "Phan biet Dropout luc train va inference",
      questions: []
    };
  }

  return {
    conceptId,
    conceptLabel: "Phan biet Dropout luc train va inference",
    questions: sourceQuestions.slice(0, 5).map((question, index) => ({
      id: String(question.id).startsWith("q") ? String(question.id) : `q${index + 1}`,
      question: question.question,
      options: question.options,
      correctIndex:
        typeof question.correctIndex === "number"
          ? question.correctIndex
          : Math.max(0, String(question.correctAnswer || "A").charCodeAt(0) - "A".charCodeAt(0))
    }))
  };
}

async function postToAiService(path, payload) {
  if (typeof fetch !== "function") {
    throw new Error("Global fetch is not available. Use Node 18 or newer.");
  }

  const response = await fetch(`${AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`AI service responded with ${response.status}`);
  }

  const json = await response.json();

  if (!json.ok) {
    throw new Error(json.error?.message || "AI service returned an error");
  }

  return json.data;
}

function fallbackAnswer(payload) {
  return {
    answer:
      "Dropout duoc dung de giam overfitting. Khi train, he thong tat ngau nhien mot phan neuron de model khong phu thuoc qua muc vao mot duong hoc. Khi inference, tat ca neuron duoc bat de model dung day du nang luc da hoc.",
    citation: {
      source: "transcript-01-clean.md",
      section: "Dropout train vs inference",
      quote: "Khi train co dropout; khi inference tat ca neuron duoc bat."
    },
    conceptId: "concept-dropout-01",
    conceptLabel: "Phan biet Dropout luc train va inference",
    confidence: 0.82,
    fallback: true,
    lessonId: payload.lessonId
  };
}

async function askTutor(payload) {
  try {
    return await postToAiService("/ai/ask", payload);
  } catch (error) {
    return fallbackAnswer(payload);
  }
}

async function indexDocument(payload) { return postToAiService("/ai/documents/index", payload); }
async function deleteDocumentIndex(documentId) { return postToAiService("/ai/documents/delete", { documentId }); }

async function generateQuiz(payload) {
  try {
    return await postToAiService("/ai/quiz", payload);
  } catch (error) {
    const quiz = getFallbackQuiz(payload.conceptId);
    return {
      conceptId: quiz.conceptId,
      conceptLabel: quiz.conceptLabel,
      questions: quiz.questions,
      fallback: true
    };
  }
}

async function generateQuizReview(payload) {
  try {
    return await postToAiService("/ai/quiz-review", payload);
  } catch (error) {
    return {
      review: [],
      fallback: true
    };
  }
}

async function analyzeSlideRegion(payload) {
  try {
    return await postToAiService("/ai/slide-region", payload);
  } catch (error) {
    const textHint = String(payload.textHint || "").trim();
    return {
      selectedText: textHint || "Không OCR được vùng ảnh vì AI service/vision model chưa sẵn sàng. Hãy kiểm tra AI_MODE=openai, OPENAI_API_KEY và AI_SERVICE_URL.",
      description: error.message,
      regionType: textHint ? "text" : "unclear",
      confidence: textHint ? 0.45 : 0.2,
      mode: "vision-fallback"
    };
  }
}

async function labelConcept(payload) {
  try {
    return await postToAiService("/ai/label", payload);
  } catch (error) {
    return {
      conceptId: "concept-dropout-01",
      conceptLabel: "Phan biet Dropout luc train va inference",
      confidence: 0.82,
      fallback: true
    };
  }
}

module.exports = {
  askTutor,
  analyzeSlideRegion,
  indexDocument,
  deleteDocumentIndex,
  generateQuiz,
  generateQuizReview,
  labelConcept
};
