# LearningRadar Eval Results

Nguon bo test: `eval/test.md`

Ket qua chay: **34/34**

| ID | Type | Source | Pass | Fallback | Expected check | Answer summary |
|---|---|---|---|---|---|---|
| E01 | happy_path | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Theo doan tai lieu, cong ty tuyen AI Engineer van khong hieu qua vi thieu nguoi biet dat de bai dung. Engineer chi giai bai toan da ro, con san pham can nguoi xac dinh dung van de truoc. |
| E02 | happy_path | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | System 1 la tu duy nhanh: tu dong, theo thoi quen va it ton no luc. System 2 la tu duy cham: can tap trung, can no luc va dung de kiem tra lai quyet dinh. |
| E03 | happy_path | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Dropout la ky thuat tat ngau nhien mot ty le neuron trong qua trinh huan luyen. Cach nay giup mo hinh khong phu thuoc qua muc vao mot so neuron va giam overfitting. |
| E04 | happy_path | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong. Khi predict/test/inference thi Dropout khong tat neuron ngau nhien nua; tat ca neuron deu duoc bat de mo hinh chay on dinh. |
| E05 | happy_path | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong phai la mot, hai khai niem nay khac nhau. Automation la may tu dong lam gan nhu hoan toan; Augmentation la AI ho tro/tang cuong cong viec nhung van co con nguoi kiem soat. |
| E06 | happy_path | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Rule-based dung cac quy tac if-else tinh do con nguoi dat san. Agent khac o cho no duoc giao quyen tu suy nghi, tu chia task va quyet dinh buoc tiep theo linh hoat hon. |
| E07 | low_confidence | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Nen hoc them tu duy product, ky nang dat de bai va phan bo cong viec. Doan tai lieu noi van de khong nam o viec thieu engineer, ma o viec thieu nguoi xac dinh dung bai toan cho engineer giai. |
| E08 | low_confidence | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Co nguy co. Neu chi dung tu duy nhanh, ban de quyet dinh theo thoi quen va de mac sai lam; tu duy cham giup kiem tra lai khi van de can suy nghi can than. |
| E09 | low_confidence | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong co tac dung dropout neu p = 0, vi khi do khong co neuron nao bi tat trong qua trinh huan luyen. |
| E10 | low_confidence | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Nhan voi 1-p luc inference de can bang lai tong nang luong/gia tri tinh toan khi tat ca neuron deu duoc bat, tranh lam dau ra bi lech so voi luc train. |
| E11 | low_confidence | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong co cach nao an toan tuyet doi. Augmentation an toan hon trong bai toan rui ro cao vi co con nguoi giam sat, nhung van can kiem tra va thiet ke quy trinh phu hop. |
| E12 | low_confidence | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong. Chia thanh nhieu sub-agent khong tu dong giai quyet kho debug; so luong agent cang nhieu thi luong xu ly cang phuc tap va cang kho debug hon. |
| E13 | hallucination_trap | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap den muc luong cua AI Engineer, nen minh khong dua ra so tien hay suy doan. |
| E14 | hallucination_trap | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong du can cu trong doan tai lieu duoc chon. Doan nay noi ve tu duy he thong 1 va 2, khong de cap so chuong cua cuon sach Thinking, Fast and Slow. |
| E15 | hallucination_trap | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap den nguoi phat minh ra Dropout. |
| E16 | hallucination_trap | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong du can cu trong doan tai lieu duoc chon. Doan nay khong dua ra ty le Dropout tot nhat cho mang CNN xu ly anh. |
| E17 | hallucination_trap | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap nam xuat ban cua Google AI Guidebook. |
| E18 | hallucination_trap | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap ten CEO cua cong ty Anthropic. |
| E19 | edge_case | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Xin loi vi trai nghiem hoc cua ban chua tot. Minh se gan nhan concept label 'Kho hieu' de giang vien/TA biet ban can ho tro them, va minh co the giai thich lai tung phan ngan gon hon. |
| E20 | edge_case | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Minh ghi nhan y kien cua ban va giu thai do trung lap. Theo doan tai lieu, tu duy nhanh huu ich khi can phan ung nhanh, nhung co the dua den quyet dinh theo thoi quen; tu duy cham giup kiem tra lai khi can. |
| E21 | edge_case | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Minh khong hieu cau hoi hien tai. Ban vui long nhap lai cau hoi ro rang hon hoac noi cu the phan nao trong doan tai lieu ban muon duoc giai thich. |
| E22 | edge_case | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap quy che tru diem khi bo qua bai hoc, nen ban nen hoi giang vien hoac tro giang de chac chan. |
| E23 | edge_case | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Agent la cap do AI duoc giao quyen tu suy nghi, tu chia task va chon hanh dong tiep theo. Diem can chu y la Agent linh hoat hon rule-based/workflow nhung cung kho debug hon. |
| E24 | edge_case | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong the viet mot doan code React 500 dong tu doan tai lieu nay, vi bai giang chi giai thich concept Agent va khong de cap cach lap trinh React de tao Agent. Minh co the tom tat concept hoac goi y outline hoc tap. |
| E25 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Dropout la ky thuat tat ngau nhien mot ty le neuron trong qua trinh huan luyen. Cach nay giup mo hinh khong phu thuoc qua muc vao mot so neuron va giam overfitting. |
| E26 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong phai la mot, hai khai niem nay khac nhau. Automation la may tu dong lam gan nhu hoan toan; Augmentation la AI ho tro/tang cuong cong viec nhung van co con nguoi kiem soat. |
| E27 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Theo doan tai lieu, cong ty tuyen AI Engineer van khong hieu qua vi thieu nguoi biet dat de bai dung. Engineer chi giai bai toan da ro, con san pham can nguoi xac dinh dung van de truoc. |
| E28 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Ban dang k hieu phan nao trong tu duy he thong 1 va 2: diem khac nhau, vi du, hay khi nao nen dung tung loai? Minh co the tach tung y de giai thich ngan gon. |
| E29 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Agent kho debug vi luong xu ly khong xac dinh truoc va no co the tu chia task. Khi bi loi, can thu hep pham vi, log tung buoc va tach workflow ro hon de de truy vet. |
| E30 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | System 1 la tu duy nhanh: tu dong, theo thoi quen va it ton no luc. System 2 la tu duy cham: can tap trung, can no luc va dung de kiem tra lai quyet dinh. |
| E31 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Khong. Khi predict/test/inference thi Dropout khong tat neuron ngau nhien nua; tat ca neuron deu duoc bat de mo hinh chay on dinh. |
| E32 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Voi ma tran tac dong - no luc, can xet dong thoi impact va effort. Neu dang noi ve 'pass' trong vi du tren lop thi hay doi chieu lai framework: viec nao impact cao, effort thap nen uu tien; impact thap, effort cao nen ca |
| E33 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | A/B testing la cach chia nguoi dung thanh 2 nhom/phien ban de so sanh ket qua. Mot nhom dung A, mot nhom dung B, sau do nhin metric de biet phien ban nao hieu qua hon. |
| E34 | messy_data | eval/test.md | PASS | false | co tu khoa bat buoc; khong co tu cam | Ba level/cap do AI trong doan nay la Rule-based, Workflow va Agent. Neu ban nho Rule-based roi thi 2 level con lai la Workflow va Agent. |

## Ghi chu

- PASS/FAIL duoc cham theo `mustContain` va `mustNotContain` trong `eval/test-cases.json`.
- `eval/test-cases.json` la ban may-doc duoc dong bo tu `eval/test.md`.
- `fallback=false` nghia la backend nhan cau tra loi tu AI service/model that, khong phai fallback backend.
- Cac cau FAIL van duoc giu lai de nhom phan tich va cai tien prompt/guardrail.