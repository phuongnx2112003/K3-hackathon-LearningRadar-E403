# T2 Note - Phan Tran Duc Manh

## Trang Thai

Phan backend tutor/quiz cua **Tran Duc Manh** da duoc trien khai.

## File Phu Trach

- `backend/src/routes/tutor.routes.js`
- `backend/src/routes/quiz.routes.js`
- `backend/src/services/tutor.service.js`
- `backend/src/services/quiz.service.js`
- `backend/src/services/ai-client.service.js`

## Endpoint Da Co

### `POST /api/tutor/ask`

Nhan request tu frontend:

```json
{
  "lessonId": "lesson-01",
  "studentId": "student-demo-01",
  "selectedText": "Doan text sinh vien chon",
  "question": "Cau hoi cua sinh vien"
}
```

Xu ly:

- Validate `selectedText` va `question`.
- Goi AI service `/ai/ask` qua `ai-client.service.js`.
- Neu AI service loi, tra mock fallback de demo khong bi chet.

Response co:

- `answerId`
- `lessonId`
- `studentId`
- `selectedText`
- `question`
- `answer`
- `citation`
- `conceptId`
- `conceptLabel`
- `confidence`

### `GET /api/quiz?conceptId=concept-dropout-01`

Xu ly:

- Lay quiz theo `conceptId`.
- Dung mock quiz trong backend de dam bao quiz hien ra va dap an cham diem khop nhau.
- AI service `/ai/quiz` se duoc noi sau o T4 neu co co che luu dap an quiz theo session.
- Tra 5 cau quiz cho frontend.
- Khong tra `correctIndex` ra frontend.

### `POST /api/quiz/submit`

Nhan request:

```json
{
  "studentId": "student-demo-01",
  "lessonId": "lesson-01",
  "conceptId": "concept-dropout-01",
  "answers": [
    {
      "questionId": "q1",
      "selectedIndex": 1
    }
  ]
}
```

Xu ly:

- Validate co `answers`.
- Cham diem dua tren mock quiz backend.
- Pass neu `score >= 3`.

Response:

```json
{
  "score": 3,
  "total": 5,
  "passed": true,
  "passThreshold": 3
}
```

## Dau Ra Dat Duoc

- Frontend co the goi backend de hoi tutor.
- Backend goi duoc AI service `/ai/ask`.
- Frontend co the lay quiz tu backend.
- Frontend co the submit quiz va nhan pass/fail.
- Co fallback neu AI service chua chay.

## Cach Test Nhanh

Chay AI service:

```bash
cd ai-service
npm start
```

Chay backend:

```bash
cd backend
npm start
```

Test health:

```bash
curl http://localhost:3000/health
```

Test ask tutor:

```bash
curl -X POST http://localhost:3000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d "{\"lessonId\":\"lesson-01\",\"studentId\":\"student-demo-01\",\"selectedText\":\"Dropout tat neuron khi train va bat tat ca khi inference\",\"question\":\"Vi sao train va inference khac nhau?\"}"
```

Test get quiz:

```bash
curl "http://localhost:3000/api/quiz?conceptId=concept-dropout-01"
```

Test submit quiz:

```bash
curl -X POST http://localhost:3000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d "{\"studentId\":\"student-demo-01\",\"lessonId\":\"lesson-01\",\"conceptId\":\"concept-dropout-01\",\"answers\":[{\"questionId\":\"q1\",\"selectedIndex\":1},{\"questionId\":\"q2\",\"selectedIndex\":0},{\"questionId\":\"q3\",\"selectedIndex\":1},{\"questionId\":\"q4\",\"selectedIndex\":0},{\"questionId\":\"q5\",\"selectedIndex\":2}]}"
```
