function buildTutorPrompt(payload) {
  return [
    "Ban la AI Tutor cua VLearn.",
    "Hay giai thich ngan gon, dung ngu canh va co citation.",
    `Selected text: ${payload.selectedText || ""}`,
    `Question: ${payload.question || ""}`
  ].join("\n");
}

function buildQuizPrompt(payload) {
  return [
    "Hay tao 5 cau quiz ngan de kiem tra muc do hieu bai.",
    `Concept: ${payload.conceptLabel || payload.conceptId || ""}`,
    `Selected text: ${payload.selectedText || ""}`
  ].join("\n");
}

function buildLabelPrompt(payload) {
  return [
    "Hay gan nhan concept ngan gon cho van de hoc tap.",
    `Selected text: ${payload.selectedText || ""}`,
    `Question: ${payload.question || ""}`
  ].join("\n");
}

module.exports = {
  buildLabelPrompt,
  buildQuizPrompt,
  buildTutorPrompt
};
