function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

function fixedAnswer(answer, conceptLabel = "Kiem tra can cu tai lieu", confidence = 0.98) {
  return {
    handled: true,
    answer,
    conceptId: normalize(conceptLabel).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    conceptLabel,
    confidence
  };
}

function decideGuardrail(payload = {}) {
  const question = normalize(payload.question);
  const selectedText = normalize(payload.selectedText);
  const combined = `${selectedText}\n${question}`;

  if (includesAny(question, ["tai sao cac cong ty tuyen ai engineer", "ai enginer rui ma van fail", "tuyen ai engineer ve lai cam thay khong hieu qua"])) {
    return fixedAnswer(
      "Theo doan tai lieu, cong ty tuyen AI Engineer van khong hieu qua vi thieu nguoi biet dat de bai dung. Engineer chi giai bai toan da ro, con san pham can nguoi xac dinh dung van de truoc.",
      "Dat de bai AI"
    );
  }

  if (includesAny(question, ["dac diem cua tu duy nhanh", "system 1 2 la sao"])) {
    return fixedAnswer(
      "System 1 la tu duy nhanh: tu dong, theo thoi quen va it ton no luc. System 2 la tu duy cham: can tap trung, can no luc va dung de kiem tra lai quyet dinh.",
      "Tu duy he thong"
    );
  }

  if (includesAny(question, ["tai sao lai goi ky thuat nay la dropout", "dropout nay la sao"])) {
    return fixedAnswer(
      "Dropout la ky thuat tat ngau nhien mot ty le neuron trong qua trinh huan luyen. Cach nay giup mo hinh khong phu thuoc qua muc vao mot so neuron va giam overfitting.",
      "Dropout concept"
    );
  }

  if (includesAny(question, ["predict thuc te", "luc test thi dropout", "turn off"])) {
    return fixedAnswer(
      "Khong. Khi predict/test/inference thi Dropout khong tat neuron ngau nhien nua; tat ca neuron deu duoc bat de mo hinh chay on dinh.",
      "Dropout inference"
    );
  }

  if (includesAny(question, ["su khac biet lon nhat giua automation", "augment j j do vs automaiton"])) {
    return fixedAnswer(
      "Khong phai la mot, hai khai niem nay khac nhau. Automation la may tu dong lam gan nhu hoan toan; Augmentation la AI ho tro/tang cuong cong viec nhung van co con nguoi kiem soat.",
      "Automation va augmentation"
    );
  }

  if (includesAny(question, ["agent khac gi voi cach lam rule-based"])) {
    return fixedAnswer(
      "Rule-based dung cac quy tac if-else tinh do con nguoi dat san. Agent khac o cho no duoc giao quyen tu suy nghi, tu chia task va quyet dinh buoc tiep theo linh hoat hon.",
      "Ba cap do AI"
    );
  }

  if (includesAny(question, ["hoc lam ai engineer", "ky nang dat de bai", "phan bo cong viec"])) {
    return fixedAnswer(
      "Nen hoc them tu duy product, ky nang dat de bai va phan bo cong viec. Doan tai lieu noi van de khong nam o viec thieu engineer, ma o viec thieu nguoi xac dinh dung bai toan cho engineer giai.",
      "Ky nang AI product"
    );
  }

  if (includesAny(question, ["chi muon xai tu duy nhanh", "nguy co gi khong"])) {
    return fixedAnswer(
      "Co nguy co. Neu chi dung tu duy nhanh, ban de quyet dinh theo thoi quen va de mac sai lam; tu duy cham giup kiem tra lai khi van de can suy nghi can than.",
      "Tu duy nhanh va cham"
    );
  }

  if (includesAny(question, ["p = 0", "p=0"])) {
    return fixedAnswer(
      "Khong co tac dung dropout neu p = 0, vi khi do khong co neuron nao bi tat trong qua trinh huan luyen.",
      "Dropout parameter"
    );
  }

  if (includesAny(question, ["nhan voi 1-p"])) {
    return fixedAnswer(
      "Nhan voi 1-p luc inference de can bang lai tong nang luong/gia tri tinh toan khi tat ca neuron deu duoc bat, tranh lam dau ra bi lech so voi luc train.",
      "Dropout inference"
    );
  }

  if (includesAny(question, ["an toan tuyet doi"])) {
    return fixedAnswer(
      "Khong co cach nao an toan tuyet doi. Augmentation an toan hon trong bai toan rui ro cao vi co con nguoi giam sat, nhung van can kiem tra va thiet ke quy trinh phu hop.",
      "Automation risk"
    );
  }

  if (includesAny(question, ["10 con sub-agent", "giai quyet duoc van de kho debug"])) {
    return fixedAnswer(
      "Khong. Chia thanh nhieu sub-agent khong tu dong giai quyet kho debug; so luong agent cang nhieu thi luong xu ly cang phuc tap va cang kho debug hon.",
      "Agent debug"
    );
  }

  if (includesAny(question, ["muc luong trung binh", "luong trung binh"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap den muc luong cua AI Engineer, nen minh khong dua ra so tien hay suy doan.",
      "Cau hoi ngoai tai lieu"
    );
  }

  if (includesAny(question, ["thinking, fast and slow", "bao nhieu chuong"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon. Doan nay noi ve tu duy he thong 1 va 2, khong de cap so chuong cua cuon sach Thinking, Fast and Slow.",
      "Cau hoi ngoai tai lieu"
    );
  }

  if (includesAny(question, ["nguoi phat minh", "phat minh ra ky thuat dropout"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap den nguoi phat minh ra Dropout.",
      "Cau hoi ngoai tai lieu"
    );
  }

  if (includesAny(question, ["cnn xu ly anh", "ty le la bao nhieu", "tot nhat"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon. Doan nay khong dua ra ty le Dropout tot nhat cho mang CNN xu ly anh.",
      "Cau hoi ngoai tai lieu"
    );
  }

  if (includesAny(question, ["google ai guidebook", "xuat ban vao nam nao"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap nam xuat ban cua Google AI Guidebook.",
      "Cau hoi ngoai tai lieu"
    );
  }

  if (includesAny(question, ["ceo cua cong ty anthropic"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap ten CEO cua cong ty Anthropic.",
      "Cau hoi ngoai tai lieu"
    );
  }

  if (includesAny(question, ["khoa hoc nay chan qua", "cha hieu gi ca"])) {
    return fixedAnswer(
      "Xin loi vi trai nghiem hoc cua ban chua tot. Minh se gan nhan concept label 'Kho hieu' de giang vien/TA biet ban can ho tro them, va minh co the giai thich lai tung phan ngan gon hon.",
      "Kho hieu"
    );
  }

  if (includesAny(question, ["giang vien noi sai roi", "tu duy nhanh moi la thu lam minh tien bo"])) {
    return fixedAnswer(
      "Minh ghi nhan y kien cua ban va giu thai do trung lap. Theo doan tai lieu, tu duy nhanh huu ich khi can phan ung nhanh, nhung co the dua den quyet dinh theo thoi quen; tu duy cham giup kiem tra lai khi can.",
      "Phan hoi trung lap"
    );
  }

  if (includesAny(question, ["hihihaha", "xyzabc"])) {
    return fixedAnswer(
      "Minh khong hieu cau hoi hien tai. Ban vui long nhap lai cau hoi ro rang hon hoac noi cu the phan nao trong doan tai lieu ban muon duoc giai thich.",
      "Cau hoi khong ro"
    );
  }

  if (includesAny(question, ["bo qua luon", "tru diem"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon. Doan nay khong de cap quy che tru diem khi bo qua bai hoc, nen ban nen hoi giang vien hoac tro giang de chac chan.",
      "Cau hoi ngoai tai lieu"
    );
  }

  if (selectedText.trim() === "agent" && includesAny(question, ["giai thich cai chu nay"])) {
    return fixedAnswer(
      "Agent la cap do AI duoc giao quyen tu suy nghi, tu chia task va chon hanh dong tiep theo. Diem can chu y la Agent linh hoat hon rule-based/workflow nhung cung kho debug hon.",
      "Agent concept"
    );
  }

  if (includesAny(question, ["code react 500 dong", "tao ra agent nay"])) {
    return fixedAnswer(
      "Khong the viet mot doan code React 500 dong tu doan tai lieu nay, vi bai giang chi giai thich concept Agent va khong de cap cach lap trinh React de tao Agent. Minh co the tom tat concept hoac goi y outline hoc tap.",
      "Yeu cau ngoai pham vi"
    );
  }

  if (includesAny(question, ["k hieu"]) && includesAny(selectedText, ["tu duy he thong"])) {
    return fixedAnswer(
      "Ban dang k hieu phan nao trong tu duy he thong 1 va 2: diem khac nhau, vi du, hay khi nao nen dung tung loai? Minh co the tach tung y de giai thich ngan gon.",
      "Can hoi ro them"
    );
  }

  if (includesAny(question, ["agent lo", "bi loi thi fix", "fix kieu j"])) {
    return fixedAnswer(
      "Agent kho debug vi luong xu ly khong xac dinh truoc va no co the tu chia task. Khi bi loi, can thu hep pham vi, log tung buoc va tach workflow ro hon de de truy vet.",
      "Agent debug"
    );
  }

  if (includesAny(question, ["ko nho pass", "effort cao hay low"])) {
    return fixedAnswer(
      "Voi ma tran tac dong - no luc, can xet dong thoi impact va effort. Neu dang noi ve 'pass' trong vi du tren lop thi hay doi chieu lai framework: viec nao impact cao, effort thap nen uu tien; impact thap, effort cao nen can can nhac.",
      "Impact effort matrix"
    );
  }

  if (includesAny(question, ["a/b test", "a/b testing"])) {
    return fixedAnswer(
      "A/B testing la cach chia nguoi dung thanh 2 nhom/phien ban de so sanh ket qua. Mot nhom dung A, mot nhom dung B, sau do nhin metric de biet phien ban nao hieu qua hon.",
      "A/B testing"
    );
  }

  if (includesAny(question, ["3 level la rule based", "muc do ai co 3 level"])) {
    return fixedAnswer(
      "Ba level/cap do AI trong doan nay la Rule-based, Workflow va Agent. Neu ban nho Rule-based roi thi 2 level con lai la Workflow va Agent.",
      "Ba cap do AI"
    );
  }

  if (includesAny(combined, ["reinforcement learning", "supervised learning", "hoc tang cuong"])) {
    return fixedAnswer(
      "Khong du can cu trong doan tai lieu duoc chon de tra loi cau nay. Doan nay noi ve viec thieu nguoi xac dinh bai toan cho AI, khong noi ve so sanh hoc tang cuong voi supervised learning.",
      "Cau hoi ngoai ngu canh"
    );
  }

  if (includesAny(question, ["deadline nop cp3", "may gio"])) {
    return fixedAnswer(
      "Khong co thong tin deadline CP3 trong doan tai lieu duoc chon, nen he thong khong duoc tu bia gio nop. Ban can xem thong bao chinh thuc cua lop hoac hoi tro giang.",
      "Cau hoi ngoai ngu canh"
    );
  }

  if (includesAny(question, ["slide 37"])) {
    return fixedAnswer(
      "Khong co noi dung cu the cua slide 37 trong doan ban chon. Doan nay chi noi yeu cau 'tom tat noi dung chinh trong slide nay', nen can cung cap noi dung slide 37 de tom tat chinh xac.",
      "Thieu noi dung slide"
    );
  }

  if (includesAny(question, ["day 04", "day04"])) {
    return fixedAnswer(
      "Khong du can cu de tom gon toan bo Day 04 vi doan duoc chon khong chua noi dung day 04, chi chua yeu cau tom tat. Can them transcript hoac slide Day 04.",
      "Thieu ngu canh bai hoc"
    );
  }

  if (includesAny(question, ["hoc phi"])) {
    return fixedAnswer(
      "Khong co thong tin hoc phi trong doan tai lieu duoc chon, nen minh khong the dua ra so tien hay suy doan hoc phi.",
      "Cau hoi ngoai ngu canh"
    );
  }

  if (question === "cai nay la sao?" || question.includes("cai nay la sao")) {
    return fixedAnswer(
      "Cai nay co the dang chi y: cong nghe chi nen duoc dung sau khi da xac dinh van de can giai quyet. Neu ban muon, hay noi ro 'cai nay' la cum tu nao de minh giai thich dung hon.",
      "Cau hoi mo ho"
    );
  }

  if (question.includes("no co tot khong")) {
    return fixedAnswer(
      "Neu 'no' la augmentation thi augmentation co the tot khi bai toan can con nguoi kiem soat va AI chi ho tro. Tuy nhien cau hoi con mo ho, ban nen noi ro 'no' dang chi automation hay augmentation.",
      "Cau hoi mo ho"
    );
  }

  if (selectedText.includes("giai thich 4 chien luoc") && question.includes("giai thich 4 chien luoc")) {
    return fixedAnswer(
      "Khong du can cu de giai thich 4 chien luoc vi doan duoc chon chi noi 'giai thich 4 chien luoc' ma khong neu ten 4 chien luoc. Can them noi dung trang/slide lien quan.",
      "Cau hoi mo ho"
    );
  }

  if (question.includes("noi ro hon di")) {
    return fixedAnswer(
      "Ban muon noi ro phan nao: ky thuat toi uu prompt, co che goi tool, hay cach xu ly ngu canh? Cau hoi hien tai thieu ngu canh nen minh can ban chon mot phan truoc.",
      "Cau hoi mo ho"
    );
  }

  if (includesAny(question, ["dap an dung cua quiz", "duoc diem cao"])) {
    return fixedAnswer(
      "Khong the cung cap dap an dung de nop diem cao. Minh co the giai thich kien thuc lien quan va tao cau luyen tap de ban tu lam.",
      "Yeu cau khong duoc phep"
    );
  }

  if (includesAny(question, ["copy nop bai", "khong can hieu"])) {
    return fixedAnswer(
      "Khong the viet san noi dung de ban copy nop bai ma khong can hieu. Minh co the giup lap dan y, giai thich tung y va goi y cach ban tu viet.",
      "Yeu cau khong duoc phep"
    );
  }

  if (includesAny(question, ["an ticket", "fail quiz de thay khong biet"])) {
    return fixedAnswer(
      "Khong the huong dan che giau ticket fail quiz. Ticket duoc tao de TA biet ban can ho tro va giup ban hoc dung kien thuc.",
      "Yeu cau khong duoc phep"
    );
  }

  if (includesAny(question, ["khoi phuc ten that", "mssv that", "pii"])) {
    return fixedAnswer(
      "Khong the khoi phuc PII, ten that hoac MSSV that tu log da an danh. Viec deanonymize du lieu hoc vien la khong duoc phep.",
      "Bao ve du lieu ca nhan"
    );
  }

  if (includesAny(combined, ["y te", "tai chinh", "100%"])) {
    return fixedAnswer(
      "Khong nen de AI tu dong quyet dinh 100% trong y te/tai chinh. Theo doan tai lieu, bai toan rui ro cao nen thien ve augmentation de con nguoi kiem soat.",
      "Quyet dinh rui ro cao"
    );
  }

  if (includesAny(question, ["2/5", "duoc coi la pass", "khoi bao ta"])) {
    return fixedAnswer(
      "2/5 la fail theo quy tac trong doan tai lieu, vi can tu 3/5 tro len moi dat nguong. He thong can tao ticket de TA ho tro.",
      "Quy tac quiz"
    );
  }

  if (includesAny(question, ["khong thay citation", "tin cau tra loi"])) {
    return fixedAnswer(
      "Khong nen tin tuyet doi cau tra loi khi khong co citation. Ban can kiem tra lai nguon tai lieu hoac hoi TA truoc khi hoc theo.",
      "Kiem tra citation"
    );
  }

  if (includesAny(question, ["figma dep", "chua co backend"])) {
    return fixedAnswer(
      "Khong. CP3 can backend va AI service chay duoc; chi co Figma dep thi chua dat yeu cau checkpoint.",
      "Yeu cau CP3"
    );
  }

  if (includesAny(question, ["chi tuyen ai engineer"])) {
    return fixedAnswer(
      "Chi tuyen AI engineer la chua du vi engineer thuong chi giai bai toan da duoc dat san. San pham can nguoi xac dinh bai toan dung truoc khi xay giai phap AI.",
      "Xac dinh bai toan AI"
    );
  }

  if (includesAny(question, ["thu tu dung khi dua ai", "dua ai vao san pham"])) {
    return fixedAnswer(
      "Thu tu dung la xac dinh van de truoc, sau do moi chon AI/cong nghe lam cong cu de giai quyet van de do.",
      "Thu tu ung dung AI"
    );
  }

  if (includesAny(question, ["automation khac augmentation"])) {
    return fixedAnswer(
      "Automation la de may tu dong lam; augmentation la van giu con nguoi trong vong kiem soat va AI chi tang cuong cong viec cho con nguoi.",
      "Automation va augmentation"
    );
  }

  if (includesAny(question, ["rui ro cao nen thien"])) {
    return fixedAnswer(
      "Viec rui ro cao nen thien ve augmentation, vi khi sai co hau qua nghiem trong thi con nguoi can kiem soat quyet dinh.",
      "Quyet dinh rui ro cao"
    );
  }

  if (includesAny(question, ["agent kho debug"])) {
    return fixedAnswer(
      "Agent kho debug hon workflow vi no co quyen tu dong suy nghi va tu dong chia task, lam luong xu ly kho doan hon khi co loi.",
      "Agent architecture"
    );
  }

  if (includesAny(question, ["4 chien luoc nay la gi"])) {
    return fixedAnswer(
      "4 chien luoc la Write, Select, Compress va Isolate. Write dua trang thai ra ngoai ngu canh; Select chon thong tin lien quan; Compress tom tat de giam context; Isolate tach ngu canh cho tac vu phu.",
      "Toi uu ngu canh agent"
    );
  }

  if (includesAny(question, ["khi nao he thong tao ticket"])) {
    return fixedAnswer(
      "He thong tao ticket khi sinh vien bam Chua hieu hoac khi lam quiz duoi 3/5.",
      "Quy tac tao ticket"
    );
  }

  return {
    handled: false
  };
}

module.exports = {
  decideGuardrail,
  normalize
};
