# Ke Hoach CP3 - LearningRadar

## 1. Muc Tieu CP3

CP3 can nang prototype tu ban "bam duoc" thanh mot flow co backend va AI service.

Ket qua CP3 can dat:

- Frontend trong `prototype/` goi duoc backend API.
- Backend trong `backend/` nhan request, quan ly ticket, dashboard va goi sang AI service.
- AI service trong `ai-service/` xu ly cau tra loi AI, citation, quiz va concept label.
- Co mock fallback de demo van chay neu chua co AI key hoac AI loi.
- Demo end-to-end chay duoc:
  - Chon text -> hoi AI -> nhan answer/citation/label.
  - Bam Da hieu -> lam quiz -> pass/fail.
  - Bam Chua hieu hoac fail quiz -> tao ticket.
  - Dashboard giang vien hien ticket.

## 2. Nguyen Tac Lam CP3

- Frontend chi goi backend, khong goi truc tiep AI service.
- Backend goi AI service qua `backend/src/services/ai-client.service.js`.
- AI service khong quan ly ticket/dashboard.
- Neu AI chua san sang, AI service tra mock response cung format.
- Moi nguoi uu tien lam dung file minh phu trach de tranh conflict.
- Tich hop som, khong doi den cuoi moi noi.

## 3. Timeline Tong Quan

| Moc thoi gian | Muc tieu | Ket qua can co |
|---|---|---|
| **T0 - 30 phut dau** | Chot contract API va data | Ca nhom dung chung ten field, endpoint, response format. |
| **T1 - 1.5 gio** | Dung skeleton backend + AI service | Server backend va AI service chay duoc route health/mock. |
| **T2 - 2.5 gio** | Lam API chinh va mock logic | Tutor ask, quiz, ticket, dashboard co response mock. |
| **T3 - 3.5 gio** | Noi frontend voi backend | Prototype khong chi dung mock local nua, goi backend duoc. |
| **T4 - 4.5 gio** | Noi backend voi AI service | Backend goi AI service de lay answer/quiz/label. |
| **T5 - 5.5 gio** | Test end-to-end | Chay duoc 2 nhanh demo: pass va tao ticket. |
| **T6 - 6 gio tro di** | Fix loi, chot demo, cap nhat tai lieu | Demo on dinh, checklist pass, slide/spec khop flow that. |

Co the rut gon thoi gian neu checkpoint gap. Thu tu uu tien khong doi: contract -> skeleton -> API mock -> noi frontend -> noi AI service -> test demo.

## 4. T0 - Chot Contract Chung

Thoi gian: 30 phut dau.

Nguoi phu trach chinh: **Tran Duc Manh**, ho tro boi **Le Cong Dung** va **Le Nguyen Minh Duc**.

Viec can lam:

- Chot endpoint backend:
  - `POST /api/tutor/ask`
  - `GET /api/quiz?conceptId=...`
  - `POST /api/quiz/submit`
  - `POST /api/tickets`
  - `GET /api/dashboard/tickets`
- Chot endpoint AI service:
  - `POST /ai/ask`
  - `POST /ai/quiz`
  - `POST /ai/label`
- Chot data field:
  - `selectedText`
  - `question`
  - `lessonId`
  - `answer`
  - `citation`
  - `conceptLabel`
  - `quizScore`
  - `passed`
  - `ticket`

Dau ra:

- Ca nhom khong tu dat field rieng.
- Frontend, backend, AI service co the lam song song.

## 5. T1 - Dung Skeleton Chay Duoc

Thoi gian: 1 - 1.5 gio.

### Tran Duc Manh

File phu trach:

- `backend/package.json`
- `backend/src/server.js`
- `backend/src/services/ai-client.service.js`

Viec can lam:

- Tao server backend.
- Khai bao route co ban.
- Them health check, vi du `GET /health`.
- Viet skeleton `ai-client.service.js` de backend co ham goi AI service.

Dau ra:

- Backend chay duoc.
- Goi `/health` tra ve OK.

### Le Cong Dung

File phu trach:

- `ai-service/package.json`
- `ai-service/src/server.js`
- `ai-service/src/routes/ask.routes.js`
- `ai-service/src/routes/quiz.routes.js`
- `ai-service/src/routes/label.routes.js`

Viec can lam:

- Tao server AI service.
- Khai bao route co ban.
- Them health check.
- Moi route tra mock response dung format.

Dau ra:

- AI service chay duoc.
- Backend co the goi AI service sau do.

### Nguyen Dao Nam Hai

File phu trach:

- `backend/src/data/mock-lessons.js`
- `backend/src/data/mock-quiz.js`
- `backend/src/data/mock-tickets.js`
- `ai-service/src/data/mock-ai-responses.js`

Viec can lam:

- Chuyen mock data tu prototype sang format backend/AI service.
- Tao it nhat:
  - 2 lesson/sample text.
  - 1 answer mock co citation.
  - 5 quiz questions.
  - 2 ticket mock.

Dau ra:

- Backend va AI service co data dung de tra response.

## 6. T2 - Lam API Chinh Bang Mock Logic

Thoi gian: 1.5 - 2.5 gio.

### Le Cong Dung

File phu trach:

- `ai-service/src/services/llm.service.js`
- `ai-service/src/services/prompt.service.js`
- `ai-service/src/services/citation.service.js`
- `ai-service/src/services/quiz-generator.service.js`
- `ai-service/src/services/concept-label.service.js`
- `ai-service/src/prompts/*.md`

Viec can lam:

- Viet prompt template cho tutor answer.
- Viet prompt template cho quiz generator.
- Viet prompt template cho concept label.
- Trong CP3, neu chua goi AI that thi service tra mock response.
- Dam bao response co:
  - `answer`
  - `citation`
  - `conceptLabel`
  - `confidence`

Dau ra:

- AI service co logic mock ro rang, sau nay thay bang AI that de duoc.

### Tran Duc Manh

File phu trach:

- `backend/src/routes/tutor.routes.js`
- `backend/src/routes/quiz.routes.js`
- `backend/src/services/tutor.service.js`
- `backend/src/services/quiz.service.js`
- `backend/src/services/ai-client.service.js`

Viec can lam:

- Backend route `/api/tutor/ask` nhan request tu frontend.
- Backend goi AI service `/ai/ask`.
- Backend route `/api/quiz` lay quiz.
- Backend route `/api/quiz/submit` cham diem quiz.

Dau ra:

- Frontend goi backend de hoi tutor va lam quiz duoc.

### Le Nguyen Minh Duc

File phu trach:

- `backend/src/routes/ticket.routes.js`
- `backend/src/routes/dashboard.routes.js`
- `backend/src/services/ticket.service.js`

Viec can lam:

- API `POST /api/tickets` tao ticket.
- API `GET /api/dashboard/tickets` lay danh sach ticket.
- Ticket co `reason`, `status`, `conceptLabel`, `quizScore`.

Dau ra:

- Tao ticket va xem dashboard qua API duoc.

## 7. T3 - Noi Frontend Voi Backend

Thoi gian: 2.5 - 3.5 gio.

### Phung Hong Phuoc

File phu trach:

- `prototype/src/student-flow.js`

Viec can lam:

- Khi bam **Gui**, truyen `selectedText`, `question`, `lessonId` len handler chung.
- Dam bao validate toi thieu:
  - Chua co text thi bao can chon/dan text.
  - Chua co question thi bao can nhap cau hoi.

Dau ra:

- Man hinh sinh vien dua duoc data sang `main.js`.

### Tran Duc Manh

File phu trach:

- `prototype/src/main.js`
- `prototype/index.html`
- `prototype/src/styles.css`

Viec can lam:

- Trong `main.js`, doi logic tu mock local sang fetch backend.
- Goi `POST /api/tutor/ask`.
- Nhan answer roi render `tutor-result.js`.
- Noi flow `Da hieu`, `Chua hieu`, quiz, ticket.

Dau ra:

- Frontend goi backend that duoc.

### Le Cong Dung

File phu trach:

- `prototype/src/tutor-result.js`
- `prototype/src/quiz-flow.js`

Viec can lam:

- Render answer tu backend response.
- Bam **Da hieu** thi goi lay quiz.
- Render quiz 5 cau.
- Nop quiz va hien pass/fail.

Dau ra:

- Answer va quiz khong con chi la man hinh tinh.

### Le Nguyen Minh Duc

File phu trach:

- `prototype/src/teacher-dashboard.js`

Viec can lam:

- Dashboard lay ticket tu backend.
- Sau khi tao ticket, dashboard refresh/hien ticket moi.

Dau ra:

- Dashboard hien data tu backend API.

## 8. T4 - Noi Backend Voi AI Service

Thoi gian: 3.5 - 4.5 gio.

### Tran Duc Manh

Viec can lam:

- Hoan thien `ai-client.service.js`.
- Backend doc AI service URL tu `.env`.
- Neu goi AI service loi, tra mock fallback thay vi crash.

Dau ra:

- Backend khong phu thuoc tuyet doi vao AI service khi demo.

### Le Cong Dung

Viec can lam:

- Dam bao AI service route tra response dung format backend can.
- Test:
  - `/ai/ask`
  - `/ai/quiz`
  - `/ai/label`

Dau ra:

- AI service co the chay rieng va duoc backend goi.

### Nguyen Dao Nam Hai

Viec can lam:

- Kiem tra citation co khop sample transcript/slide.
- Sua mock data neu answer, quiz, label chua lien quan nhau.

Dau ra:

- Demo co noi dung hop ly, khong bi "mock cho co".

## 9. T5 - Test End-To-End

Thoi gian: 4.5 - 5.5 gio.

Nguoi phu trach chinh: **Nguyen Xuan Phuong**.

File phu trach:

- `docs/test-checklist.md`
- `docs/demo-script.md`

Viec can test:

### Nhanh 1 - Da Hieu Va Pass Quiz

1. Mo prototype.
2. Chon/dan text.
3. Nhap cau hoi.
4. Bam **Gui**.
5. Thay answer/citation/label.
6. Bam **Da hieu**.
7. Lam quiz dat 3/5 tro len.
8. He thong hien pass.
9. Khong tao ticket can xu ly.

### Nhanh 2 - Chua Hieu

1. Mo prototype.
2. Chon/dan text.
3. Nhap cau hoi.
4. Bam **Gui**.
5. Bam **Chua hieu**.
6. He thong tao ticket.
7. Dashboard hien ticket.

### Nhanh 3 - Da Hieu Nhung Fail Quiz

1. Mo prototype.
2. Bam **Da hieu**.
3. Lam quiz duoi 3/5.
4. He thong tao ticket voi reason `quiz_failed`.
5. Dashboard hien ticket.

Dau ra:

- Checklist ghi ro pass/fail.
- Loi nao chan demo thi bao owner sua ngay.

## 10. T6 - Chot Demo Va Tai Lieu

Thoi gian: 5.5 - 6 gio tro di.

### Nguyen Xuan Phuong

Viec can lam:

- Viet demo script 1-2 phut.
- Cap nhat slide outline.
- Cap nhat spec neu flow that khac voi spec.

### Tat ca thanh vien

Viec can lam:

- Moi nguoi test lai phan minh phu trach.
- Khong them tinh nang moi neu flow chua on dinh.
- Chi sua loi chan demo.

Dau ra:

- Demo CP3 chay on dinh.
- Tai lieu khop voi san pham.

## 11. Phan Cong Cu The Theo Thanh Vien

## 11.1 Nguyen Dao Nam Hai

Phu trach:

- Data.
- Evidence.
- Mock lesson/answer/quiz/ticket.
- Citation mau.

Thu tu lam:

1. Chon 2-3 doan transcript/slide mau.
2. Tao mock lesson trong `backend/src/data/mock-lessons.js`.
3. Tao mock quiz trong `backend/src/data/mock-quiz.js`.
4. Tao mock AI response trong `ai-service/src/data/mock-ai-responses.js`.
5. Kiem tra answer, citation, label va quiz co lien quan nhau.

Dau ra cuoi:

- Data du sach de demo CP3.

## 11.2 Phung Hong Phuoc

Phu trach:

- Flow sinh vien phan dau.
- Input selected text.
- Input question.
- Nut Gui.

Thu tu lam:

1. Hoan thien UI selected text/question.
2. Validate input trong frontend.
3. Goi callback `onSubmitQuestion`.
4. Test nut Gui voi mock handler.
5. Sau khi backend san sang, test voi API that qua `main.js`.

Dau ra cuoi:

- Sinh vien co the nhap/chon text va gui cau hoi khong loi.

## 11.3 Le Cong Dung

Phu trach:

- Tutor result.
- Quiz flow.
- AI service.
- Prompt.

Thu tu lam:

1. Lam AI service route mock `/ai/ask`, `/ai/quiz`, `/ai/label`.
2. Viet prompt template trong `ai-service/src/prompts/`.
3. Lam frontend render answer/citation/label.
4. Lam quiz 5 cau va hien pass/fail.
5. Dam bao response format khop backend.

Dau ra cuoi:

- AI result va quiz chay duoc, co mock fallback.

## 11.4 Tran Duc Manh

Phu trach:

- Noi flow frontend.
- Backend skeleton.
- Backend goi AI service.

Thu tu lam:

1. Tao backend server chay duoc.
2. Tao route skeleton.
3. Viet `ai-client.service.js`.
4. Noi frontend `main.js` voi backend API.
5. Xu ly fallback neu API loi.

Dau ra cuoi:

- Flow frontend -> backend -> AI service chay duoc.

## 11.5 Le Nguyen Minh Duc

Phu trach:

- Ticket.
- Dashboard giang vien.
- Dashboard API.

Thu tu lam:

1. Lam ticket data format.
2. Lam API tao ticket.
3. Lam API lay ticket cho dashboard.
4. Lam frontend dashboard render ticket.
5. Test case Chua hieu va fail quiz.

Dau ra cuoi:

- Dashboard hien dung ticket sinh ra trong flow.

## 11.6 Nguyen Xuan Phuong

Phu trach:

- Test.
- Demo.
- Spec/slide.

Thu tu lam:

1. Viet checklist test CP3.
2. Test tung nhanh flow.
3. Ghi loi theo owner.
4. Viet demo script 1-2 phut.
5. Cap nhat slide/spec theo ban chay that.

Dau ra cuoi:

- Demo co kich ban ro, test checklist pass cac case chinh.

## 12. Viec Khong Nen Lam Truoc Khi CP3 On Dinh

- Chua can dang nhap.
- Chua can database that neu mock/in-memory du de demo.
- Chua can upload file that.
- Chua can UI qua dep.
- Chua can dashboard analytics phuc tap.
- Chua can toi uu code qua som.

Neu con thoi gian sau khi flow da chay, moi lam dep UI va them tinh nang phu.

## 13. Definition Of Done CP3

CP3 hoan thanh khi ca 6 dieu sau deu dat:

- Prototype goi backend API thanh cong.
- Backend goi AI service hoac mock AI service thanh cong.
- Bam Gui hien answer/citation/concept label.
- Bam Da hieu di den quiz va tinh pass/fail.
- Bam Chua hieu hoac fail quiz tao ticket.
- Dashboard giang vien hien ticket va thong ke co ban.

Neu thieu mot trong cac dieu tren, CP3 chua du hoan chinh.
