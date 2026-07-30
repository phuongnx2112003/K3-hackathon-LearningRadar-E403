# Phan Cong CP2 va Cau Truc Thu Muc

## Muc Tieu CP2

CP2 can show duoc mot flow bam duoc tu dau den cuoi:

1. Mo trang prototype.
2. Chon hoac dan mot doan tai lieu.
3. Go cau hoi.
4. Bam **Gui**.
5. Hien cau tra loi gia lap co citation.
6. Chon **Da hieu** hoac **Chua hieu**.
7. Neu **Da hieu** thi lam quiz 5 cau va hien pass/fail.
8. Neu **Chua hieu** hoac fail quiz thi tao ticket sang dashboard giang vien.

CP2 chua can AI that, chua can backend that, chua can giao dien qua dep. Uu tien: nut bam co phan hoi, man hinh noi duoc voi nhau, demo khong bi dut flow.

## Cau Truc Thu Muc De Xuat

```text
/
+-- spec.md
+-- phan-cong-cp2.md
+-- data/
|   +-- vlearn-pack/
|       +-- chatlog/
|       +-- transcript/
+-- prototype/
|   +-- README.md
|   +-- index.html
|   +-- src/
|   |   +-- main.js
|   |   +-- styles.css
|   |   +-- mock-data.js
|   |   +-- student-flow.js
|   |   +-- tutor-result.js
|   |   +-- quiz-flow.js
|   |   +-- teacher-dashboard.js
|   +-- assets/
|       +-- screenshots/
+-- backend/
|   +-- README.md
|   +-- package.json
|   +-- .env.example
|   +-- src/
|   |   +-- server.js
|   |   +-- routes/
|   |   |   +-- tutor.routes.js
|   |   |   +-- quiz.routes.js
|   |   |   +-- ticket.routes.js
|   |   |   +-- dashboard.routes.js
|   |   +-- services/
|   |   |   +-- tutor.service.js
|   |   |   +-- quiz.service.js
|   |   |   +-- ticket.service.js
|   |   |   +-- citation.service.js
|   |   |   +-- ai-client.service.js
|   |   +-- data/
|   |   |   +-- mock-lessons.js
|   |   |   +-- mock-quiz.js
|   |   |   +-- mock-tickets.js
|   |   +-- utils/
|   |       +-- response.js
+-- ai-service/
|   +-- README.md
|   +-- package.json
|   +-- .env.example
|   +-- src/
|   |   +-- server.js
|   |   +-- routes/
|   |   |   +-- ask.routes.js
|   |   |   +-- quiz.routes.js
|   |   |   +-- label.routes.js
|   |   +-- services/
|   |   |   +-- llm.service.js
|   |   |   +-- prompt.service.js
|   |   |   +-- citation.service.js
|   |   |   +-- quiz-generator.service.js
|   |   |   +-- concept-label.service.js
|   |   +-- prompts/
|   |   |   +-- tutor-answer.prompt.md
|   |   |   +-- quiz-generator.prompt.md
|   |   |   +-- concept-label.prompt.md
|   |   +-- data/
|   |   |   +-- mock-ai-responses.js
|   |   +-- utils/
|   |       +-- response.js
+-- docs/
|   +-- demo-script.md
|   +-- test-checklist.md
|   +-- slide-outline.md
+-- tham-khao/
```

## Quy Uoc Lam Viec

- Tat ca mock data dung cho prototype dat trong `prototype/src/mock-data.js`.
- Tu CP3, API app dat trong `backend/`, xu ly AI dat rieng trong `ai-service/`; CP2 van co the mock o frontend, nhung ten field nen giong API de sau nay doi sang service de hon.
- Cac doan transcript/slide goc lay tu `data/vlearn-pack/`, khong sua truc tiep file data goc.
- Man hinh sinh vien tach trong `student-flow.js`, ket qua AI tach trong `tutor-result.js`, quiz tach trong `quiz-flow.js`, dashboard tach trong `teacher-dashboard.js`.
- Backend chia theo 3 lop: `routes/` nhan request, `services/` xu ly logic app/call AI service, `data/` chua du lieu mock hoac adapter data tam.
- AI service chi phu trach logic AI: prompt, citation, sinh cau tra loi, sinh quiz, gan nhan concept. Khong xu ly UI, dashboard hoac trang thai ticket.
- Tai lieu demo, checklist test va dan y slide dat trong `docs/`.
- Neu can them file moi, dat ten ro chuc nang, viet bang chu thuong va ngan gon.

## Cau Truc Backend Cho CP3

Backend dat tai `backend/`, ngang hang voi `prototype/`.

| Thu muc/file | Muc dich |
|---|---|
| `backend/src/server.js` | Diem chay server, khai bao route va cong API. |
| `backend/src/routes/tutor.routes.js` | API nhan doan text + cau hoi tu frontend, goi `ai-service`, tra ve cau tra loi/citation/nhan kien thuc. |
| `backend/src/routes/quiz.routes.js` | API lay quiz/submit quiz; co the goi `ai-service` de sinh quiz va tu cham diem trong backend. |
| `backend/src/routes/ticket.routes.js` | API tao ticket khi sinh vien chua hieu hoac fail quiz. |
| `backend/src/routes/dashboard.routes.js` | API lay danh sach ticket/thong ke cho dashboard giang vien. |
| `backend/src/services/tutor.service.js` | Logic dieu phoi hoi tutor va format du lieu tra ve cho frontend. |
| `backend/src/services/quiz.service.js` | Logic tao quiz, cham diem pass/fail. |
| `backend/src/services/ticket.service.js` | Logic tao, cap nhat, dong ticket. |
| `backend/src/services/citation.service.js` | Adapter tam cho citation neu chua goi `ai-service`. |
| `backend/src/services/ai-client.service.js` | Ham goi sang `ai-service` de hoi AI, sinh quiz, gan nhan concept. |
| `backend/src/data/` | Du lieu mock tam thoi cho lesson, quiz, ticket. |
| `backend/src/utils/response.js` | Format response chung de frontend de xu ly. |

## Cau Truc AI Service Cho CP3

AI service dat tai `ai-service/`, ngang hang voi `backend/` va `prototype/`.

| Thu muc/file | Muc dich |
|---|---|
| `ai-service/src/server.js` | Diem chay rieng cua AI service. |
| `ai-service/src/routes/ask.routes.js` | API nhan cau hoi + selected text, tra ve cau tra loi AI. |
| `ai-service/src/routes/quiz.routes.js` | API sinh quiz 5 cau theo concept/selected text. |
| `ai-service/src/routes/label.routes.js` | API gan nhan concept/van de kien thuc. |
| `ai-service/src/services/llm.service.js` | Noi goi model AI that hoac mock AI. |
| `ai-service/src/services/prompt.service.js` | Lap prompt tu selected text, question va transcript. |
| `ai-service/src/services/citation.service.js` | Tim/chon citation tu transcript/slide. |
| `ai-service/src/services/quiz-generator.service.js` | Sinh quiz 5 cau theo noi dung da chon. |
| `ai-service/src/services/concept-label.service.js` | Gan nhan concept/lo hong kien thuc. |
| `ai-service/src/prompts/` | Luu prompt template de ca nhom de doc va sua. |
| `ai-service/src/data/mock-ai-responses.js` | Mock response khi chua co AI key hoac khi demo offline. |
| `ai-service/src/utils/response.js` | Format response chung cua AI service. |

API toi thieu can co cho CP3:

- `POST /api/tutor/ask`: gui `selectedText`, `question` va nhan `answer`, `citation`, `conceptLabel`.
- `GET /api/quiz?conceptId=...`: lay 5 cau quiz.
- `POST /api/quiz/submit`: gui dap an, nhan `score`, `passed`.
- `POST /api/tickets`: tao ticket khi **Chua hieu** hoac quiz fail.
- `GET /api/dashboard/tickets`: lay ticket cho dashboard giang vien.

## Role Tung Thanh Vien

| Thanh vien | Vai tro chinh | File/thu muc phu trach | Dau ra can co |
|---|---|---|---|
| **Nguyen Dao Nam Hai (2A202601037)** | Data va bang chung | `data/vlearn-pack/`, `prototype/src/mock-data.js`, `backend/src/data/`, `ai-service/src/data/` | Chon 2-3 doan transcript/slide mau, tao cau hoi mau, cau tra loi mau, citation, nhan kien thuc va ticket mau. |
| **Phung Hong Phuoc (2A202601215)** | Luong hoi dap sinh vien phan dau | `prototype/src/student-flow.js`, phan input trong `prototype/index.html` | Man hinh co doan tai lieu, o nhap cau hoi, nut **Gui**; bam Gui truyen du lieu sang phan ket qua. |
| **Le Cong Dung (2A202601649)** | Ket qua AI gia lap, prompt va quiz | `prototype/src/tutor-result.js`, `prototype/src/quiz-flow.js`, `ai-service/src/routes/`, `ai-service/src/services/`, `ai-service/src/prompts/` | Sau khi bam Gui hien cau tra loi co citation, nhan kien thuc, nut **Da hieu/Chua hieu** va quiz 5 cau; CP3 co AI service hoi tutor, gan nhan va sinh quiz. |
| **Tran Duc Manh (2A202601567)** | Noi prototype end-to-end va backend skeleton | `prototype/src/main.js`, `prototype/index.html`, `prototype/src/styles.css`, `backend/src/server.js`, `backend/package.json`, `backend/src/services/ai-client.service.js` | Noi cac buoc thanh mot flow lien mach; tao skeleton backend de frontend doi tu mock sang API va backend goi sang AI service. |
| **Le Nguyen Minh Duc (2A202601013)** | Dashboard giang vien va ticket API | `prototype/src/teacher-dashboard.js`, phan dashboard trong `prototype/index.html`, `backend/src/routes/ticket.routes.js`, `backend/src/routes/dashboard.routes.js`, `backend/src/services/ticket.service.js` | Dashboard hien ticket, nhan kien thuc yeu, so luot gap, vi du cau hoi va trang thai ticket; CP3 co API tao/lay ticket. |
| **Nguyen Xuan Phuong (2A202601874)** | Kiem thu, spec va demo | `docs/test-checklist.md`, `docs/demo-script.md`, `docs/slide-outline.md`, `spec.md` | Checklist test CP2, kich ban demo 1-2 phut, cap nhat spec/slide theo prototype that. |

## Checklist CP2

- [ ] Mo duoc trang prototype.
- [ ] Thay duoc doan tai lieu mau.
- [ ] Nhap duoc cau hoi.
- [ ] Bam **Gui** hien ket qua.
- [ ] Ket qua co citation va nhan kien thuc.
- [ ] Bam **Da hieu** di den quiz.
- [ ] Quiz co 5 cau va tinh duoc pass/fail.
- [ ] Bam **Chua hieu** tao ticket.
- [ ] Fail quiz tao ticket.
- [ ] Dashboard giang vien hien ticket.
- [ ] Demo duoc flow trong 1-2 phut.
