import React, { useState } from 'react';
import { MOCK_QUIZ } from './mock-data';

const QuizFlow = ({ onClose, onQuizComplete }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionId, optionKey) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: optionKey });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    MOCK_QUIZ.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    setScore(correctCount);
    setSubmitted(true);

    const isPassed = correctCount >= 3; // Policy: đạt từ 3/5 trở lên
    if (onQuizComplete) {
      onQuizComplete(correctCount, isPassed);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content shadow-lg border-0 rounded-4">
          <div className="modal-header bg-dark text-white rounded-top-4">
            <h5 className="modal-title font-weight-bold d-flex align-items-center gap-2">
              📝 Quiz Kiểm Tra Hiểu Thật (5 câu hỏi)
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 bg-light">
            {!submitted ? (
              <div>
                <p className="text-muted small mb-4">
                  Hoàn thành 5 câu hỏi trắc nghiệm bên dưới để kiểm tra mức độ hiểu bài của bạn. Cần đạt tối thiểu <strong>3/5 câu</strong> để vượt qua!
                </p>

                {MOCK_QUIZ.map((q) => (
                  <div key={q.id} className="card border-0 shadow-sm mb-3 p-3 bg-white">
                    <h6 className="font-weight-bold text-dark mb-3">{q.question}</h6>
                    <div className="d-flex flex-column gap-2">
                      {q.options.map((opt, idx) => {
                        const optKey = opt.substring(0, 1);
                        const isSelected = answers[q.id] === optKey;
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelect(q.id, optKey)}
                            className={`p-3 rounded border text-start cursor-pointer transition-all ${
                              isSelected ? 'bg-indigo text-white border-primary font-weight-bold' : 'bg-light hover-bg-gray'
                            }`}
                            style={{
                              background: isSelected ? '#4f46e5' : '#f8fafc',
                              color: isSelected ? '#ffffff' : '#1e293b',
                              cursor: 'pointer'
                            }}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {/* Result Summary Header */}
                <div className="text-center py-3 mb-4 bg-white rounded-4 border p-3 shadow-sm">
                  {score >= 3 ? (
                    <div>
                      <div className="fs-1 text-success mb-1">🎉</div>
                      <h4 className="font-weight-bold text-success">XUẤT SẮC! ĐÃ VƯỢT QUA QUIZ</h4>
                      <h5 className="font-weight-bold mb-1">Kết quả: {score} / 5 câu chính xác</h5>
                      <p className="text-muted small mb-0">
                        Tín hiệu hiểu bài của bạn đã được ghi nhận vào hệ thống VLearn!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="fs-1 text-warning mb-1">💡</div>
                      <h4 className="font-weight-bold text-warning-emphasis">CẦN CỦNG CỐ LẠI KIẾN THỨC</h4>
                      <h5 className="font-weight-bold mb-2">Kết quả: {score} / 5 câu chính xác</h5>
                      <p className="text-dark small mb-0">
                        LearningRadar đã tạo ticket cho TA, đồng thời AI Tutor tổng hợp <strong>giải thích chi tiết cho các câu trả lời chưa đúng</strong> để bạn ôn lại ngay.
                      </p>
                    </div>
                  )}
                </div>

                {/* Detailed Review Breakdown for Wrong Answers */}
                <h6 className="font-weight-bold text-dark mb-3">🔍 Chi Tiết Phân Tích & Giải Thích Lại Từ AI Tutor:</h6>

                {MOCK_QUIZ.map((q) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`card border-0 shadow-sm mb-3 p-3 bg-white border-start border-4 ${
                        isCorrect ? 'border-success' : 'border-danger'
                      }`}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <strong className="text-dark">{q.question}</strong>
                        <span className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'}`}>
                          {isCorrect ? 'ĐÚNG' : 'CHƯA CHÍNH XÁC'}
                        </span>
                      </div>

                      <div className="small mb-2">
                        <span>Lựa chọn của bạn: </span>
                        <strong className={isCorrect ? 'text-success' : 'text-danger'}>
                          {userAnswer || 'Chưa chọn'}
                        </strong>
                        {!isCorrect && (
                          <span className="ms-3 text-success font-weight-bold">
                            ➔ Đáp án đúng: {q.correctAnswer}
                          </span>
                        )}
                      </div>

                      {/* AI Re-explanation for wrong answers */}
                      {!isCorrect && (
                        <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-3 border border-warning small mt-2">
                          <strong className="d-block mb-1">💡 AI Tutor Giải Thích Lại:</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="modal-footer bg-white border-top d-flex justify-content-between">
            {submitted && score < 3 ? (
              <button className="btn btn-outline-primary font-weight-bold" onClick={handleRetry}>
                🔄 Làm lại Quiz ngay
              </button>
            ) : <div></div>}

            {!submitted ? (
              <button
                className="btn btn-primary px-4 font-weight-bold"
                style={{ background: '#4f46e5', border: 'none' }}
                disabled={Object.keys(answers).length < 5}
                onClick={handleSubmit}
              >
                Nộp bài Quiz ({Object.keys(answers).length}/5 câu)
              </button>
            ) : (
              <button className="btn btn-dark px-4 font-weight-bold" onClick={onClose}>
                Đóng & Quay lại Bài học
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizFlow;
