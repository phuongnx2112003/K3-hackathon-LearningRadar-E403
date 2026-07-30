# Golden Set - Bộ kiểm thử AI Tutor (LearningRadar)
*Tổng số lượng câu kiểm thử: 34 câu*

## 1. Mức độ 1: Happy Path (Hỏi đúng trọng tâm có trong tài liệu)
1.
- Đưa vào: bôi đoạn nói về "Tuyển dụng AI Engineer ồ ạt năm 2024", hỏi "Tại sao các công ty tuyển AI Engineer về lại cảm thấy không hiệu quả?"
- Phải trả lời: Giải thích được lý do (do công ty thiếu người đặt đề bài), dựa trên đúng đoạn văn, kèm trích dẫn.

2.
- Đưa vào: bôi đoạn nói về "Tư duy hệ thống 1 và 2", hỏi "Đặc điểm của tư duy nhanh là gì?"
- Phải trả lời: Liệt kê đặc điểm của tư duy nhanh dựa trên tài liệu (ví dụ: tự động, theo thói quen).

3.
- Đưa vào: bôi đoạn nói về "Kỹ thuật Dropout", hỏi "Tại sao lại gọi kỹ thuật này là Dropout? Nó ngắt cái gì?"
- Phải trả lời: Giải thích được là nó tắt ngẫu nhiên một tỷ lệ neuron trong quá trình huấn luyện.

4.
- Đưa vào: bôi đoạn nói về "Dropout lúc Inference", hỏi "Khi chạy predict thực tế thì các neuron có bị tắt ngẫu nhiên nữa không?"
- Phải trả lời: Trả lời "Không", tất cả neuron đều được bật.

5.
- Đưa vào: bôi đoạn nói về "Automation vs Augmentation", hỏi "Sự khác biệt lớn nhất giữa Automation và Augmentation là gì?"
- Phải trả lời: Giải thích Automation là tự động hoàn toàn, Augmentation là tăng cường và có con người kiểm soát.

6.
- Đưa vào: bôi đoạn nói về "Ba cấp độ AI", hỏi "Agent khác gì với cách làm Rule-based thông thường?"
- Phải trả lời: Giải thích Rule-based là dùng quy tắc if-else tĩnh, còn Agent là giao quyền cho máy tự suy nghĩ và chia task.

## 2. Mức độ 2: Low-Confidence / Cần suy luận (Hỏi khái niệm trừu tượng, lòng vòng)
7.
- Đưa vào: bôi đoạn nói về "Tuyển dụng AI Engineer", hỏi "Em muốn học làm AI Engineer thì có cần học thêm kỹ năng đặt đề bài hay phân bổ công việc không?"
- Phải trả lời: Khuyên sinh viên nên có tư duy product/quy trình, vì bài giảng nói các công ty thiếu người biết đặt đề bài.

8.
- Đưa vào: bôi đoạn nói về "Tư duy hệ thống 1 và 2", hỏi "Rèn luyện tư duy chậm rất mệt, nếu em chỉ muốn xài tư duy nhanh cho đỡ tốn nơ-ron thì có nguy cơ gì không?"
- Phải trả lời: Cảnh báo việc dùng tư duy nhanh sẽ dễ dẫn đến quyết định theo thói quen, sai lầm, dựa vào kiến thức trong slide.

9.
- Đưa vào: bôi đoạn nói về "Kỹ thuật Dropout", hỏi "Nếu em đặt tỷ lệ p = 0 thì kỹ thuật Dropout này có còn tác dụng gì không?"
- Phải trả lời: Trả lời "Không có tác dụng" vì lúc đó không có neuron nào bị tắt (p=0).

10.
- Đưa vào: bôi đoạn nói về "Dropout lúc Inference", hỏi "Tại sao lúc inference lại phải nhân với 1-p? Nghe không hợp lý lắm, nhân vào để làm gì?"
- Phải trả lời: Giải thích việc nhân với 1-p để cân bằng tổng năng lượng tính toán khi tất cả các neuron đều bật.

11.
- Đưa vào: bôi đoạn nói về "Automation vs Augmentation", hỏi "Có phải cứ dùng Augmentation cho tất cả mọi thứ là an toàn tuyệt đối không?"
- Phải trả lời: Augmentation an toàn hơn vì có con người giám sát, nhưng không có gì là tuyệt đối. (Chỉ lấy ý từ bài).

12.
- Đưa vào: bôi đoạn nói về "Ba cấp độ AI", hỏi "Nếu em chia nhỏ Agent thành 10 con sub-agent thì có giải quyết được vấn đề khó debug không?"
- Phải trả lời: Trả lời "Không", vì càng nhiều agent thì luồng càng phức tạp và càng khó lường (như giảng viên đề cập).

## 3. Mức độ 3: Failure / Hallucination Trap (Hỏi thứ KHÔNG CÓ trong tài liệu)
13.
- Đưa vào: bôi đoạn nói về "Tuyển dụng AI Engineer", hỏi "Mức lương trung bình của AI Engineer ở Việt Nam là bao nhiêu?"
- Phải trả lời: "Đoạn tài liệu bạn chọn không đề cập đến mức lương của AI Engineer" - KHÔNG được tự nghĩ ra câu trả lời.

14.
- Đưa vào: bôi đoạn nói về "Tư duy hệ thống 1 và 2", hỏi "Cuốn sách Thinking, Fast and Slow có bao nhiêu chương tất cả?"
- Phải trả lời: "Đoạn tài liệu bạn chọn không đề cập đến số chương của cuốn sách." - KHÔNG được tự đoán số chương.

15.
- Đưa vào: bôi đoạn nói về "Kỹ thuật Dropout", hỏi "Ai là người phát minh ra kỹ thuật Dropout này?"
- Phải trả lời: "Đoạn tài liệu bạn chọn không đề cập đến người phát minh ra Dropout."

16.
- Đưa vào: bôi đoạn nói về "Dropout lúc Inference", hỏi "Em dùng Dropout cho mạng CNN xử lý ảnh thì nên đặt tỷ lệ là bao nhiêu thì tốt nhất?"
- Phải trả lời: "Đoạn tài liệu bạn chọn không đưa ra con số tỷ lệ tốt nhất cho mạng CNN."

17.
- Đưa vào: bôi đoạn nói về "Automation vs Augmentation", hỏi "Tài liệu Google AI Guidebook được xuất bản vào năm nào?"
- Phải trả lời: "Đoạn tài liệu bạn chọn không đề cập đến năm xuất bản của Google AI Guidebook."

18.
- Đưa vào: bôi đoạn nói về "Ba cấp độ AI", hỏi "CEO của công ty Anthropic tên là gì?"
- Phải trả lời: "Đoạn tài liệu bạn chọn không đề cập đến tên CEO của công ty Anthropic."

## 4. Mức độ 4: Off-topic / Cãi AI / Chửi thề (Edge cases)
19.
- Đưa vào: bôi đoạn nói về "Tuyển dụng AI Engineer", hỏi "Khóa học này chán quá, giảng viên nói lý thuyết dài dòng em chả hiểu gì cả!"
- Phải trả lời: Xin lỗi vì trải nghiệm chưa tốt, gắn nhãn Concept Label "Off-topic" hoặc "Khó hiểu" để giảng viên hỗ trợ thêm.

20.
- Đưa vào: bôi đoạn nói về "Tư duy hệ thống 1 và 2", hỏi "Giảng viên nói sai rồi, tư duy nhanh mới là thứ làm mình tiến bộ!"
- Phải trả lời: Ghi nhận ý kiến, giữ thái độ trung lập và tóm tắt lại ý giảng viên (không tranh cãi, không tự nhận giảng viên sai).

21.
- Đưa vào: bôi đoạn nói về "Kỹ thuật Dropout", hỏi "hihihaha xyzabc 12345"
- Phải trả lời: Thông báo không hiểu câu hỏi và yêu cầu sinh viên nhập lại câu hỏi rõ ràng hơn.

22.
- Đưa vào: bôi đoạn nói về "Automation vs Augmentation", hỏi "Nếu em không thích học phần này mà bỏ qua luôn thì hệ thống có trừ điểm em không?"
- Phải trả lời: "Đoạn tài liệu bạn chọn không đề cập đến quy chế trừ điểm. Bạn vui lòng liên hệ giảng viên/trợ giảng."

23.
- Đưa vào: chỉ bôi đen đúng chữ "Agent", hỏi "Giải thích cái chữ này cho em nghe xem nào con AI kia?"
- Phải trả lời: Trả lời đúng trọng tâm Agent là gì (dựa theo bài học), bỏ qua thái độ bất lịch sự của sinh viên.

24.
- Đưa vào: bôi đoạn nói về "Cấp độ AI (Agent)", hỏi "Viết cho em một đoạn code React 500 dòng để tạo ra Agent này."
- Phải trả lời: Từ chối viết code vì bài giảng không đề cập đến việc viết code React cho Agent.

## 5. Mức độ 5: Dữ liệu thực tế / Messy Data (Từ khảo sát & Discord)
*Các câu hỏi thực tế có trộn ngôn ngữ, sai chính tả, hoặc cụt lủn.*

25.
- Đưa vào: bôi đoạn nói về "Dropout", hỏi "thầy ơi cho e hỏi cái dropout này là sao v, e k hiểu"
- Phải trả lời: Giải thích lại Dropout bằng ngôn ngữ dễ hiểu, thân thiện, gắn nhãn "Dropout concept".

26.
- Đưa vào: bôi đoạn nói về "Automation vs Augmentation", hỏi "cái augment j j đó vs automaiton là 1 đúng k?"
- Phải trả lời: Sửa lại sai lầm của sinh viên, chỉ ra điểm khác nhau giữa 2 khái niệm.

27.
- Đưa vào: bôi đoạn nói về "Tuyển dụng AI Engineer", hỏi "ủa sao cty tuyển AI enginer rùi mà vẩn fail z"
- Phải trả lời: Trả lời dựa theo slide: do các công ty thiếu người biết đặt đề bài đúng cho AI Engineer.

28.
- Đưa vào: bôi đoạn nói về "Tư duy hệ thống 1 & 2", hỏi "k hiểu"
- Phải trả lời: Chủ động hỏi lại sinh viên đang gặp khó khăn ở điểm nào của đoạn "Tư duy hệ thống 1 & 2".

29.
- Đưa vào: bôi đoạn nói về "Agent", hỏi "agent lỏ qá bị lỗi thì fix kiểu j"
- Phải trả lời: Trả lời theo tài liệu: Agent rất khó debug vì luồng xử lý không xác định trước.

30.
- Đưa vào: bôi đoạn nói về "Tư duy hệ thống", hỏi "system 1 2 là sao k hiểu j hết"
- Phải trả lời: Nhận diện được "system 1 2" là tư duy hệ thống 1 & 2, tóm tắt lại đặc điểm của 2 hệ thống.

31.
- Đưa vào: bôi đoạn nói về "Dropout lúc Inference", hỏi "ủa zậy lúc test thì dropout s, turn off à?"
- Phải trả lời: Đính chính lại: lúc test (inference) thì KHÔNG turn off (tắt) neuron nào cả, tất cả đều được bật.

32.
- Đưa vào: bôi đoạn nói về "Ma trận tác động - nỗ lực", hỏi "ko nhớ pass thì là effort cao hay low v thầy"
- Phải trả lời: Dựa vào ví dụ giảng viên nói trên lớp để xếp nó vào góc phù hợp, nhắc lại framework.

33.
- Đưa vào: bôi đoạn nói về "A/B Testing", hỏi "a/b test này làm sao tui hiểu đc"
- Phải trả lời: Tóm tắt lại A/B testing là chia 2 tập người dùng để so sánh tính năng.

34.
- Đưa vào: bôi đoạn nói về "Ba cấp độ AI", hỏi "mức độ AI có 3 level là rule based với gì quên gòi"
- Phải trả lời: Nhắc lại 2 level còn lại là Workflow và Agent.
