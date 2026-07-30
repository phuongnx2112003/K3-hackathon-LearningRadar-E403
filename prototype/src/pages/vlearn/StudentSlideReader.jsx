import React, { useState } from 'react';
import Widget from '../../components/Widget/Widget';
import { MOCK_SLIDES } from '../../mockData/vlearnMockData';
import { askAiTutor } from '../../services/aiService';

const StudentSlideReader = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorResult, setTutorResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [checkStatus, setCheckStatus] = useState(null);

  const currentSlide = MOCK_SLIDES[activeSlideIndex];

  const handleTextMouseUp = () => {
    const text = window.getSelection().toString().trim();
    if (text && text.length > 5) {
      setSelectedText(text);
    }
  };

  const handleAskTutor = async () => {
    if (!userQuestion.trim()) return;
    setLoading(true);
    setTutorResult(null);
    setCheckStatus(null);
    setSelectedAnswer(null);

    const result = await askAiTutor({
      selectedText,
      userQuestion,
      contextSlide: currentSlide.title
    });

    setTutorResult(result);
    setLoading(false);
  };

  const handleVerifyAnswer = () => {
    if (!tutorResult?.checkQuestion) return;
    if (selectedAnswer === tutorResult.checkQuestion.correctAnswer) {
      setCheckStatus('passed');
    } else {
      setCheckStatus('failed');
    }
  };

  return (
    <div className="student-slide-reader-page">
      {/* Header Info */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="font-weight-bold text-dark mb-1">VLearn Slide Reader & AI Tutor</h3>
          <p className="text-muted mb-0">Chọn/bôi đen khái niệm khó hiểu trên Slide để nhận giải đáp & kiểm tra hiểu thật.</p>
        </div>
        <span className="badge bg-indigo-100 text-indigo-700 px-3 py-2 rounded-pill font-weight-bold" style={{ background: '#e0e7ff', color: '#4338ca' }}>
          🎯 Lát cắt: Sinh viên khoanh vùng text ➔ Hỏi AI ➔ Check Question
        </span>
      </div>

      <div className="row g-4">
        {/* Left Column: Slide Viewer */}
        <div className="col-lg-7">
          <div className="custom-card p-4">
            {/* Toolbar */}
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <div>
                <span className="badge bg-secondary mb-1">{currentSlide.section}</span>
                <h5 className="font-weight-bold mb-0 text-dark">{currentSlide.title}</h5>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                >
                  ← Trước
                </button>
                <span className="small text-muted font-weight-bold">
                  {activeSlideIndex + 1} / {MOCK_SLIDES.length}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={activeSlideIndex === MOCK_SLIDES.length - 1}
                  onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                >
                  Tiếp →
                </button>
              </div>
            </div>

            {/* Slide Content Box */}
            <div className="slide-box p-4" onMouseUp={handleTextMouseUp}>
              {currentSlide.content.map((block) => (
                <p key={block.id} className="slide-paragraph lead mb-3">
                  {block.text}
                </p>
              ))}
            </div>

            {/* Hint alert */}
            <div className="mt-3 p-3 bg-light rounded-3 d-flex align-items-center gap-2 border">
              <span className="fs-5">💡</span>
              <small className="text-muted">
                <strong>Mẹo trải nghiệm:</strong> Dùng chuột bôi đen 1 đoạn văn bản bất kỳ ở khung slide trên để AI Tutor tập trung giải thích đúng vùng đó!
              </small>
            </div>
          </div>
        </div>

        {/* Right Column: AI Tutor Panel */}
        <div className="col-lg-5">
          <div className="ai-tutor-widget p-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <span className="fs-4">🤖</span>
              <div>
                <h5 className="font-weight-bold mb-0">AI Tutor Trợ Giảng</h5>
                <small className="text-muted">Giải đáp & Đánh giá mức độ hiểu</small>
              </div>
            </div>

            {selectedText ? (
              <div className="alert alert-indigo d-flex align-items-center justify-content-between p-2 mb-3" style={{ background: '#e0e7ff', color: '#3730a3', borderRadius: '10px' }}>
                <small className="text-truncate" style={{ maxWidth: '85%' }}>
                  <strong>Đã chọn đoạn:</strong> "{selectedText}"
                </small>
                <button className="btn-close btn-sm" onClick={() => setSelectedText('')}></button>
              </div>
            ) : null}

            {/* Question Input */}
            <div className="mb-3">
              <label className="form-label font-weight-bold small text-muted">Nhập thắc mắc của bạn:</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Ví dụ: Kỹ thuật Dropout khác gì so với L2 Regularization?"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              ></textarea>
            </div>

            <button
              className="btn btn-primary w-100 py-2 font-weight-bold shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', border: 'none' }}
              disabled={loading || !userQuestion.trim()}
              onClick={handleAskTutor}
            >
              {loading ? (
                <span>⚡ AI đang phân tích slide & soạn câu hỏi...</span>
              ) : (
                <span>🚀 Hỏi AI Tutor</span>
              )}
            </button>

            {/* AI Response Card */}
            {tutorResult && (
              <div className="mt-4 p-3 border rounded-3 bg-white shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className={`badge ${tutorResult.isRealAi ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {tutorResult.isRealAi ? 'Gemini 1.5 Flash Real-time' : 'Mock AI Simulator'}
                  </span>
                  <small className="text-muted">VLearn Tutor v2.4</small>
                </div>

                <div className="p-3 bg-light rounded-3 mb-3" style={{ whiteSpace: 'pre-line', fontSize: '0.925rem' }}>
                  {tutorResult.answer}
                </div>

                {/* Check Question Section */}
                {tutorResult.checkQuestion && (
                  <div className="check-question-card mt-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-primary">KIỂM TRA HIỂU THẬT</span>
                      <small className="text-muted">Xác minh xem bạn đã hiểu đúng bản chất chưa</small>
                    </div>

                    <h6 className="font-weight-bold text-dark mb-3">
                      {tutorResult.checkQuestion.question}
                    </h6>

                    <div className="d-flex flex-column gap-2 mb-3">
                      {tutorResult.checkQuestion.options.map((opt, idx) => {
                        const optKey = opt.substring(0, 1);
                        const isSelected = selectedAnswer === optKey;
                        return (
                          <button
                            key={idx}
                            className={`option-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedAnswer(optKey)}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className="btn btn-dark w-100 font-weight-bold"
                      disabled={!selectedAnswer || checkStatus !== null}
                      onClick={handleVerifyAnswer}
                    >
                      Xác nhận đáp án
                    </button>

                    {checkStatus === 'passed' && (
                      <div className="alert alert-success mt-3 mb-0 p-3 rounded-3">
                        🎉 <strong>Chính xác 100%!</strong> Tín hiệu hiểu bài của bạn đã được lưu vào Radar Giảng viên.
                      </div>
                    )}

                    {checkStatus === 'failed' && (
                      <div className="alert alert-danger mt-3 mb-0 p-3 rounded-3">
                        ⚠️ <strong>Chưa chính xác!</strong> Hệ thống đã tự động ghi nhận điểm nhầm lẫn này tới Giảng viên / TA để giải đáp thêm.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSlideReader;
