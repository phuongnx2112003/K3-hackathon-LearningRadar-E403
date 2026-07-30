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
+-- docs/
|   +-- demo-script.md
|   +-- test-checklist.md
|   +-- slide-outline.md
+-- tham-khao/
```

## Quy Uoc Lam Viec

- Tat ca mock data dung cho prototype dat trong `prototype/src/mock-data.js`.
- Cac doan transcript/slide goc lay tu `data/vlearn-pack/`, khong sua truc tiep file data goc.
- Man hinh sinh vien tach trong `student-flow.js`, ket qua AI tach trong `tutor-result.js`, quiz tach trong `quiz-flow.js`, dashboard tach trong `teacher-dashboard.js`.
- Tai lieu demo, checklist test va dan y slide dat trong `docs/`.
- Neu can them file moi, dat ten ro chuc nang, viet bang chu thuong va ngan gon.

## Role Tung Thanh Vien

| Thanh vien | Vai tro chinh | File/thu muc phu trach | Dau ra can co |
|---|---|---|---|
| **Nguyen Dao Nam Hai (2A202601037)** | Data va bang chung | `data/vlearn-pack/`, `prototype/src/mock-data.js` | Chon 2-3 doan transcript/slide mau, tao cau hoi mau, cau tra loi mau, citation, nhan kien thuc va ticket mau. |
| **Phung Hong Phuoc (2A202601215)** | Luong hoi dap sinh vien phan dau | `prototype/src/student-flow.js`, phan input trong `prototype/index.html` | Man hinh co doan tai lieu, o nhap cau hoi, nut **Gui**; bam Gui truyen du lieu sang phan ket qua. |
| **Le Cong Dung (2A202601649)** | Ket qua AI gia lap va quiz | `prototype/src/tutor-result.js`, `prototype/src/quiz-flow.js` | Sau khi bam Gui hien cau tra loi co citation, nhan kien thuc, nut **Da hieu/Chua hieu** va quiz 5 cau. |
| **Tran Duc Manh (2A202601567)** | Noi prototype end-to-end | `prototype/src/main.js`, `prototype/index.html`, `prototype/src/styles.css` | Noi cac buoc thanh mot flow lien mach: chon text -> hoi AI -> xem ket qua -> lam quiz -> pass/fail hoac tao ticket. |
| **Le Nguyen Minh Duc (2A202601013)** | Dashboard giang vien | `prototype/src/teacher-dashboard.js`, phan dashboard trong `prototype/index.html` | Dashboard hien ticket, nhan kien thuc yeu, so luot gap, vi du cau hoi va trang thai ticket. |
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
