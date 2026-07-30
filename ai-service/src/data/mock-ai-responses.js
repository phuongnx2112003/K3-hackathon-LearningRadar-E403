export const mockTutorAnswers = {
  "lesson-01": {
    answer: "Theo bài giảng, việc tuyển dụng AI Engineer không mang lại hiệu quả vì các công ty thiếu người đặt đề bài...",
    citation: "[T01-002]",
    conceptLabel: "Problem Formulation",
    confidence: 0.95
  },
  "lesson-03": {
    answer: "Trong bài, giảng viên khuyên không nên tự động hóa (automate) 100% ngay từ đầu vì khi giao toàn quyền cho AI, bạn phải đối mặt với rủi ro rất lớn nếu AI quyết định sai. Thay vào đó, với những việc mà hậu quả sai sót nghiêm trọng, hãy luôn bắt đầu từ hướng Augmentation (tăng cường) để con người giữ vai trò kiểm soát, rồi mới tăng dần mức độ tự động hóa lên khi đã an toàn.",
    citation: "[T02-033, T02-034]",
    conceptLabel: "AI Risk Management",
    confidence: 0.98
  },
  "lesson-04": {
    answer: "Theo bài giảng, khi sử dụng Agent, bạn giao quyền tự động suy nghĩ và phân chia task cho AI, khiến bài toán trở thành không xác định. Vì hệ thống tự sinh ra các luồng xử lý mới mà bạn không lường trước được, nên khi xảy ra lỗi, mỗi trường hợp lỗi lại là một logic hoàn toàn mới, khiến quá trình debug (tìm và sửa lỗi) trở nên vô cùng khó khăn.",
    citation: "[T02-039]",
    conceptLabel: "Agent Architecture",
    confidence: 0.92
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
