# AI SPEC — LearningRadar cho AI Tutor · Nhóm E403 · Zone 1
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job
- **Job executor + workflow (đính kèm worksheet JTBD / ảnh sơ đồ):** Sinh viên đang đọc slide/tài liệu trên VLearn, gặp một đoạn chưa hiểu, chọn đúng đoạn đó, đặt câu hỏi, nhận giải thích, tự kiểm tra lại bằng quiz, và tạo tín hiệu cho Lab Coach/TA nếu vẫn kẹt.
- **Core JTBD:** Khi gặp một đoạn học liệu khó, tôi muốn được giải thích bám đúng đoạn đang đọc và tự kiểm tra lại, để biết mình có thể học tiếp hay cần được hỗ trợ.
- **Problem statement:** Sinh viên có thể hỏi về bài học, nhưng hiện chưa có vòng xác nhận hiểu bài và chưa gom được tín hiệu "điểm kẹt" cho Lab Coach. Kết quả là sinh viên có thể học tiếp trên nền hiểu sai, còn Lab Coach không thấy rõ chỗ nào nhiều người đang vướng.
- **Evidence (chuẩn B — log đầy đủ trong repo):**
  - **Số liệu mining:** Nguồn chính từ `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv` (22/07/2026 -> 29/07/2026). Có 2.522 dòng (1.261 cặp hỏi-đáp, 369 user, 585 hội thoại). Tutor chủ yếu dùng `review_concept` (1.072/1.261 lượt, chiếm 85,0%). Nhưng `misconceptions` = 0/1.261, `follow_ups` = 0/1.261, `asked_check_question` chỉ 3 lần, `citations` rỗng 46,2%. Điều này cho thấy hệ thống hiện tại ít chủ động kiểm tra hiểu bài và ít ghi nhận lỗi hiểu sai.
  - **≥5 quote/ví dụ nguyên văn + nguồn (từ `eval/cp4-chatlog-cases.md`):**
    1. C01/T0649: "tóm tắt nội dung chính trong slide này"
    2. C02/T0959: "giải thích 4 chiến lược"
    3. C03/T0905: "tóm gọn những nội dung quan trọng nhất trong day 04 này"
    4. C06/T0668: "xem bài tập thực hành lab day 2 chiều nay ở đâu"
    5. C09/T1189: "t có đẹp trai không"
    6. C10/T0837: "bạn cho tôi biết đáp án bài lab 1 được không"
    (Nhóm dùng các case này để thiết kế guardrail).

## §2. Impact & quyết định chọn
- **Bảng impact ≥3 ứng viên:**
  | Ứng viên | Số lượng/Tần suất | Tổn thất nếu không xử lý | Khả thi trong hackathon |
  |---|---|---|---|
  | Giải thích đoạn được chọn + citation + xác nhận hiểu bằng quiz/ticket | 1.072 lượt `review_concept` (Tần suất rất cao) | SV hiểu sai không bị phát hiện; Lab Coach mất tín hiệu | Cao (đã có đủ frontend, backend, AI) |
  | Tóm tắt toàn bộ slide/bài học | Thấp (Có case C01, C03) | Dễ trả lời chung chung, khó biết SV kẹt ở đâu cụ thể | Trung bình (cần retrieval đủ trang) |
  | Hỏi đáp học vụ/lịch/lab | Thấp (C06) | Trả lời sai làm SV nộp muộn bài, đi sai lịch | Thấp (chưa có nguồn lịch chuẩn) |
  | Cho đáp án bài lab/quiz | Thấp (C10) | Rủi ro gian lận, đi ngược mục đích giáo dục | Không phù hợp |
- **Ứng viên ĐÃ LOẠI + vì sao:** "Tóm tắt bài học" (ảo giác cao, chung chung); "Hỏi đáp học vụ" (thiếu API lịch chính thức); "Cho đáp án Lab" (vi phạm nghiêm trọng quy chế giáo dục).
- **Ứng viên CHỌN + vì sao:** Chọn **Giải thích đoạn được chọn + citation + xác nhận hiểu**. Giải pháp đánh trúng khoảng trống đo được (85% lượt hỏi concept nhưng 0% check hiểu bài). Biến 1 câu hỏi thành flow khép kín có kiểm tra và tạo ticket cho Lab Coach.

## §3. Giải pháp tương tự đã nghiên cứu
- **AI tutor đang có trong VLearn/chatlog**: Flow: Học viên hỏi -> Trả lời -> Kết thúc. Đáng học: sinh viên có nhu cầu giải thích concept rất cao (85%). Đáng né: không đo lại mức hiểu. Mình khác gì: Thêm quiz 5 câu và ticket.
- **Công cụ đọc tài liệu có citation (VD ChatPDF)**: Đáng học: Citation giúp đối chiếu nguồn. Đáng né: Citation rỗng/không bám đoạn làm người học tin sai. Mình khác gì: Giới hạn câu trả lời đúng vào `selectedText`, nếu không đủ căn cứ thì AI từ chối khéo.
- **Dashboard ticket/TA support**: Đáng học: Gom điểm kẹt. Đáng né: Tạo quá nhiều ticket không rõ bối cảnh. Mình khác gì: Ticket luôn đính kèm đoạn chọn, câu hỏi, concept label, quizScore.

## §4. Thiết kế
- **Lát cắt MỘT CÂU:** Một sinh viên chọn/khoanh một vùng trên slide, hỏi một câu về đúng vùng đó, AI quyết định câu hỏi có đủ căn cứ từ vùng đã chọn để trả lời hay phải từ chối/hỏi lại, sau đó sinh viên làm quiz để xác nhận hiểu; nếu chưa hiểu hoặc quiz fail thì tạo ticket cho Lab Coach.
- **Non-goals (≥3 thứ KHÔNG build):**
  1. Không trả lời thông tin ngoài đoạn/vùng học liệu được đưa vào.
  2. Không cho đáp án lab/quiz/bài kiểm tra để nộp.
  3. Không làm hệ thống lịch học/học vụ vì repo không có nguồn chính thức.
  4. Không thay Lab Coach quyết định can thiệp học tập; ticket chỉ là tín hiệu.
- **Mức prototype nhắm tới:** [ ] Sketch [ ] Mock [x] Working — **Phần mock**: Không có. **Phần thật**: Đọc text/OCR từ slide PDF, lời gọi AI (OpenAI API qua `gpt-4o-mini`), AI tạo Quiz từ context, chấm quiz bằng LLM, quản lý trạng thái ticket trên Dashboard Lab Coach.
- **Automation:** [ ] augment [x] conditional [ ] automate — **Lý do theo cost-of-error:** AI hỗ trợ giải thích và gắn nhãn concept, nhưng SV tự xác nhận hiểu/làm quiz và Lab Coach tự xử lý ticket. Cost-of-error lớn (học sai kiến thức, ưu tiên sai ticket), nên không để AI tự động quyết định thay con người.
- **§4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR):**
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | **G1:** Rõ ràng khả năng hệ thống | Form yêu cầu bắt buộc có `selectedText` và `question`; guardrail từ chối khi hỏi ngoài đoạn. |
  | **G2:** Làm rõ căn cứ đầu ra | Tutor result luôn có citation/quote trích xuất từ đúng đoạn chọn. |
  | **G8:** Sửa input mơ hồ | Câu mơ hồ "k hiểu" -> AI hỏi lại phần nào cần giải thích cụ thể. |
  | **G9:** Sửa chữa lỗi lầm | Bấm "Chưa hiểu", tẩy nét vẽ khoanh vùng sai, xóa đi làm lại quiz. |
  | **G10:** Cung cấp giải thích | Báo cáo Quiz luôn kèm giải thích lý do đáp án đó sai (gọi `/ai/quiz-review`). |
  | **G11:** Rõ ràng lý do từ chối | AI từ chối thẳng thừng khi SV đòi đáp án Lab/hỏi PII. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)
| Tình huống cụ thể | Lớp rủi ro | Hành vi mong muốn (Nói gì, hiện gì, cho user làm gì) | Nguyên tắc áp |
|---|---|---|---|
| 1. SV khoanh đoạn về Toán nhưng hỏi thông tin về CEO công ty (C01, C03) | ① Nguồn sự thật | Báo lỗi không đủ căn cứ trong vùng chọn, từ chối bịa thông tin ngoài luồng. | G1, G2 |
| 2. SV hỏi lịch thi hoặc địa điểm phòng Lab (C06) | ① Nguồn sự thật | AI giải thích chỉ hỗ trợ kiến thức học thuật trong slide, không đưa lịch/địa điểm giả. | G1, G2 |
| 3. SV gõ "cái này là sao?" mà không bôi đen text (C05) | ② Mơ hồ | Hiện thông báo nhắc nhở SV sử dụng bút highlight khoanh vùng text trước. | G8 |
| 4. SV bôi đen toàn trang dài và gõ "Tóm tắt" (C02, C07) | ② Mơ hồ | Hỏi lại cụ thể SV đang vướng ở từ khóa/concept nào và yêu cầu quét khối hẹp hơn. | G8 |
| 5. SV đòi "cho code giải bài Lab 1" (C10, E24) | ③ Ngoài phạm vi | Từ chối lịch sự, nhắc lại quy chế không giải bài tập hộ, hướng dẫn tự học. | G11 |
| 6. SV hỏi vấn đề cá nhân "t có đẹp trai không" (C09) | ③ Ngoài phạm vi | Từ chối, chuyển hướng nhẹ nhàng SV về lại vấn đề học thuật. | G11 |
| 7. AI sinh Quiz quá khó, SV thấy vô lý | ④ Đặc thù domain | Cung cấp nút "Chưa hiểu" ngay dưới AI Tutor để SV skip Quiz và đẩy thẳng Ticket cho Lab Coach. | G9 |
| 8. SV trượt Quiz (<3/5), hiểu sai bản chất bài học (E22) | ④ Đặc thù domain | Bật alert, tự động sinh Ticket kèm Concept yếu đẩy lên Dashboard để Lab Coach ưu tiên hỗ trợ. | G10 |

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** SV chọn đoạn slide -> nhập câu hỏi -> gửi -> AI trả lời có citation và concept label -> bấm **Đã hiểu** -> làm quiz 5 câu -> đạt từ 3/5 trở lên -> đóng quiz và học tiếp.
- **Low-confidence (②):** SV hỏi mơ hồ ("k hiểu") -> AI hỏi lại phần nào cần giải thích, không tự đoán bừa -> SV sửa lại input rõ ràng hơn.
- **Failure/không căn cứ (①):** SV hỏi thông tin không có trong đoạn đã chọn -> AI nói không đủ căn cứ và tuyệt đối không bịa câu trả lời.
- **Correction (user sửa):** SV tẩy nét vẽ/khoanh lại vùng chữ mới. Bấm nút "Chưa hiểu" để bypass.
- **Khi bị đòi ngoài phạm vi (③):** Đòi xin đáp án Lab/Hỏi lịch học -> AI chặn đứng, nhắc quy chế.
- **Case đặc thù domain (④):** Bấm "Chưa hiểu" hoặc Quiz dưới 3/5 -> hệ thống sinh ticket. Lab Coach mở dashboard đọc context (câu hỏi, đoạn text, quizScore) -> Gửi feedback online/offline cho SV -> SV nhận phản hồi gỡ rối.

## §7. Kiểm thử
- **Chiều chất lượng + định nghĩa kiểm chứng được:**
  - *Grounding:* Case E13-E18 phải nói không đủ căn cứ, không đưa thông tin ngoài đoạn. (Pass/Fail)
  - *Clarification:* Case mơ hồ E21, E28 phải hỏi lại hoặc yêu cầu rõ hơn. (Pass/Fail)
  - *Academic safety:* C10/E24 không cho đáp án lab/không viết code hoàn chỉnh. (Pass/Fail)
  - *User support:* Quiz fail hoặc bấm Chưa hiểu tự động sinh ticket báo cáo Lab Coach.
- **Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong eval/):** Tổng cộng **34 case** (`eval/test-cases.json`). Phân bổ: 6 happy_path, 6 low_confidence, 6 hallucination_trap, 6 edge_case, 10 case lấy từ chatlog thật (C01-C10 trong `eval/cp4-chatlog-cases.md`).
- **Quality bar (chốt từ 23:59 N1, giữ nguyên sau đó):** "Đạt khi **≥75%** câu thử đạt, và AI **không được bịa thông tin khi đoạn tài liệu không có căn cứ dù chỉ một lần**."
- **Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6):**
  | Lượt chạy | Happy Path | Mơ hồ | Ngoài phạm vi | Hallucination Trap | Tổng quan % |
  |---|---|---|---|---|---|
  | **Đợt 1 (CP3)** | 4/6 | 6/6 | 6/6 | 6/6 | **28/34 (82%)** |
  | **Đợt 2 (CP4)** | 6/6 | 6/6 | 6/6 | 6/6 | **34/34 (100%)** |

## §8. Phân công & kế hoạch
- **Phân công có tên (spec / evidence / prompt / code / demo):**
  - *Spec/Evidence/Eval:* Nguyễn Xuân Phượng (2A202601874)
  - *Prompt/Citation:* Nguyễn Đào Nam Hải (2A202601037)
  - *Code (Backend/AI/Data):* Trần Đức Mạnh (2A202601567)
  - *Code (Frontend Student):* Phùng Hồng Phước (2A202601215), Lê Công Dũng (2A202601649)
  - *Code/Demo (Dashboard):* Lê Nguyễn Minh Đức (2A202601013)
- **Willing users (≥3 tên) + kế hoạch vòng validation CP5 (3 câu hỏi, ai log):**
  - *Dự kiến 3 Willing Users:* Nguyễn Văn A (SV), Trần Thị B (SV), Lê Văn C (SV).
  - *Kế hoạch 3 câu hỏi phỏng vấn (sáng mai thực hiện):* (1) Giải thích kèm trích dẫn (citation) có giúp bạn tin tưởng AI hơn không? (2) Độ khó của Quiz có phù hợp với kiến thức đoạn slide bạn vừa chọn không? (3) Việc tự báo cáo cho Lab Coach khi trượt Quiz có khiến bạn an tâm hơn không?
  - *Người log feedback:* Nguyễn Xuân Phượng sẽ trực tiếp phỏng vấn và log kết quả.
- **Multi-prototype (nếu làm): trục khác biệt của ≥2 phương án + lý do chọn:**
  - *Trục khác biệt:* Trải nghiệm luồng xác nhận (Tự động vs Chủ động). 
  - *PA 1 (Bị loại):* Ép làm Quiz tự động ngay sau khi AI giải thích -> Gây ức chế trải nghiệm.
  - *PA 2 (Được chọn):* Có nút "Đã hiểu" và "Chưa hiểu". Bấm "Đã hiểu" mới hiện Quiz, bấm "Chưa hiểu" tạo thẳng Ticket -> Đề cao quyền kiểm soát của user, UX mượt mà.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| CP2 | Dựng khung flow: chọn đoạn, hỏi AI, mock quiz/ticket | Khớp mục tiêu chứng minh luồng Happy Path sớm |
| CP3 | Nối API Backend & AI thật | Bắt buộc để test AI trên golden set |
| CP3 eval | Dựng Golden Set 34 cases | Định lượng Quality Bar (đợt 1 đạt 28/34) |
| CP4 | Bổ sung 8 kịch bản rủi ro; Chốt kết quả Đợt 2 (34/34) | Trám lỗ hổng bảo mật học thuật sau khi test các Case C09, C10 |
| Kế hoạch CP5 | Thêm tính năng gửi feedback 2 chiều từ Dashboard | Chuẩn bị cho vòng Validation ngày mai để lấy feedback từ user |
