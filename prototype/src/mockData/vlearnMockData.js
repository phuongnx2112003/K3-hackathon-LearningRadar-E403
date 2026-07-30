// VLearn Mock Data cho LearningRadar AI Tutor

export const MOCK_SLIDES = [
  {
    id: 'slide-1',
    title: 'Bài 4: Overfitting & Regularization trong Deep Learning',
    section: 'Chương 2 - Tối ưu hoá mô hình AI',
    content: [
      {
        id: 'p1',
        text: 'Overfitting xảy ra khi mô hình học quá kỹ các chi tiết và nhiễu (noise) trong tập dữ liệu huấn luyện, khiến mô hình hoạt động rất tốt trên tập train nhưng có độ chính xác kém trên tập dữ liệu mới (test set).'
      },
      {
        id: 'p2',
        text: 'Kỹ thuật Dropout hoạt động bằng cách ngẫu nhiên "tắt" một tỷ lệ các neuron trong quá trình forward và backward pass ở mỗi bước huấn luyện. Điều này ngăn các neuron phụ thuộc quá nhiều vào nhau (co-adaptation).'
      },
      {
        id: 'p3',
        text: 'L2 Regularization (Weight Decay) thêm một thành phần phạt tích bình phương độ lớn của các trọng số vào hàm mất mát (Loss Function), ép trọng số có giá trị nhỏ hơn và mô hình mượt hơn.'
      }
    ]
  },
  {
    id: 'slide-2',
    title: 'Bài 5: Attention Mechanism & Transformer Baseline',
    section: 'Chương 3 - Kiến trúc LLM',
    content: [
      {
        id: 'p4',
        text: 'Self-Attention cho phép mô hình tính toán trọng số liên quan giữa tất cả các từ trong cùng một câu, giúp nắm bắt ngữ cảnh dài tốt hơn so với RNN hay LSTM truyền thống.'
      },
      {
        id: 'p5',
        text: 'Ba ma trận Query (Q), Key (K), Value (V) được tạo ra bằng cách nhân vector đầu vào với các ma trận trọng số có thể học được. Scaled Dot-Product Attention được tính bằng softmax(QK^T / sqrt(d_k)) * V.'
      }
    ]
  }
];

export const MOCK_MISCONCEPTIONS = [
  {
    id: 'misc-1',
    topic: 'Phân biệt Dropout lúc Train vs Inference',
    count: 48,
    severity: 'high',
    description: 'Nhiều sinh viên nhầm lẫn rằng Dropout vẫn được bật trong quá trình Inference/Predict.',
    impactedStudents: 18,
    recommendedAction: 'Giảng viên nên giải thích lại việc scaling trọng số hoặc giữ nguyên neuron khi test.'
  },
  {
    id: 'misc-2',
    topic: 'Ý nghĩa của sqrt(d_k) trong Scaled Dot-Product Attention',
    count: 32,
    severity: 'medium',
    description: 'Sinh viên chưa hiểu vì sao phải chia cho căn d_k (để tránh vọt gradient khi d_k quá lớn).',
    impactedStudents: 12,
    recommendedAction: 'Cung cấp bài tập nhỏ tính tay Softmax với số lớn.'
  },
  {
    id: 'misc-3',
    topic: 'Khác biệt giữa L1 và L2 Regularization',
    count: 24,
    severity: 'low',
    description: 'Nhầm lẫn giữa khả năng tạo ra trọng số bằng 0 (Sparsity) của L1 vs L2.',
    impactedStudents: 9,
    recommendedAction: 'Chiếu slide so sánh hình học của L1 (kim cương) và L2 (hình tròn).'
  }
];

export const MOCK_STATS = {
  totalQuestions: 1261,
  totalStudents: 369,
  misconceptionsIdentified: 84,
  understandingCheckPassRate: '64.2%',
  topConfusedSlide: 'Bài 4: Overfitting & Regularization',
  activeConversationsToday: 58
};

export const MOCK_STUDENT_FEEDBACK_LOGS = [
  {
    id: 'log-101',
    studentName: 'Nguyễn Văn A (U102)',
    slideTitle: 'Bài 4 - Overfitting',
    selectedText: 'Kỹ thuật Dropout hoạt động bằng cách ngẫu nhiên "tắt" một tỷ lệ các neuron...',
    question: 'Nếu tắt neuron thì lúc nộp bài làm sao dự đoán đúng được ạ?',
    aiResponse: 'Lúc nộp bài (Inference), tất cả các neuron đều được bật. Tuy nhiên các trọng số sẽ được nhân với tỷ lệ (1 - p) để cân bằng tổng năng lượng.',
    checkQuestion: 'Lúc Inference (dự đoán thực tế), Dropout có tắt neuron không?',
    studentAnswer: 'Có, vẫn tắt 50%',
    status: 'failed', // failed check = misconception detected
    timestamp: '10:14 AM Today'
  },
  {
    id: 'log-102',
    studentName: 'Trần Thị B (U205)',
    slideTitle: 'Bài 5 - Attention Mechanism',
    selectedText: 'Scaled Dot-Product Attention được tính bằng softmax(QK^T / sqrt(d_k)) * V',
    question: 'Tại sao lại cần chia cho căn d_k ạ?',
    aiResponse: 'Khi d_k lớn, tích QK^T sẽ mang giá trị lớn, khiến hàm Softmax rơi vào vùng có gradient cực nhỏ (saturate). Chia cho sqrt(d_k) giúp chuẩn hoá giá trị về khoảng hợp lý.',
    checkQuestion: 'Nếu không chia cho sqrt(d_k) khi d_k lớn, hiện tượng gì sẽ xảy ra với Softmax?',
    studentAnswer: 'Gradient bị triệt tiêu (vanishing gradient) do Softmax rơi vào vùng bão hoà.',
    status: 'passed',
    timestamp: '09:45 AM Today'
  }
];
