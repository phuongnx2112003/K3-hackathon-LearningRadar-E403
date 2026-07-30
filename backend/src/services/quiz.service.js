const mockQuizModule = require("../data/mock-quiz");

const defaultQuiz = {
  conceptId: "concept-dropout-01",
  conceptLabel: "Phan biet Dropout luc train va inference",
  questions: [
    {
      id: "q1",
      question: "Dropout duoc dung chu yeu de lam gi?",
      options: ["Tang overfitting", "Giam overfitting", "Tang kich thuoc data", "Xoa test set"],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Trong qua trinh train, Dropout lam gi voi mot so neuron?",
      options: ["Tat ngau nhien", "Nhan doi", "Xoa vinh vien", "Chi giu neuron sai"],
      correctIndex: 0
    },
    {
      id: "q3",
      question: "Khi inference, cac neuron thuong o trang thai nao?",
      options: ["Tat tat ca", "Bat tat ca", "Chi bat 10%", "Bi xoa khoi model"],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Dropout giup han che hien tuong nao?",
      options: ["Co-adaptation", "Compilation", "Pagination", "Authentication"],
      correctIndex: 0
    },
    {
      id: "q5",
      question: "Nguong pass quiz LearningRadar CP3 la bao nhieu cau dung?",
      options: ["1/5", "2/5", "3/5", "5/5"],
      correctIndex: 2
    }
  ]
};

const conceptToLesson = {
  "concept-dropout-01": "lesson-01",
  "concept-augmentation-01": "lesson-03"
};

function answerToIndex(answer) {
  if (typeof answer === "number") {
    return answer;
  }

  if (typeof answer !== "string") {
    return 0;
  }

  return Math.max(0, answer.trim().toUpperCase().charCodeAt(0) - "A".charCodeAt(0));
}

function normalizeQuestion(question, index) {
  return {
    id: String(question.id).startsWith("q") ? String(question.id) : `q${index + 1}`,
    question: question.question,
    options: question.options,
    correctIndex:
      typeof question.correctIndex === "number"
        ? question.correctIndex
        : answerToIndex(question.correctAnswer)
  };
}

function getQuizByConcept(conceptId = "concept-dropout-01") {
  if (typeof mockQuizModule.getQuizByConcept === "function") {
    return mockQuizModule.getQuizByConcept(conceptId);
  }

  const lessonId = conceptToLesson[conceptId] || conceptId || "lesson-01";
  const sourceQuestions = mockQuizModule.mockQuizzes?.[lessonId];

  if (!Array.isArray(sourceQuestions) || !sourceQuestions.length) {
    return defaultQuiz;
  }

  return {
    conceptId,
    conceptLabel:
      conceptId === "concept-augmentation-01"
        ? "Phan biet Automation va Augmentation"
        : "Phan biet Dropout luc train va inference",
    questions: sourceQuestions.slice(0, 5).map(normalizeQuestion)
  };
}

function hideCorrectAnswers(quiz) {
  return {
    conceptId: quiz.conceptId,
    conceptLabel: quiz.conceptLabel,
    questions: quiz.questions.map(({ correctIndex, ...question }) => question)
  };
}

async function getQuiz(conceptId = "concept-dropout-01") {
  return hideCorrectAnswers(getQuizByConcept(conceptId));
}

function submitQuiz(payload) {
  const conceptId = payload.conceptId || "concept-dropout-01";
  const quiz = getQuizByConcept(conceptId);
  const answers = Array.isArray(payload.answers) ? payload.answers : [];

  if (!answers.length) {
    const error = new Error("answers la bat buoc khi submit quiz");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

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
