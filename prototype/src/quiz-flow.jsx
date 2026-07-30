import React, { useEffect, useState } from 'react';
import { getQuiz, submitQuiz } from './api-client';

const QuizFlow = ({ context, onClose, onQuizComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadQuiz() {
      try {
        setLoading(true);
        setError(null);
        const data = await getQuiz(context.conceptId);
        if (active) setQuiz(data);
      } catch (requestError) {
        if (active) setError(requestError.message || 'Không thể tải quiz từ backend.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadQuiz();
    return () => {
      active = false;
    };
  }, [context.conceptId]);

  const handleSelect = (questionId, optionIndex) => {
    if (result) return;
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const submission = await submitQuiz({
        studentId: context.studentId,
        lessonId: context.lessonId,
        conceptId: quiz.conceptId,
        answers: quiz.questions.map((question) => ({
          questionId: question.id,
          selectedIndex: answers[question.id]
        }))
      });
      setResult(submission);
      onQuizComplete?.(submission.score, submission.passed);
    } catch (requestError) {
      setError(requestError.message || 'Không thể nộp quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const totalQuestions = quiz?.questions.length || 5;

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
            {error && quiz && <div className="alert alert-danger">{error}</div>}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-muted mb-0">Đang lấy quiz từ backend...</p>
              </div>
            ) : error && !quiz ? (
              <div className="alert alert-danger mb-0">{error}</div>
            ) : !result ? (
              <div>
                <p className="text-muted small mb-4">
                  Hoàn thành 5 câu hỏi trắc nghiệm bên dưới để kiểm tra mức độ hiểu bài của bạn. Cần đạt tối thiểu <strong>3/5 câu</strong> để vượt qua!
                </p>

                {quiz.questions.map((q) => (
                  <div key={q.id} className="card border-0 shadow-sm mb-3 p-3 bg-white">
                    <h6 className="font-weight-bold text-dark mb-3">{q.question}</h6>
                    <div className="d-flex flex-column gap-2">
                      {q.options.map((opt, idx) => {
                        const isSelected = answers[q.id] === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelect(q.id, idx)}
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
                  {result.passed ? (
                    <div>
                      <div className="fs-1 text-success mb-1">🎉</div>
                      <h4 className="font-weight-bold text-success">XUẤT SẮC! ĐÃ VƯỢT QUA QUIZ</h4>
                      <h5 className="font-weight-bold mb-1">Kết quả: {result.score} / {result.total} câu chính xác</h5>
                      <p className="text-muted small mb-0">
                        Tín hiệu hiểu bài của bạn đã được ghi nhận vào hệ thống VLearn!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="fs-1 text-warning mb-1">💡</div>
                      <h4 className="font-weight-bold text-warning-emphasis">CẦN CỦNG CỐ LẠI KIẾN THỨC</h4>
                      <h5 className="font-weight-bold mb-2">Kết quả: {result.score} / {result.total} câu chính xác</h5>
                      <p className="text-dark small mb-0">
                        LearningRadar đã tạo ticket cho TA, đồng thời AI Tutor tổng hợp <strong>giải thích chi tiết cho các câu trả lời chưa đúng</strong> để bạn ôn lại ngay.
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-muted small mb-0">Điểm số được backend chấm theo ngưỡng đạt {result.passThreshold}/{result.total}.</p>
                {Array.isArray(result.review) && (
                  <div className="mt-3">
                    <h6 className="font-weight-bold text-dark mb-2">Chi tiết đáp án</h6>
                    {result.review.map((item, index) => {
                      const question = quiz.questions.find((candidate) => candidate.id === item.questionId);
                      const selected = question?.options[item.selectedIndex] || 'Chưa chọn';
                      const correct = question?.options[item.correctIndex] || 'Không xác định';

                      return (
                        <div key={item.questionId} className={`small p-2 mb-2 rounded border ${item.correct ? 'border-success bg-success-subtle' : 'border-danger bg-danger-subtle'}`}>
                          <strong>Câu {index + 1}: {item.correct ? 'Đúng' : 'Chưa đúng'}</strong>
                          <div>Bạn chọn: {selected}</div>
                          {!item.correct && <div>Đáp án đúng: {correct}</div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer bg-white border-top d-flex justify-content-between">
            {result && !result.passed ? (
              <button className="btn btn-outline-primary font-weight-bold" onClick={handleRetry}>
                🔄 Làm lại Quiz ngay
              </button>
            ) : <div></div>}

            {!result ? (
              <button
                className="btn btn-primary px-4 font-weight-bold"
                style={{ background: '#4f46e5', border: 'none' }}
                disabled={!quiz || submitting || Object.keys(answers).length < totalQuestions}
                onClick={handleSubmit}
              >
                {submitting ? 'Đang nộp...' : `Nộp bài Quiz (${Object.keys(answers).length}/${totalQuestions} câu)`}
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
