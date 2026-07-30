# CP3 Test Checklist - LearningRadar

## Ket Qua Test Tu Dong

- [x] Backend JS syntax check pass.
- [x] AI service JS syntax check pass.
- [x] AI service doc duoc key that tu `ai-service/.env` va goi OpenAI thanh cong.
- [x] AI service health check pass.
- [x] Backend health check pass.
- [x] Backend tra `GET /api/lessons` tu transcript trong `data/vlearn-pack/transcript`.
- [x] Backend serve PDF slide that qua `GET /api/slides/d1-slide-hackathon.pdf`.
- [x] `POST /ai/ask` tra answer/citation/concept label.
- [x] `POST /ai/quiz` tra 5 cau quiz.
- [x] `POST /ai/label` tra concept label.
- [x] `POST /api/tutor/ask` backend goi AI service duoc.
- [x] `GET /api/quiz` tra 5 cau va khong leak `correctIndex`.
- [x] `POST /api/quiz/submit` cham diem pass/fail duoc.
- [x] `POST /api/tickets` tao ticket duoc.
- [x] `GET /api/dashboard/tickets` tra summary va tickets.
- [x] `npm.cmd run build` trong `prototype/` build thanh cong.

## Ket Qua Smoke Test Gan Nhat

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

## Checklist Demo Thu Cong

- [ ] Chay `ai-service` bang `npm start`.
- [ ] Chay `backend` bang `npm start`.
- [ ] Chay `prototype` bang `npm run dev`.
- [ ] Mo prototype tren browser.
- [ ] Thay PDF slide that trong khung noi dung.
- [ ] Chon hoac dan mot doan transcript.
- [ ] Nhap cau hoi.
- [ ] Bam **Gui cau hoi cho AI Tutor**.
- [ ] Thay answer, citation, concept label tu OpenAI qua backend.
- [ ] Bam **Da hieu**.
- [ ] Quiz hien 5 cau.
- [ ] Nop quiz pass tu 3/5 tro len va thay pass.
- [ ] Lam lai flow, bam **Chua hieu**.
- [ ] Dashboard hien ticket moi.
- [ ] Lam lai flow, quiz fail duoi 3/5.
- [ ] Dashboard hien ticket `quiz_failed` co `quizScore`.

## Luu Y

- PowerShell co the chan `npm` do Execution Policy. Neu gap loi `npm.ps1 cannot be loaded`, dung `npm.cmd`.
- De nop bai ban that, dung `AI_MODE=openai` va `OPENAI_API_KEY` trong `ai-service/.env`.
- `fallback: false` trong smoke test nghia la backend da nhan cau tra loi tu OpenAI that, khong phai mock fallback.
