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

  const getStatusMeta = (st) => {
    if (st === 'open' || st === 'Mới') {
      return {
        label: 'Open (Mới)',
        tone: 'danger',
        selectLabel: 'open (Cần xử lý)'
      };
    }
    if (st === 'reviewed' || st === 'in_progress' || st === 'Đang hỗ trợ') {
      return {
        label: 'Reviewed (Đã xem)',
        tone: 'warning',
        selectLabel: 'reviewed (Đang xem)'
      };
    }
    if (st === 'closed' || st === 'Đã xử lý') {
      return {
        label: 'Closed (Đã xử lý)',
        tone: 'success',
        selectLabel: 'closed (Đã xong)'
      };
    }
    return {
      label: st || 'Không rõ',
      tone: 'secondary',
      selectLabel: st || 'Không rõ'
    };
  };

  const normalizeStatusValue = (st) => {
    const meta = getStatusMeta(st);
    if (meta.tone === 'danger') return 'open';
    if (meta.tone === 'warning') return 'reviewed';
    if (meta.tone === 'success') return 'closed';
    return st || 'open';
  };

  const getReasonMeta = (ticket) => {
    const isQuizFailed = ticket.reason === 'quiz_failed' || (ticket.source && ticket.source.includes('Fail'));
    return {
      label: isQuizFailed
        ? `quiz_failed (${ticket.quizScore !== null && ticket.quizScore !== undefined ? ticket.quizScore : '?'}/5)`
        : 'not_understood',
      title: isQuizFailed ? 'Fail Quiz kiểm tra' : 'Bấm "Chưa hiểu"',
      tone: isQuizFailed ? 'danger' : 'warning'
    };
  };

  const formatDateTime = (value) => {
    if (!value) return 'Chưa có thời gian';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const clipText = (value, maxLength = 130) => {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
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
  const closedCount = summary?.closedTickets ?? tickets.filter(t => t.status === 'closed' || t.status === 'Đã xử lý').length;
  const totalCount = summary?.totalTickets ?? tickets.length;
  const reasonBreakdown = summary?.reasonBreakdown || tickets.reduce((acc, ticket) => {
    const reason = getReasonMeta(ticket).label.startsWith('quiz_failed') ? 'quiz_failed' : 'not_understood';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || filteredTickets[0] || null;

  return (
    <div className="lab-coach-dashboard">
      <header className="lab-coach-header">
        <div>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <h3 className="lab-coach-title mb-0">Dashboard Lab Coach (LearningRadar)</h3>
            <span className={`lab-health-badge ${isBackendLive ? 'is-online' : 'is-local'}`}>
              <span className="lab-health-dot"></span>
              {isBackendLive ? 'Backend API Online' : 'Local Mock Mode'}
            </span>
          </div>
          <p className="lab-coach-subtitle mb-0">
            Quản lý ticket học viên chưa hiểu bài và các điểm nhầm lẫn từ Backend Server.
          </p>
        </div>

        <div className="lab-coach-actions">
          <button className="btn btn-outline-primary fw-bold" onClick={loadDashboardData} disabled={loading}>
            {loading ? 'Đang tải...' : '↻ Làm mới'}
          </button>
          <span className="lab-kpi-pill danger">{openCount} Ticket Cần Xem</span>
          <span className="lab-kpi-pill warning">{reviewedCount} Đang Hỗ Trợ</span>
        </div>
      </header>

      {actionMessage && (
        <div className="alert alert-info py-2 small mb-3" role="status">
          {actionMessage}
        </div>
      )}

      <nav className="lab-ticket-tabs" aria-label="Lọc ticket">
        {[
          { key: 'All', label: 'Tất cả Ticket', count: totalCount, dot: 'primary' },
          { key: 'open', label: 'Open (Cần xử lý)', count: openCount, dot: 'danger' },
          { key: 'reviewed', label: 'Reviewed (Đang xem)', count: reviewedCount, dot: 'warning' },
          { key: 'closed', label: 'Closed (Đã hoàn tất)', count: closedCount, dot: 'success' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`lab-ticket-tab ${filterStatus === tab.key ? 'is-active' : ''}`}
            onClick={() => setFilterStatus(tab.key)}
            type="button"
          >
            <span className={`tab-dot ${tab.dot}`}></span>
            <span>{tab.label}</span>
            <strong>{tab.count}</strong>
          </button>
        ))}
      </nav>

      <section className="lab-summary-grid">
        <div className="lab-summary-card total-card">
          <div className="lab-summary-icon">⌁</div>
          <div>
            <p className="lab-card-label mb-1">Tổng ticket cần theo dõi</p>
            <div className="lab-total-number">{totalCount}</div>
            <p className="small text-muted mb-0">
              Chưa hiểu: <strong className="text-primary">{reasonBreakdown.not_understood || 0}</strong>
              <span className="mx-2">·</span>
              Fail Quiz: <strong className="text-primary">{reasonBreakdown.quiz_failed || 0}</strong>
            </p>
          </div>
        </div>

        <div className="lab-summary-card concepts-card">
          <p className="lab-card-label mb-3">Điểm kiến thức xuất hiện nhiều (Concept Labels)</p>
          <div className="lab-concept-list">
            {Object.keys(conceptCounts).length > 0 ? (
              Object.entries(conceptCounts).map(([concept, count]) => (
                <span className="lab-concept-chip" key={concept}>
                  {concept} · {count} lượt
                </span>
              ))
            ) : (
              <span className="text-muted small">Chưa có dữ liệu thống kê concept</span>
            )}
          </div>
        </div>
      </section>

      <section className="lab-table-card">
        <div className="table-responsive">
          <table className="table lab-ticket-table align-middle mb-0">
            <thead>
              <tr>
                <th>Mã Ticket</th>
                <th>Học viên / Thời gian</th>
                <th>Khái niệm / Lỗi nhầm lẫn</th>
                <th>Lý do tạo Ticket</th>
                <th>Chi tiết Case</th>
                <th>Trạng thái</th>
                <th>Hành động TA</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const statusMeta = getStatusMeta(ticket.status);
                  const reasonMeta = getReasonMeta(ticket);
                  return (
                    <tr
                      key={ticket.id}
                      className={selectedTicket?.id === ticket.id ? 'is-selected' : ''}
                      onClick={() => setSelectedTicketId(ticket.id)}
                    >
                      <td><strong className="ticket-code">{ticket.id}</strong></td>
                      <td>
                        <strong className="d-block text-dark">{ticket.studentName || ticket.studentId || 'Sinh viên ẩn danh'}</strong>
                        <span className="text-muted small">{formatDateTime(ticket.createdAt)}</span>
                      </td>
                      <td>
                        <span className="lab-concept-badge">{ticket.conceptLabel || 'Chưa gắn concept'}</span>
                        <span className="d-block small text-muted mt-2">
                          <strong>Hỏi:</strong> "{clipText(ticket.question, 150)}"
                        </span>
                      </td>
                      <td>
                        <span className={`lab-reason-badge ${reasonMeta.tone}`}>{reasonMeta.label}</span>
                      </td>
                      <td className="small" style={{ minWidth: 220 }}>
                        <div><strong>Lý do:</strong> {reasonMeta.title}</div>
                        {ticket.quizScore !== null && ticket.quizScore !== undefined && (
                          <div><strong>Điểm Quiz:</strong> {ticket.quizScore}/5 câu</div>
                        )}
                        <details className="mt-1" onClick={(event) => event.stopPropagation()}>
                          <summary className="text-primary cursor-pointer">Xem đoạn đã chọn</summary>
                          <span className="text-muted">{ticket.selectedText}</span>
                        </details>
                      </td>
                      <td>
                        <span className={`lab-status-badge ${statusMeta.tone}`}>{statusMeta.label}</span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm lab-status-select"
                          value={normalizeStatusValue(ticket.status)}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) => handleStatusChange(ticket.id, event.target.value)}
                        >
                          <option value="open">open (Cần xử lý)</option>
                          <option value="reviewed">reviewed (Đang xem)</option>
                          <option value="closed">closed (Đã xong)</option>
                        </select>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary w-100 mt-2 fw-bold"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedTicketId(ticket.id);
                          }}
                        >
                          Mở / trả lời
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    {loading ? 'Đang tải dữ liệu từ Backend API...' : 'Không tìm thấy ticket nào phù hợp.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedTicket && (
        <section className="lab-reply-panel">
          <div className="lab-reply-header">
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h4 className="mb-0">Trả lời sinh viên - {selectedTicket.id}</h4>
                <span className={`lab-status-badge ${getStatusMeta(selectedTicket.status).tone}`}>
                  {getStatusMeta(selectedTicket.status).label}
                </span>
              </div>
              <p className="text-muted small mb-0">
                {selectedTicket.studentName || selectedTicket.studentId || 'Sinh viên ẩn danh'} · {formatDateTime(selectedTicket.createdAt)}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-success fw-bold"
              onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
            >
              Đánh dấu đã xử lý
            </button>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="lab-detail-card">
                {selectedTicket.caseSummary?.learningGap && (
                  <div className="lab-case-note">
                    <strong>Điểm học viên chưa hiểu:</strong> {selectedTicket.caseSummary.learningGap}
                    {selectedTicket.caseSummary.summary && <div className="mt-1">{selectedTicket.caseSummary.summary}</div>}
                  </div>
                )}
                <label className="lab-field-label">Câu hỏi của sinh viên</label>
                <p>{selectedTicket.question}</p>
                <label className="lab-field-label">Đoạn sinh viên chọn</label>
                <div className="lab-selected-context">{selectedTicket.selectedText}</div>
                {selectedTicket.caseSummary?.aiExplanation && (
                  <>
                    <label className="lab-field-label mt-3">AI đã giải thích</label>
                    <div className="lab-selected-context">{selectedTicket.caseSummary.aiExplanation}</div>
                  </>
                )}
                {(selectedTicket.caseSummary?.citations || []).length > 0 && (
                  <div className="mt-3 small">
                    <label className="lab-field-label">Nguồn AI đã dùng</label>
                    {selectedTicket.caseSummary.citations.map((citation, index) => (
                      <div className="text-muted" key={`${selectedTicket.id}-citation-${index}`}>
                        Trang {citation.page || '?'}: "{citation.quote || citation.source || 'Tài liệu liên quan'}"
                      </div>
                    ))}
                  </div>
                )}
                {(selectedTicket.conversation || []).length > 1 && (
                  <details className="mt-3 small">
                    <summary className="text-primary cursor-pointer">Xem các lượt hỏi AI trước đó</summary>
                    {selectedTicket.conversation.map((turn, index) => (
                      <div className="border-start ps-2 mt-2" key={`${selectedTicket.id}-turn-${index}`}>
                        <strong>Lượt {index + 1} · Học viên:</strong> {turn.question}
                        <div className="text-muted mt-1"><strong>AI:</strong> {turn.answer || 'Chưa có câu trả lời'}</div>
                      </div>
                    ))}
                  </details>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="lab-detail-card">
                <label className="lab-field-label">Feedback gửi trực tiếp cho sinh viên</label>
                <textarea
                  className="form-control lab-feedback-box"
                  rows="5"
                  maxLength="1000"
                  placeholder="Nhập giải thích ngắn gọn, gợi ý xem lại slide/trích dẫn, hoặc hẹn sinh viên hỏi tiếp..."
                  value={feedbackDrafts[selectedTicket.id] || ''}
                  onChange={(event) => setFeedbackDrafts(prev => ({ ...prev, [selectedTicket.id]: event.target.value }))}
                />
                <div className="d-flex align-items-center justify-content-between gap-2 mt-2">
                  <span className="text-muted small">{(feedbackDrafts[selectedTicket.id] || '').length}/1000</span>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary fw-bold"
                      onClick={() => handleFeedbackSubmit(selectedTicket)}
                    >
                      Gửi phản hồi cho sinh viên
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setActionMessage(`Đã lưu nháp phản hồi cho ticket ${selectedTicket.id}.`)}
                    >
                      Lưu nháp
                    </button>
                  </div>
                </div>

                {(selectedTicket.teacherReplies || []).length > 0 && (
                  <div className="mt-4">
                    <label className="lab-field-label">Lịch sử phản hồi</label>
                    {(selectedTicket.teacherReplies || []).map((reply) => (
                      <div key={reply.id} className="lab-reply-history">
                        <strong>{reply.teacherName || 'Giảng viên/TA'}</strong>
                        <span className="text-muted ms-2">{formatDateTime(reply.createdAt)}</span>
                        <div className="mt-1">{reply.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <details className="lab-materials-panel">
        <summary>Quản lý học liệu PDF ({documents.length})</summary>
        <form className="row g-2 align-items-end mt-3" onSubmit={handleUpload}>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Mã bài học</label>
            <input className="form-control" value={uploadForm.lessonId} onChange={(event) => setUploadForm((form) => ({ ...form, lessonId: event.target.value }))} placeholder="lesson-day-03" />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Tiêu đề hiển thị</label>
            <input className="form-control" value={uploadForm.title} onChange={(event) => setUploadForm((form) => ({ ...form, title: event.target.value }))} placeholder="Bài học hôm nay - RAG" />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">File PDF</label>
            <input className="form-control" type="file" accept="application/pdf,.pdf" onChange={(event) => setUploadForm((form) => ({ ...form, file: event.target.files?.[0] || null }))} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary fw-bold" disabled={uploading} type="submit">{uploading ? 'Đang embedding...' : 'Upload PDF'}</button>
          </div>
        </form>

        <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
          <div className="small fw-bold text-dark">Tài liệu đã upload</div>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={loadDocuments}>Tải lại danh sách</button>
        </div>
        {documents.length === 0 ? (
          <div className="alert alert-light border small mb-0">Chưa có tài liệu nào.</div>
        ) : (
          <div className="list-group">
            {documents.map((document) => (
              <div className="list-group-item d-flex align-items-center justify-content-between gap-3" key={document.id}>
                <div className="small">
                  <strong>{document.title}</strong>
                  <div className="text-muted">{document.originalFilename} · {document.lessonId} · {document.chunkCount} embeddings · {formatDateTime(document.createdAt)}</div>
                </div>
                <div className="d-flex gap-2 flex-shrink-0">
                  <a className="btn btn-sm btn-outline-primary" href={getBackendAssetUrl(`/api/documents/${document.id}/file`)} target="_blank" rel="noreferrer">Xem PDF</a>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDocument(document)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </details>
    </div>
  );
};

export default TeacherDashboard;
