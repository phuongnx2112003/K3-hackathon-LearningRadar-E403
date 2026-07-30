import React, { useState } from 'react';
import { MOCK_LESSON, MOCK_AI_RESPONSE, INITIAL_TICKETS } from './mock-data';
import TutorResult from './tutor-result';
import QuizFlow from './quiz-flow';
import TeacherDashboard from './teacher-dashboard';

const StudentFlow = () => {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher'
  const [selectedText, setSelectedText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorResult, setTutorResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [notification, setNotification] = useState(null);

  // Highlighting text handler
  const handleMouseUp = () => {
    const text = window.getSelection().toString().trim();
    if (text && text.length > 5) {
      setSelectedText(text);
    }
  };

  // Step 4: Click Gửi (Send)
  const handleSend = () => {
    if (!questionText.trim() && !selectedText) return;
    setLoading(true);
    setTutorResult(null);

    setTimeout(() => {
      setLoading(false);
      setTutorResult({
        ...MOCK_AI_RESPONSE,
        userQuestion: questionText || 'Giải thích đoạn văn bản này',
        selectedText: selectedText || MOCK_LESSON.paragraphs[1].text
      });
    }, 700);
  };

  // Step 6: User clicks "Đã hiểu" -> Launch Quiz
  const handleUnderstand = () => {
    setShowQuiz(true);
  };

  // Step 6 & 8: User clicks "Chưa hiểu" -> Create Ticket
  const handleNotUnderstand = () => {
    const newTicket = {
      id: `TICKET-${Math.floor(100 + Math.random() * 900)}`,
      studentName: 'Sinh viên ẩn danh (U102)',
      selectedText: selectedText || MOCK_LESSON.paragraphs[1].text,
      question: questionText || 'Chưa hiểu rõ về Dropout lúc Train vs Predict',
      conceptLabel: tutorResult?.conceptLabel || 'Phân biệt Dropout',
      source: 'Bấm "Chưa hiểu"',
      status: 'Mới',
      createdAt: 'Bây giờ'
    };
    setTickets([newTicket, ...tickets]);
    setNotification({
      type: 'warning',
      message: `🔴 Đã tự động tạo Ticket #${newTicket.id} gửi sang Dashboard Giảng viên!`
    });
    setTutorResult(null);
  };

  // Step 7 & 8: Complete Quiz (Pass/Fail)
  const handleQuizComplete = (score, passed) => {
    if (passed) {
      setNotification({
        type: 'success',
        message: `🎉 Chúc mừng bạn đã đạt ${score}/5 câu Quiz! Tín hiệu hiểu bài đã được lưu vào hệ thống VLearn.`
      });
    } else {
      const newTicket = {
        id: `TICKET-${Math.floor(100 + Math.random() * 900)}`,
        studentName: 'Sinh viên ẩn danh (U102)',
        selectedText: selectedText || MOCK_LESSON.paragraphs[1].text,
        question: questionText || 'Fail Quiz kiểm tra hiểu bài',
        conceptLabel: tutorResult?.conceptLabel || 'Phân biệt Dropout',
        source: `Fail Quiz (${score}/5 câu)`,
        status: 'Mới',
        createdAt: 'Bây giờ'
      };
      setTickets([newTicket, ...tickets]);
      setNotification({
        type: 'danger',
        message: `⚠️ Chưa đạt Quiz (${score}/5 câu). Đã tự động tạo Ticket #${newTicket.id} gửi sang Dashboard Giảng viên!`
      });
    }
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="vlearn-app-container min-vh-100 bg-light d-flex flex-column">
      {/* Top Header Bar (Authentic VLearn UI from Screenshot) */}
      <header className="navbar navbar-expand bg-white border-bottom px-3 py-2 shadow-sm sticky-top">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light btn-sm border">‹</button>

          {/* Brand Logo */}
          <div className="d-flex align-items-center gap-2 font-weight-bold text-dark fs-5">
            <span className="text-primary font-weight-bold">V</span>Learn
          </div>

          <div className="vr mx-1"></div>

          {/* Doc Title */}
          <div className="d-flex align-items-center gap-2">
            <span className="fs-5 text-secondary">📄</span>
            <div>
              <div className="font-weight-bold text-dark small mb-0">day01_302.pdf</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>COMP2010 · Lecture_material_ms2039d0_hnxpxy</div>
            </div>
          </div>
        </div>

        {/* Middle Toolbar */}
        <div className="mx-auto d-none d-md-flex align-items-center gap-2 bg-light p-1 rounded-3 border">
          <button className="btn btn-white btn-sm shadow-sm font-weight-bold">📍 Đọc</button>
          <button className="btn btn-light btn-sm text-muted">✏️ Bút</button>
          <button className="btn btn-light btn-sm text-muted">🖍️ Highlight</button>
          <span className="small text-muted border-start ps-2">Trang 5 · 1 note</span>
          <span className="small text-muted border-start ps-2">- 100% +</span>
        </div>

        {/* View Switcher & User Profile */}
        <div className="d-flex align-items-center gap-3">
          <div className="btn-group btn-group-sm">
            <button
              className={`btn font-weight-bold ${activeTab === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('student')}
            >
              📖 Sinh viên (Slide Reader)
            </button>
            <button
              className={`btn font-weight-bold ${activeTab === 'teacher' ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setActiveTab('teacher')}
            >
              📊 Giảng viên (Dashboard {tickets.filter(t => t.status === 'Mới').length > 0 ? `• ${tickets.filter(t => t.status === 'Mới').length}` : ''})
            </button>
          </div>

          <span className="badge bg-light text-dark border">VI</span>
          <span className="badge bg-light text-dark border">🌙</span>
          <div className="d-flex align-items-center gap-1 bg-light border px-2 py-1 rounded-pill small">
            <span>👤</span> <strong className="small">Sinh viên ẩn danh</strong>
          </div>
        </div>
      </header>

      {/* Global Notifications */}
      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show m-3 mb-0 shadow-sm`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
        </div>
      )}

      {/* Main Workspace Body */}
      {activeTab === 'student' ? (
        <div className="d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 'calc(100vh - 60px)' }}>
          {/* Left Sidebar: Học liệu môn học (From Screenshot) */}
          <aside className="bg-white border-end p-3 d-none d-lg-block" style={{ width: '280px' }}>
            <h6 className="font-weight-bold text-dark mb-1">📖 Học liệu môn học</h6>
            <p className="text-muted small mb-3">Chương, slide và tài liệu đã upload</p>

            <div className="d-flex flex-column gap-2">
              {MOCK_LESSON.chapters.map((chap, idx) => (
                <div key={idx} className="border rounded-3 p-2 bg-light">
                  <div className="d-flex align-items-center justify-content-between cursor-pointer">
                    <strong className="small text-dark">▸ {chap.title}</strong>
                    {chap.active && <span className="badge bg-primary rounded-pill" style={{ fontSize: '0.65rem' }}>STUDYING</span>}
                  </div>

                  {chap.docs && chap.docs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-2 rounded mt-1 ms-2 small d-flex align-items-center justify-content-between ${
                        doc.active ? 'bg-white border-start border-primary border-3 shadow-sm font-weight-bold' : 'text-muted'
                      }`}
                    >
                      <span className="text-truncate">📄 {doc.title}</span>
                      <small className="text-muted" style={{ fontSize: '0.65rem' }}>{doc.pages} trang</small>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* Center PDF Slide Canvas */}
          <main className="flex-grow-1 p-4 bg-light overflow-auto">
            <div className="card shadow-sm border-0 p-4 mx-auto bg-white rounded-4" style={{ maxWidth: '850px' }}>
              <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                <span className="badge bg-secondary font-weight-bold">Trang 5 / 83</span>
                <span className="small text-muted font-monospace">Mã tài liệu: {MOCK_LESSON.id}</span>
              </div>

              {/* Text Selection Area (Step 2) */}
              <div className="pdf-slide-canvas p-3" onMouseUp={handleMouseUp}>
                <h4 className="font-weight-bold text-dark mb-3">Slide 5: Overfitting & Regularization trong Deep Learning</h4>

                {MOCK_LESSON.paragraphs.map((p) => (
                  <p key={p.id} className="lead text-dark mb-4 p-2 rounded hover-bg-light position-relative" style={{ lineHeight: '1.8' }}>
                    <span className="badge bg-light text-secondary border me-2 font-monospace" style={{ fontSize: '0.7rem' }}>[{p.code}]</span>
                    {p.text}
                  </p>
                ))}
              </div>

              {selectedText && (
                <div className="alert alert-indigo mt-3 d-flex align-items-center justify-content-between p-2" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                  <small className="text-truncate" style={{ maxWidth: '80%' }}>
                    <strong>Đang chọn:</strong> "{selectedText}"
                  </small>
                  <button className="btn btn-sm btn-primary font-weight-bold" onClick={() => setSelectedText('')}>Xóa chọn</button>
                </div>
              )}
            </div>
          </main>

          {/* Right Panel: AI Tutor Drawer */}
          <aside className="bg-white border-start p-3 overflow-auto" style={{ width: '400px' }}>
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <span className="fs-4">🤖</span>
              <div>
                <h6 className="font-weight-bold text-dark mb-0">AI Tutor Trợ Giảng</h6>
                <small className="text-muted">Trả lời giải đáp + Tạo Citation [Trang N]</small>
              </div>
            </div>

            {/* Input Form (Step 3 & 4) */}
            <div className="mb-3">
              <label className="form-label small text-muted font-weight-bold">Nhập câu hỏi của bạn:</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Ví dụ: Khi predict thì neuron trong Dropout có bị tắt không?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              ></textarea>
            </div>

            <button
              className="btn btn-primary w-100 font-weight-bold py-2 shadow-sm"
              style={{ background: '#4f46e5', border: 'none' }}
              disabled={loading}
              onClick={handleSend}
            >
              {loading ? 'AI đang tạo trích dẫn...' : '🚀 Gửi câu hỏi cho AI Tutor'}
            </button>

            {/* Step 5: AI Answer with Citation */}
            <TutorResult
              loading={loading}
              result={tutorResult}
              onUnderstand={handleUnderstand}
              onNotUnderstand={handleNotUnderstand}
            />
          </aside>
        </div>
      ) : (
        /* Teacher Dashboard Tab */
        <div className="p-4 flex-grow-1">
          <TeacherDashboard tickets={tickets} onUpdateTicketStatus={handleUpdateTicketStatus} />
        </div>
      )}

      {/* Step 7: Quiz Modal */}
      {showQuiz && (
        <QuizFlow
          onClose={() => setShowQuiz(false)}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default StudentFlow;
