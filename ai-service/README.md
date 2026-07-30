# LearningRadar AI Service

Service rieng cho cac tac vu AI cua LearningRadar.

AI service phu trach:

- Tao cau tra loi tutor.
- Tim citation.
- Gan concept label.
- Sinh quiz 5 cau.

Trong CP3, service nay mac dinh tra mock response dung contract. Sau nay co the thay `llm.service.js` de goi model AI that.

## Chay local

```bash
cd ai-service
npm start
```

Mac dinh server chay tai:

```text
http://localhost:4000
```

## Endpoint

- `GET /health`
- `POST /ai/ask`
- `POST /ai/quiz`
- `POST /ai/label`
