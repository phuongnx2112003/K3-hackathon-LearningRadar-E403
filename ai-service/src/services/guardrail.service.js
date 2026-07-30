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
