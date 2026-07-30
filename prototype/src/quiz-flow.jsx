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

    const isPassed = correctCount >= 4; // Pass threshold: 4/5
    onQuizComplete(correctCount, isPassed);
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
                  Hoàn thành 5 câu hỏi trắc nghiệm bên dưới để kiểm tra mức độ hiểu bài của bạn. Cần đạt tối thiểu <strong>4/5 câu</strong> để vượt qua!
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
              <div className="text-center py-4">
                {score >= 4 ? (
                  <div>
                    <div className="display-1 text-success mb-2">🎉</div>
                    <h3 className="font-weight-bold text-success">XUẤT SẮC! ĐÃ VƯỢT QUA QUIZ</h3>
                    <h4 className="font-weight-bold mb-3">Kết quả: {score} / 5 câu chính xác</h4>
                    <p className="text-muted">
                      Tín hiệu hiểu bài của bạn đã được cập nhật vào hệ thống VLearn LearningRadar!
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="display-1 text-danger mb-2">⚠️</div>
                    <h3 className="font-weight-bold text-danger">CHƯA VƯỢT QUA QUIZ</h3>
                    <h4 className="font-weight-bold mb-3">Kết quả: {score} / 5 câu (Cần $\ge 4$ câu)</h4>
                    <div className="alert alert-danger mx-auto p-3" style={{ maxWidth: 500 }}>
                      🔴 <strong>Đã tự động tạo Ticket gửi đến Giảng viên/TA!</strong> TA sẽ chủ động liên hệ để hỗ trợ giải đáp lại khái niệm này cho bạn.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer bg-white border-top">
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
