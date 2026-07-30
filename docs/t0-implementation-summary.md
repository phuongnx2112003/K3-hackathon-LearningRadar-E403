# T0 Implementation Summary

## Da Trien Khai

T0 da duoc dua vao codebase theo contract trong `docs/t0-contract-note.md`.

## Backend

Thu muc: `backend/`

Da co:

- `GET /health`
- `POST /api/tutor/ask`
- `GET /api/quiz?conceptId=...`
- `POST /api/quiz/submit`
- `POST /api/tickets`
- `GET /api/dashboard/tickets`

Backend dung Node core `http`, chua can cai dependency.

Backend co:

- Response format chung `{ ok, data }` va `{ ok, error }`.
- Mock lesson, quiz, ticket.
- Ticket service in-memory.
- Quiz scoring voi nguong pass 3/5.
- `ai-client.service.js` de goi sang AI service.
- Fallback response neu AI service chua chay hoac bi loi.

## AI Service

Thu muc: `ai-service/`

Da co:

- `GET /health`
- `POST /ai/ask`
- `POST /ai/quiz`
- `POST /ai/label`

AI service dung Node core `http`, chua can cai dependency.

AI service co:

- Mock AI answer.
- Mock citation.
- Mock concept label.
- Mock quiz 5 cau.
- Prompt template trong `ai-service/src/prompts/`.

## Prototype

Thu muc: `prototype/`

Da bo sung:

- `prototype/.env.example`
- `prototype/src/api-client.js`

Frontend component hien co chua bi sua. File `api-client.js` chi la client dung chung de T3 noi UI vao backend.

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

## Smoke Test Da Chay

Ket qua test local:

- Backend health: pass.
- AI service health: pass.
- `POST /api/tutor/ask`: pass.
- `GET /api/quiz`: tra 5 cau.
- `POST /api/quiz/submit`: tinh pass/fail duoc.
- `POST /api/tickets`: tao ticket duoc.
- `GET /api/dashboard/tickets`: lay summary va ticket duoc.

## Viec Tiep Theo Sau T0

- T1: Moi thanh vien tiep tuc lam module theo `docs/cp3-plan.md`.
- T2: Hoan thien logic route/service mock.
- T3: Noi UI React hien co voi `prototype/src/api-client.js`.
- T4: Thay mock AI bang AI that neu kip va co API key.
