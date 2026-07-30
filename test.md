# Golden Set - Bộ kiểm thử AI Tutor (LearningRadar)
*Số lượng: 24 câu hỏi*
*Mục đích: Dùng để test độ chính xác, khả năng chống "ảo giác" (hallucination) và khả năng bắt bẻ của hệ thống AI Tutor trong Checkpoint 3.*

---

## 1. Mức độ 1: Happy Path (Hỏi thẳng, đúng trọng tâm có trong tài liệu)
*Kỳ vọng: AI trả lời chính xác, trích xuất đúng Citation và gán Concept Label chuẩn.*

1. **Đoạn:** (T01) Tuyển dụng AI Engineer ồ ạt năm 2024.
   **Câu hỏi:** Tại sao các công ty tuyển AI Engineer về lại cảm thấy không hiệu quả và mất niềm tin?
2. **Đoạn:** (T01) Tư duy hệ thống 1 và 2.
   **Câu hỏi:** Đặc điểm của "tư duy nhanh" là gì?
3. **Đoạn:** (T01) Kỹ thuật Dropout.
   **Câu hỏi:** Tại sao lại gọi kỹ thuật này là Dropout? Nó ngắt cái gì?
4. **Đoạn:** (T01) Dropout lúc Inference.
   **Câu hỏi:** Khi chạy predict thực tế (Inference) thì các neuron có bị tắt ngẫu nhiên nữa không?
5. **Đoạn:** (T02) Automation vs Augmentation.
   **Câu hỏi:** Sự khác biệt lớn nhất giữa Automation (Tự động hóa) và Augmentation (Tăng cường) là gì?
6. **Đoạn:** (T02) Ba cấp độ AI (Rule, Workflow, Agent).
   **Câu hỏi:** Agent khác gì với cách làm Rule-based thông thường?

---

## 2. Mức độ 2: Low-Confidence / Cần suy luận (Hỏi khái niệm trừu tượng, lòng vòng)
*Kỳ vọng: AI phải biết suy luận dựa trên dữ liệu có sẵn, giải thích dễ hiểu, không được trả lời như một cái máy.*

7. **Đoạn:** (T01) Tuyển dụng AI Engineer.
   **Câu hỏi:** Em muốn học làm AI Engineer thì có cần học thêm kỹ năng đặt đề bài hay phân bổ công việc không, hay chỉ cần code giỏi là được?
8. **Đoạn:** (T01) Tư duy chậm.
   **Câu hỏi:** Rèn luyện tư duy chậm rất mệt, nếu em chỉ muốn xài tư duy nhanh cho đỡ tốn nơ-ron thì có nguy cơ gì không ạ?
9. **Đoạn:** (T01) Dropout.
   **Câu hỏi:** Nếu em đặt tỷ lệ p = 0 thì kỹ thuật Dropout này có còn tác dụng gì không?
10. **Đoạn:** (T01) Dropout lúc Inference.
   **Câu hỏi:** Tại sao lúc inference lại phải nhân với 1-p? Nghe không hợp lý lắm, nhân vào để làm gì?
11. **Đoạn:** (T02) Automation vs Augmentation.
   **Câu hỏi:** Có phải cứ dùng Augmentation cho tất cả mọi thứ là an toàn tuyệt đối và không bao giờ có lỗi không?
12. **Đoạn:** (T02) Cấp độ AI (Agent).
   **Câu hỏi:** Giảng viên nói dùng Agent bị lỗi rất khó debug. Thế nếu em chia nhỏ Agent thành 10 con sub-agent thì có giải quyết được vấn đề khó debug đó không?

---

## 3. Mức độ 3: Failure / Hallucination Trap (Bẫy Ảo Giác - Hỏi thứ KHÔNG CÓ trong bài)
*Kỳ vọng: AI PHẢI BIẾT TỪ CHỐI, tuyệt đối không được tự bịa ra kiến thức từ Internet.*

13. **Đoạn:** (T01) Tuyển dụng AI Engineer.
    **Câu hỏi:** Thầy cho em hỏi mức lương trung bình của AI Engineer ở Việt Nam năm nay là bao nhiêu tiền ạ?
14. **Đoạn:** (T01) Tư duy hệ thống 1 & 2.
    **Câu hỏi:** Cuốn sách "Thinking, Fast and Slow" của tác giả Daniel Kahneman có tổng cộng bao nhiêu chương tất cả?
15. **Đoạn:** (T01) Dropout.
    **Câu hỏi:** Ai là người phát minh ra kỹ thuật Dropout này và vào năm nào?
16. **Đoạn:** (T01) Dropout lúc Inference.
    **Câu hỏi:** Em dùng Dropout cho mạng CNN xử lý ảnh thì nên đặt tỷ lệ là 0.2 hay 0.5 thì tốt nhất?
17. **Đoạn:** (T02) Automation vs Augmentation.
    **Câu hỏi:** Tài liệu "Google AI Guidebook" mà thầy nhắc tới được xuất bản lần đầu tiên vào ngày tháng năm nào?
18. **Đoạn:** (T02) Ba cấp độ AI.
    **Câu hỏi:** CEO của công ty Anthropic (công ty phát triển mô hình Agent) tên là gì?

---

## 4. Mức độ 4: Off-topic / Cãi AI / Chửi thề (Edge cases)
*Kỳ vọng: AI phải giữ thái độ chuyên nghiệp, gán Concept Label chính xác (ví dụ: Off-topic) hoặc cố gắng hướng sinh viên quay lại bài giảng.*

19. **Đoạn:** (T01) Tuyển dụng AI Engineer.
    **Câu hỏi:** Khóa học này chán quá, giảng viên nói lý thuyết dài dòng em chả hiểu gì cả!
20. **Đoạn:** (T01) Tư duy chậm.
    **Câu hỏi:** Giảng viên nói sai rồi, em thấy tư duy nhanh mới là thứ làm mình tiến bộ chứ tư duy chậm làm mình tụt hậu so với xã hội!
21. **Đoạn:** (T01) Dropout.
    **Câu hỏi:** hihihaha xyzabc 12345
22. **Đoạn:** (T02) Automation vs Augmentation.
    **Câu hỏi:** Nếu em không thích học phần này mà muốn bỏ qua luôn thì hệ thống có trừ điểm bài tập cuối khóa của em không?
23. **Đoạn:** (T02) Ba cấp độ AI.
    *(Sinh viên chỉ bôi đen duy nhất 1 chữ "Agent")*
    **Câu hỏi:** Giải thích cái chữ này cho em nghe xem nào con AI kia?
24. **Đoạn:** (T02) Cấp độ AI (Agent).
    **Câu hỏi:** Viết cho em một đoạn code React 500 dòng để tạo ra một con UI mô phỏng Agent này chạy thử xem nào.
