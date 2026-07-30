// MOCK DATA CHO CHECKPOINT 2 - LearningRadar (Đã chuẩn hóa theo Contract trong Policy.md)

// 1. Dữ liệu Lesson (Đoạn text sinh viên chọn)
export const mockLessons = [
  {
    lessonId: "lesson-01",
    title: "Xác định bài toán kinh doanh cho AI",
    source: "transcript-01-clean.md",
    content: "Trong khoảng hai năm trở lại đây, sau làn sóng AI, các công ty có áp lực phải đưa AI vào tổ chức của mình. Ở Việt Nam mình quan sát thấy có một làn sóng đầu tiên là các công ty tuyển rất nhiều AI engineer, khoảng 2024 và 2025. Họ đặt ra một câu hỏi \"bây giờ tôi muốn AI cho doanh nghiệp\", và việc đầu tiên là họ tuyển — mình thấy rất nhiều tin tuyển dụng như vậy. Nhưng cuối cùng câu chuyện là ông AI engineer đấy chỉ giải được cái bài mà đã có người đưa sẵn một đề bài cụ thể. Vấn đề ở đây là cái người đặt ra đề bài đấy thì lại không có. Không có ai chỉ ra được là trong 7749 cái việc tôi phải làm mỗi ngày, cái gì tôi nên đưa vào làm trước, cái gì tôi nên làm để tạo ra được thành quả ngay đầu tiên. Sau đấy thì nhiều công ty thấy là không hiệu quả và mất niềm tin về cách làm việc đấy."
  },
  {
    lessonId: "lesson-02",
    title: "Tư duy hệ thống 1 & 2",
    source: "transcript-01-clean.md",
    content: "Theo nghiên cứu về não bộ thì não bộ của chúng ta hay đi theo thói quen. Khi bạn luôn nhảy thẳng vào solution thì bạn sẽ bị quen như thế, và nếu bạn không bao giờ cho mình dừng lại, cho mình câu hỏi để xây dựng một lối tư duy mới thì bạn sẽ bị cuốn theo cái kia mãi. Cái này là trong cuốn sách về tư duy hệ thống 1 với hệ thống 2 — \"Thinking, Fast and Slow\" — cuốn kinh điển về tư duy, nói về việc con người chúng ta có hai kiểu tư duy: nhanh và chậm. Tư duy nhanh là bạn nghe một vấn đề gì đấy là bạn phản ứng luôn — nó không tốn nhiều nơ-ron thần kinh lắm, não bạn không bị mệt, bạn phản ứng theo phản xạ, bản năng. Như những cái đường khi bạn đi: đèn xanh bạn đi, đèn đỏ là dừng lại, rẽ trái hoặc có xe thì bạn tự động dừng — tất cả những cái đấy đã thành phản xạ rồi. Nhưng tư duy chậm là thứ tư duy khiến chúng ta lớn dần lên, hình thành những kỹ năng mới, thói quen mới. Tư duy chậm là một kiểu tư duy rất tốn năng lượng và khiến chúng ta bị mệt."
  }
];

// 2. Dữ liệu Tutor Answer
export const mockTutorAnswers = {
  "lesson-01": {
    answer: "Theo bài giảng, việc tuyển dụng AI Engineer không mang lại hiệu quả vì các công ty thiếu người biết cách xác định đề bài cụ thể. Giảng viên có nói: \"Ông AI engineer đấy chỉ giải được cái bài mà đã có người đưa sẵn một đề bài cụ thể. Vấn đề ở đây là cái người đặt ra đề bài đấy thì lại không có\". Do không ai chỉ ra được việc gì cần làm trước để tạo ra thành quả ngay, việc triển khai AI rơi vào bế tắc và gây mất niềm tin.",
    citation: "[T01-002]",
    conceptLabel: "Problem Formulation",
    confidence: 0.95
  },
  "lesson-02": {
    answer: "Bạn cần rèn luyện tư duy chậm vì đó chính là cách để bản thân phát triển. Giảng viên giải thích rằng: \"Tư duy chậm là thứ tư duy khiến chúng ta lớn dần lên, hình thành những kỹ năng mới, thói quen mới\". Mặc dù nó tốn năng lượng và gây mệt mỏi, nhưng nó rất cần thiết để bạn vượt qua những phản xạ có điều kiện (tư duy nhanh) và thực sự thay đổi cách tư duy cốt lõi.",
    citation: "[T01-016]",
    conceptLabel: "Product Mindset",
    confidence: 0.92
  }
};

// 3. Dữ liệu Quiz Question (5 câu mỗi lesson)
export const mockQuizzes = {
  "lesson-01": [
    {
      id: "q1_1",
      question: "Vấn đề cốt lõi khi các công ty ồ ạt tuyển AI Engineer vào năm 2024-2025 nhưng không hiệu quả là gì?",
      options: [
        "AI Engineer thiếu kỹ năng lập trình.",
        "Công nghệ AI lúc đó chưa đủ trưởng thành.",
        "Thiếu người có khả năng đặt ra đề bài cụ thể cần giải quyết.",
        "Thiếu dữ liệu để huấn luyện mô hình."
      ],
      correctIndex: 2
    },
    {
      id: "q1_2",
      question: "Theo giảng viên, một AI Engineer thường làm tốt nhất nhiệm vụ gì?",
      options: [
        "Giải các bài toán đã được định nghĩa sẵn và cụ thể.",
        "Đặt ra chiến lược kinh doanh cho công ty.",
        "Đánh giá nhu cầu của khách hàng.",
        "Quản lý toàn bộ dự án phần mềm."
      ],
      correctIndex: 0
    },
    {
      id: "q1_3",
      question: "Tại sao các công ty lại mất niềm tin vào việc ứng dụng AI?",
      options: [
        "Vì AI chi phí quá đắt đỏ.",
        "Không thấy được thành quả ngay lập tức do không biết ưu tiên bài toán nào.",
        "Vì AI thường xuyên sinh ra ảo giác (hallucination).",
        "Vì người dùng không thích AI."
      ],
      correctIndex: 1
    },
    {
      id: "q1_4",
      question: "Theo giảng viên, việc nào nên được ưu tiên làm trước trong số rất nhiều việc mỗi ngày?",
      options: [
        "Việc dễ nhất.",
        "Việc phức tạp nhất.",
        "Việc mà AI Engineer thích làm.",
        "Việc có thể tạo ra thành quả ngay đầu tiên."
      ],
      correctIndex: 3
    },
    {
      id: "q1_5",
      question: "Điều gì xảy ra khi không có người định hướng vấn đề cụ thể cho team phát triển?",
      options: [
        "Các AI Engineer sẽ làm việc độc lập và sáng tạo hơn.",
        "Sản phẩm sẽ bị trì hoãn do không biết làm gì trước.",
        "Công ty sẽ tự động ứng dụng AI thành công.",
        "Dẫn đến mất định hướng, không hiệu quả và mất niềm tin."
      ],
      correctIndex: 3
    }
  ],
  "lesson-02": [
    {
      id: "q2_1",
      question: "Đặc điểm chính của 'tư duy nhanh' (Hệ thống 1) là gì?",
      options: [
        "Phân tích rất sâu sắc một vấn đề.",
        "Phản ứng theo bản năng, phản xạ, không tốn nhiều năng lượng.",
        "Luôn đưa ra quyết định chính xác 100%.",
        "Rất mệt mỏi và tốn não."
      ],
      correctIndex: 1
    },
    {
      id: "q2_2",
      question: "Tại sao chúng ta thường có xu hướng nhảy thẳng vào giải pháp (solution)?",
      options: [
        "Do não bộ hoạt động theo thói quen của tư duy nhanh.",
        "Vì các giải pháp luôn luôn đúng.",
        "Do tư duy chậm quá phức tạp.",
        "Vì sếp luôn yêu cầu thế."
      ],
      correctIndex: 0
    },
    {
      id: "q2_3",
      question: "Mục đích chính của việc rèn luyện 'tư duy chậm' là gì?",
      options: [
        "Giải quyết vấn đề thật nhanh gọn.",
        "Tiết kiệm năng lượng thần kinh.",
        "Giúp hình thành kỹ năng, thói quen mới để phát triển tư duy.",
        "Tránh khỏi những nguy hiểm trên đường."
      ],
      correctIndex: 2
    },
    {
      id: "q2_4",
      question: "Khó khăn lớn nhất khi thực hành 'tư duy chậm' là gì?",
      options: [
        "Rất khó để tìm sách hướng dẫn.",
        "Không mang lại tác dụng ngay lập tức.",
        "Gây mệt mỏi và tiêu tốn nhiều năng lượng thần kinh.",
        "Dễ bị nhầm lẫn với tư duy nhanh."
      ],
      correctIndex: 2
    },
    {
      id: "q2_5",
      question: "Cuốn sách nào được nhắc đến để giải thích về 2 hệ thống tư duy?",
      options: [
        "The Design of Everyday Things",
        "Thinking, Fast and Slow",
        "People + AI Guidebook",
        "AI Engineering"
      ],
      correctIndex: 1
    }
  ]
};

// 4. Dữ liệu Ticket
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
    id: "ticket-002",
    selectedText: "Tư duy chậm là thứ tư duy khiến chúng ta lớn dần lên...",
    question: "Tư duy chậm gây mệt mỏi thì tại sao mình lại phải rèn luyện nó?",
    conceptLabel: "Product Mindset",
    reason: "quiz_failed",
    quizScore: 2,
    status: "open",
    createdAt: "2026-07-30T10:55:00Z"
  }
];
