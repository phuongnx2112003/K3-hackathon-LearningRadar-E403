# Final Handoff - LearningRadar CP3

## Trang Thai Nop Bai

Project da chay duoc voi OpenAI API key that va data slide/transcript that trong repo.

## Cau Hinh Bat Buoc

File `ai-service/.env` can co:

```text
PORT=4000
AI_MODE=openai
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-your_real_key_here
```

Khong commit `.env`.

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

Neu PowerShell bao loi `npm.ps1 cannot be loaded`, dung `npm.cmd`.

## API Da Test

- `GET /api/lessons`
- `GET /api/slides/d1-slide-hackathon.pdf`
- `POST /api/tutor/ask`
- `GET /api/quiz`
- `POST /api/quiz/submit`
- `POST /api/tickets`
- `GET /api/dashboard/tickets`
- `POST /ai/ask`
- `POST /ai/quiz`
- `POST /ai/label`

## Ket Qua Quan Trong

- OpenAI API real call: pass.
- Backend ask qua AI service: pass.
- `fallback=false`: pass, nghia la khong dung mock fallback.
- Slide PDF trong `data/vlearn-pack/slides`: da serve len UI.
- Transcript trong `data/vlearn-pack/transcript`: da load len UI.
- Frontend build: pass.

## Luu Y Khi Demo

- Chay `ai-service` truoc `backend`.
- Chay `backend` truoc `prototype`.
- Neu OpenAI het quota hoac sai key, backend co fallback de flow khong chet, nhung khi nop bai nen dam bao `fallback=false` trong test.
