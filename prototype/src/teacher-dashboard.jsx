import React, { useState, useEffect } from 'react';
import { getDashboardTickets, sendTicketFeedback, updateTicketStatus } from './api-client';

const TeacherDashboard = ({ tickets: initialTickets = [], onUpdateTicketStatus }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [tickets, setTickets] = useState(initialTickets);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [actionMessage, setActionMessage] = useState('');

  // Load tickets from Backend API
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardTickets(filterStatus === 'All' ? null : filterStatus);
      if (data && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        setSummary(data.summary);
        setIsBackendLive(true);
      }
    } catch (err) {
      console.warn('Dashboard fetch error (using fallback props):', err.message);
      setIsBackendLive(false);
      setTickets(initialTickets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [filterStatus, initialTickets]);

  // Handle status update
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      if (isBackendLive) {
        const data = await updateTicketStatus(ticketId, newStatus);
        if (data?.ticket && onUpdateTicketStatus) {
          onUpdateTicketStatus(ticketId, data.ticket.status, data.ticket);
        }
        await loadDashboardData();
      } else {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      console.error('Error updating status:', err.message);
    }

    if (onUpdateTicketStatus && !isBackendLive) {
      onUpdateTicketStatus(ticketId, newStatus);
    }
  };

  const applyTicketUpdate = (ticketId, updatedTicket) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...updatedTicket } : t));
    if (onUpdateTicketStatus) {
      onUpdateTicketStatus(ticketId, updatedTicket.status, updatedTicket);
    }
  };

  const handleFeedbackSubmit = async (ticket) => {
    const message = (feedbackDrafts[ticket.id] || '').trim();
    if (!message) {
      setActionMessage('Hay nhap noi dung feedback truoc khi gui.');
      return;
    }

    const localReply = {
      id: `local-reply-${Date.now()}`,
      teacherName: 'Giang vien/TA',
      message,
      createdAt: new Date().toISOString()
    };

    try {
      if (isBackendLive) {
        const data = await sendTicketFeedback(ticket.id, message, 'reviewed');
        if (data?.ticket) {
          applyTicketUpdate(ticket.id, data.ticket);
        }
        await loadDashboardData();
      } else {
        applyTicketUpdate(ticket.id, {
          ...ticket,
          status: ticket.status === 'open' ? 'reviewed' : ticket.status,
          teacherFeedback: message,
          lastFeedbackAt: localReply.createdAt,
          teacherReplies: [...(ticket.teacherReplies || []), localReply]
        });
      }

      setFeedbackDrafts(prev => ({ ...prev, [ticket.id]: '' }));
      setActionMessage(`Da gui phan hoi cho sinh vien o ticket ${ticket.id}.`);
    } catch (err) {
      setActionMessage(`Khong gui duoc feedback: ${err.message}`);
    }
  };

  // Status mapping & badge helper
  const getStatusBadge = (st) => {
    switch (st) {
      case 'open':
      case 'Mới':
        return <span className="badge bg-danger">🔴 Open (Mới)</span>;
      case 'reviewed':
      case 'in_progress':
      case 'Đang hỗ trợ':
        return <span className="badge bg-warning text-dark">🟡 Reviewed (Đã xem)</span>;
      case 'closed':
      case 'Đã xử lý':
        return <span className="badge bg-success">🟢 Closed (Đã xử lý)</span>;
      default:
        return <span className="badge bg-secondary">{st}</span>;
    }
  };

  // Filtered tickets fallback for local
  const filteredTickets = tickets.filter(t => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'open') return t.status === 'open' || t.status === 'Mới';
    if (filterStatus === 'reviewed') return t.status === 'reviewed' || t.status === 'in_progress' || t.status === 'Đang hỗ trợ';
    if (filterStatus === 'closed') return t.status === 'closed' || t.status === 'Đã xử lý';
    return t.status === filterStatus;
  });

  // Calculate concept counts for summary if not provided by backend summary
  const conceptCounts = summary?.topConcepts
    ? summary.topConcepts.reduce((acc, cur) => { acc[cur.conceptLabel] = cur.count; return acc; }, {})
    : tickets.reduce((counts, ticket) => {
        counts[ticket.conceptLabel] = (counts[ticket.conceptLabel] || 0) + 1;
        return counts;
      }, {});

  const openCount = summary?.openTickets ?? tickets.filter(t => t.status === 'open' || t.status === 'Mới').length;
  const reviewedCount = summary?.reviewedTickets ?? tickets.filter(t => t.status === 'reviewed' || t.status === 'in_progress' || t.status === 'Đang hỗ trợ').length;
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || filteredTickets[0] || null;

  return (
    <div className="p-4 bg-white rounded-4 shadow-sm border">
      {/* Header Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="font-weight-bold text-dark mb-0">📊 Dashboard Lab Coach (LearningRadar)</h4>
            <span className={`badge ${isBackendLive ? 'bg-success-subtle text-success border border-success' : 'bg-secondary-subtle text-secondary border'}`} style={{ fontSize: '0.75rem' }}>
              {isBackendLive ? '⚡ Backend API Online' : '🏠 Local Mock Mode'}
            </span>
          </div>
          <p className="text-muted mb-0 small">Quản lý Ticket học viên chưa hiểu bài & các điểm nhầm lẫn (Concept Labels) từ Backend Server.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-primary btn-sm font-weight-bold" onClick={loadDashboardData} disabled={loading}>
            {loading ? '🔄 Đang tải...' : '🔄 Làm mới'}
          </button>
          <span className="badge bg-danger fs-6 px-3 py-2">
            🚨 {openCount} Ticket Cần Xem
          </span>
          <span className="badge bg-warning text-dark fs-6 px-3 py-2">
            ⏳ {reviewedCount} Đang Hỗ Trợ
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-3">
        {[
          { key: 'All', label: 'Tất cả Ticket' },
          { key: 'open', label: '🔴 Open (Cần xử lý)' },
          { key: 'reviewed', label: '🟡 Reviewed (Đang xem)' },
          { key: 'closed', label: '🟢 Closed (Đã hoàn tất)' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm font-weight-bold ${filterStatus === tab.key ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilterStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {actionMessage && (
        <div className="alert alert-info py-2 small" role="status">
          {actionMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="border rounded-3 p-3 bg-light h-100">
            <div className="small text-muted font-weight-bold">Tổng ticket cần theo dõi</div>
            <div className="display-6 fw-bold text-dark">{summary?.totalTickets ?? tickets.length}</div>
            {summary?.reasonBreakdown && (
              <div className="small text-muted mt-2">
                <span>Chưa hiểu: <strong>{summary.reasonBreakdown.not_understood || 0}</strong></span> · 
                <span className="ms-2">Fail Quiz: <strong>{summary.reasonBreakdown.quiz_failed || 0}</strong></span>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-8">
          <div className="border rounded-3 p-3 h-100">
            <div className="small text-muted font-weight-bold mb-2">Điểm kiến thức xuất hiện nhiều (Concept Labels)</div>
            <div className="d-flex flex-wrap gap-2">
              {Object.keys(conceptCounts).length > 0 ? (
                Object.entries(conceptCounts).map(([concept, count]) => (
                  <span className="badge bg-indigo text-white p-2" style={{ background: '#4f46e5' }} key={concept}>
                    {concept}: {count} lượt
                  </span>
                ))
              ) : (
                <span className="text-muted small">Chưa có dữ liệu thống kê concept</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Mã Ticket</th>
              <th>Học viên / Thời gian</th>
              <th>Khái niệm / Lỗi nhầm lẫn (Concept)</th>
              <th>Lý do tạo Ticket</th>
              <th>Chi tiết Case</th>
              <th>Trạng thái</th>
              <th>Hành động TA</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  className={selectedTicketId === t.id ? 'table-primary' : ''}
                  onClick={() => setSelectedTicketId(t.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong className="font-monospace text-primary">{t.id}</strong></td>
                  <td>
                    <strong className="text-dark d-block">{t.studentName || t.studentId || 'Sinh viên ẩn danh'}</strong>
                    <small className="text-muted">{t.createdAt}</small>
                  </td>
                  <td>
                    <span className="badge bg-indigo text-white mb-1" style={{ background: '#4f46e5' }}>
                      {t.conceptLabel}
                    </span>
                    <small className="d-block text-muted"><strong>Hỏi:</strong> "{t.question}"</small>
                  </td>
                  <td>
                    <span className={`badge ${t.reason === 'quiz_failed' || (t.source && t.source.includes('Fail')) ? 'bg-danger-subtle text-danger border border-danger' : 'bg-warning-subtle text-warning-emphasis border border-warning'}`}>
                      {t.reason === 'quiz_failed' ? `quiz_failed (${t.quizScore !== null && t.quizScore !== undefined ? t.quizScore : '?'}/5)` : 'not_understood'}
                    </span>
                  </td>
                  <td className="small" style={{ minWidth: '200px' }}>
                    <div><strong>Lý do:</strong> {t.reason === 'quiz_failed' ? 'Fail Quiz kiểm tra' : 'Bấm "Chưa hiểu"'}</div>
                    {t.quizScore !== null && t.quizScore !== undefined && <div><strong>Điểm Quiz:</strong> {t.quizScore}/5 câu</div>}
                    <details className="mt-1">
                      <summary className="text-primary cursor-pointer">Xem đoạn đã chọn</summary>
                      <span className="text-muted">{t.selectedText}</span>
                    </details>
                  </td>
                  <td>{getStatusBadge(t.status)}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={t.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    >
                      <option value="open">open (Cần xử lý)</option>
                      <option value="reviewed">reviewed (Đang xem)</option>
                      <option value="closed">closed (Đã xong)</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary w-100 mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicketId(t.id);
                      }}
                    >
                      Mo / tra loi
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  {loading ? 'Đang tải dữ liệu từ Backend API...' : 'Không tìm thấy Ticket nào phù hợp.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <div className="border rounded-3 p-3 mt-3 bg-light">
          <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
            <div>
              <h5 className="mb-1 text-dark">Tra loi sinh vien - {selectedTicket.id}</h5>
              <div className="small text-muted">
                {selectedTicket.studentName || selectedTicket.studentId || 'Sinh vien an danh'} · {selectedTicket.createdAt}
              </div>
            </div>
            <div>{getStatusBadge(selectedTicket.status)}</div>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="bg-white border rounded-3 p-3 h-100">
                <div className="small text-muted fw-bold mb-1">Cau hoi cua sinh vien</div>
                <p className="mb-2">{selectedTicket.question}</p>
                <div className="small text-muted fw-bold mb-1">Doan sinh vien chon</div>
                <div className="small text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedTicket.selectedText}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-white border rounded-3 p-3 h-100">
                <label className="form-label small text-muted fw-bold">
                  Feedback gui truc tiep cho sinh vien
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Nhap giai thich ngan gon, goi y xem lai slide/trich dan, hoac hen sinh vien hoi tiep..."
                  value={feedbackDrafts[selectedTicket.id] || ''}
                  onChange={(e) => setFeedbackDrafts(prev => ({ ...prev, [selectedTicket.id]: e.target.value }))}
                />
                <div className="d-flex gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm fw-bold"
                    onClick={() => handleFeedbackSubmit(selectedTicket)}
                  >
                    Gui phan hoi cho sinh vien
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                  >
                    Danh dau da xu ly
                  </button>
                </div>

                {(selectedTicket.teacherReplies || []).length > 0 && (
                  <div className="mt-3">
                    <div className="small text-muted fw-bold mb-2">Lich su phan hoi</div>
                    {(selectedTicket.teacherReplies || []).map((reply) => (
                      <div key={reply.id} className="border rounded-3 p-2 mb-2 small bg-light">
                        <strong>{reply.teacherName || 'Giang vien/TA'}</strong>
                        <span className="text-muted ms-2">{reply.createdAt}</span>
                        <div className="mt-1">{reply.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
