export const mockTickets = [
  {
    id: "ticket-001",
    selectedText: "Vấn đề ở đây là cái người đặt ra đề bài đấy thì lại không có...",
    question: "Tại sao công ty tuyển AI engineer về lại không hiệu quả và mất niềm tin ạ?",
    conceptLabel: "Problem Formulation",
    reason: "not_understood",
    quizScore: null,
    status: "open",
    createdAt: "2026-07-30T10:45:00Z"
  },
  {
    id: 'ticket-002',
    studentName: 'Nguyễn Văn A (U102)',
    selectedText: 'Kỹ thuật Dropout hoạt động bằng cách ngẫu nhiên tắt một tỷ lệ neuron...',
    question: 'Nếu tắt neuron thì lúc nộp bài làm sao dự đoán đúng được ạ?',
    conceptLabel: 'Phân biệt Dropout lúc Train vs Inference',
    reason: 'quiz_failed',
    quizScore: 2,
    status: "open",
    createdAt: '2026-07-30T10:14:00Z'
  }
];
