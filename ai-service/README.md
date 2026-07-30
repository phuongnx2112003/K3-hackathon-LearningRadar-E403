# LearningRadar AI Service

Service rieng cho cac tac vu AI cua LearningRadar.

AI service phu trach:

- Tao cau tra loi tutor.
- Tim citation.
- Gan concept label.
- Sinh quiz 5 cau.

Service luôn gọi OpenAI Responses API; không có mock fallback.

## Chay local

```bash
cd ai-service
# Tao .env tu .env.example va dien OPENAI_API_KEY
set -a && source .env && set +a
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

## Cau hinh OpenAI

| Bien moi truong | Mac dinh | Mo ta |
| --- | --- | --- |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | Base URL cua OpenAI API, khong them `/responses`. |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model dung de tao answer, quiz va concept label. |
| `OPENAI_API_KEY` | — | API key bắt buộc; không commit vào git. |
