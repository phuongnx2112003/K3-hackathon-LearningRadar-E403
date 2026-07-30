# Dàn ý slide — LearningRadar cho VLearn

## Slide 1 — Vấn đề

- Học viên hỏi AI Tutor xong vẫn có thể hiểu sai, nhưng tín hiệu này hiện bị mất.
- Giảng viên/TA không biết khái niệm nào đang khiến nhiều học viên vướng.
- LearningRadar biến một lần hỏi bài thành tín hiệu để hỗ trợ đúng chỗ.

## Slide 2 — Người dùng và lát cắt

- Người dùng chính: sinh viên đang đọc slide/transcript trên VLearn.
- Lát cắt: sinh viên chọn một đoạn khó, hỏi AI; AI trả lời có citation và gắn nhãn kiến thức; tín hiệu “chưa hiểu” hoặc quiz fail được gửi cho TA.
- Người dùng thứ hai: giảng viên/TA xem dashboard để ưu tiên hỗ trợ.

## Slide 3 — Flow prototype CP2

`Chọn/dán đoạn tài liệu → Hỏi AI Tutor → Citation + concept label → Đã hiểu/Chưa hiểu → Quiz 5 câu → Ticket → Dashboard`

- CP2 dùng mock data để chứng minh toàn bộ flow bấm được.
- CP3 thay mock bằng backend và AI call thật.

## Slide 4 — Quy tắc ra quyết định

- “Chưa hiểu” tạo ticket ngay.
- “Đã hiểu” không kết thúc flow: học viên làm quiz 5 câu.
- Đạt từ 3/5: không tạo ticket. Dưới 3/5: tạo ticket, lưu điểm quiz và vẫn giải thích lại các câu sai.
- Citation luôn hiển thị cạnh câu trả lời để học viên kiểm căn cứ.

## Slide 5 — Dashboard giảng viên

- Mỗi ticket có: đoạn text, câu hỏi, concept label, lý do tạo, điểm quiz (nếu có) và trạng thái xử lý.
- Dashboard tổng hợp số ticket và số lượt theo từng nhãn kiến thức.
- TA có thể đổi trạng thái: Mới → Đang hỗ trợ → Đã xử lý.

## Slide 6 — Demo và bước tiếp theo

- Demo nhánh 1: “Chưa hiểu” → ticket xuất hiện trên dashboard.
- Demo nhánh 2: quiz fail → ticket có điểm quiz; quiz pass → không ticket.
- CP3: gọi AI thật, citation từ transcript, API ticket/dashboard và golden set đánh giá chất lượng.
