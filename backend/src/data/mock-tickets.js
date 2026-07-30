// Mock Tickets - Dữ liệu mẫu theo Contract trong policy.md
// Dùng CommonJS (require/module.exports) để khớp với backend

const mockTickets = [
  {
    id: "ticket-001",
    studentId: "student-demo-01",
    lessonId: "lesson-01",
    selectedText: "Vấn đề ở đây là cái người đặt ra đề bài đấy thì lại không có...",
    question: "Tại sao công ty tuyển AI engineer về lại không hiệu quả và mất niềm tin ạ?",
    conceptLabel: "Problem Formulation",
    reason: "not_understood",
    quizScore: null,
    status: "open",
    createdAt: "2026-07-30T10:45:00Z"
  },
  {
    id: "ticket-002",
    studentId: "student-demo-02",
    lessonId: "lesson-01",
    selectedText: "Kỹ thuật Dropout hoạt động bằng cách ngẫu nhiên tắt một tỷ lệ neuron...",
    question: "Nếu tắt neuron thì lúc nộp bài làm sao dự đoán đúng được ạ?",
    conceptLabel: "Phân biệt Dropout lúc Train vs Inference",
    reason: "quiz_failed",
    quizScore: 2,
    status: "open",
    createdAt: "2026-07-30T10:14:00Z"
  },
  {
    id: "ticket-003",
    studentId: "student-demo-03",
    lessonId: "lesson-02",
    selectedText: "Nếu công việc đấy sai mà gây hậu quả cực kỳ nghiêm trọng, thì nó cần luôn nằm ở gần phía augmentation hơn...",
    question: "Augmentation khác gì với việc mình tự làm hoàn toàn từ đầu ạ?",
    conceptLabel: "AI Risk Management",
    reason: "not_understood",
    quizScore: null,
    status: "open",
    createdAt: "2026-07-30T14:20:00Z"
  },
  {
    id: "ticket-004",
    studentId: "student-demo-04",
    lessonId: "lesson-02",
    selectedText: "Với agent, chính là bạn cho nó quyền tự động suy nghĩ và tự động chia task. Khi nó sai bạn sẽ rất khó debug.",
    question: "Tại sao Agent lại khó sửa lỗi hơn so với code bình thường?",
    conceptLabel: "Agent Architecture",
    reason: "quiz_failed",
    quizScore: 1,
    status: "reviewed",
    createdAt: "2026-07-30T14:40:00Z"
  }
];

module.exports = { mockTickets };
