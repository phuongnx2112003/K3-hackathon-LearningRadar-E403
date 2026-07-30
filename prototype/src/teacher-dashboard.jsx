import React, { useState } from 'react';

const TeacherDashboard = ({ tickets, onUpdateTicketStatus }) => {
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredTickets = tickets.filter(t => filterStatus === 'All' || t.status === filterStatus);

  return (
    <div className="p-4 bg-white rounded-4 shadow-sm border">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h4 className="font-weight-bold text-dark mb-1">📊 Dashboard Giảng Viên & TA (LearningRadar)</h4>
          <p className="text-muted mb-0">Quản lý Ticket học viên chưa hiểu bài & các điểm nhầm lẫn cần giải đáp.</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-danger fs-6 px-3 py-2">
            🚨 {tickets.filter(t => t.status === 'Mới').length} Ticket Mới
          </span>
          <span className="badge bg-warning text-dark fs-6 px-3 py-2">
            ⏳ {tickets.filter(t => t.status === 'Đang hỗ trợ').length} Đang hỗ trợ
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-3">
        {['All', 'Mới', 'Đang hỗ trợ', 'Đã xử lý'].map((st) => (
          <button
            key={st}
            className={`btn btn-sm font-weight-bold ${filterStatus === st ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilterStatus(st)}
          >
            {st === 'All' ? 'Tất cả Ticket' : st}
          </button>
        ))}
      </div>

      {/* Ticket List Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Mã Ticket</th>
              <th>Học viên</th>
              <th>Khái niệm / Lỗi nhầm lẫn</th>
              <th>Nguồn tạo Ticket</th>
              <th>Trạng thái</th>
              <th>Hành động TA</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id}>
                <td><strong className="font-monospace text-primary">{t.id}</strong></td>
                <td>
                  <strong className="text-dark d-block">{t.studentName}</strong>
                  <small className="text-muted">{t.createdAt}</small>
                </td>
                <td>
                  <span className="badge bg-indigo text-white mb-1" style={{ background: '#4f46e5' }}>
                    {t.conceptLabel}
                  </span>
                  <small className="d-block text-muted"><strong>Hỏi:</strong> "{t.question}"</small>
                </td>
                <td>
                  <span className={`badge ${t.source.includes('Fail') ? 'bg-danger-subtle text-danger border border-danger' : 'bg-warning-subtle text-warning-emphasis border border-warning'}`}>
                    {t.source}
                  </span>
                </td>
                <td>
                  <span className={`badge ${t.status === 'Mới' ? 'bg-danger' : t.status === 'Đang hỗ trợ' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <select
                      className="form-select form-select-sm"
                      value={t.status}
                      onChange={(e) => onUpdateTicketStatus(t.id, e.target.value)}
                    >
                      <option value="Mới">Mới</option>
                      <option value="Đang hỗ trợ">Đang hỗ trợ</option>
                      <option value="Đã xử lý">Đã xử lý</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;
