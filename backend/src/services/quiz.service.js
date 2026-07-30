const mockQuizModule = require("../data/mock-quiz");
const { generateQuiz: generateQuizWithAi } = require("./ai-client.service");

const generatedQuizStore = new Map();

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

function slugify(value) {
  return String(value || "generated-concept")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "generated-concept";
}

function inferLabel(payload = {}) {
  const text = `${payload.conceptLabel || ""} ${payload.question || ""} ${payload.selectedText || ""}`.toLowerCase();

  if (text.includes("llm") || text.includes("large language model") || text.includes("transformer")) {
    return "Hieu dung ve LLM";
  }

  if (text.includes("automation") || text.includes("augmentation")) {
    return "Automation va Augmentation";
  }

  if (text.includes("agent")) {
    return "Agent va workflow";
  }

  if (text.includes("dropout")) {
    return "Dropout train va inference";
  }

  return payload.conceptLabel || "Kiem tra dung diem thac mac";
}

function buildContextFallbackQuiz(payload = {}) {
  const label = inferLabel(payload);
  const conceptId = payload.conceptId || `context-${slugify(label)}`;
  const selectedText = String(payload.selectedText || "").trim();
  const question = String(payload.question || "").trim();

  if (/llm|large language model|transformer/i.test(`${selectedText} ${question} ${label}`)) {
    return {
      conceptId,
      conceptLabel: label,
      questions: [
        {
          id: "q1",
          question: "Theo doan vua hoi, LLM nen duoc hieu la gi?",
          options: ["Mot ung dung chatbot cu the", "Mot mo hinh ngon ngu lon lam nen tang cho nhieu tac vu", "Mot co so du lieu slide", "Mot cong cu chi de ve anh"],
          correctIndex: 1
        },
        {
          id: "q2",
          question: "Vi sao noi chatbot chi la ung dung cu the cua LLM?",
          options: ["Vi chatbot la lop san pham dong goi ben ngoai nen tang LLM", "Vi chatbot khong can model nao", "Vi LLM chi dung de cham quiz", "Vi chatbot luon la Transformer"],
          correctIndex: 0
        },
        {
          id: "q3",
          question: "LLM trong doan duoc huan luyen de lam gi?",
          options: ["Du doan tu/phan tiep theo trong ngu canh", "Xoa transcript", "Tu dong tao ticket", "Chi doc file PDF"],
          correctIndex: 0
        },
        {
          id: "q4",
          question: "Y nao sau day dung voi quan he giua LLM va Transformer trong doan?",
          options: ["LLM co the dua tren kien truc Transformer", "Transformer la giao dien cua VLearn", "LLM khong lien quan den mo hinh", "Transformer chi la quiz"],
          correctIndex: 0
        },
        {
          id: "q5",
          question: "Neu da hieu doan nay, ban se tranh nham lan nao?",
          options: ["Dong nhat LLM voi moi chatbot cu the", "Noi LLM la nen tang/model", "Phan biet model va san pham dong goi", "Hieu chatbot la ung dung cua model"],
          correctIndex: 0
        }
      ]
    };
  }

  if (/automation|augmentation/i.test(`${selectedText} ${question} ${label}`)) {
    return {
      conceptId,
      conceptLabel: label,
      questions: [
        {
          id: "q1",
          question: "Automation khac Augmentation o diem chinh nao?",
          options: ["Automation de may tu lam, Augmentation la AI ho tro con nguoi", "Hai khai niem giong nhau", "Augmentation la xoa con nguoi khoi quy trinh", "Automation chi la to mau slide"],
          correctIndex: 0
        },
        {
          id: "q2",
          question: "Khi viec sai co hau qua nghiem trong, nen thien ve huong nao?",
          options: ["Automation 100%", "Augmentation co con nguoi kiem soat", "Bo qua danh gia rui ro", "Dung AI de quyet dinh tat ca"],
          correctIndex: 1
        },
        {
          id: "q3",
          question: "Dau hieu nao hop voi Augmentation?",
          options: ["AI ho tro, con nguoi van giam sat", "AI tu quyet dinh moi thu", "Khong can nguoi dung", "Khong can kiem tra dau ra"],
          correctIndex: 0
        },
        {
          id: "q4",
          question: "Automation phu hop hon khi nao?",
          options: ["Tac vu ro rang, rui ro thap, co the tu dong hoa", "Tac vu mo ho va hau qua cao", "Khi khong co can cu", "Khi muon che giau loi"],
          correctIndex: 0
        },
        {
          id: "q5",
          question: "Muc tieu cua viec chon giua Automation va Augmentation la gi?",
          options: ["Can bang hieu qua voi muc do kiem soat/rui ro", "Luon chon AI lam thay 100%", "Chi lam giao dien dep", "Khong can do luong"],
          correctIndex: 0
        }
      ]
    };
  }

  const shortContext = selectedText || question || "doan kien thuc vua hoi";

  return {
    conceptId,
    conceptLabel: label,
    questions: [
      {
        id: "q1",
        question: "Y chinh cua doan kien thuc vua hoi la gi?",
        options: [shortContext.slice(0, 120), "Mot noi dung khong lien quan", "Chi la quy dinh nop bai", "Khong co y nao"],
        correctIndex: 0
      },
      {
        id: "q2",
        question: "Khi tra loi cau hoi nay, nen dua vao dau?",
        options: ["Doan tai lieu vua chon", "Doan ngoai nguon khong lien quan", "Doan tu bia them", "Dap an quiz co san"],
        correctIndex: 0
      },
      {
        id: "q3",
        question: "Neu doan tai lieu khong co thong tin can hoi, AI Tutor nen lam gi?",
        options: ["Noi khong du can cu", "Bia cau tra loi", "Doan so lieu", "Tra loi bang bat ky cach nao"],
        correctIndex: 0
      },
      {
        id: "q4",
        question: "Cau hoi quiz nay dang kiem tra dieu gi?",
        options: ["Muc do hieu diem vua thac mac", "Kha nang copy dap an", "Thoi gian nop bai", "Ten file frontend"],
        correctIndex: 0
      },
      {
        id: "q5",
        question: "Sau khi doc giai thich, sinh vien nen lam gi de xac nhan da hieu?",
        options: ["Tra loi quiz dua tren doan vua hoi", "Bo qua citation", "Doi sang chu de khac", "An ticket"],
        correctIndex: 0
      }
    ]
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
  if (typeof conceptId === "object" && conceptId !== null) {
    const payload = conceptId;
    const hasContext = Boolean(String(payload.selectedText || "").trim() || String(payload.question || "").trim());
    let quiz;

    if (hasContext) {
      try {
        quiz = await generateQuizWithAi(payload);
        if (quiz.fallback === true) {
          quiz = buildContextFallbackQuiz(payload);
        }
      } catch (error) {
        quiz = buildContextFallbackQuiz(payload);
      }
    } else {
      quiz = getQuizByConcept(payload.conceptId || "concept-dropout-01");
    }

    const normalizedQuiz = {
      conceptId: quiz.conceptId || payload.conceptId || `context-${Date.now()}`,
      conceptLabel: quiz.conceptLabel || inferLabel(payload),
      questions: quiz.questions.slice(0, 5).map(normalizeQuestion),
      fallback: quiz.fallback === true
    };

    generatedQuizStore.set(normalizedQuiz.conceptId, normalizedQuiz);
    return hideCorrectAnswers(normalizedQuiz);
  }

  return hideCorrectAnswers(getQuizByConcept(conceptId));
}

function submitQuiz(payload) {
  const conceptId = payload.conceptId || "concept-dropout-01";
  const quiz = generatedQuizStore.get(conceptId) || getQuizByConcept(conceptId);
  const answers = Array.isArray(payload.answers) ? payload.answers : [];

  if (!answers.length) {
    const error = new Error("answers la bat buoc khi submit quiz");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const review = answers.map((answer) => {
    const question = quiz.questions.find((item) => item.id === answer.questionId);
    return {
      questionId: answer.questionId,
      selectedIndex: answer.selectedIndex,
      correctIndex: question?.correctIndex ?? null,
      correct: Boolean(question && question.correctIndex === answer.selectedIndex)
    };
  }, 0);
  const score = review.filter((item) => item.correct).length;

  const total = quiz.questions.length;
  const passThreshold = 3;

  return {
    score,
    total,
    passed: score >= passThreshold,
    passThreshold,
    review
  };
}

module.exports = {
  getQuiz,
  submitQuiz
};
