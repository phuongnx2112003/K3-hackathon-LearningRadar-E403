const mockAiAnswer = {
  answer:
    "Dropout giup model giam overfitting. Khi train, mot phan neuron duoc tat ngau nhien de model khong hoc phu thuoc vao mot vai neuron cu the. Khi inference, tat ca neuron duoc bat de dung day du nang luc cua model, dong thoi output duoc can bang theo ty le dropout.",
  citation: {
    source: "transcript-01-clean.md",
    section: "Dropout train vs inference",
    quote: "Khi train co dropout; khi inference tat ca neuron duoc bat."
  },
  conceptId: "concept-dropout-01",
  conceptLabel: "Phan biet Dropout luc train va inference",
  confidence: 0.82
};

const mockQuiz = {
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

module.exports = {
  mockAiAnswer,
  mockQuiz
};
