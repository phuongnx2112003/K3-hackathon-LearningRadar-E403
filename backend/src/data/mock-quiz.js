const mockQuizByConcept = {
  "concept-dropout-01": {
    conceptId: "concept-dropout-01",
    conceptLabel: "Phan biet Dropout luc train va inference",
    questions: [
      {
        id: "q1",
        question: "Dropout duoc dung chu yeu de lam gi?",
        options: ["Tang overfitting", "Giam overfitting", "Tang kich thuoc data", "Xoa test set"],
        correctIndex: 1
      },
      {
        id: "q2",
        question: "Trong qua trinh train, Dropout lam gi voi mot so neuron?",
        options: ["Tat ngau nhien", "Nhan doi", "Xoa vinh vien", "Chi giu neuron sai"],
        correctIndex: 0
      },
      {
        id: "q3",
        question: "Khi inference, cac neuron thuong o trang thai nao?",
        options: ["Tat tat ca", "Bat tat ca", "Chi bat 10%", "Bi xoa khoi model"],
        correctIndex: 1
      },
      {
        id: "q4",
        question: "Dropout giup han che hien tuong nao?",
        options: ["Co-adaptation", "Compilation", "Pagination", "Authentication"],
        correctIndex: 0
      },
      {
        id: "q5",
        question: "Nguong pass quiz LearningRadar CP3 la bao nhieu cau dung?",
        options: ["1/5", "2/5", "3/5", "5/5"],
        correctIndex: 2
      }
    ]
  }
};

function getQuizByConcept(conceptId = "concept-dropout-01") {
  return mockQuizByConcept[conceptId] || mockQuizByConcept["concept-dropout-01"];
}

function hideCorrectAnswers(quiz) {
  return {
    conceptId: quiz.conceptId,
    conceptLabel: quiz.conceptLabel,
    questions: quiz.questions.map(({ correctIndex, ...question }) => question)
  };
}

module.exports = {
  getQuizByConcept,
  hideCorrectAnswers,
  mockQuizByConcept
};
