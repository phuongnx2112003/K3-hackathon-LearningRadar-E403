// Mock Data cho Prototype CP2 — LearningRadar AI Tutor

export const MOCK_LESSON = {
  id: 'day01_302.pdf',
  courseName: 'COMP2010 · Lecture_material_ms2039d0_hnxpxy',
  title: 'day01_302.pdf',
  totalPages: 83,
  currentPage: 5,
  chapters: [
    {
      title: 'Day 1',
      active: true,
      docs: [
        { id: 'doc-1', title: 'day01_302.pdf', pages: 83, active: true },
        { id: 'doc-2', title: 'material_mrxpq9zu_t8e6xs.pdf', pages: 32, active: false }
      ]
    },
    { title: 'Day 2', docs: [{ id: 'doc-3', title: 'day02_transformer.pdf', pages: 45 }] },
    { title: 'Day 3', docs: [{ id: 'doc-4', title: 'day03_fine_tuning.pdf', pages: 60 }] },
    { title: 'Day 4', docs: [{ id: 'doc-5', title: 'day04_eval_metrics.pdf', pages: 50 }] },
    { title: 'Day 5', docs: [{ id: 'doc-6', title: 'day05_rag_agent.pdf', pages: 72 }] }
  ],
  paragraphs: [
    {
      id: 'p1',
      page: 5,
      code: 'D1-P12',
      text: 'Overfitting xảy ra khi mô hình học quá kỹ các chi tiết và nhiễu (noise) trong tập dữ liệu huấn luyện, khiến mô hình hoạt động rất tốt trên tập train nhưng có độ chính xác kém trên tập dữ liệu mới (test set).'
    },
    {
      id: 'p2',
      page: 5,
      code: 'D1-P13',
      text: 'Kỹ thuật Dropout hoạt động bằng cách ngẫu nhiên "tắt" một tỷ lệ neuron (ví dụ: p=0.5) trong quá trình forward và backward pass ở mỗi bước huấn luyện. Điều này ngăn các neuron phụ thuộc quá nhiều vào nhau (co-adaptation).'
    },
    {
      id: 'p3',
      page: 6,
      code: 'D1-P14',
      text: 'Lưu ý quan trọng: Lúc Inference/Predict (đánh giá thực tế), tất cả các neuron đều được BẬT. Giá trị đầu ra của mỗi neuron sẽ được nhân với tỷ lệ (1 - p) để cân bằng tổng năng lượng tính toán.'
    }
  ]
};

export const MOCK_AI_RESPONSE = {
  answer: `Chào bạn! Về câu hỏi của bạn dựa trên slide **day01_302.pdf**:

- **Giải thích bản chất:** Dropout là kỹ thuật Regularization ngẫu nhiên tắt một tỷ lệ neuron trong quá trình **Huấn luyện (Train)** để tránh hiện tượng co-adaptation.
- **Trạng thái khi Predict (Inference):** Lúc dự đoán thực tế, **tất cả neuron đều được BẬT**, các trọng số được nhân với hệ số $(1-p)$ để giữ cân bằng năng lượng.

Hy vọng giải thích này giúp bạn làm rõ khác biệt giữa lúc Train và lúc Predict!`,
  citation: 'Trích dẫn: [Trang 5 - Mã đoạn D1-P13 & D1-P14]',
  conceptLabel: 'Lỗ hổng: Phân biệt Dropout lúc Train vs Inference',
  conceptId: 'concept-dropout-01'
};

// Quiz 5 câu kèm giải thích chi tiết khi trả lời sai
export const MOCK_QUIZ = [
  {
    id: 1,
    question: '1. Mục đích chính của kỹ thuật Dropout trong Deep Learning là gì?',
    options: [
      'A. Giảm thời lượng huấn luyện mô hình',
      'B. Phòng chống hiện tượng Overfitting và ngăn các neuron phụ thuộc vào nhau',
      'C. Tăng số lượng tham số của mạng nơ-ron',
      'D. Tự động gắn nhãn dữ liệu đầu vào'
    ],
    correctAnswer: 'B',
    explanation: 'Dropout ngẫu nhiên tắt neuron ở từng bước train để tránh các neuron bị phụ thuộc quá nhiều vào nhau (co-adaptation), giúp mô hình tổng quát hóa tốt hơn.'
  },
  {
    id: 2,
    question: '2. Trong quá trình Inference (dự đoán/đánh giá thực tế), các neuron xử lý thế nào?',
    options: [
      'A. Vẫn bị tắt ngẫu nhiên 50% neuron',
      'B. Tắt toàn bộ các neuron ở layer ẩn',
      'C. Tất cả neuron đều được BẬT và trọng số được scaling phù hợp',
      'D. Chỉ bật neuron ở layer đầu tiên'
    ],
    correctAnswer: 'C',
    explanation: 'Lúc Inference (dự đoán), toàn bộ neuron đều được BẬT để đạt độ chính xác cao nhất. Trọng số sẽ được nhân với (1-p) để cân bằng tổng năng lượng.'
  },
  {
    id: 3,
    question: '3. Nếu tỷ lệ Dropout p = 0.2, có bao nhiêu neuron bị tắt ở mỗi bước forward pass lúc Train?',
    options: [
      'A. 20% số neuron trong layer đó',
      'B. 80% số neuron trong layer đó',
      'C. 2% số neuron',
      'D. Không có neuron nào bị tắt'
    ],
    correctAnswer: 'A',
    explanation: 'Tỷ lệ p = 0.2 nghĩa là ở mỗi bước huấn luyện, 20% số neuron ngẫu nhiên sẽ bị ngắt kết nối tạm thời.'
  },
  {
    id: 4,
    question: '4. Hiện tượng co-adaptation giữa các neuron xảy ra khi nào?',
    options: [
      'A. Khi các neuron hoạt động hoàn toàn độc lập',
      'B. Khi các neuron phụ thuộc quá nhiều vào lỗi của nhau trong tập train',
      'C. Khi mô hình bị Underfitting',
      'D. Khi tỷ lệ học (learning rate) quá nhỏ'
    ],
    correctAnswer: 'B',
    explanation: 'Co-adaptation là hiện tượng các neuron phụ thuộc lẫn nhau để sửa lỗi của nhau trong tập train, dẫn đến kém linh hoạt khi gặp dữ liệu mới.'
  },
  {
    id: 5,
    question: '5. Điểm khác biệt lớn nhất giữa lúc Train và lúc Inference khi dùng Dropout là gì?',
    options: [
      'A. Lúc Train bật hết neuron, lúc Inference tắt 50%',
      'B. Lúc Train ngẫu nhiên tắt neuron, lúc Inference bật toàn bộ neuron',
      'C. Cả Train và Inference đều tắt ngẫu nhiên neuron như nhau',
      'D. Không có điểm khác biệt nào'
    ],
    correctAnswer: 'B',
    explanation: 'Lúc Train ngẫu nhiên tắt neuron để rèn luyện mạng, còn lúc Inference bật toàn bộ neuron để thu được kết quả dự đoán đầy đủ và chính xác nhất.'
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'TICKET-101',
    studentName: 'Nguyễn Văn A (U102)',
    selectedText: 'Kỹ thuật Dropout hoạt động bằng cách ngẫu nhiên tắt một tỷ lệ neuron...',
    question: 'Nếu tắt neuron thì lúc nộp bài làm sao dự đoán đúng được ạ?',
    conceptLabel: 'Phân biệt Dropout lúc Train vs Inference',
    source: 'Bấm "Chưa hiểu"',
    status: 'Mới',
    createdAt: '10:14 AM'
  }
];
