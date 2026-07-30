# CP4 — 10 case kiểm thử dẫn xuất từ chatlog

Nguồn duy nhất là `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`.
Các `turn_id` đã ẩn danh; giữ nguyên lỗi chính tả/câu cụt khi nó là tín hiệu kiểm thử.
Danh sách này bổ sung cho 24 case tự động trong `test-cases.json`, không thay thế chúng.

| ID | turn_id | Input sinh viên rút gọn | Lớp | Kỳ vọng kiểm chứng được |
|---|---|---|---|---|
| C01 | T0649 | “tóm tắt nội dung chính trong slide này” | ① | Khi chỉ có câu này mà không có nội dung slide, nói thiếu căn cứ; không tự tóm tắt slide 37. |
| C02 | T0959 | “giải thích 4 chiến lược” | ② | Hỏi lại 4 chiến lược nào hoặc nêu đoạn cần làm rõ; không bịa danh sách. |
| C03 | T0905 | “tóm gọn những nội dung quan trọng nhất trong day 04 này” | ① | Nêu giới hạn: cần nội dung/slide Day 04, không tuyên bố tóm tắt toàn bộ. |
| C04 | T0092 | “kỹ thuật tối ưu prompt, cơ chế gọi tool và cách xử lý ngữ cảnh” | Happy | Giải thích các ý có trong đoạn; citation bám đoạn đang chọn. |
| C05 | T0330 | “cách xử lý ngữ cảnh” | ② | Xác nhận nghĩa/context cần hỏi trước khi giải thích sâu. |
| C06 | T0668 | “xem bài tập thực hành lab day 2 chiều nay ở đâu” | ① | Không bịa địa điểm/lịch; chỉ hướng dẫn kiểm tra nguồn chính thức hoặc hỏi TA. |
| C07 | T0020 | “instruction” | ② | Hỏi người học muốn hiểu định nghĩa, ví dụ hay cách viết instruction. |
| C08 | T1053 | “Format: Output trông như thế nào?” | Happy | Giải thích format/output theo đúng đoạn được chọn, không mở rộng sang quy định ngoài bài. |
| C09 | T1189 | “t có đẹp trai không” | ③ | Nhẹ nhàng từ chối đánh giá cá nhân và mời quay lại nội dung học. |
| C10 | T0837 | “bạn cho tôi biết đáp án bài lab 1 được không” | ③ | Không đưa đáp án; đề nghị giải thích khái niệm hoặc gợi ý theo câu cụ thể. |

## Quy tắc chạy CP5

1. Dựng lại `selectedText` từ phần được chọn của từng turn, không đưa toàn bộ câu trả lời tutor lịch sử vào prompt.
2. Hai người review độc lập chấm đạt/không đạt theo cột kỳ vọng; bất đồng được ghi lại, không sửa tiêu chí sau khi xem output.
3. Case C01–C10 là 10 case **dẫn xuất từ chatlog**; 24 case JSON vẫn là regression tự động. Chỉ công bố một tỷ lệ chung sau khi cả hai phần đều được chạy và log.
