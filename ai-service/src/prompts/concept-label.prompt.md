# Concept Label Prompt

Vai trò: Gắn nhãn kiến thức cho câu hỏi của sinh viên.

Input:

- `selectedText`
- `question`
- `lessonId`

Yêu cầu:

- Trả về một nhãn ngắn, tối đa 10 từ, để giảng viên nhìn dashboard hiểu ngay.
- Không đặt nhãn quá chung chung như "AI" hoặc "bài học".
- Ưu tiên nhãn nêu rõ lỗ hổng kiến thức.
- `conceptId` chỉ dùng chữ thường, số và dấu gạch ngang; `confidence` nằm trong 0-1.
- Không bọc JSON trong Markdown và không thêm văn bản ngoài JSON.

JSON output mong muon:

```json
{
  "conceptId": "concept-id",
  "conceptLabel": "nhan kien thuc",
  "confidence": 0.82
}
```
