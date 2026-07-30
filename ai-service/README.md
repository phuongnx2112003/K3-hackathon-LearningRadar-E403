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
EMBEDDING_PROVIDER=gemini
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
RAG_DATABASE_PATH=../data/local-rag.sqlite
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

## RAG local voi SQLite

Khong can Docker hay database server. Lab Coach upload PDF tu dashboard; backend chi luu metadata sau khi AI service da trich xuat PDF, chia doan va ghi embedding vao file SQLite `data/local-rag.sqlite` trong project. Khi hoc vien gui cau hoi, AI service embedding cau hoi, loc theo `lessonId`, tinh cosine similarity va lay 4 doan gan nhat de dua chung vao prompt.

Mac dinh, neu co `GEMINI_API_KEY`, he thong dung Gemini `gemini-embedding-001`: `RETRIEVAL_DOCUMENT` khi index PDF va `RETRIEVAL_QUERY` khi hoc vien hoi. Dat `EMBEDDING_PROVIDER=local` de demo offline, hoac `openai` neu can dung lai OpenAI embeddings. Khi doi embedding provider/model, xoa `data/local-rag.sqlite` va upload/index lai cac PDF de tat ca vector co cung kich thuoc.

## Endpoint

- `GET /health`
- `POST /ai/ask`
- `POST /ai/quiz`
- `POST /ai/label`
- `POST /ai/documents/index` (noi bo, do backend goi sau upload)

## Luu Y

- Service tu doc `ai-service/.env`, khong can cai them `dotenv`.
- Neu co `OPENAI_API_KEY` va `AI_MODE` khac `mock`, service se goi OpenAI that.
- Neu `AI_MODE=openai` ma thieu key, service se bao loi ro rang.
