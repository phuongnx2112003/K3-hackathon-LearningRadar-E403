import React, { useState, useRef, useEffect } from 'react';
import { MOCK_LESSON, INITIAL_TICKETS } from './mock-data';
import TutorResult from './tutor-result';
import QuizFlow from './quiz-flow';
import TeacherDashboard from './teacher-dashboard';
import {
  askTutor,
  createTicket as createTicketApi,
  getBackendAssetUrl,
  getLessons,
  getSlidePageImageUrl,
  recognizeSlideRegion
} from './api-client';

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
  const [dataLessons, setDataLessons] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState('lesson-01');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectionSource, setSelectionSource] = useState('');

  const activeDataLesson = dataLessons.find((lesson) => lesson.lessonId === activeLessonId) || dataLessons[0];
  const lessonView = activeDataLesson
    ? {
        id: activeDataLesson.slideFile || activeDataLesson.source,
        courseName: 'VLearn · Hackathon learning data',
        title: activeDataLesson.title,
        totalPages: activeDataLesson.paragraphs?.length || 1,
        currentPage: currentPageIndex + 1,
        source: activeDataLesson.source,
        slideUrl: getBackendAssetUrl(activeDataLesson.slideUrl),
        chapters: [
          {
            title: 'Data thật từ vlearn-pack',
            active: true,
            docs: dataLessons.map((lesson) => ({
              id: lesson.lessonId,
              title: lesson.title,
              pages: lesson.paragraphs?.length || 1,
              active: lesson.lessonId === activeLessonId
            }))
          }
        ],
        paragraphs: activeDataLesson.paragraphs?.length ? activeDataLesson.paragraphs : MOCK_LESSON.paragraphs
      }
    : MOCK_LESSON;

  const totalSlidePages = lessonView.paragraphs?.length || 1;
  const safePageIndex = Math.min(currentPageIndex, totalSlidePages - 1);
  const activeSlideParagraph = lessonView.paragraphs?.[safePageIndex] || lessonView.paragraphs?.[0] || {
    code: 'P-001',
    text: ''
  };

  useEffect(() => {
    let active = true;

    async function loadLessons() {
      try {
        const data = await getLessons();
        if (!active) return;

        const lessons = Array.isArray(data.lessons) ? data.lessons : [];
        setDataLessons(lessons);
        if (lessons[0]?.lessonId) {
          setActiveLessonId(lessons[0].lessonId);
          setCurrentPageIndex(0);
          setSelectedText(lessons[0].paragraphs?.[0]?.text || '');
          setSelectionSource('Đang dùng đoạn mở đầu của tài liệu.');
          setQuestionText(lessons[0].defaultQuestion || '');
        }
      } catch (error) {
        setNotification({
          type: 'warning',
          message: `Không tải được slide/transcript từ backend, đang dùng mock local: ${error.message}`
        });
      }
    }

    loadLessons();

    return () => {
      active = false;
    };
  }, []);

  const createTicket = async ({ reason, quizScore = null }) => {
    const payload = {
      studentId: 'student-demo-01',
      lessonId: tutorResult?.lessonId || activeDataLesson?.lessonId || 'lesson-01',
      selectedText: selectedText || tutorResult?.selectedText || lessonView.paragraphs[0]?.text || MOCK_LESSON.paragraphs[1].text,
      question: questionText || tutorResult?.question || 'Chưa hiểu rõ về Dropout lúc Train vs Predict',
      conceptLabel: tutorResult?.conceptLabel || 'Phân biệt Dropout lúc Train vs Inference',
      reason,
      quizScore
    };

    try {
      const response = await createTicketApi(payload);
      const backendTicket = response.ticket;
      setTickets((currentTickets) => [
        backendTicket,
        ...currentTickets.filter((ticket) => ticket.id !== backendTicket.id)
      ]);
      return backendTicket;
    } catch (error) {
      const fallbackTicket = {
        id: `local-ticket-${Date.now()}`,
        studentName: 'Sinh viên ẩn danh (U102)',
        ...payload,
        source: reason === 'not_understood' ? 'Bấm "Chưa hiểu"' : `Fail Quiz (${quizScore}/5 câu)`,
        status: 'open',
        createdAt: new Date().toISOString()
      };

      setTickets((currentTickets) => [fallbackTicket, ...currentTickets]);
      setNotification({
        type: 'warning',
        message: `Backend ticket API đang lỗi nên tạm lưu local ticket: ${error.message}`
      });
      return fallbackTicket;
    }
  };

  // Exact Highlighted Text List
  const [highlightedSnippets, setHighlightedSnippets] = useState([]);

  // Canvas Freehand Drawing State
  const canvasRef = useRef(null);
  const drawingStartRef = useRef(null);
  const drawingBoundsRef = useRef(null);
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
  }, [toolMode, safePageIndex, activeLessonId]);

  const useCurrentSlideAsContext = (source, defaultQuestion) => {
    const context = activeSlideParagraph.text || selectedText.trim();
    if (!context) return;

    setSelectedText(context);
    setSelectionSource(source);
    if (!questionText.trim()) {
      setQuestionText(defaultQuestion);
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e) => {
    if (toolMode !== 'pen' && toolMode !== 'highlight') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    drawingStartRef.current = { x, y };
    drawingBoundsRef.current = { minX: x, minY: y, maxX: x, maxY: y };
    setPrevPos({ x, y });
  };

  const draw = (e) => {
    if (!isDrawing || (toolMode !== 'pen' && toolMode !== 'highlight')) return;
    if (toolMode === 'highlight') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const bounds = drawingBoundsRef.current;
    if (bounds) {
      bounds.minX = Math.min(bounds.minX, x);
      bounds.minY = Math.min(bounds.minY, y);
      bounds.maxX = Math.max(bounds.maxX, x);
      bounds.maxY = Math.max(bounds.maxY, y);
    }

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setPrevPos({ x, y });
    setHasDrawings(true);
  };

  const applySelectedText = (text, options = {}) => {
    const cleanText = String(text || '').trim();
    if (cleanText.length < 2) return;

    setSelectedText(cleanText);
    setSelectionSource(options.source || 'Đã lấy đoạn text từ transcript.');

    if (options.highlight) {
      setHighlightedSnippets((current) => (
        current.includes(cleanText) ? current : [...current, cleanText]
      ));
      setQuestionText(`Giải thích đoạn trích highlight: "${cleanText}"`);
      return;
    }

    if (!questionText.trim()) {
      setQuestionText('Giải thích đoạn kiến thức này giúp em.');
    }
  };

  const normalizeCanvasBox = (box, canvas) => {
    if (!box || !canvas) return null;
    const x = Math.max(0, Math.min(box.x, canvas.width));
    const y = Math.max(0, Math.min(box.y, canvas.height));
    const width = Math.max(0, Math.min(box.width, canvas.width - x));
    const height = Math.max(0, Math.min(box.height, canvas.height - y));

    if (width < 8 || height < 8) return null;

    return {
      x: x / canvas.width,
      y: y / canvas.height,
      width: width / canvas.width,
      height: height / canvas.height
    };
  };

  const recognizeCurrentRegion = async (box, source, defaultQuestion) => {
    const canvas = canvasRef.current;
    const bbox = normalizeCanvasBox(box, canvas);

    if (!bbox || !activeDataLesson?.slideFile) {
      useCurrentSlideAsContext(source, defaultQuestion);
      return;
    }

    try {
      const result = await recognizeSlideRegion({
        lessonId: activeDataLesson?.lessonId || 'lesson-01',
        slideFile: activeDataLesson.slideFile,
        page: safePageIndex + 1,
        bbox
      });

      const regionText = result.selectedText?.trim();
      if (regionText) {
        setSelectedText(regionText);
        setSelectionSource(`${source} Nhận diện ${result.matchedBlocks?.length || 0} block trong vùng khoanh.`);
        if (!questionText.trim()) {
          setQuestionText(defaultQuestion);
        }
        return;
      }
    } catch (error) {
      setNotification({
        type: 'warning',
        message: `Chưa nhận diện được vùng khoanh, đang dùng context của cả slide: ${error.message}`
      });
    }

    useCurrentSlideAsContext(source, defaultQuestion);
  };

  const stopDrawing = async (e) => {
    if (isDrawing && toolMode === 'pen') {
      const bounds = drawingBoundsRef.current;
      const box = bounds
        ? {
            x: bounds.minX,
            y: bounds.minY,
            width: bounds.maxX - bounds.minX,
            height: bounds.maxY - bounds.minY
          }
        : null;

      await recognizeCurrentRegion(
        box,
        `Đã khoanh bằng bút đỏ trên slide ${safePageIndex + 1}; AI dùng nội dung slide này làm ngữ cảnh.`,
        'Giải thích phần em vừa khoanh trong slide này.'
      );
      setIsDrawing(false);
      return;
    }

    if (isDrawing && toolMode === 'highlight') {
      const canvas = canvasRef.current;
      const start = drawingStartRef.current;

      if (canvas && start && e) {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        const x = Math.min(start.x, endX);
        const y = Math.min(start.y, endY);
        const width = Math.abs(endX - start.x);
        const height = Math.abs(endY - start.y);

        if (width > 8 && height > 8) {
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
          ctx.strokeStyle = 'rgba(202, 138, 4, 0.7)';
          ctx.lineWidth = 2;
          ctx.fillRect(x, y, width, height);
          ctx.strokeRect(x, y, width, height);
          setHasDrawings(true);
        }
      }

      await recognizeCurrentRegion(
        canvas && start && e
          ? {
              x: Math.min(start.x, e.clientX - canvas.getBoundingClientRect().left),
              y: Math.min(start.y, e.clientY - canvas.getBoundingClientRect().top),
              width: Math.abs(e.clientX - canvas.getBoundingClientRect().left - start.x),
              height: Math.abs(e.clientY - canvas.getBoundingClientRect().top - start.y)
            }
          : null,
        `Đã highlight trực tiếp trên slide ${safePageIndex + 1}; AI dùng nội dung slide này làm ngữ cảnh.`,
        'Giải thích phần em vừa highlight trong slide này.'
      );
      setIsDrawing(false);
      return;
    }

    if (isDrawing && toolMode === 'pen') {
      const drawingContext = selectedText.trim() || activeSlideParagraph.text || '';
      if (drawingContext) {
        setSelectedText(drawingContext);
        setSelectionSource('Vùng khoanh bằng bút: dùng đoạn transcript đang mở làm ngữ cảnh hỏi AI.');
        if (!questionText.trim()) {
          setQuestionText('Giải thích phần em vừa khoanh trong slide này.');
        }
      }
    }
    setIsDrawing(false);
  };

  // Exact Text Selection Handler for Highlight Mode & Read Mode
  const handleTextMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text && text.length > 2) {
      applySelectedText(text, {
        highlight: toolMode === 'highlight',
        source: toolMode === 'highlight'
          ? 'Đã highlight đoạn text trong transcript.'
          : 'Đã bôi đen đoạn text trong transcript.'
      });
      return;
    }
  };

  // Clear drawings and highlights
  const handleClearAnnotations = () => {
    setHighlightedSnippets([]);
    drawingStartRef.current = null;
    setSelectedText('');
    setSelectionSource('');
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
        lessonId: activeDataLesson?.lessonId || 'lesson-01',
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
      lessonId: activeDataLesson?.lessonId || 'lesson-01'
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
  const handleNotUnderstand = async () => {
    const newTicket = await createTicket({ reason: 'not_understood' });
    setNotification({
      type: 'warning',
      message: `Đã tạo Ticket #${newTicket.id} gửi sang Dashboard Giảng viên.`
    });
    setTutorResult(null);
  };

  // Step 7 & 8: Complete Quiz (Pass/Fail)
  const handleQuizComplete = async (score, passed) => {
    if (passed) {
      setNotification({
        type: 'success',
        message: `Chúc mừng, bạn đã đạt ${score}/5 câu Quiz. Tín hiệu hiểu bài đã được ghi nhận.`
      });
    } else {
      const newTicket = await createTicket({ reason: 'quiz_failed', quizScore: score });
      setNotification({
        type: 'danger',
        message: `Bạn đạt ${score}/5 câu. Đã tạo Ticket #${newTicket.id} để TA hỗ trợ.`
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

          <span className="small text-muted border-start ps-2">Trang {safePageIndex + 1} · {totalSlidePages} slide</span>
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
              {lessonView.chapters.map((chap, idx) => (
                <div key={idx} className="border rounded-3 p-2 bg-light">
                  <div className="d-flex align-items-center justify-content-between cursor-pointer">
                    <strong className="small text-dark">▸ {chap.title}</strong>
                    {chap.active && <span className="badge bg-primary rounded-pill" style={{ fontSize: '0.65rem' }}>STUDYING</span>}
                  </div>

                  {chap.docs && chap.docs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setActiveLessonId(doc.id);
                        const nextLesson = dataLessons.find((lesson) => lesson.lessonId === doc.id);
                        if (nextLesson) {
                          setSelectedText(nextLesson.paragraphs?.[0]?.text || '');
                          setCurrentPageIndex(0);
                          setSelectionSource('Đang dùng đoạn mở đầu của tài liệu.');
                          setQuestionText(nextLesson.defaultQuestion || '');
                          setTutorResult(null);
                          setShowQuiz(false);
                        }
                      }}
                      className={`p-2 rounded mt-1 ms-2 small d-flex align-items-center justify-content-between ${
                        doc.active ? 'bg-white border-start border-primary border-3 shadow-sm font-weight-bold' : 'text-muted'
                      }`}
                      style={{ cursor: 'pointer' }}
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
              <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom position-relative" style={{ zIndex: 2 }}>
                <span className="badge bg-secondary font-weight-bold">Tài liệu thật từ data</span>
                <span className="small text-muted font-monospace">Mã tài liệu: {lessonView.id}</span>
              </div>

              {/* Text Area */}
              <div
                className="pdf-slide-canvas p-3 position-relative"
                onMouseUp={handleTextMouseUp}
                style={{ zIndex: 2 }}
              >
                <h4 className="font-weight-bold text-dark mb-3">{lessonView.title}</h4>

                <div
                  className="interactive-slide-page border rounded-3 bg-white mb-3 position-relative overflow-hidden"
                  style={{
                    minHeight: '620px',
                    borderColor: '#dbe4f0'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-light">
                    <div>
                      <span className="badge bg-primary-subtle text-primary border me-2">Slide {safePageIndex + 1}</span>
                      <span className="small text-muted">{safePageIndex + 1}/{totalSlidePages}</span>
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={safePageIndex === 0}
                        onClick={() => {
                          setCurrentPageIndex((page) => Math.max(0, page - 1));
                          setSelectedText('');
                          setSelectionSource('');
                          handleClearAnnotations();
                        }}
                      >
                        Trước
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => applySelectedText(activeSlideParagraph.text, { source: `Đã chọn toàn bộ slide ${safePageIndex + 1}.` })}
                      >
                        Hỏi slide này
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={safePageIndex >= totalSlidePages - 1}
                        onClick={() => {
                          setCurrentPageIndex((page) => Math.min(totalSlidePages - 1, page + 1));
                          setSelectedText('');
                          setSelectionSource('');
                          handleClearAnnotations();
                        }}
                      >
                        Sau
                      </button>
                    </div>
                  </div>

                  <div className="position-relative bg-light" style={{ aspectRatio: '16 / 9' }}>
                    {lessonView.slideUrl ? (
                      <img
                        key={`${activeDataLesson?.slideFile}-${safePageIndex}`}
                        alt={`${lessonView.title} - slide ${safePageIndex + 1}`}
                        src={getSlidePageImageUrl(activeDataLesson?.slideFile, safePageIndex + 1)}
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ objectFit: 'fill', background: '#f8fafc', pointerEvents: 'none' }}
                      />
                    ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                        Không có file PDF gốc cho tài liệu này.
                      </div>
                    )}

                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        pointerEvents: toolMode === 'pen' || toolMode === 'highlight' ? 'auto' : 'none',
                        zIndex: 5,
                        cursor: toolMode === 'pen' || toolMode === 'highlight' ? 'crosshair' : 'default'
                      }}
                    />
                  </div>
                </div>

                {lessonView.slideUrl && (
                  <div className="small text-muted px-1 mb-2">
                    File PDF gốc: <a href={lessonView.slideUrl} target="_blank" rel="noreferrer">{lessonView.id}</a>
                  </div>
                )}
              </div>

              {selectedText && (
                <div className="alert alert-indigo mt-3 d-flex align-items-center justify-content-between gap-2 p-2 position-relative" style={{ background: '#e0e7ff', color: '#3730a3', zIndex: 2 }}>
                  <small className="text-truncate" style={{ maxWidth: '76%' }}>
                    <strong>Đoạn trích chọn:</strong> "{selectedText}"
                    {selectionSource && <span className="d-block text-muted">{selectionSource}</span>}
                  </small>
                  <button
                    className="btn btn-sm btn-primary font-weight-bold"
                    onClick={() => {
                      setSelectedText('');
                      setSelectionSource('');
                    }}
                  >
                    Xóa chọn
                  </button>
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
                onChange={(e) => {
                  setSelectedText(e.target.value);
                  setSelectionSource(e.target.value.trim() ? 'Đã nhập/dán thủ công.' : '');
                }}
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
            lessonId: activeDataLesson?.lessonId || 'lesson-01',
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
