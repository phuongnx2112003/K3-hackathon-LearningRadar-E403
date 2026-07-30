# Demo Script CP3 - LearningRadar

## Chuan Bi

Dam bao `ai-service/.env` co:

```text
AI_MODE=openai
OPENAI_API_KEY=sk-...
```

Mo 3 terminal:

```bash
cd ai-service
npm start
```

```bash
cd backend
npm start
```

```bash
cd prototype
npm run dev
```

## Loi Noi Demo 1-2 Phut

LearningRadar la tinh nang giup sinh vien hoi AI ngay tren dung doan tai lieu dang kho hieu. Diem khac biet la he thong khong dung lai o viec AI tra loi, ma kiem tra xem sinh vien da hieu that chua va day tin hieu chua hieu len dashboard cho giang vien.

## Flow Demo

1. Mo trang prototype LearningRadar.
2. UI tu tai slide PDF that tu `data/vlearn-pack/slides` va transcript that tu `data/vlearn-pack/transcript`.
3. O man sinh vien, chon hoac dan mot doan text tren transcript.
4. Nhap cau hoi: `Vi sao can xac dinh dung bai toan truoc khi dua AI vao san pham?`
5. Bam **Gui cau hoi cho AI Tutor**.
6. He thong goi backend `POST /api/tutor/ask`; backend goi AI service `/ai/ask`; AI service goi OpenAI that.
7. Man hinh hien cau tra loi, citation va concept label.
8. Bam **Da hieu** de mo quiz.
9. Lam quiz 5 cau va nop bai.
10. Neu dat tu 3/5 tro len, he thong hien pass.
11. Lam nhanh thu nhanh khac: bam **Chua hieu**.
12. He thong tao ticket qua backend `POST /api/tickets`.
13. Chuyen sang tab giang vien, dashboard lay data tu `GET /api/dashboard/tickets` va hien ticket.
14. Doi status ticket sang `reviewed` de chung minh dashboard goi API update.

## Diem Can Nhan Manh

- CP3 da co 3 lop: `prototype`, `backend`, `ai-service`.
- Frontend khong goi truc tiep AI service.
- Backend co fallback neu AI service loi, nhung ban test nop bai da chay voi `fallback=false`.
- Quiz pass nguong 3/5; fail quiz tao ticket.
- Dashboard giup giang vien thay concept nao dang co nhieu sinh vien vuong.
