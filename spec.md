# AI SPEC — LearningRadar · Nhóm [XX] · Zone [X]

## CP1 Canvas — Tờ Canvas 7 Dòng

| # | Mục | Nội dung chốt |
|---|---|---|
| 1 | **Chiến tuyến** | **VLearn — tính năng mới: LearningRadar cho AI Tutor.** |
| 2 | **Ai đang làm việc này — một vai cụ thể** | **Sinh viên đang đọc slide trên VLearn trong/ sau buổi học**, gặp một đoạn kiến thức chưa hiểu và muốn hỏi ngay trên đúng vùng text đó. |
| 3 | **Họ vướng gì — ai, đang làm gì, vướng đâu, hậu quả gì** | Sinh viên khoanh/đọc một đoạn slide khó hiểu, hỏi AI tutor xong vẫn không chắc mình đã hiểu đúng hay chưa; nếu không báo được tín hiệu "chưa hiểu" về cho giảng viên thì lỗ hổng kiến thức bị trôi qua, buổi sau sinh viên dễ học tiếp trên nền hiểu sai. |
| 4 | **1-2 bằng chứng đầu tiên** | Data VLearn có **1.261 lượt hỏi-đáp student-tutor**, **369 user**, **585 conversation**. Tutor chủ yếu đang `review_concept`: **1.074/1.261 lượt**, nhưng `misconceptions` = **0/1.261**, `follow_ups` = **0/1.261**, `asked_check_question` chỉ **3 lượt** → hệ thống gần như chưa ghi nhận sinh viên đã hiểu thật chưa và chưa tổng hợp điểm yếu cho giảng viên. |
| 5 | **Lát cắt MỘT CÂU** | **Sinh viên khoanh vùng một đoạn text khó hiểu trên slide VLearn; AI quyết định đoạn đó thuộc mục kiến thức nào và có đủ căn cứ để giải thích hay không; sinh viên nhận câu trả lời có citation, chọn "Đã hiểu/Chưa hiểu", làm quiz 5 câu nếu đã hiểu; nếu chưa hiểu hoặc không pass 3/5 thì hệ thống gửi ticket có nhãn vấn đề sang radar của giảng viên.** |
| 6 | **AI tự làm đến đâu + 1 dòng lý do** | **Conditional automation:** AI tự giải thích có citation, gắn nhãn kiến thức, sinh quiz và tạo ticket; sinh viên xác nhận mức hiểu, giảng viên quyết định có can thiệp hay không — vì nếu AI chẩn đoán/giải thích sai thì sinh viên có thể học sai kiến thức và giảng viên can thiệp nhầm trọng tâm. |
| 7 | **≥3 người sẽ thử + phân công có tên** | Người thử dự kiến: **Nguyễn Đào Nam Hải**, **Phùng Hồng Phước**, **Lê Công Dũng**, **Trần Đức Mạnh**, **Lê Nguyễn Minh Đức**, **Nguyễn Xuân Phượng**. Phân công: **Nguyễn Đào Nam Hải (2A202601037)** xử lý dữ liệu VLearn, thống kê bằng chứng và chuẩn bị 2-3 đoạn slide/transcript mẫu cho demo; **Phùng Hồng Phước (2A202601215)** thiết kế luồng hỏi-đáp của sinh viên, viết nội dung màn hình chọn đoạn text và nút Đã hiểu/Chưa hiểu; **Lê Công Dũng (2A202601649)** xây prompt AI tutor, định dạng câu trả lời có citation và tạo bộ quiz 5 câu kiểm tra hiểu bài; **Trần Đức Mạnh (2A202601567)** dựng prototype giao diện sinh viên, nối các bước chọn đoạn text, nhận giải thích, làm quiz và hiện kết quả pass/fail; **Lê Nguyễn Minh Đức (2A202601013)** dựng dashboard giảng viên, hiển thị ticket, nhãn kiến thức yếu, số lượt gặp và ví dụ câu hỏi; **Nguyễn Xuân Phượng (2A202601874)** kiểm thử end-to-end, ghi nhận lỗi/feedback, hoàn thiện spec, kịch bản demo và slide trình bày. |

## Ghi Chú Phạm Vi CP1

Prototype CP2-CP3 chỉ cần demo một flow chính:

1. Sinh viên chọn/khoanh sẵn một đoạn text trên slide.
2. AI trả lời ngắn, có citation từ slide/transcript.
3. Sinh viên chọn **Đã hiểu** hoặc **Chưa hiểu**.
4. Nếu **Đã hiểu**, hệ thống sinh 5 câu quiz; pass **3/5** thì đóng ticket.
5. Nếu **Chưa hiểu** hoặc quiz dưới **3/5**, hệ thống gửi ticket sang dashboard giảng viên.
6. Giảng viên xem dashboard LearningRadar: nhãn kiến thức yếu, số lượt gặp, ví dụ câu hỏi, gợi ý remind trong buổi tới.

Các phần có thể mock ở bản đầu:

- thao tác khoanh vùng có thể giả lập bằng một đoạn text được chọn sẵn;
- dashboard giảng viên có thể dùng batch chatlog mẫu;
- citation ưu tiên từ transcript/slide trong `data/vlearn-pack/`, nguồn ngoài chỉ dùng khi kiểm soát được và ghi rõ.

## Phân Công CP2 — Show Được Thứ Bấm Được

Mục tiêu CP2: mở trang → chọn/dán đoạn tài liệu → gõ câu hỏi → bấm Gửi → hiện kết quả bằng dữ liệu giả cứng → bấm tiếp được đến cuối flow. Chưa cần AI thật, chưa cần đẹp, ưu tiên chạy được trọn luồng.

| Thành viên | Việc cần làm cho CP2 | Kết quả cần có |
|---|---|---|
| **Nguyễn Đào Nam Hải (2A202601037)** | Chuẩn bị dữ liệu giả cho demo: 2-3 đoạn slide/transcript mẫu, câu hỏi mẫu, câu trả lời mẫu có citation, nhãn kiến thức yếu và dữ liệu ticket mẫu. | File/mock data đủ để các màn hình lấy ra hiển thị; có ít nhất 1 case "Đã hiểu" và 1 case "Chưa hiểu". |
| **Phùng Hồng Phước (2A202601215)** | Làm luồng màn hình sinh viên phần đầu: mở trang, hiển thị đoạn tài liệu, chọn/dán đoạn text, nhập câu hỏi và bấm **Gửi**. | Người dùng bấm được từ màn đầu đến lúc gửi câu hỏi; dữ liệu nhập/chọn được truyền sang bước kết quả. |
| **Lê Công Dũng (2A202601649)** | Làm phần kết quả AI giả: sau khi bấm **Gửi** thì hiện câu trả lời, citation, nhãn kiến thức và 2 nút **Đã hiểu/Chưa hiểu**; chuẩn bị quiz 5 câu giả. | Bấm Gửi không bị đứng; màn kết quả hiện đủ nội dung; bấm Đã hiểu thì sang quiz, bấm Chưa hiểu thì tạo ticket. |
| **Trần Đức Mạnh (2A202601567)** | Dựng prototype giao diện sinh viên end-to-end: nối các bước chọn đoạn text → hỏi AI → xem kết quả → làm quiz → hiện pass/fail. | Flow sinh viên chạy liền mạch tới cuối; pass 3/5 thì đóng ticket, dưới 3/5 thì tạo ticket. |
| **Lê Nguyễn Minh Đức (2A202601013)** | Làm dashboard giảng viên: danh sách ticket, nhãn kiến thức yếu, số lượt gặp, ví dụ câu hỏi và trạng thái ticket. | Khi có case Chưa hiểu hoặc fail quiz, dashboard hiển thị được ticket tương ứng bằng dữ liệu giả. |
| **Nguyễn Xuân Phượng (2A202601874)** | Kiểm thử CP2 và chuẩn bị demo: test toàn bộ các nút, ghi lỗi, chốt kịch bản demo 1-2 phút, cập nhật spec/slide theo flow thật. | Có checklist test; demo chạy được từ đầu đến cuối mà không cần giải thích bằng miệng quá nhiều. |
