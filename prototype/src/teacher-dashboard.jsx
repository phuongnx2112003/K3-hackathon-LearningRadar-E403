import React, { useState, useEffect } from 'react';
import { deleteLessonPdf, getBackendAssetUrl, getDashboardTickets, getDocuments, sendTicketFeedback, updateTicketStatus, uploadLessonPdf } from './api-client';

const TeacherDashboard = ({ tickets: initialTickets = [], onUpdateTicketStatus }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [tickets, setTickets] = useState(initialTickets);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [actionMessage, setActionMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ lessonId: `lesson-${new Date().toISOString().slice(0, 10)}`, title: '', file: null });
  const [documents, setDocuments] = useState([]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!uploadForm.lessonId.trim() || !uploadForm.title.trim() || !uploadForm.file) {
      setActionMessage('Nhập mã bài học, tiêu đề và chọn file PDF trước khi upload.');
      return;
    }
    if (!/\.pdf$/i.test(uploadForm.file.name)) {
      setActionMessage('Chỉ hỗ trợ file PDF.');
      return;
    }
    setUploading(true);
    setActionMessage('Đang upload, trích xuất nội dung và tạo embedding vào SQLite…');
    try {
      const data = await uploadLessonPdf({ ...uploadForm, uploadedBy: 'Lab Coach' });
      setActionMessage(`Đã sẵn sàng cho học viên: ${data.document.title} (${data.document.chunkCount} đoạn đã embedding).`);
      await loadDocuments();
      setUploadForm({ lessonId: `lesson-${new Date().toISOString().slice(0, 10)}`, title: '', file: null });
      event.target.reset();
    } catch (error) {
      setActionMessage(`Upload chưa hoàn tất: ${error.message}`);
    } finally { setUploading(false); }
  };

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
    } catch (error) { setActionMessage(`Không tải được danh sách học liệu: ${error.message}`); }
  };

  const handleDeleteDocument = async (document) => {
    if (!window.confirm(`Xóa “${document.title}”? PDF và ${document.chunkCount} embedding sẽ bị xóa vĩnh viễn.`)) return;
    try {
      const result = await deleteLessonPdf(document.id);
      setDocuments((items) => items.filter((item) => item.id !== document.id));
      setActionMessage(`Đã xóa ${document.title} và ${result.deletedChunks} embedding.`);
    } catch (error) { setActionMessage(`Không thể xóa tài liệu: ${error.message}`); }
  };

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

  useEffect(() => { loadDocuments(); }, []);

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
      setActionMessage('Hãy nhập nội dung feedback trước khi gửi.');
      return;
    }

    const localReply = {
      id: `local-reply-${Date.now()}`,
      teacherName: 'Giảng viên/TA',
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
      setActionMessage(`Đã gửi phản hồi cho sinh viên ở ticket ${ticket.id}.`);
    } catch (err) {
      setActionMessage(`Không gửi được feedback: ${err.message}`);
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

      <section className="border rounded-3 p-3 mb-4" style={{ background: '#f8faff' }}>
        <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
          <div>
            <h5 className="mb-1">📤 Học liệu PDF cho bài học</h5>
            <p className="small text-muted mb-0">PDF sẽ được trích xuất, chia đoạn và embedding vào SQLite local trong project. Học viên sẽ thấy tài liệu mới trong danh sách bài học.</p>
          </div>
          <span className="badge bg-primary">Role: lapcoach</span>
        </div>
        <form className="row g-2 align-items-end" onSubmit={handleUpload}>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Mã bài học</label>
            <input className="form-control" value={uploadForm.lessonId} onChange={(e) => setUploadForm((form) => ({ ...form, lessonId: e.target.value }))} placeholder="lesson-day-03" />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Tiêu đề hiển thị</label>
            <input className="form-control" value={uploadForm.title} onChange={(e) => setUploadForm((form) => ({ ...form, title: e.target.value }))} placeholder="Bài học hôm nay — RAG" />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">File PDF (tối đa 25 MB)</label>
            <input className="form-control" type="file" accept="application/pdf,.pdf" onChange={(e) => setUploadForm((form) => ({ ...form, file: e.target.files?.[0] || null }))} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary fw-bold" disabled={uploading} type="submit">{uploading ? 'Đang embedding…' : 'Upload PDF'}</button>
          </div>
        </form>
        <div className="mt-3 pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="small fw-bold text-dark">📚 Tài liệu đã upload ({documents.length})</div>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={loadDocuments}>↻ Tải lại danh sách</button>
          </div>
          {documents.length === 0 ? <div className="alert alert-light border small mb-0">Chưa có tài liệu nào. Sau khi upload thành công, PDF sẽ xuất hiện ở đây để bạn xem hoặc xóa.</div> : (
            <div className="list-group">
              {documents.map((document) => (
                <div className="list-group-item d-flex align-items-center justify-content-between gap-3" key={document.id}>
                  <div className="small"><strong>📄 {document.title}</strong><div className="text-muted">{document.originalFilename} · {document.lessonId} · {document.chunkCount} embeddings · {new Date(document.createdAt).toLocaleString('vi-VN')}</div></div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <a className="btn btn-sm btn-outline-primary" href={getBackendAssetUrl(`/api/documents/${document.id}/file`)} target="_blank" rel="noreferrer">👁️ Xem PDF</a>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDocument(document)}>🗑️ Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
                      Mở / trả lời
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
              <h5 className="mb-1 text-dark">Trả lời sinh viên - {selectedTicket.id}</h5>
              <div className="small text-muted">
                {selectedTicket.studentName || selectedTicket.studentId || 'Sinh viên ẩn danh'} · {selectedTicket.createdAt}
              </div>
            </div>
            <div>{getStatusBadge(selectedTicket.status)}</div>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="bg-white border rounded-3 p-3 h-100">
                <div className="small text-muted fw-bold mb-1">Câu hỏi của sinh viên</div>
                <p className="mb-2">{selectedTicket.question}</p>
                <div className="small text-muted fw-bold mb-1">Đoạn sinh viên chọn</div>
                <div className="small text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedTicket.selectedText}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-white border rounded-3 p-3 h-100">
                <label className="form-label small text-muted fw-bold">
                  Feedback gửi trực tiếp cho sinh viên
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Nhập giải thích ngắn gọn, gợi ý xem lại slide/trích dẫn, hoặc hẹn sinh viên hỏi tiếp..."
                  value={feedbackDrafts[selectedTicket.id] || ''}
                  onChange={(e) => setFeedbackDrafts(prev => ({ ...prev, [selectedTicket.id]: e.target.value }))}
                />
                <div className="d-flex gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm fw-bold"
                    onClick={() => handleFeedbackSubmit(selectedTicket)}
                  >
                    Gửi phản hồi cho sinh viên
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                  >
                    Đánh dấu đã xử lý
                  </button>
                </div>

                {(selectedTicket.teacherReplies || []).length > 0 && (
                  <div className="mt-3">
                    <div className="small text-muted fw-bold mb-2">Lịch sử phản hồi</div>
                    {(selectedTicket.teacherReplies || []).map((reply) => (
                      <div key={reply.id} className="border rounded-3 p-2 mb-2 small bg-light">
                        <strong>{reply.teacherName || 'Giảng viên/TA'}</strong>
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
