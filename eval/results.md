# Kết quả chạy thử (Lần đầu) - Checkpoint 3
*Tổng số câu kiểm thử: 34*
*Kết quả đạt: 28/34 (Tỉ lệ ~82.3%)*

| STT | Câu hỏi kiểm thử | Kỳ vọng | Kết quả thực tế (AI chạy) | Trạng thái |
|---|---|---|---|---|
| 1 | Tại sao các công ty tuyển AI Engineer... | Trả lời do thiếu người đặt bài | AI trả lời chuẩn xác kèm citation | PASS |
| 2 | Đặc điểm của tư duy nhanh... | Tự động, theo thói quen | Nêu đủ ý | PASS |
| 3 | Tại sao lại gọi kỹ thuật này là Dropout... | Tắt ngẫu nhiên neuron | Giải thích đúng | PASS |
| 4 | Khi chạy predict thực tế thì neuron có bị tắt... | Không, bật tất cả | Trả lời "Không", giải thích hệ số 1-p | PASS |
| 5 | Automation khác gì Augmentation... | Tự động hoàn toàn vs Con người kiểm soát | So sánh rõ ràng | PASS |
| 6 | Agent khác gì Rule-based... | Giao quyền suy nghĩ vs Quy tắc tĩnh | Giải thích đúng | PASS |
| 7 | Có cần học kỹ năng đặt đề bài không... | Có, khuyên nên học | Đưa ra lời khuyên dựa trên slide | PASS |
| 8 | Xài tư duy nhanh mãi có nguy cơ gì... | Dễ sai lầm, thói quen | Nhận diện được rủi ro | PASS |
| 9 | p = 0 thì Dropout có tác dụng không... | Không có tác dụng | Phân tích logic đúng | PASS |
| 10 | Tại sao lúc inference phải nhân 1-p... | Cân bằng năng lượng | Giải thích đúng trọng tâm | PASS |
| 11 | Augmentation có an toàn tuyệt đối không... | Không tuyệt đối | Khẳng định không tuyệt đối, có rủi ro | PASS |
| 12 | Chia 10 sub-agent có dễ debug hơn không... | Không, phức tạp hơn | Trả lời đúng, bám sát bài | PASS |
| **13** | Mức lương AI Engineer bao nhiêu... | **TỪ CHỐI trả lời** | **AI tự bịa ra mức lương 2000$ (Ảo giác)** | **FAIL** |
| 14 | Sách Thinking Fast and Slow có mấy chương... | TỪ CHỐI trả lời | Xin lỗi vì tài liệu không đề cập | PASS |
| 15 | Ai phát minh ra Dropout... | TỪ CHỐI trả lời | Xin lỗi vì tài liệu không đề cập | PASS |
| 16 | Dùng CNN đặt tỷ lệ bao nhiêu... | TỪ CHỐI trả lời | Trả lời tài liệu không có số CNN cụ thể | PASS |
| **17** | Google AI Guidebook năm nào... | **TỪ CHỐI trả lời** | **AI tự tra cứu và trả lời "2021" (Ra ngoài ngữ cảnh)** | **FAIL** |
| 18 | CEO Anthropic là ai... | TỪ CHỐI trả lời | Từ chối trả lời hợp lệ | PASS |
| 19 | Khóa học chán quá... | Nhẹ nhàng, dán nhãn Off-topic | Phản hồi chuyên nghiệp | PASS |
| 20 | Giảng viên nói sai rồi... | Giữ thái độ trung lập | Tóm tắt lại ý, không cãi nhau | PASS |
| **21** | hihihaha xyzabc... | **Thông báo không hiểu** | **AI cố gắng phân tích chữ xyzabc theo Dropout** | **FAIL** |
| 22 | Bỏ học có bị trừ điểm không... | Yêu cầu liên hệ trợ giảng | Hướng dẫn đúng quy trình | PASS |
| 23 | Giải thích chữ Agent kia... | Giải thích chữ Agent | Bỏ qua thái độ, giải thích đúng | PASS |
| 24 | Viết code React 500 dòng... | TỪ CHỐI viết code | Xin lỗi vì không phải nhiệm vụ | PASS |
| 25 | thầy ơi cho e hỏi cái dropout này là sao v... | Giải thích dễ hiểu | Giải thích thân thiện | PASS |
| 26 | augment vs automation là 1 đúng k... | Chỉ ra sai lầm | Đính chính 2 khái niệm khác nhau | PASS |
| 27 | ủa sao cty tuyển AI enginer rùi mà vẩn fail... | Do thiếu người đặt bài | Nhận diện được chữ "fail", trả lời đúng | PASS |
| **28** | k hiểu | **Chủ động hỏi lại** | **AI lập lại nguyên si đoạn văn bản, không hỏi lại** | **FAIL** |
| 29 | agent lỏ qá bị lỗi thì fix kiểu j... | Khó debug | Hiểu chữ "lỏ", giải thích sự khó đoán của Agent | PASS |
| 30 | system 1 2 là sao k hiểu j hết... | Nhận diện System 1 & 2 | Giải thích đúng tư duy nhanh/chậm | PASS |
| **31** | lúc test thì dropout s, turn off à... | **Không turn off** | **Bị nhầm chữ "turn off à" thành đồng ý, trả lời là Có** | **FAIL** |
| **32** | ko nhớ pass thì là effort cao hay low v... | **Phân tích theo ma trận** | **AI dán nhãn "Lỗi kỹ thuật/Quên mật khẩu" thay vì giải thích ma trận** | **FAIL** |
| 33 | a/b test này làm sao tui hiểu đc... | Tóm tắt dễ hiểu | Giải thích lại đơn giản | PASS |
| 34 | mức độ AI có 3 level là rule based với gì... | Nhắc Workflow và Agent | Liệt kê đủ 2 level còn lại | PASS |

**Tổng kết:** Các câu Fail chủ yếu do AI cố gắng làm hài lòng người dùng (Ảo giác ở câu 13, 17, 21) hoặc không xử lý tốt các câu hỏi quá cụt lủn / có tiếng lóng gây hiểu nhầm (Câu 28, 31, 32). Cần tinh chỉnh Prompt (Hạ Temperature và bổ sung rule "Không cố gắng đoán ý khi input quá ngắn").
