import React from 'react';

function renderAnswerWithCitations(answer, citations, onCitationClick) {
  return String(answer || '').split(/(\[\d+\])/g).map((part, index) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (!match) return part;
    const citationIndex = Number(match[1]) - 1;
    const citation = citations[citationIndex];
    if (!citation) return part;
    return (
      <button
        type="button"
        key={`${part}-${index}`}
        className="btn btn-link btn-sm p-0 align-baseline citation-marker"
        onClick={() => onCitationClick?.(citation, citationIndex)}
        title={`Mở ${citation.source || 'tài liệu'} · trang ${citation.page || '?'}`}
      >
        {part}
      </button>
    );
  });
}

const TutorResult = ({ result, onUnderstand, onNotUnderstand, onCitationClick, loading }) => {
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

  const citations = result.citations?.length ? result.citations : [result.citation].filter(Boolean);
  const referencedNumbers = new Set(
    Array.from(String(result.answer || '').matchAll(/\[(\d+)\]/g))
      .map((match) => Number(match[1]))
      .filter((number) => number >= 1 && number <= citations.length)
  );
  // Retrieval can return extra context, but only sources explicitly cited in
  // the answer should be shown as "Đoạn liên quan". Keep all sources as a
  // fallback when an older model response contains no markers.
  const displayedCitations = referencedNumbers.size
    ? citations.map((citation, index) => ({ citation, number: index + 1 })).filter(({ number }) => referencedNumbers.has(number))
    : citations.map((citation, index) => ({ citation, number: index + 1 }));
  const citationNumberMap = new Map(displayedCitations.map(({ number }, index) => [number, index + 1]));
  const answerWithRenumberedCitations = String(result.answer || '').replace(/\[(\d+)\]/g, (marker, number) => {
    const nextNumber = citationNumberMap.get(Number(number));
    return nextNumber ? `[${nextNumber}]` : marker;
  });
  const displayedCitationValues = displayedCitations.map(({ citation }) => citation);

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
        {renderAnswerWithCitations(answerWithRenumberedCitations, displayedCitationValues, onCitationClick)}
      </div>

      {/* Citation Box */}
      <div className="p-2 mb-3 bg-warning-subtle text-warning-emphasis border border-warning rounded small">
        📌 <strong>Đoạn liên quan</strong>{displayedCitations.length ? ` · ${displayedCitations.length} đoạn` : ''}
        {displayedCitations.map(({ citation, number }, index) => (
          <button
            type="button"
            className={`citation-card-button text-start w-100 border-0 bg-transparent p-0 ${index ? 'mt-2 pt-2 border-top border-warning' : 'mt-2'}`}
            key={`${citation.source || 'citation'}-${index}`}
            onClick={() => onCitationClick?.(citation, index)}
            title="Mở đúng trang tài liệu"
          >
            <strong>[{index + 1}] · Trang {citation.page || '?'}</strong>
            <div style={{ whiteSpace: 'pre-line' }}>“{citation.quote || citation}”</div>
          </button>
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
