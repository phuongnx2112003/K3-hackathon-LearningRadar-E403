# Policy Du An LearningRadar

## 1. Muc Dich Tai Lieu

File nay dung de thong nhat cach ca nhom hieu va lam du an **LearningRadar**.

Tat ca thanh vien can doc file nay truoc khi code, viet spec, lam slide hoac demo. Muc tieu la tranh tinh trang moi nguoi hieu mot kieu, lam lech flow, dat sai file, hoac lam tinh nang khong can cho checkpoint.

## 2. Tong Quan Du An

**LearningRadar** la mot tinh nang moi cho VLearn AI Tutor.

Y tuong chinh:

Sinh vien dang doc slide/transcript tren VLearn, gap mot doan kien thuc kho hieu, co the chon/dan doan do, go cau hoi va nhan cau tra loi tu AI Tutor. Sau do sinh vien xac nhan **Da hieu** hoac **Chua hieu**. Neu sinh vien chua hieu, hoac lam quiz khong dat, he thong tao ticket va dua len dashboard cho giang vien xem.

Muc tieu cuoi cung:

- Sinh vien duoc giai thich dung ngu canh, co citation tu tai lieu hoc.
- He thong biet sinh vien da that su hieu hay chua.
- Giang vien thay duoc nhung diem kien thuc nhieu sinh vien dang yeu.
- AI khong chi tra loi cau hoi, ma con tao tin hieu hoc tap co ich cho giang vien.

## 3. Van De Can Giai Quyet

Hien tai AI Tutor co the tra loi cau hoi, nhung chua ghi nhan tot viec sinh vien co hieu that hay khong.

Van de cu the:

- Sinh vien hoi xong nhung van co the hieu sai.
- AI tra loi xong la het, khong tao thanh tin hieu cho giang vien.
- Giang vien kho biet lop dang bi hong kien thuc o dau.
- He thong chua co flow kiem tra lai muc do hieu cua sinh vien.

LearningRadar giai quyet bang cach them flow:

```text
Chon doan tai lieu -> Hoi AI -> Xac nhan Da hieu/Chua hieu -> Quiz -> Ticket -> Dashboard giang vien
```

## 4. Doi Tuong Su Dung

### 4.1 Sinh Vien

Sinh vien la nguoi:

- Doc slide/transcript tren VLearn.
- Chon hoac dan mot doan kien thuc chua hieu.
- Go cau hoi.
- Doc cau tra loi AI.
- Bam **Da hieu** hoac **Chua hieu**.
- Lam quiz ngan neu da hieu.

### 4.2 Giang Vien/TA

Giang vien hoac TA la nguoi:

- Xem dashboard LearningRadar.
- Thay cac ticket sinh vien chua hieu.
- Xem nhan kien thuc yeu.
- Xem so luot gap van de.
- Xem vi du cau hoi cua sinh vien.
- Quyet dinh co can nhac lai trong buoi hoc sau hay khong.

### 4.3 AI Tutor

AI Tutor la thanh phan:

- Nhan selected text va cau hoi.
- Tra loi ngan gon, dung ngu canh.
- Dua citation tu slide/transcript.
- Gan nhan concept/kien thuc.
- Sinh quiz 5 cau neu can.

AI khong duoc tu dong ket luan rang sinh vien da hieu. Sinh vien phai xac nhan hoac lam quiz de tao tin hieu.

## 5. Pham Vi Theo Checkpoint

## 5.1 CP2 - Show Duoc Thu Bam Duoc

CP2 chi can lam duoc prototype co the bam tu dau den cuoi.

CP2 can co:

- Mo duoc trang prototype.
- Hien duoc doan tai lieu mau.
- Chon hoac dan duoc doan text.
- Nhap duoc cau hoi.
- Bam **Gui**.
- Hien cau tra loi gia lap.
- Hien citation gia lap.
- Hien nhan kien thuc gia lap.
- Bam **Da hieu** thi sang quiz.
- Quiz co 5 cau.
- Tinh duoc pass/fail.
- Bam **Chua hieu** hoac fail quiz thi tao ticket.
- Dashboard giang vien hien ticket.

CP2 chua can:

- AI that.
- Backend that.
- Database that.
- Dang nhap that.
- Giao dien qua dep.
- Xu ly moi edge case.

Tieu chi quan trong nhat cua CP2:

**Bam duoc het flow, khong co nut chet, khong co man hinh roi rac khong noi voi nhau.**

## 5.2 CP3 - Co Backend Va AI Service

CP3 can nang prototype thanh he thong co API.

CP3 can co:

- Frontend goi backend thay vi chi dung mock trong browser.
- Backend co API cho tutor, quiz, ticket va dashboard.
- AI service xu ly prompt, citation, answer, quiz va concept label.
- Backend goi sang AI service.
- Co mock fallback neu AI key hoac model khong san sang.
- Dashboard lay ticket tu backend.

CP3 co the van chua can:

- Database production.
- Authentication day du.
- Deployment that.
- Toi uu performance lon.

## 6. Flow Chinh Cua San Pham

## 6.1 Flow Sinh Vien

1. Sinh vien mo trang LearningRadar.
2. He thong hien mot doan slide/transcript mau.
3. Sinh vien chon hoac dan doan text dang kho hieu.
4. Sinh vien go cau hoi.
5. Sinh vien bam **Gui**.
6. He thong hien cau tra loi AI.
7. Cau tra loi phai co:
   - Noi dung giai thich.
   - Citation.
   - Nhan kien thuc/concept.
8. Sinh vien chon:
   - **Da hieu**
   - **Chua hieu**
9. Neu **Chua hieu**, he thong tao ticket ngay.
10. Neu **Da hieu**, he thong cho lam quiz 5 cau.
11. Neu quiz dat tu 3/5 tro len, ticket duoc dong hoac khong tao ticket.
12. Neu quiz duoi 3/5, he thong tao ticket.

## 6.2 Flow Giang Vien

1. Giang vien mo dashboard.
2. Dashboard hien danh sach ticket.
3. Moi ticket can co:
   - Ten/ma case gia lap cua sinh vien.
   - Doan text sinh vien hoi.
   - Cau hoi cua sinh vien.
   - Nhan kien thuc yeu.
   - Ly do tao ticket: Chua hieu hoac fail quiz.
   - Diem quiz neu co.
   - Trang thai ticket.
4. Dashboard co thong ke:
   - Tong so ticket.
   - Nhan kien thuc nao xuat hien nhieu.
   - So luot gap tung nhan.
5. Giang vien dung dashboard de biet phan nao can nhac lai.

## 7. Tinh Nang Cu The

## 7.1 Chon Hoac Dan Doan Tai Lieu

Muc dich:

Cho sinh vien chi ro dung phan kien thuc dang khong hieu.

Trong CP2:

- Co the dung san mot doan text mau.
- Co the cho textarea de dan text.
- Khong can highlight tren PDF/slide that.

Trong CP3:

- Co the lay selected text tu frontend.
- Co the gan them lessonId, slideId hoac transcriptId.

Input toi thieu:

```json
{
  "selectedText": "Doan tai lieu sinh vien chon",
  "lessonId": "lesson-01"
}
```

## 7.2 Hoi AI Tutor

Muc dich:

Sinh vien dat cau hoi ve doan text da chon.

Trong CP2:

- Bam **Gui** thi lay cau tra loi tu mock data.

Trong CP3:

- Frontend goi backend `POST /api/tutor/ask`.
- Backend goi `ai-service`.
- AI service tao cau tra loi dua tren selected text va question.

Request de xuat:

```json
{
  "selectedText": "Doan text kho hieu",
  "question": "Em chua hieu vi sao phan nay nhu vay?",
  "lessonId": "lesson-01"
}
```

Response de xuat:

```json
{
  "answer": "Giai thich ngan gon...",
  "citation": "Transcript 03, doan 2",
  "conceptLabel": "Khai niem can cung co",
  "confidence": 0.82
}
```

## 7.3 Citation

Muc dich:

Dam bao cau tra loi cua AI co can cu tu slide/transcript.

Quy uoc:

- Citation phai hien ra gan cau tra loi.
- Citation co the la transcript, slide hoac lesson.
- Neu chua co citation that, CP2 duoc dung citation gia lap.

Vi du:

```text
Citation: transcript-03-clean.md, phan 2
```

## 7.4 Nhan Kien Thuc/Concept Label

Muc dich:

Gan cau hoi cua sinh vien vao mot nhom kien thuc de giang vien xem dashboard.

Vi du nhan:

- Bien va kieu du lieu.
- Vong lap.
- Ham.
- Dieu kien if/else.
- Truy van du lieu.
- Logic ung dung.

Trong CP2:

- Dung nhan gia lap trong mock data.

Trong CP3:

- AI service gan nhan concept.
- Backend luu conceptLabel vao ticket.

## 7.5 Nut Da Hieu/Chua Hieu

Muc dich:

Sinh vien tu xac nhan muc do hieu sau khi doc cau tra loi.

Quy tac:

- Bam **Chua hieu**: tao ticket ngay.
- Bam **Da hieu**: khong dong flow ngay, ma chuyen sang quiz 5 cau.

Ly do:

Sinh vien co the tu tin da hieu nhung van hieu sai. Quiz giup kiem tra lai.

## 7.6 Quiz 5 Cau

Muc dich:

Kiem tra nhanh sinh vien co hieu concept vua hoi hay khong.

Quy tac:

- Quiz gom 5 cau.
- Dat tu 3/5 tro len la pass.
- Duoi 3/5 la fail.
- Fail quiz tao ticket.

Trong CP2:

- Quiz duoc hard-code trong mock data.

Trong CP3:

- Quiz co the lay tu backend.
- Backend co the goi AI service de sinh quiz.

Response nop quiz de xuat:

```json
{
  "score": 3,
  "total": 5,
  "passed": true
}
```

## 7.7 Ticket

Muc dich:

Ticket la tin hieu gui sang giang vien khi sinh vien co kha nang chua hieu.

Ticket duoc tao khi:

- Sinh vien bam **Chua hieu**.
- Sinh vien lam quiz duoi 3/5.

Ticket khong tao khi:

- Sinh vien bam **Da hieu** va quiz pass 3/5 tro len.

Ticket toi thieu can co:

```json
{
  "id": "ticket-001",
  "selectedText": "Doan text sinh vien hoi",
  "question": "Cau hoi cua sinh vien",
  "conceptLabel": "Nhan kien thuc",
  "reason": "not_understood",
  "quizScore": null,
  "status": "open",
  "createdAt": "demo-time"
}
```

Gia tri `reason`:

- `not_understood`: sinh vien bam Chua hieu.
- `quiz_failed`: sinh vien fail quiz.

Gia tri `status`:

- `open`: dang can giang vien xem.
- `reviewed`: giang vien da xem.
- `closed`: da xu ly hoac khong can xu ly nua.

## 7.8 Dashboard Giang Vien

Muc dich:

Giup giang vien thay nhung van de lap lai trong lop.

Dashboard can hien:

- Tong so ticket.
- Danh sach ticket.
- Nhan kien thuc yeu.
- So luot gap moi nhan.
- Vi du cau hoi sinh vien.
- Trang thai ticket.

Trong CP2:

- Dashboard chi can hien du lieu mock/ticket vua tao trong flow.

Trong CP3:

- Dashboard goi backend `GET /api/dashboard/tickets`.

## 8. Kien Truc Thu Muc

```text
/
+-- prototype/
+-- backend/
+-- ai-service/
+-- data/
+-- docs/
+-- tham-khao/
+-- spec.md
+-- phan-cong-cp2.md
+-- policy.md
```

## 8.1 Prototype

`prototype/` phu trach giao dien va flow bam duoc.

```text
prototype/
+-- index.html
+-- README.md
+-- src/
|   +-- main.js
|   +-- styles.css
|   +-- mock-data.js
|   +-- student-flow.js
|   +-- tutor-result.js
|   +-- quiz-flow.js
|   +-- teacher-dashboard.js
+-- assets/
    +-- screenshots/
```

Quy uoc:

- `main.js`: noi cac man hinh va quan ly flow.
- `student-flow.js`: man hinh chon text, nhap cau hoi, bam Gui.
- `tutor-result.js`: hien cau tra loi, citation, nhan concept.
- `quiz-flow.js`: hien quiz, cham diem, hien pass/fail.
- `teacher-dashboard.js`: hien ticket va thong ke.
- `mock-data.js`: du lieu gia lap cho CP2.
- `styles.css`: style chung.

## 8.2 Backend

`backend/` phu trach API chinh cua ung dung.

```text
backend/
+-- package.json
+-- .env.example
+-- src/
    +-- server.js
    +-- routes/
    +-- services/
    +-- data/
    +-- utils/
```

Backend lam:

- Nhan request tu frontend.
- Quan ly ticket.
- Quan ly dashboard data.
- Dieu phoi quiz result.
- Goi sang AI service khi can cau tra loi, quiz, label.

Backend khong nen lam:

- Khong viet prompt dai trong route.
- Khong xu ly UI.
- Khong de logic AI nam lan voi ticket/dashboard.

## 8.3 AI Service

`ai-service/` phu trach toan bo logic lien quan den AI.

```text
ai-service/
+-- package.json
+-- .env.example
+-- src/
    +-- server.js
    +-- routes/
    +-- services/
    +-- prompts/
    +-- data/
    +-- utils/
```

AI service lam:

- Tao prompt.
- Goi model AI hoac mock AI.
- Tao cau tra loi tutor.
- Tim citation.
- Sinh quiz.
- Gan nhan concept.

AI service khong lam:

- Khong quan ly dashboard.
- Khong luu trang thai ticket chinh.
- Khong xu ly giao dien.

## 8.4 Data

`data/` chua du lieu goc tu hackathon.

Quy uoc:

- Khong sua truc tiep file data goc neu khong can.
- Neu can trich mau, copy sang mock data.
- Citation nen uu tien tu `data/vlearn-pack/transcript/`.

## 8.5 Docs

`docs/` chua tai lieu phuc vu demo va test.

Can co:

- `demo-script.md`: kich ban demo.
- `test-checklist.md`: checklist test.
- `slide-outline.md`: dan y slide.

## 9. API De Xuat

## 9.1 Backend API

Frontend chi nen goi backend, khong goi truc tiep AI service.

| Method | Endpoint | Muc dich |
|---|---|---|
| `POST` | `/api/tutor/ask` | Gui selected text + question, nhan cau tra loi AI. |
| `GET` | `/api/quiz?conceptId=...` | Lay quiz 5 cau. |
| `POST` | `/api/quiz/submit` | Nop dap an quiz, nhan score/pass/fail. |
| `POST` | `/api/tickets` | Tao ticket. |
| `GET` | `/api/dashboard/tickets` | Lay ticket cho dashboard. |

## 9.2 AI Service API

Backend goi AI service qua cac endpoint noi bo.

| Method | Endpoint | Muc dich |
|---|---|---|
| `POST` | `/ai/ask` | Sinh cau tra loi AI co citation. |
| `POST` | `/ai/quiz` | Sinh quiz 5 cau. |
| `POST` | `/ai/label` | Gan nhan concept. |

## 10. Contract Du Lieu Chung

Tat ca module nen dung cung ten field de de noi voi nhau.

### Lesson

```json
{
  "lessonId": "lesson-01",
  "title": "Bai hoc mau",
  "source": "transcript-03-clean.md",
  "content": "Noi dung doan hoc..."
}
```

### Tutor Answer

```json
{
  "answer": "Cau tra loi cua AI",
  "citation": "Nguon trich dan",
  "conceptLabel": "Nhan kien thuc",
  "confidence": 0.82
}
```

### Quiz Question

```json
{
  "id": "q1",
  "question": "Cau hoi quiz",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0
}
```

### Ticket

```json
{
  "id": "ticket-001",
  "selectedText": "Doan text",
  "question": "Cau hoi",
  "conceptLabel": "Nhan kien thuc",
  "reason": "quiz_failed",
  "quizScore": 2,
  "status": "open"
}
```

## 11. Phan Cong Theo Module

| Thanh vien | Phu trach chinh | Noi dung can lam |
|---|---|---|
| **Nguyen Dao Nam Hai (2A202601037)** | Data va bang chung | Chon transcript/slide mau, tao mock data, citation mau, ticket mau. |
| **Phung Hong Phuoc (2A202601215)** | Flow sinh vien phan dau | Man hinh chon/dan text, nhap cau hoi, nut Gui, truyen data sang buoc sau. |
| **Le Cong Dung (2A202601649)** | AI result, prompt, quiz | Cau tra loi AI gia lap, citation, prompt template, quiz 5 cau, AI service logic. |
| **Tran Duc Manh (2A202601567)** | Noi flow va backend skeleton | `main.js`, `index.html`, style chung, backend server, goi AI client. |
| **Le Nguyen Minh Duc (2A202601013)** | Dashboard va ticket | Tao/hien ticket, dashboard giang vien, thong ke nhan kien thuc. |
| **Nguyen Xuan Phuong (2A202601874)** | Test, spec, demo | Checklist test, demo script, slide outline, test end-to-end. |

## 12. Quy Tac Lam Viec Song Song

De lam song song, moi nguoi chi nen sua file minh phu trach chinh.

Quy tac:

- Truoc khi sua file chung nhu `index.html`, `main.js`, `styles.css`, can bao cho nhom.
- Neu can them field moi vao mock data, phai cap nhat contract trong file nay hoac bao nguoi phu trach data.
- Khong doi ten function/field chung ma khong bao nhom.
- Moi module nen export function ro rang.
- CP2 uu tien chay duoc hon la code dep.
- CP3 moi toi uu lai cach goi API/service.

Function contract de xuat cho frontend:

```js
renderStudentFlow(container, onSubmitQuestion)
renderTutorResult(container, data, onUnderstood, onNotUnderstood)
renderQuizFlow(container, questions, onQuizDone)
renderTeacherDashboard(container, tickets)
```

## 13. Tieu Chi Hoan Thanh

## 13.1 Hoan Thanh CP2

CP2 duoc xem la dat khi:

- Co the mo prototype.
- Bam duoc tu dau den cuoi flow.
- Co it nhat 2 nhanh demo:
  - Nhanh **Da hieu -> quiz -> pass**.
  - Nhanh **Chua hieu hoac fail quiz -> ticket -> dashboard**.
- Dashboard hien ticket.
- Khong can AI/backend that.

## 13.2 Hoan Thanh CP3

CP3 duoc xem la dat khi:

- Frontend goi backend API.
- Backend tao/lay ticket duoc.
- Backend goi AI service de lay answer/quiz/label hoac mock AI service.
- Dashboard lay data qua API.
- Flow van chay duoc end-to-end.

## 14. Ngoai Pham Vi Tam Thoi

Nhung viec chua uu tien:

- Dang nhap nguoi dung.
- Phan quyen that.
- Database production.
- Upload slide/PDF that.
- Highlight truc tiep tren slide that.
- Cham diem phuc tap.
- Recommendation ca nhan hoa sau nhieu buoi hoc.
- Dashboard analytics nang cao.

Co the them sau neu CP2/CP3 da on dinh.

## 15. Nguyen Tac Ra Quyet Dinh

Khi phan van co nen lam mot tinh nang hay khong, dung thu tu uu tien sau:

1. Co giup demo flow chay duoc khong?
2. Co lam ro gia tri LearningRadar khong?
3. Co phuc vu CP2/CP3 khong?
4. Co lam nhom bi cham hoac kho merge khong?

Neu mot viec khong giup flow bam duoc hoac khong giup dashboard/ticket ro hon, tam thoi de sau.

## 16. Tom Tat Mot Cau

LearningRadar la flow giup sinh vien hoi AI tren dung doan tai lieu, kiem tra lai viec da hieu hay chua, va bien tin hieu chua hieu thanh ticket/dashboard de giang vien thay duoc diem yeu cua lop.
