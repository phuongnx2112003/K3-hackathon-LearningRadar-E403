export const mockQuizzes = {
  "lesson-01": [
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
  ]
};
