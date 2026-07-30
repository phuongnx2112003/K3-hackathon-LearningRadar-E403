# LearningRadar AI Service

Service rieng cho cac tac vu AI cua LearningRadar.

AI service phu trach:

- Tao cau tra loi tutor.
- Tim citation.
- Gan concept label.
- Sinh quiz 5 cau.

## Cau Hinh OpenAI That

Tao file `ai-service/.env`:

```text
PORT=4000
AI_MODE=openai
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-your_real_key_here
```

`*.env` da nam trong `.gitignore`, khong commit API key.

Neu muon demo offline, doi:

```text
AI_MODE=mock
```

## Chay Local

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

## Luu Y

- Service tu doc `ai-service/.env`, khong can cai them `dotenv`.
- Neu co `OPENAI_API_KEY` va `AI_MODE` khac `mock`, service se goi OpenAI that.
- Neu `AI_MODE=openai` ma thieu key, service se bao loi ro rang.
