# Slide Outline CP3 - LearningRadar

## Slide 1 - Problem

- Sinh vien hoi AI xong van co the hieu sai.
- Giang vien khong thay duoc nhung diem kien thuc lop dang vuong.
- LearningRadar bien mot lan hoi bai thanh tin hieu hoc tap co the theo doi.

## Slide 2 - User Flow

```text
Chon text tren slide/transcript -> Hoi AI -> Answer + citation + concept label -> Da hieu/Chua hieu -> Quiz -> Ticket -> Dashboard
```

- Sinh vien hoi tren dung doan tai lieu.
- AI tra loi co citation.
- Tin hieu chua hieu duoc day sang giang vien.

## Slide 3 - Data That Tren UI

- PDF slide that lay tu `data/vlearn-pack/slides`.
- Transcript that lay tu `data/vlearn-pack/transcript`.
- Frontend tai data qua backend `GET /api/lessons` va `GET /api/slides/:file`.

## Slide 4 - CP3 Architecture

```text
prototype -> backend -> ai-service -> OpenAI API
```

- `prototype`: UI va flow bam duoc.
- `backend`: API tutor/quiz/ticket/dashboard/lessons/slides.
- `ai-service`: OpenAI answer, concept label, quiz generation.

## Slide 5 - Backend API

- `GET /api/lessons`
- `GET /api/slides/d1-slide-hackathon.pdf`
- `POST /api/tutor/ask`
- `GET /api/quiz`
- `POST /api/quiz/submit`
- `POST /api/tickets`
- `PATCH /api/tickets`
- `GET /api/dashboard/tickets`

## Slide 6 - AI Service

- `POST /ai/ask`: goi OpenAI that, tra answer + citation + label.
- `POST /ai/quiz`: goi OpenAI/mock generator de sinh 5 cau quiz.
- `POST /ai/label`: gan concept label.
- `AI_MODE=openai` cho ban nop bai that.

## Slide 7 - Demo Result

- Gui cau hoi hien answer that tu OpenAI qua backend.
- Da hieu -> quiz -> pass/fail.
- Chua hieu hoac fail quiz -> tao ticket.
- Dashboard hien ticket va doi status duoc.
- Smoke test gan nhat co `fallback=false`.

## Slide 8 - Next Step

- Cai tien citation lay truc tiep theo page/slide.
- Them database de luu ticket lau dai.
- Them auth/role cho sinh vien va giang vien.
- Them deployment production.
