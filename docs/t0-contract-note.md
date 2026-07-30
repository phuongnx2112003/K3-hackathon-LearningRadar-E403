# T0 Contract Note - LearningRadar CP3

## 1. Muc Tieu T0

T0 dung de chot contract chung truoc khi ca nhom code CP3.

Sau T0, frontend, backend va AI service co the lam song song ma khong bi lech ten field, lech endpoint hoac lech response format.

## 2. Ket Luan Da Chot

- Frontend chi goi `backend/`.
- Backend la API chinh cua ung dung.
- Backend goi `ai-service/` khi can answer, citation, quiz hoac concept label.
- AI service khong quan ly ticket va dashboard.
- CP3 co the dung mock fallback neu AI that chua san sang.
- Tat ca module dung chung data field trong file nay.

## 3. Kien Truc Goi Service

```text
prototype/
  -> goi backend API

backend/
  -> nhan request tu prototype
  -> quan ly quiz submit, ticket, dashboard
  -> goi ai-service khi can AI

ai-service/
  -> sinh answer
  -> tim citation
  -> gan concept label
  -> sinh quiz
```

Quy tac:

- `prototype` khong goi truc tiep `ai-service`.
- `backend` goi `ai-service` thong qua `backend/src/services/ai-client.service.js`.
- Neu `ai-service` loi, backend tra mock fallback de demo khong bi chet flow.

## 4. Backend API Contract

Backend base URL de xuat khi chay local:

```text
http://localhost:3000
```

### 4.1 Health Check

Endpoint:

```text
GET /health
```

Response:

```json
{
  "ok": true,
  "service": "backend",
  "message": "LearningRadar backend is running"
}
```

Dung de test backend da chay hay chua.

### 4.2 Ask Tutor

Endpoint:

```text
POST /api/tutor/ask
```

Muc dich:

Frontend gui doan text va cau hoi cua sinh vien len backend. Backend goi AI service de lay cau tra loi, citation va concept label.

Request body:

```json
{
  "lessonId": "lesson-01",
  "studentId": "student-demo-01",
  "selectedText": "Doan kien thuc sinh vien dang chua hieu",
  "question": "Em chua hieu y chinh cua doan nay la gi?"
}
```

Response thanh cong:

```json
{
  "ok": true,
  "data": {
    "answerId": "answer-001",
    "lessonId": "lesson-01",
    "studentId": "student-demo-01",
    "selectedText": "Doan kien thuc sinh vien dang chua hieu",
    "question": "Em chua hieu y chinh cua doan nay la gi?",
    "answer": "Cau tra loi ngan gon cua AI Tutor.",
    "citation": {
      "source": "transcript-03-clean.md",
      "section": "Phan 2",
      "quote": "Doan trich ngan lam can cu"
    },
    "conceptLabel": "Khai niem can cung co",
    "confidence": 0.82
  }
}
```

Response loi validation:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "selectedText va question la bat buoc"
  }
}
```

### 4.3 Get Quiz

Endpoint:

```text
GET /api/quiz?conceptId=concept-01
```

Muc dich:

Lay quiz 5 cau theo concept. Backend co the lay tu mock data hoac goi AI service.

Response:

```json
{
  "ok": true,
  "data": {
    "conceptId": "concept-01",
    "conceptLabel": "Khai niem can cung co",
    "questions": [
      {
        "id": "q1",
        "question": "Cau hoi quiz 1",
        "options": ["A", "B", "C", "D"]
      }
    ]
  }
}
```

Luu y:

- Frontend khong can nhan `correctIndex` neu muon tranh lo dap an.
- Trong CP3 demo nhanh, co the tra `correctIndex` neu cham diem o frontend.
- Neu cham diem o backend, frontend chi gui selected option.

### 4.4 Submit Quiz

Endpoint:

```text
POST /api/quiz/submit
```

Muc dich:

Nop dap an quiz va nhan ket qua pass/fail.

Request body:

```json
{
  "studentId": "student-demo-01",
  "lessonId": "lesson-01",
  "conceptId": "concept-01",
  "answers": [
    {
      "questionId": "q1",
      "selectedIndex": 0
    }
  ]
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "score": 3,
    "total": 5,
    "passed": true,
    "passThreshold": 3
  }
}
```

Quy tac:

- `passed = true` neu `score >= 3`.
- `passed = false` neu `score < 3`.
- Neu fail quiz, frontend goi `POST /api/tickets`.

### 4.5 Create Ticket

Endpoint:

```text
POST /api/tickets
```

Muc dich:

Tao ticket khi sinh vien bam **Chua hieu** hoac fail quiz.

Request body khi Chua hieu:

```json
{
  "studentId": "student-demo-01",
  "lessonId": "lesson-01",
  "selectedText": "Doan kien thuc sinh vien dang chua hieu",
  "question": "Em chua hieu y chinh cua doan nay la gi?",
  "conceptLabel": "Khai niem can cung co",
  "reason": "not_understood",
  "quizScore": null
}
```

Request body khi fail quiz:

```json
{
  "studentId": "student-demo-01",
  "lessonId": "lesson-01",
  "selectedText": "Doan kien thuc sinh vien dang chua hieu",
  "question": "Em chua hieu y chinh cua doan nay la gi?",
  "conceptLabel": "Khai niem can cung co",
  "reason": "quiz_failed",
  "quizScore": 2
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "ticket": {
      "id": "ticket-001",
      "studentId": "student-demo-01",
      "lessonId": "lesson-01",
      "selectedText": "Doan kien thuc sinh vien dang chua hieu",
      "question": "Em chua hieu y chinh cua doan nay la gi?",
      "conceptLabel": "Khai niem can cung co",
      "reason": "not_understood",
      "quizScore": null,
      "status": "open",
      "createdAt": "demo-time"
    }
  }
}
```

### 4.6 Dashboard Tickets

Endpoint:

```text
GET /api/dashboard/tickets
```

Muc dich:

Lay danh sach ticket va thong ke co ban cho dashboard giang vien.

Response:

```json
{
  "ok": true,
  "data": {
    "summary": {
      "totalTickets": 2,
      "openTickets": 2,
      "topConcepts": [
        {
          "conceptLabel": "Khai niem can cung co",
          "count": 2
        }
      ]
    },
    "tickets": [
      {
        "id": "ticket-001",
        "studentId": "student-demo-01",
        "lessonId": "lesson-01",
        "selectedText": "Doan kien thuc sinh vien dang chua hieu",
        "question": "Em chua hieu y chinh cua doan nay la gi?",
        "conceptLabel": "Khai niem can cung co",
        "reason": "not_understood",
        "quizScore": null,
        "status": "open",
        "createdAt": "demo-time"
      }
    ]
  }
}
```

## 5. AI Service API Contract

AI service base URL de xuat khi chay local:

```text
http://localhost:4000
```

AI service chi nhan request tu backend trong CP3.

### 5.1 AI Health Check

Endpoint:

```text
GET /health
```

Response:

```json
{
  "ok": true,
  "service": "ai-service",
  "message": "LearningRadar AI service is running"
}
```

### 5.2 AI Ask

Endpoint:

```text
POST /ai/ask
```

Request body:

```json
{
  "lessonId": "lesson-01",
  "selectedText": "Doan kien thuc sinh vien dang chua hieu",
  "question": "Em chua hieu y chinh cua doan nay la gi?"
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "answer": "Cau tra loi ngan gon cua AI Tutor.",
    "citation": {
      "source": "transcript-03-clean.md",
      "section": "Phan 2",
      "quote": "Doan trich ngan lam can cu"
    },
    "conceptLabel": "Khai niem can cung co",
    "confidence": 0.82
  }
}
```

### 5.3 AI Quiz

Endpoint:

```text
POST /ai/quiz
```

Request body:

```json
{
  "lessonId": "lesson-01",
  "conceptLabel": "Khai niem can cung co",
  "selectedText": "Doan kien thuc sinh vien dang chua hieu"
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "conceptId": "concept-01",
    "conceptLabel": "Khai niem can cung co",
    "questions": [
      {
        "id": "q1",
        "question": "Cau hoi quiz 1",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0
      }
    ]
  }
}
```

### 5.4 AI Label

Endpoint:

```text
POST /ai/label
```

Request body:

```json
{
  "lessonId": "lesson-01",
  "selectedText": "Doan kien thuc sinh vien dang chua hieu",
  "question": "Em chua hieu y chinh cua doan nay la gi?"
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "conceptId": "concept-01",
    "conceptLabel": "Khai niem can cung co",
    "confidence": 0.82
  }
}
```

## 6. Data Field Da Chot

| Field | Kieu du lieu | Bat buoc | Dung o dau | Y nghia |
|---|---|---|---|---|
| `lessonId` | string | Co | frontend, backend, AI service | ID bai hoc/demo lesson. |
| `studentId` | string | Nen co | frontend, backend | ID sinh vien demo. |
| `selectedText` | string | Co | frontend, backend, AI service | Doan text sinh vien chon/dan. |
| `question` | string | Co | frontend, backend, AI service | Cau hoi sinh vien go. |
| `answerId` | string | Khong | backend | ID cau tra loi, dung de trace demo. |
| `answer` | string | Co | backend, AI service, frontend | Cau tra loi cua AI Tutor. |
| `citation` | object | Co | backend, AI service, frontend | Nguon/can cu cua cau tra loi. |
| `conceptId` | string | Nen co | backend, AI service | ID nhan kien thuc. |
| `conceptLabel` | string | Co | backend, AI service, frontend | Nhan kien thuc yeu. |
| `confidence` | number | Khong | AI service, backend | Do tin cay gia lap/AI. |
| `questions` | array | Co voi quiz | backend, AI service, frontend | Danh sach 5 cau quiz. |
| `answers` | array | Co khi submit quiz | frontend, backend | Dap an sinh vien chon. |
| `score` | number | Co khi submit quiz | backend, frontend | So cau dung. |
| `total` | number | Co khi submit quiz | backend, frontend | Tong so cau quiz. |
| `passed` | boolean | Co khi submit quiz | backend, frontend | Ket qua pass/fail. |
| `passThreshold` | number | Nen co | backend, frontend | Diem toi thieu de pass. |
| `ticket` | object | Co khi tao ticket | backend, frontend | Ticket gui sang dashboard. |
| `reason` | string | Co voi ticket | backend, frontend | Ly do tao ticket. |
| `status` | string | Co voi ticket | backend, frontend | Trang thai ticket. |
| `createdAt` | string | Nen co | backend, frontend | Thoi diem tao ticket. |

## 7. Gia Tri Enum Da Chot

### 7.1 Ticket Reason

```text
not_understood
quiz_failed
```

Y nghia:

- `not_understood`: sinh vien bam **Chua hieu**.
- `quiz_failed`: sinh vien bam **Da hieu** nhung quiz duoi 3/5.

### 7.2 Ticket Status

```text
open
reviewed
closed
```

Y nghia:

- `open`: dang can giang vien xem.
- `reviewed`: giang vien/TA da xem.
- `closed`: da xu ly xong hoac khong can xu ly nua.

## 8. Frontend Function Contract

Frontend trong `prototype/src/` nen giu cac function sau de de noi module.

```js
renderStudentFlow(container, onSubmitQuestion)
renderTutorResult(container, data, onUnderstood, onNotUnderstood)
renderQuizFlow(container, questions, onQuizDone)
renderTeacherDashboard(container, tickets, summary)
```

### 8.1 onSubmitQuestion

Input:

```js
{
  lessonId: "lesson-01",
  studentId: "student-demo-01",
  selectedText: "Doan text",
  question: "Cau hoi"
}
```

Xu ly:

- `main.js` goi `POST /api/tutor/ask`.
- Sau khi co response, render `tutor-result.js`.

### 8.2 onUnderstood

Xu ly:

- Goi `GET /api/quiz?conceptId=...`.
- Render `quiz-flow.js`.

### 8.3 onNotUnderstood

Xu ly:

- Goi `POST /api/tickets` voi `reason = "not_understood"`.
- Refresh dashboard.

### 8.4 onQuizDone

Input:

```js
{
  score: 2,
  total: 5,
  passed: false
}
```

Xu ly:

- Neu `passed = true`, hien trang thai pass.
- Neu `passed = false`, goi `POST /api/tickets` voi `reason = "quiz_failed"`.
- Refresh dashboard.

## 9. Response Format Chung

Tat ca API nen tra ve theo format:

Thanh cong:

```json
{
  "ok": true,
  "data": {}
}
```

That bai:

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mo ta loi ngan gon"
  }
}
```

Quy uoc:

- Frontend chi can check `ok`.
- Neu `ok = false`, hien message loi ngan.
- Khong tra ve response moi endpoint mot kieu.

## 10. File Phu Trach Sau T0

| Thanh vien | File/folder phu trach sau khi chot T0 |
|---|---|
| **Nguyen Dao Nam Hai** | `backend/src/data/`, `ai-service/src/data/`, `prototype/src/mock-data.js` |
| **Phung Hong Phuoc** | `prototype/src/student-flow.js` |
| **Le Cong Dung** | `prototype/src/tutor-result.js`, `prototype/src/quiz-flow.js`, `ai-service/src/` |
| **Tran Duc Manh** | `prototype/src/main.js`, `backend/src/server.js`, `backend/src/services/ai-client.service.js` |
| **Le Nguyen Minh Duc** | `prototype/src/teacher-dashboard.js`, `backend/src/routes/ticket.routes.js`, `backend/src/routes/dashboard.routes.js`, `backend/src/services/ticket.service.js` |
| **Nguyen Xuan Phuong** | `docs/test-checklist.md`, `docs/demo-script.md`, `docs/slide-outline.md`, `spec.md` |

## 11. Checklist Hoan Thanh T0

- [x] Chot backend endpoint.
- [x] Chot AI service endpoint.
- [x] Chot data field chung.
- [x] Chot response format chung.
- [x] Chot frontend function contract.
- [x] Chot ranh gioi `prototype`, `backend`, `ai-service`.
- [x] Chot owner file/folder sau T0.

## 12. Tom Tat Cho Ca Nhom

Sau T0, ca nhom lam theo contract nay:

- Frontend goi backend.
- Backend goi AI service.
- AI service tra answer, citation, label, quiz.
- Ticket chi tao trong backend.
- Dashboard chi lay ticket tu backend.
- Tat ca API tra `{ ok, data }` hoac `{ ok, error }`.
- Field bat buoc cua flow hoi AI la `lessonId`, `studentId`, `selectedText`, `question`.
- Field bat buoc cua answer la `answer`, `citation`, `conceptLabel`.
- Field bat buoc cua ticket la `selectedText`, `question`, `conceptLabel`, `reason`, `status`.

Day la contract chuan de bat dau T1/T2 ma khong can hoi lai ten endpoint hay ten field.
