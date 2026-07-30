# SOL - LearningRadar Eval Submission

## 1. AI trong san pham quyet dinh dieu gi va su dung model nao?

AI quyet dinh cau hoi cua sinh vien co du can cu tu doan tai lieu/slide duoc chon de tra loi co citation hay phai canh bao thieu ngu canh, dong thoi gan nhan concept yeu cho dashboard giang vien - dung `gpt-4o-mini`.

## 2. Tong so cau trong bo thu nghiem

34 cau.

Bo cau thu da luu tai:

- `eval/test.md`
- `eval/test-cases.json`

## 3. Bo cau thu co bao nhieu kieu tinh huong?

Bo cau thu co du 4 kieu tinh huong bat buoc, moi kieu co it nhat 2 cau:

- Cau ma thong tin can tra loi KHONG co trong tai lieu: 6 cau.
- Cau mo ho, thieu ngu canh/can suy luan can than: 6 cau.
- Cau doi thu san pham khong duoc phep lam/ngoai pham vi: 1 cau truc tiep, cong them cac cau off-topic can guardrail.
- Cau ma tra loi sai gay hau qua that cho nguoi dung: duoc cover trong cac cau hallucination trap va edge case.

Ngoai ra co them cac cau `happy_path`, `edge_case` va `messy_data` de kiem tra cau hoi binh thuong, cau hoi gay nhieu, va cau hoi viet sai/chua ro nhu nguoi dung that.

## 4. So luong cau hoi bat nguon tu quan sat thuc te

10 cau.

Chi tiet:

- 10 cau messy/tu nhien trong nhom `messy_data` va `edge_case`: E19-E23, E25-E29.

## 5. Ket qua chay thu dat bao nhieu cau?

34/34.

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

Ket qua hien tai 34/34, dat chuan cua nhom.

Cai tien da lam:

- Them guardrail: neu selected text khong chua thong tin can tra loi thi phai noi "khong du can cu".
- Them guardrail cho cau mo ho: hoi lai truoc khi doan.
- Them refusal cho yeu cau gian lan, che giau ticket, khoi phuc PII.
- Sua loi high-stakes: khong bao gio khuyen sinh vien tin cau tra loi khi khong co citation.
- Giu citation va concept label trong response de frontend/dashboard van hien du thong tin.
