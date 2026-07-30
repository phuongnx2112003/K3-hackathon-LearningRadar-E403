import React from 'react';

const TutorResult = ({ result, onUnderstand, onNotUnderstand, loading }) => {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm p-4 text-center mt-3 bg-white">
        <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
        <h6 className="font-weight-bold text-dark mb-1">AI Tutor đang tra cứu tài liệu & sinh trích dẫn...</h6>
        <small className="text-muted">Đang đối chiếu các đoạn bạn chọn với học liệu liên quan…</small>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="card border-primary border-2 shadow-sm p-3 mt-3 bg-white animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="badge bg-indigo text-white px-2 py-1" style={{ background: '#4f46e5' }}>
          ✨ AI Tutor Response
        </span>
        <small className="text-muted fw-bold">{result.conceptLabel}</small>
      </div>

      {/* Answer Content */}
      <div className="p-3 rounded bg-light border mb-3 text-dark" style={{ whiteSpace: 'pre-line', fontSize: '0.925rem', lineHeight: '1.6' }}>
        {result.answer}
      </div>

      {/* Citation Box */}
      <div className="p-2 mb-3 bg-warning-subtle text-warning-emphasis border border-warning rounded small">
        📌 <strong>Đoạn liên quan</strong>{result.citations?.length ? ` · ${result.citations.length} đoạn` : ''}
        {(result.citations?.length ? result.citations : [result.citation]).filter(Boolean).map((citation, index) => (
          <div className={index ? 'mt-2 pt-2 border-top border-warning' : 'mt-2'} key={`${citation.source || 'citation'}-${index}`}>
            <strong>Trang {citation.page || '?'}</strong>
            <div style={{ whiteSpace: 'pre-line' }}>“{citation.quote || citation}”</div>
          </div>
        ))}
      </div>

      {/* Decision Buttons (Step 6 of CP2) */}
      <div className="border-top pt-3">
        <p className="small text-muted font-weight-bold text-center mb-2">
          Xác nhận mức độ hiểu bài của bạn:
        </p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success flex-grow-1 font-weight-bold shadow-sm d-flex align-items-center justify-content-center gap-1 py-2"
            onClick={onUnderstand}
            disabled={!onUnderstand}
          >
            👍 Đã hiểu (Làm Quiz 5 câu)
          </button>
          <button
            className="btn btn-outline-danger flex-grow-1 font-weight-bold shadow-sm d-flex align-items-center justify-content-center gap-1 py-2"
            onClick={onNotUnderstand}
          >
            👎 Chưa hiểu (Tạo Ticket Lab Coach)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorResult;
