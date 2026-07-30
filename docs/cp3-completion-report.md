# CP3 Completion Report - LearningRadar

## Trang Thai

Da hoan thien CP3 voi OpenAI API that va data slide/transcript that trong repo.

## T3 - Noi Frontend Voi Backend

Da lam:

- `prototype/src/main.jsx` de app goi backend that qua component flow.
- `prototype/src/api-client.js` co cac ham:
  - `askTutor`
  - `getLessons`
  - `getBackendAssetUrl`
  - `getQuiz`
  - `submitQuiz`
  - `createTicket`
  - `updateTicketStatus`
  - `getDashboardTickets`
- `prototype/src/student-flow.jsx`:
  - Tai lesson/transcript/slide tu backend.
  - Nhung PDF slide that vao UI.
  - Validate selected text va question.
  - Bam Gui goi `POST /api/tutor/ask`.
  - Bam Chua hieu goi `POST /api/tickets`.
  - Quiz fail goi `POST /api/tickets`.
- `prototype/src/quiz-flow.jsx`:
  - Lay quiz tu backend.
  - Submit quiz ve backend.
  - Hien pass/fail.
- `prototype/src/teacher-dashboard.jsx`:
  - Lay ticket/summary tu backend.
  - Cap nhat status ticket qua API.

## T4 - Noi Backend Voi AI Service

Da lam:

- Backend goi AI service qua `backend/src/services/ai-client.service.js`.
- `POST /api/tutor/ask` goi `/ai/ask`.
- AI service doc `.env` truc tiep, khong can cai them `dotenv`.
- AI service goi OpenAI that khi co `OPENAI_API_KEY` va `AI_MODE=openai`.
- AI service co:
  - `/ai/ask`
  - `/ai/quiz`
  - `/ai/label`
- Neu AI service loi, backend fallback van tra answer de demo khong dut flow.

## Data That Tren UI

Da lam:

- Backend co `GET /api/lessons` doc transcript that tu `data/vlearn-pack/transcript`.
- Backend co `GET /api/slides/:file` serve PDF slide that tu `data/vlearn-pack/slides`.
- Frontend tai lesson tu backend va nhung PDF slide that vao UI bang iframe.
- Frontend dung transcript paragraphs that lam noi dung de sinh vien chon/dan text.

## T5 - Test End-To-End

Da test:

- Health backend va AI service.
- OpenAI API key that trong `ai-service/.env`.
- AI service goi OpenAI thanh cong.
- AI ask/quiz/label.
- Backend lessons/slides.
- Backend tutor ask.
- Backend quiz get/submit.
- Ticket create/update.
- Dashboard tickets.
- Frontend production build.

Chi tiet nam trong `docs/test-checklist.md`.

## Cach Chay

Terminal 1:

```bash
cd ai-service
npm start
```

Terminal 2:

```bash
cd backend
npm start
```

Terminal 3:

```bash
cd prototype
npm run dev
```

Neu PowerShell chan `npm`, dung `npm.cmd`.

## Ket Qua Smoke Test That Gan Nhat

```text
backendHealth: true
aiHealth: true
lessonsCount: 2
firstLessonParagraphs: 8
slideStatus: 200
slideBytes: 9765803
openAiBackendAskOk: true
answerHasCitation: true
fallback: false
quizQuestions: 5
submitPassed: true
ticketCreated: ticket-005
dashboardTotal: 5
```
