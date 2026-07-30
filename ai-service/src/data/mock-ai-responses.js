const mockAiAnswer = {
  answer:
    "Dropout giúp model giảm overfitting. Khi train, một phần neuron được tắt ngẫu nhiên để model không phụ thuộc quá mức vào một vài neuron cụ thể. Khi inference, tất cả neuron được bật để dùng đầy đủ năng lực đã học, đồng thời output được cân bằng theo tỷ lệ dropout.",
  citation: {
    source: "transcript-01-clean.md",
    section: "Dropout train vs inference",
    quote: "Khi train có dropout; khi inference tất cả neuron được bật."
  },
  conceptId: "concept-dropout-01",
  conceptLabel: "Phân biệt Dropout lúc Train và Inference",
  confidence: 0.82
};

const mockQuiz = {
  conceptId: "concept-dropout-01",
  conceptLabel: "Phân biệt Dropout lúc Train và Inference",
  questions: [
    {
      id: "q1",
      question: "Dropout được dùng chủ yếu để làm gì?",
      options: ["Tăng overfitting", "Giảm overfitting", "Tăng kích thước data", "Xóa test set"],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Trong quá trình train, Dropout làm gì với một số neuron?",
      options: ["Tắt ngẫu nhiên", "Nhân đôi", "Xóa vĩnh viễn", "Chỉ giữ neuron sai"],
      correctIndex: 0
    },
    {
      id: "q3",
      question: "Khi inference, các neuron thường ở trạng thái nào?",
      options: ["Tắt tất cả", "Bật tất cả", "Chỉ bật 10%", "Bị xóa khỏi model"],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Dropout giúp hạn chế hiện tượng nào?",
      options: ["Co-adaptation", "Compilation", "Pagination", "Authentication"],
      correctIndex: 0
    },
    {
      id: "q5",
      question: "Ngưỡng pass quiz LearningRadar CP3 là bao nhiêu câu đúng?",
      options: ["1/5", "2/5", "3/5", "5/5"],
      correctIndex: 2
    }
  ]
};

module.exports = {
  mockAiAnswer,
  mockQuiz
};
