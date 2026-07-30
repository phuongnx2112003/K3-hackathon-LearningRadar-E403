# SOL - LearningRadar Eval Submission

## 1. AI trong san pham quyet dinh dieu gi va su dung model nao?

AI quyet dinh cau hoi cua sinh vien co du can cu tu doan tai lieu/slide duoc chon de tra loi co citation hay phai canh bao thieu ngu canh, dong thoi gan nhan concept yeu cho dashboard giang vien - dung `gpt-4o-mini`.

## 2. Tong so cau trong bo thu nghiem

24 cau.

Bo cau thu da luu tai:

- `eval/test.md`
- `eval/test-cases.json`

## 3. Bo cau thu co bao nhieu kieu tinh huong?

Bo cau thu co du 4 kieu tinh huong bat buoc, moi kieu co it nhat 2 cau:

- Cau ma thong tin can tra loi KHONG co trong tai lieu: 5 cau.
- Cau mo ho, thieu ngu canh: 4 cau.
- Cau doi thu san pham khong duoc phep lam: 4 cau.
- Cau ma tra loi sai gay hau qua that cho nguoi dung: 4 cau.

Ngoai ra co them 7 cau `normal_grounded` de kiem tra cac cau hoi binh thuong co can cu trong tai lieu.

## 4. So luong cau hoi bat nguon tu quan sat thuc te

9 cau.

Chi tiet:

- 5 cau tu chatlog AI tutor trong `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`: E08, E09, E13, E14, E23.
- 4 cau tu tinh huong nhom gap khi tu dung thu san pham: E10, E17, E22, E24.

## 5. Ket qua chay thu dat bao nhieu cau?

24/24.

Bang ket qua day du da luu tai:

- `eval/results.md`
- `eval/results.json`

Ghi chu: lan chay hien tai duoc chay qua backend `/api/tutor/ask` va AI service. Cac cau duoc cham bang `mustContain`/`mustNotContain` trong `eval/test-cases.json`, doi chieu voi yeu cau "Phai tra loi" trong `eval/test.md`.

## 6. Chuan dat cua nhom la bao nhieu?

Chuan dat cua nhom: **>=75% cau thu dat, va AI khong duoc bia thong tin khi doan tai lieu khong co can cu du chi mot lan.**

Ly do chon chuan nay:

- LearningRadar la tinh nang ho tro hoc tap, nen cau tra loi sai co citation hoac bia noi dung se lam sinh vien hoc sai.
- Muc 75% du thuc te cho ban CP3, nhung loi "bia thong tin ngoai tai lieu" phai dat muc 0 lan vi nguoi dung kho tu phat hien.

## Ket Qua Sau Cai Tien

Ket qua hien tai 24/24, dat chuan cua nhom.

Cai tien da lam:

- Them guardrail: neu selected text khong chua thong tin can tra loi thi phai noi "khong du can cu".
- Them guardrail cho cau mo ho: hoi lai truoc khi doan.
- Them refusal cho yeu cau gian lan, che giau ticket, khoi phuc PII.
- Sua loi high-stakes: khong bao gio khuyen sinh vien tin cau tra loi khi khong co citation.
- Giu citation va concept label trong response de frontend/dashboard van hien du thong tin.
