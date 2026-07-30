export const mockTutorAnswers = {
  "lesson-01": {
    answer: "Theo bài giảng, việc tuyển dụng AI Engineer không mang lại hiệu quả vì các công ty thiếu người đặt đề bài...",
    citation: "[T01-002]",
    conceptLabel: "Problem Formulation",
    confidence: 0.95
  },
  "default": {
    answer: `Chào bạn! Về câu hỏi của bạn dựa trên slide:

- **Giải thích bản chất:** Dropout là kỹ thuật Regularization ngẫu nhiên tắt một tỷ lệ neuron trong quá trình **Huấn luyện (Train)** để tránh hiện tượng co-adaptation.
- **Trạng thái khi Predict (Inference):** Lúc dự đoán thực tế, **tất cả neuron đều được BẬT**, các trọng số được nhân với hệ số (1-p) để giữ cân bằng năng lượng.

Hy vọng giải thích này giúp bạn làm rõ khác biệt giữa lúc Train và lúc Predict!`,
    citation: '[Trang 5 - Mã đoạn D1-P13 & D1-P14]',
    conceptLabel: 'Phân biệt Dropout lúc Train vs Inference',
    confidence: 0.90
  }
};
