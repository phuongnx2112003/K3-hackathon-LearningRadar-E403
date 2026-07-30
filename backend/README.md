# LearningRadar Backend

Main API cho frontend `prototype/`.

Backend phu trach:

- Nhan request tu frontend.
- Goi `ai-service/` de lay answer, citation, label va quiz.
- Cham diem quiz.
- Tao ticket.
- Tra dashboard data cho giang vien.

## Chay local

```bash
cd backend
npm start
```

Mac dinh server chay tai:

```text
http://localhost:3000
```

## Endpoint

- `GET /health`
- `POST /api/tutor/ask`
- `GET /api/quiz?conceptId=concept-dropout-01`
- `POST /api/quiz/submit`
- `POST /api/tickets`
- `GET /api/dashboard/tickets`
