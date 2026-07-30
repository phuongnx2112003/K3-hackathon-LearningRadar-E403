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
  ],
  "lesson-03": [
    {
      id: 31,
      question: "Theo bài giảng, điểm khác biệt lớn nhất giữa Automation và Augmentation là gì?",
      options: [
        "Automation nhanh hơn Augmentation.",
        "Automation giao toàn quyền cho máy, Augmentation giữ con người ở lại để kiểm soát.",
        "Augmentation tốn nhiều chi phí hơn Automation.",
        "Automation chỉ dùng cho bài toán dễ, Augmentation dùng cho bài toán khó."
      ],
      correctAnswer: "B",
      explanation: "Automation là để máy tự động làm hoàn toàn, còn Augmentation là dùng AI để tăng cường năng lực cho con người, con người vẫn là người ra quyết định cuối cùng."
    },
    {
      id: 32,
      question: "Khi giải quyết một bài toán có rủi ro và hậu quả cực kỳ nghiêm trọng (như y tế, tài chính), chiến lược nào được ưu tiên?",
      options: [
        "Tự động hóa hoàn toàn (100% Automation) để loại bỏ sai sót của con người.",
        "Bắt đầu với Automation, sau đó nếu lỗi thì chuyển sang Augmentation.",
        "Luôn ưu tiên Augmentation để con người có thể kiểm soát và can thiệp khi cần thiết.",
        "Dùng Agent để tự động phân tích rủi ro."
      ],
      correctAnswer: "C",
      explanation: "Bài giảng nhấn mạnh: nếu công việc sai gây hậu quả cực kỳ nghiêm trọng, nó cần luôn nằm ở gần phía augmentation hơn là đi về automate."
    },
    {
      id: 33,
      question: "Giảng viên khuyên cách tiếp cận khi đưa AI vào một quy trình mới là gì?",
      options: [
        "Áp dụng 100% tự động hóa ngay từ đầu để tiết kiệm thời gian.",
        "Bắt đầu từ Augmentation (tăng cường), sau đó mới tăng dần mức độ tự động hóa.",
        "Chỉ dùng AI cho những việc không quan trọng.",
        "Không nên dùng AI nếu quy trình đó đã có từ lâu."
      ],
      correctAnswer: "B",
      explanation: "Nên đi từ phía augmentation lên — đừng cố gắng automate mọi thứ 100% ngay lập tức, vì cái đấy có thể có những rủi ro rất lớn."
    }
  ]
};
