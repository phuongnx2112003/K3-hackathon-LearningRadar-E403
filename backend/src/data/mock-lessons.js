const mockLessons = [
  {
    lessonId: "lesson-01",
    title: "Dropout trong train va inference",
    source: "transcript-01-clean.md",
    content:
      "Dropout la ky thuat regularization. Khi train, mot ty le neuron duoc tat ngau nhien de tranh phu thuoc qua muc. Khi inference, tat ca neuron duoc bat va output duoc can bang theo ty le dropout.",
    defaultQuestion: "Em chua hieu vi sao train thi tat neuron nhung inference lai bat tat ca?"
  },
  {
    lessonId: "lesson-02",
    title: "Problem formulation cho AI product",
    source: "transcript-02-clean.md",
    content:
      "Truoc khi dua AI vao san pham, nhom can xac dinh dung bai toan nguoi dung, tin hieu dau vao, dau ra mong muon va rui ro khi AI tu dong hoa qua muc.",
    defaultQuestion: "Vi sao phai chot bai toan nguoi dung truoc khi chon model AI?"
  }
];

function findLessonById(lessonId) {
  return mockLessons.find((lesson) => lesson.lessonId === lessonId) || mockLessons[0];
}

module.exports = {
  findLessonById,
  mockLessons
};
