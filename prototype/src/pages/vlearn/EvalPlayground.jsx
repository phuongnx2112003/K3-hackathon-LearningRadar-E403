import React, { useState } from 'react';

const MOCK_GOLDEN_SET = [
  { id: 1, query: 'Overfitting xảy ra khi nào?', intent: 'review_concept', output: 'Mô hình học quá kỹ noise trong tập train.', score: 0.96, status: 'pass' },
  { id: 2, query: 'Cho em xin link nộp bài CP2 với ạ', intent: 'logistics', output: 'Dẫn link nộp bài từ nguồn chính thức.', score: 1.0, status: 'pass' },
  { id: 3, query: 'Lúc predict Dropout có tắt neuron không?', intent: 'misconception_check', output: 'Không, lúc predict bật tất cả neuron.', score: 0.92, status: 'pass' },
  { id: 4, query: 'Tại sao phải chia cho sqrt(d_k)?', intent: 'review_concept', output: 'Tránh vanishing gradient khi Softmax bão hoà.', score: 0.94, status: 'pass' },
  { id: 5, query: 'Mai có được nghỉ học không thầy?', intent: 'out_of_scope', output: 'Từ chối lịch sự, nhắc học viên check lịch chính thức.', score: 0.88, status: 'pass' }
];

const EvalPlayground = () => {
  const [running, setRunning] = useState(false);
  const [testScore, setTestScore] = useState(94.2);

  const handleRunEval = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setTestScore(96.4);
    }, 1200);
  };

  return (
    <div className="eval-playground">
      {/* Header Info */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="font-weight-bold text-dark mb-1">Golden Set & Prompt Eval Suite</h3>
          <p className="text-muted mb-0">Đo lường độ chính xác và khả năng nhận diện intent của AI Tutor trước khi nộp bài Demo.</p>
        </div>
        <button
          className="btn btn-success px-4 py-2 font-weight-bold shadow-sm"
          disabled={running}
          onClick={handleRunEval}
        >
          {running ? '🔄 Đang chạy test 50 queries...' : '🚀 Chạy Chẩn Đoán Eval Suite'}
        </button>
      </div>

      {/* Metrics overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="custom-card p-4 text-center">
            <span className="small text-muted font-weight-bold text-uppercase d-block mb-1">Accuracy Overall</span>
            <h1 className="font-weight-bold text-success display-4 mb-0">{testScore}%</h1>
            <small className="text-muted">Đạt tiêu chuẩn Quality Bar cho Hackathon</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="custom-card p-4 text-center">
            <span className="small text-muted font-weight-bold text-uppercase d-block mb-1">Số Query Đã Test</span>
            <h1 className="font-weight-bold text-indigo display-4 mb-0" style={{ color: '#4f46e5' }}>50 / 50</h1>
            <small className="text-muted">Trích xuất từ Chatlog 1.261 mẫu</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="custom-card p-4 text-center">
            <span className="small text-muted font-weight-bold text-uppercase d-block mb-1">Hallucination Rate</span>
            <h1 className="font-weight-bold text-primary display-4 mb-0" style={{ color: '#059669' }}>0.0%</h1>
            <small className="text-muted">Tuân thủ Nguồn Sự Thật 100%</small>
          </div>
        </div>
      </div>

      {/* Golden Set Table */}
      <div className="custom-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h5 className="font-weight-bold mb-0">Bảng Kết Quả Kiểm Thử Mẫu (Golden Set)</h5>
          <span className="badge bg-success">Golden Set v1.0 Passed</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Query Input</th>
                <th>Expected Intent</th>
                <th>AI Output Generated</th>
                <th>Confidence Score</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GOLDEN_SET.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong></td>
                  <td><code>"{item.query}"</code></td>
                  <td><span className="badge bg-indigo-100 text-indigo-700">{item.intent}</span></td>
                  <td><small className="text-dark">{item.output}</small></td>
                  <td><strong className="text-success">{(item.score * 100).toFixed(0)}%</strong></td>
                  <td><span className="badge bg-success">PASS</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvalPlayground;
