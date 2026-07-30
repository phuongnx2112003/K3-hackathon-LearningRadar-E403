import React from 'react';
import { MOCK_MISCONCEPTIONS, MOCK_STATS, MOCK_STUDENT_FEEDBACK_LOGS } from '../../mockData/vlearnMockData';

const TeacherRadarDashboard = () => {
  return (
    <div className="teacher-radar-dashboard">
      {/* Header Info */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="font-weight-bold text-dark mb-1">LearningRadar — Teacher & TA Dashboard</h3>
          <p className="text-muted mb-0">Bản đồ tổng hợp lỗ hổng kiến thức & tín hiệu chưa hiểu bài của sinh viên theo thời gian thực.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm font-weight-bold" onClick={() => alert("Xuất báo cáo CSV thành công!")}>
            📥 Export CSV Report
          </button>
          <button className="btn btn-primary btn-sm font-weight-bold" onClick={() => alert("Đã gửi thông báo tới TA hỗ trợ nhóm 18 sinh viên!")}>
            📢 Gửi Tín Hiệu Cho TA
          </button>
        </div>
      </div>

      {/* 4 Premium Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="custom-card stat-card-gradient-1 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-white-50 text-uppercase font-weight-bold">Tổng lượt hỏi</span>
              <div className="stat-icon-wrapper">💬</div>
            </div>
            <h2 className="font-weight-bold mb-1">{MOCK_STATS.totalQuestions}</h2>
            <small className="text-white-50">Từ {MOCK_STATS.totalStudents} sinh viên (Data Mining)</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="custom-card stat-card-gradient-2 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-white-50 text-uppercase font-weight-bold">Lỗi nhầm lẫn phát hiện</span>
              <div className="stat-icon-wrapper">⚠️</div>
            </div>
            <h2 className="font-weight-bold mb-1">{MOCK_STATS.misconceptionsIdentified}</h2>
            <small className="text-white-50">Cần giải đáp ngay trong buổi học</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="custom-card stat-card-gradient-3 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-white-50 text-uppercase font-weight-bold">Đạt Check Question</span>
              <div className="stat-icon-wrapper">🎯</div>
            </div>
            <h2 className="font-weight-bold mb-1">{MOCK_STATS.understandingCheckPassRate}</h2>
            <div className="progress mt-2" style={{ height: 6, background: 'rgba(255,255,255,0.3)' }}>
              <div className="progress-bar bg-white" style={{ width: '64.2%' }}></div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="custom-card stat-card-gradient-4 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-white-50 text-uppercase font-weight-bold">Slide vướng nhất</span>
              <div className="stat-icon-wrapper">🔥</div>
            </div>
            <h6 className="font-weight-bold mb-1 text-truncate" style={{ fontSize: '0.95rem' }}>{MOCK_STATS.topConfusedSlide}</h6>
            <small className="text-white-50">48 lượt hỏi chưa đạt yêu cầu</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Misconceptions Table */}
        <div className="col-lg-8">
          <div className="custom-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 className="font-weight-bold mb-0">Bản Đồ Radar Lỗ Hổng Kiến Thức Phát Hiện</h5>
                <small className="text-muted">Phân tích từ hội thoại Student-Tutor & kết quả Check Question</small>
              </div>
              <span className="badge bg-primary rounded-pill">Top 3 Lỗ Hổng Báo Động</span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Chủ đề nhầm lẫn</th>
                    <th>Mức độ</th>
                    <th>Số SV vướng</th>
                    <th>Đề xuất hành động cho GV</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_MISCONCEPTIONS.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong className="text-dark d-block mb-1">{item.topic}</strong>
                        <small className="text-muted">{item.description}</small>
                      </td>
                      <td>
                        <span className={`badge ${item.severity === 'high' ? 'bg-danger' : item.severity === 'medium' ? 'bg-warning text-dark' : 'bg-info'}`}>
                          {item.severity.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-danger fs-6">{item.impactedStudents}</span> sv
                      </td>
                      <td>
                        <small className="text-dark font-weight-bold">{item.recommendedAction}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feedback Ticker */}
        <div className="col-lg-4">
          <div className="custom-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h5 className="font-weight-bold mb-0">Live Student Signals</h5>
              <span className="live-pulse"></span>
            </div>

            <div className="d-flex flex-column gap-3">
              {MOCK_STUDENT_FEEDBACK_LOGS.map((log) => (
                <div key={log.id} className="p-3 rounded-3 bg-light border">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <strong className="text-dark small">{log.studentName}</strong>
                    <span className={`badge ${log.status === 'passed' ? 'bg-success' : 'bg-danger'}`}>
                      {log.status === 'passed' ? 'HIỂU BÀI' : 'NHẦM LẪN'}
                    </span>
                  </div>
                  <small className="text-muted d-block mb-2">{log.slideTitle} • {log.timestamp}</small>
                  
                  <div className="p-2 bg-white rounded border small">
                    <div className="text-truncate"><strong>Hỏi:</strong> "{log.question}"</div>
                    <div><strong>Đáp Check Q:</strong> <span className={log.status === 'failed' ? 'text-danger font-weight-bold' : 'text-success font-weight-bold'}>"{log.studentAnswer}"</span></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-outline-primary w-100 mt-3 font-weight-bold btn-sm">
              Xem toàn bộ 1.261 log mining
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRadarDashboard;
