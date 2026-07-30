import React, { useState, useRef, useEffect } from 'react';
import { MOCK_LESSON, INITIAL_TICKETS } from './mock-data';
import TutorResult from './tutor-result';
import QuizFlow from './quiz-flow';
import TeacherDashboard from './teacher-dashboard';
import { askTutor } from './api-client';

const StudentFlow = ({ onSubmitQuestion }) => {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher'
  const [toolMode, setToolMode] = useState('read'); // 'read' | 'pen' | 'highlight'
  const [selectedText, setSelectedText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorResult, setTutorResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [notification, setNotification] = useState(null);

  const createTicket = ({ reason, quizScore = null }) => {
    const newTicket = {
      id: `TICKET-${103 + tickets.length}`,
      studentName: 'Sinh viên ẩn danh (U102)',
      selectedText: selectedText || MOCK_LESSON.paragraphs[1].text,
      question: questionText || 'Chưa hiểu rõ về Dropout lúc Train vs Predict',
      conceptLabel: tutorResult?.conceptLabel || 'Phân biệt Dropout lúc Train vs Inference',
      reason,
      quizScore,
      source: reason === 'not_understood' ? 'Bấm "Chưa hiểu"' : `Fail Quiz (${quizScore}/5 câu)`,
      status: 'Mới',
      createdAt: 'Bây giờ'
    };

    setTickets((currentTickets) => [newTicket, ...currentTickets]);
    return newTicket;
  };

  // Exact Highlighted Text List
  const [highlightedSnippets, setHighlightedSnippets] = useState([]);

  // Canvas Freehand Drawing State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [hasDrawings, setHasDrawings] = useState(false);

  // Adjust canvas size to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  }, [toolMode]);

  // Canvas Drawing Handlers
  const startDrawing = (e) => {
    if (toolMode !== 'pen') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setPrevPos({ x, y });
  };

  const draw = (e) => {
    if (!isDrawing || toolMode !== 'pen') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = '#ef4444'; // Red pen color
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setPrevPos({ x, y });
    setHasDrawings(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Exact Text Selection Handler for Highlight Mode & Read Mode
  const handleTextMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text && text.length > 2) {
      setSelectedText(text);

      if (toolMode === 'highlight') {
        if (!highlightedSnippets.includes(text)) {
          setHighlightedSnippets(prev => [...prev, text]);
        }
        setQuestionText(`Giải thích đoạn trích highlight: "${text}"`);
      }
    }
  };

  // Clear drawings and highlights
  const handleClearAnnotations = () => {
    setHighlightedSnippets([]);
    setSelectedText('');
    setQuestionText('');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawings(false);
  };

  // Step 4: Click Gửi (Send)
  const handleSend = async () => {
    if (!questionText.trim() || !selectedText.trim()) {
      setNotification({
        type: 'warning',
        message: 'Hãy chọn/dán đoạn tài liệu và nhập câu hỏi trước khi gửi AI Tutor.'
      });
      return;
    }
    setLoading(true);
    setTutorResult(null);

    try {
      const response = await askTutor({
        lessonId: 'lesson-01',
        studentId: 'student-demo-01',
        selectedText,
        question: questionText
      });
      setTutorResult(response);
    } catch (error) {
      setNotification({
        type: 'danger',
        message: error.message || 'Không thể nhận câu trả lời từ backend. Hãy thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Validate input and forward the request to the shared handler.
  const handleSubmitQuestion = () => {
    const payload = {
      selectedText: selectedText.trim(),
      question: questionText.trim(),
      lessonId: 'lesson-01'
    };

    if (!payload.selectedText) {
      setNotification({
        type: 'warning',
        message: 'Hãy chọn hoặc dán đoạn tài liệu cần hỏi trước khi gửi AI Tutor.'
      });
      return;
    }

    if (!payload.question) {
      setNotification({
        type: 'warning',
        message: 'Hãy nhập câu hỏi trước khi gửi AI Tutor.'
      });
      return;
    }

    if (!onSubmitQuestion) {
      handleSend();
      return;
    }

    setLoading(true);
    setTutorResult(null);

    Promise.resolve(onSubmitQuestion(payload))
      .then((result) => {
        if (result) {
          setTutorResult({
            ...result,
            userQuestion: payload.question,
            selectedText: payload.selectedText
          });
          return;
        }

        setTutorResult({
          ...MOCK_AI_RESPONSE,
          userQuestion: payload.question,
          selectedText: payload.selectedText
        });
      })
      .catch((error) => {
        setNotification({
          type: 'danger',
          message: error.message || 'Không thể gửi câu hỏi. Vui lòng thử lại.'
        });
      })
      .finally(() => setLoading(false));
  };

  // Step 6: User clicks "Đã hiểu" -> Launch Quiz
  const handleUnderstand = () => {
    setShowQuiz(true);
  };

  // Step 6 & 8: User clicks "Chưa hiểu" -> Create Ticket
  const handleNotUnderstand = () => {
    const newTicket = createTicket({ reason: 'not_understood' });
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
      const newTicket = createTicket({ reason: 'quiz_failed', quizScore: score });
      setNotification({
        type: 'danger',
        message: `⚠️ Bạn đạt ${score}/5 câu. Đã tạo Ticket #${newTicket.id} để TA hỗ trợ; bạn vẫn có thể xem giải thích và làm lại quiz.`
      });
    }
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
  };

  // Render paragraph with exact highlighted snippet spans
  const renderParagraphText = (text) => {
    if (highlightedSnippets.length === 0) return text;

    let parts = [text];
    highlightedSnippets.forEach((snippet) => {
      let newParts = [];
      parts.forEach((part) => {
        if (typeof part === 'string' && part.includes(snippet)) {
          const splitArr = part.split(snippet);
          splitArr.forEach((sub, idx) => {
            newParts.push(sub);
            if (idx < splitArr.length - 1) {
              newParts.push(
                <mark
                  key={`${snippet}-${idx}`}
                  style={{
                    background: '#fef08a',
                    color: '#854d0e',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)'
                  }}
                >
                  {snippet}
                </mark>
              );
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  };

  return (
    <div className="vlearn-app-container min-vh-100 bg-light d-flex flex-column">
      {/* Top Header Bar */}
      <header className="navbar navbar-expand bg-white border-bottom px-3 py-2 shadow-sm sticky-top">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light btn-sm border">‹</button>

          <div className="d-flex align-items-center gap-2 font-weight-bold text-dark fs-5">
            <span className="text-primary font-weight-bold">V</span>Learn
          </div>

          <div className="vr mx-1"></div>

          <div className="d-flex align-items-center gap-2">
            <span className="fs-5 text-secondary">📄</span>
            <div>
              <div className="font-weight-bold text-dark small mb-0">day01_302.pdf</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>COMP2010 · Lecture_material_ms2039d0_hnxpxy</div>
            </div>
          </div>
        </div>

        {/* Middle Interactive Toolbar */}
        <div className="mx-auto d-none d-md-flex align-items-center gap-1 bg-light p-1 rounded-3 border">
          <button
            className={`btn btn-sm px-3 font-weight-bold transition-all ${
              toolMode === 'read' ? 'bg-white shadow-sm text-dark rounded-3' : 'text-secondary border-0'
            }`}
            onClick={() => setToolMode('read')}
          >
            📍 Đọc
          </button>
          
          <button
            className={`btn btn-sm px-3 font-weight-bold transition-all ${
              toolMode === 'pen' ? 'bg-secondary-subtle border border-secondary text-dark rounded-3 shadow-sm' : 'text-secondary border-0'
            }`}
            style={toolMode === 'pen' ? { background: '#e2e8f0', color: '#0f172a' } : {}}
            onClick={() => setToolMode('pen')}
          >
            ✏️ Bút
          </button>

          <button
            className={`btn btn-sm px-3 font-weight-bold transition-all ${
              toolMode === 'highlight' ? 'bg-warning-subtle border border-warning text-warning-emphasis rounded-3 shadow-sm' : 'text-secondary border-0'
            }`}
            style={toolMode === 'highlight' ? { background: '#fef08a', color: '#854d0e' } : {}}
            onClick={() => setToolMode('highlight')}
          >
            🖍️ Highlight
          </button>

          <span className="small text-muted border-start ps-2">Trang 5 · 1 note</span>
          <span className="small text-muted border-start ps-2 me-2">- 100% +</span>

          {(highlightedSnippets.length > 0 || hasDrawings) && (
            <button
              className="btn btn-outline-danger btn-sm border-0 py-0 font-weight-bold"
              onClick={handleClearAnnotations}
            >
              🗑️ Xóa
            </button>
          )}
        </div>

        {/* View Switcher & User Profile */}
        <div className="d-flex align-items-center gap-3">
          <div className="btn-group btn-group-sm text-nowrap">
            <button
              className={`btn font-weight-bold text-nowrap ${activeTab === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setActiveTab('student')}
            >
              📖 Sinh viên (Slide Reader)
            </button>
            <button
              className={`btn font-weight-bold text-nowrap ${activeTab === 'teacher' ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setActiveTab('teacher')}
            >
              📊 Giảng viên {tickets.filter(t => t.status === 'Mới').length > 0 ? `(${tickets.filter(t => t.status === 'Mới').length})` : ''}
            </button>
          </div>

          <span className="badge bg-light text-dark border">VI</span>
          <span className="badge bg-light text-dark border">🌙</span>
          <div className="d-flex align-items-center gap-1 bg-light border px-2 py-1 rounded-pill small">
            <span>👤</span> <strong className="small">Sinh viên ẩn danh</strong>
          </div>
        </div>
      </header>

      {/* Mode Banners */}
      {toolMode === 'pen' && (
        <div className="bg-secondary-subtle text-dark py-1 text-center small font-weight-bold border-bottom">
          ✏️ CHẾ ĐỘ BÚT VẼ TỰ DO: Dùng chuột kéo rê để vẽ/khoanh vùng tự do lên trang slide!
        </div>
      )}
      {toolMode === 'highlight' && (
        <div className="bg-warning-subtle text-warning-emphasis py-1 text-center small font-weight-bold border-bottom">
          🖍️ CHẾ ĐỘ HIGHLIGHT CHÍNH XÁC: Bôi đen đúng từ/cụm từ cần tô vàng & hỏi AI Tutor!
        </div>
      )}

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
          {/* Left Sidebar */}
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
          <main className="flex-grow-1 p-4 bg-light overflow-auto position-relative">
            <div className="card shadow-sm border-0 p-4 mx-auto bg-white rounded-4 position-relative" style={{ maxWidth: '850px' }}>
              
              {/* HTML5 Canvas overlay for Freehand Pen Drawing */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  pointerEvents: toolMode === 'pen' ? 'auto' : 'none',
                  zIndex: toolMode === 'pen' ? 10 : 1,
                  cursor: toolMode === 'pen' ? 'crosshair' : 'default'
                }}
              />

              <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom position-relative" style={{ zIndex: 2 }}>
                <span className="badge bg-secondary font-weight-bold">Trang 5 / 83</span>
                <span className="small text-muted font-monospace">Mã tài liệu: {MOCK_LESSON.id}</span>
              </div>

              {/* Text Area */}
              <div
                className="pdf-slide-canvas p-3 position-relative"
                onMouseUp={handleTextMouseUp}
                style={{ zIndex: 2 }}
              >
                <h4 className="font-weight-bold text-dark mb-3">Slide 5: Overfitting & Regularization trong Deep Learning</h4>

                {MOCK_LESSON.paragraphs.map((p) => (
                  <p key={p.id} className="lead text-dark mb-4 p-2 rounded hover-bg-light" style={{ lineHeight: '1.8' }}>
                    <span className="badge bg-light text-secondary border me-2 font-monospace" style={{ fontSize: '0.7rem' }}>[{p.code}]</span>
                    {renderParagraphText(p.text)}
                  </p>
                ))}
              </div>

              {selectedText && (
                <div className="alert alert-indigo mt-3 d-flex align-items-center justify-content-between p-2 position-relative" style={{ background: '#e0e7ff', color: '#3730a3', zIndex: 2 }}>
                  <small className="text-truncate" style={{ maxWidth: '80%' }}>
                    <strong>Đoạn trích chọn:</strong> "{selectedText}"
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

            {/* Input Form */}
            <div className="mb-3">
              <label className="form-label small text-muted font-weight-bold">Đoạn tài liệu cần hỏi:</label>
              <textarea
                className="form-control mb-3"
                rows="3"
                placeholder="Bôi đen đoạn slide bên trái hoặc dán đoạn kiến thức vào đây."
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
              />
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
              onClick={handleSubmitQuestion}
            >
              {loading ? 'AI đang tạo trích dẫn...' : '🚀 Gửi câu hỏi cho AI Tutor'}
            </button>

            {/* AI Answer with Citation */}
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

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizFlow
          context={{
            lessonId: 'lesson-01',
            studentId: 'student-demo-01',
            conceptId: tutorResult?.conceptId || 'concept-dropout-01'
          }}
          onClose={() => setShowQuiz(false)}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default StudentFlow;
