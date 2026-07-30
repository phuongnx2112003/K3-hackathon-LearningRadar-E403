# AI SPEC — LearningRadar cho AI Tutor
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job
- Job executor + workflow (đính kèm worksheet JTBD / ảnh sơ đồ): Sinh viên đang đọc slide trên VLearn trong/sau buổi học, gặp một đoạn kiến thức chưa hiểu và muốn hỏi ngay trên đúng vùng text đó.
- Core JTBD (không tên sản phẩm/AI trong câu): Sinh viên khoanh/đọc một đoạn slide khó hiểu, muốn giải đáp thắc mắc để hiểu đúng kiến thức.
- Problem statement (KHÔNG chữ AI): Sinh viên khoanh/đọc một đoạn slide khó hiểu, hỏi giải đáp xong vẫn không chắc mình đã hiểu đúng hay chưa; nếu không báo được tín hiệu "chưa hiểu" về cho giảng viên thì lỗ hổng kiến thức bị trôi qua, buổi sau sinh viên dễ học tiếp trên nền hiểu sai.
- Evidence (chuẩn A và/hoặc B — log đầy đủ trong repo):
  - Số liệu mining / kết quả khảo sát (n = ?, % xác nhận): Data VLearn có 1.261 lượt hỏi-đáp student-tutor, 369 user, 585 conversation. Tutor chủ yếu đang review_concept: 1.072 lượt; misconceptions = 0/1.261, follow_ups = 0/1.261, asked_check_question chỉ 3 lượt. Điều này cho thấy hệ thống gần như chưa ghi nhận sinh viên đã hiểu thật chưa và chưa tổng hợp điểm yếu cho giảng viên.
  - ≥5 quote/ví dụ nguyên văn + nguồn: (Sẽ bổ sung)

## §2. Impact & quyết định chọn
- Bảng impact ≥3 ứng viên (bao nhiêu người · tần suất · tốn gì mỗi lần · khả thi): (Sẽ bổ sung)
- Ứng viên ĐÃ LOẠI + vì sao: (Sẽ bổ sung)
- Ứng viên CHỌN + vì sao (bằng số): (Sẽ bổ sung)

## §3. Giải pháp tương tự đã nghiên cứu
- [Sản phẩm 1]: flow / đáng học / đáng né / mình khác gì
- [Sản phẩm 2]: ...

## §4. Thiết kế
- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả): Sinh viên khoanh vùng một đoạn text khó hiểu trên slide VLearn; AI quyết định đoạn đó thuộc mục kiến thức nào và có đủ căn cứ để giải thích hay không; sinh viên nhận câu trả lời có citation, chọn "Đã hiểu/Chưa hiểu", làm quiz 5 câu nếu đã hiểu; nếu chưa hiểu hoặc không pass 3/5 thì hệ thống gửi ticket có nhãn vấn đề sang radar của giảng viên.
- Non-goals (≥3 thứ KHÔNG build): (Sẽ bổ sung)
- Mức prototype nhắm tới: [ ] Sketch [ ] Mock [ ] Working — phần nào mock, phần nào thật: (Sẽ bổ sung)
- Automation: [ ] augment [x] conditional [ ] automate — lý do theo cost-of-error: AI tự giải thích có citation, gắn nhãn kiến thức, sinh quiz và tạo ticket; sinh viên xác nhận mức hiểu, giảng viên quyết định có can thiệp hay không — vì nếu AI chẩn đoán/giải thích sai thì sinh viên có thể học sai kiến thức và giảng viên can thiệp nhầm trọng tâm.
- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR, xem guide):
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | (Sẽ bổ sung) | (Sẽ bổ sung) |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8) [bảng theo guide §2.5]
(Sẽ bổ sung)

## §6. Bốn đường đi của trải nghiệm
- Happy path: · Low-confidence (②): · Failure/không căn cứ (①): · Correction (user sửa):
- Khi bị đòi ngoài phạm vi (③): · Case đặc thù domain (④):

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được: (Sẽ bổ sung)
- Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong eval/): (Sẽ bổ sung)
- Quality bar (chốt từ 23:59, giữ nguyên sau đó): "Đạt khi ≥ ___% qua bộ, và ___"
- Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6): (Sẽ bổ sung)

## §8. Phân công & kế hoạch
- Phân công có tên: 
  - Trần Đức Mạnh (2A202601567): xử lý dữ liệu VLearn, thống kê bằng chứng và chuẩn bị 2-3 đoạn slide/transcript mẫu cho demo; hỗ trợ thêm phần luồng sinh viên
  - Phùng Hồng Phước (2A202601215): thiết kế luồng hỏi-đáp của sinh viên, viết nội dung màn hình chọn đoạn text và nút Đã hiểu/Chưa hiểu
  - Nguyễn Đào Nam Hải (2A202601037): xây prompt AI tutor, định dạng câu trả lời có citation và tạo bộ quiz 5 câu kiểm tra hiểu bài
  - Lê Công Dũng (2A202601649): dựng prototype giao diện sinh viên, nối các bước chọn đoạn text, nhận giải thích, làm quiz và hiện kết quả pass/fail
  - Lê Nguyễn Minh Đức (2A202601013): dựng dashboard giảng viên, hiển thị ticket, nhãn kiến thức yếu, số lượt gặp và ví dụ câu hỏi
  - Nguyễn Xuân Phượng (2A202601874): kiểm thử end-to-end, ghi nhận lỗi/feedback, hoàn thiện spec, kịch bản demo và slide trình bày
- Willing users (≥3 tên) + kế hoạch vòng validation CP5 (3 câu hỏi, ai log): Nguyễn Phúc Huy Hoàng (Học viên K3), Nguyễn Quốc Thịnh (Học viên K3), Lương Ngọc Quang (Học viên K3).
- Multi-prototype (nếu làm): trục khác biệt của ≥2 phương án + lý do chọn: (Sẽ bổ sung)

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
