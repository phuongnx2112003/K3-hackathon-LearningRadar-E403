import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { MOCK_LESSON, INITIAL_TICKETS, MOCK_AI_RESPONSE } from './mock-data';
import TutorResult from './tutor-result';
import QuizFlow from './quiz-flow';
import {
  askTutor,
  createTicket as createTicketApi,
  getBackendAssetUrl,
  getDashboardTickets,
  getLessons,
  recognizeSlideRegion
} from './api-client';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function PdfPage({ documentProxy, pageNumber, onTextMouseUp, onRendered, toolMode }) {
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    let renderTask;

    async function renderPage() {
      try {
        const page = await documentProxy.getPage(pageNumber);
        if (cancelled || !canvasRef.current || !textLayerRef.current) return;

        // The page section starts at the browser's default 300px canvas width.
        // Measure the scroll reader instead so every PDF page fills the middle pane.
        const readerWidth = canvasRef.current.parentElement.parentElement?.clientWidth || 760;
        const parentWidth = Math.max(readerWidth - 24, 320);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(parentWidth / unscaledViewport.width, 2.5);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
        if (cancelled || !textLayerRef.current) return;

        const textContent = await page.getTextContent();
        const textLayer = textLayerRef.current;
        textLayer.replaceChildren();
        textLayer.style.width = `${Math.ceil(viewport.width)}px`;
        textLayer.style.height = `${Math.ceil(viewport.height)}px`;

        textContent.items.forEach((item, index) => {
          if (!item.str) return;
          const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
          const fontHeight = Math.hypot(transform[2], transform[3]);
          const span = document.createElement('span');
          span.dataset.pdfText = 'true';
          span.dataset.pdfPage = String(pageNumber);
          span.dataset.pdfIndex = String(index);
          span.textContent = item.str;
          span.style.left = `${transform[4]}px`;
          span.style.top = `${transform[5] - fontHeight}px`;
          span.style.width = `${Math.max(item.width * scale, 1)}px`;
          span.style.height = `${Math.max(fontHeight, 1)}px`;
          span.style.fontSize = `${fontHeight}px`;
          textLayer.appendChild(span);
        });
        onRendered?.();
      } catch (renderError) {
        if (!cancelled) setError(`Không thể hiển thị trang ${pageNumber}: ${renderError.message}`);
      }
    }

    renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [documentProxy, pageNumber, onRendered]);

  const canSelectText = toolMode === 'read' || toolMode === 'highlight';

  return (
    <section className="position-relative mx-auto mb-3" style={{ width: 'fit-content', minHeight: '120px' }}>
      <canvas ref={canvasRef} data-pdf-page-canvas="true" data-pdf-page={pageNumber} className="d-block shadow-sm" />
      <div
        ref={textLayerRef}
        onMouseUp={(event) => {
          event.stopPropagation();
          onTextMouseUp();
        }}
        aria-label={`Lớp văn bản có thể bôi đen của PDF, trang ${pageNumber}`}
        className="pdf-text-layer"
        style={{
          position: 'absolute',
          inset: 0,
          userSelect: canSelectText ? 'text' : 'none',
          pointerEvents: canSelectText ? 'auto' : 'none',
          cursor: canSelectText ? 'text' : 'default'
        }}
      />
      {error && <div className="alert alert-warning small mt-2">{error}</div>}
    </section>
  );
}

const StudentFlow = ({ user, onLogout, onSubmitQuestion, tickets: externalTickets, onAddTicket }) => {
  const [toolMode, setToolMode] = useState('read'); // 'read' | 'pen' | 'eraser' | 'highlight'
  const [selectedText, setSelectedText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorResult, setTutorResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [notification, setNotification] = useState(null);
  const [dataLessons, setDataLessons] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState('lesson-01');
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pdfRenderTick, setPdfRenderTick] = useState(0);
  const [selectionSource, setSelectionSource] = useState('');

  const activeDataLesson = dataLessons.find((lesson) => lesson.lessonId === activeLessonId) || dataLessons[0];
  const lessonView = activeDataLesson
    ? {
        id: activeDataLesson.slideFile || activeDataLesson.source,
        courseName: 'VLearn · Hackathon learning data',
        title: activeDataLesson.title,
        totalPages: activeDataLesson.paragraphs?.length || 1,
        currentPage: 1,
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

  const totalSlidePages = pdfPageCount || lessonView.totalPages || 1;
  const safePageIndex = 0;
  const handlePdfPageRendered = useCallback(() => {
    setPdfRenderTick((current) => current + 1);
  }, []);

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
          setSelectedText('');
          setQuestionText('');
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

  useEffect(() => {
    let active = true;

    async function syncTickets() {
      try {
        const data = await getDashboardTickets();
        if (active && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        }
      } catch (error) {
        // Keep local tickets when backend is offline.
      }
    }

    syncTickets();
    const timer = setInterval(syncTickets, 5000);

    return () => {
      active = false;
      clearInterval(timer);
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
        teacherReplies: [],
        teacherFeedback: '',
        lastFeedbackAt: null,
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
  const pdfPagesContainerRef = useRef(null);
  const penBoundsRef = useRef(null);
  const penPointsRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [hasDrawings, setHasDrawings] = useState(false);

  // Adjust canvas size to match container while preserving existing drawings.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return undefined;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const nextWidth = Math.max(parent.scrollWidth, parent.clientWidth);
      const nextHeight = Math.max(parent.scrollHeight, parent.clientHeight);
      if (canvas.width === nextWidth && canvas.height === nextHeight) return;

      const snapshot = document.createElement('canvas');
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      const snapshotCtx = snapshot.getContext('2d');
      snapshotCtx.drawImage(canvas, 0, 0);

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(snapshot, 0, 0);
    };
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas.parentElement);
    const frame = requestAnimationFrame(resizeCanvas);
    const timers = [120, 360, 800].map((delay) => setTimeout(resizeCanvas, delay));
    resizeCanvas();

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [pdfDocument, pdfPageCount, pdfRenderTick, lessonView.id]);

  // Load the PDF once, then render every page in a vertically scrollable reader.
  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      setPdfLoading(true);
      setPdfError('');
      setPdfDocument(null);
      setPdfPageCount(0);

      try {
        const documentProxy = await pdfjsLib.getDocument(lessonView.slideUrl).promise;
        if (cancelled) return;
        setPdfDocument(documentProxy);
        setPdfPageCount(documentProxy.numPages);
      } catch (error) {
        if (!cancelled) {
          setPdfError(`Không thể render PDF để chọn text: ${error.message}`);
        }
      } finally {
        if (!cancelled) setPdfLoading(false);
      }
    }

    if (lessonView.slideUrl) loadPdf();

    return () => {
      cancelled = true;
    };
  }, [lessonView.slideUrl]);

  // Canvas Drawing Handlers
  const startDrawing = (e) => {
    if (toolMode !== 'pen' && toolMode !== 'eraser' && toolMode !== 'highlight') return;
    e.preventDefault();
    e.stopPropagation();
    window.getSelection?.().removeAllRanges();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    drawingStartRef.current = { x, y };
    drawingBoundsRef.current = { minX: x, minY: y, maxX: x, maxY: y };
    setPrevPos({ x, y });
    penBoundsRef.current = { minX: x, minY: y, maxX: x, maxY: y };
    penPointsRef.current = [{ x, y }];
  };

  const draw = (e) => {
    if (!isDrawing || (toolMode !== 'pen' && toolMode !== 'eraser' && toolMode !== 'highlight')) return;
    if (toolMode === 'highlight') return;
    e.preventDefault();
    e.stopPropagation();
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

    ctx.save();
    ctx.globalCompositeOperation = toolMode === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = toolMode === 'eraser' ? 'rgba(0,0,0,1)' : '#ef4444';
    ctx.lineWidth = toolMode === 'eraser' ? 24 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();

    setPrevPos({ x, y });
    if (penBoundsRef.current) {
      penBoundsRef.current = {
        minX: Math.min(penBoundsRef.current.minX, x),
        minY: Math.min(penBoundsRef.current.minY, y),
        maxX: Math.max(penBoundsRef.current.maxX, x),
        maxY: Math.max(penBoundsRef.current.maxY, y)
      };
    }
    penPointsRef.current.push({ x, y });
    setHasDrawings(true);
  };

  const capturePenRegionImage = (bounds) => {
    if (!pdfPagesContainerRef.current || !canvasRef.current) return null;

    const overlayRect = canvasRef.current.getBoundingClientRect();
    const pageCanvases = Array.from(pdfPagesContainerRef.current.querySelectorAll('[data-pdf-page-canvas]'));
    const region = {
      left: overlayRect.left + bounds.minX,
      top: overlayRect.top + bounds.minY,
      right: overlayRect.left + bounds.maxX,
      bottom: overlayRect.top + bounds.maxY
    };

    const match = pageCanvases
      .map((pageCanvas) => {
        const rect = pageCanvas.getBoundingClientRect();
        const left = Math.max(region.left, rect.left);
        const top = Math.max(region.top, rect.top);
        const right = Math.min(region.right, rect.right);
        const bottom = Math.min(region.bottom, rect.bottom);
        const area = Math.max(0, right - left) * Math.max(0, bottom - top);
        return { pageCanvas, rect, area, left, top, right, bottom };
      })
      .filter((item) => item.area > 0)
      .sort((a, b) => b.area - a.area)[0];

    if (!match) return null;

    const padding = 12;
    const scaleX = match.pageCanvas.width / match.rect.width;
    const scaleY = match.pageCanvas.height / match.rect.height;
    const sx = Math.max(0, (match.left - match.rect.left - padding) * scaleX);
    const sy = Math.max(0, (match.top - match.rect.top - padding) * scaleY);
    const sw = Math.min(match.pageCanvas.width - sx, (match.right - match.left + padding * 2) * scaleX);
    const sh = Math.min(match.pageCanvas.height - sy, (match.bottom - match.top + padding * 2) * scaleY);

    if (sw < 8 || sh < 8) return null;

    const maxSide = 1200;
    const outputScale = Math.min(1, maxSide / Math.max(sw, sh));
    const output = document.createElement('canvas');
    output.width = Math.max(1, Math.round(sw * outputScale));
    output.height = Math.max(1, Math.round(sh * outputScale));
    output.getContext('2d').drawImage(match.pageCanvas, sx, sy, sw, sh, 0, 0, output.width, output.height);

    return {
      imageDataUrl: output.toDataURL('image/png'),
      page: Number(match.pageCanvas.dataset.pdfPage || 1),
      bbox: {
        x: Math.max(0, (match.left - match.rect.left) / match.rect.width),
        y: Math.max(0, (match.top - match.rect.top) / match.rect.height),
        width: Math.min(1, (match.right - match.left) / match.rect.width),
        height: Math.min(1, (match.bottom - match.top) / match.rect.height)
      }
    };
  };

  const recognizeImageRegion = async (bounds, textHint = '') => {
    const capture = capturePenRegionImage(bounds);
    if (!capture) {
      setNotification({ type: 'warning', message: 'Không crop được vùng khoanh để OCR. Hãy khoanh lại sát nội dung trên slide.' });
      return;
    }

    setNotification({ type: 'info', message: 'Đang OCR/mô tả vùng ảnh bạn vừa khoanh bằng AI...' });

    try {
      const result = await recognizeSlideRegion({
        slideFile: activeDataLesson?.slideFile || lessonView.id,
        page: capture.page,
        bbox: capture.bbox,
        imageDataUrl: capture.imageDataUrl,
        textHint
      });
      const recognizedText = String(result.selectedText || result.description || '').trim();

      if (!recognizedText) {
        setNotification({ type: 'warning', message: 'AI chưa nhận ra nội dung trong vùng khoanh. Hãy khoanh vùng lớn hơn hoặc rõ hơn.' });
        return;
      }

      applySelectedText(recognizedText, {
        source: result.mode === 'vision'
          ? `Đã OCR/mô tả ảnh từ vùng khoanh ở trang ${capture.page}.`
          : `Đã lấy text từ vùng khoanh ở trang ${capture.page}.`
      });
      setQuestionText(`Giải thích vùng em vừa khoanh trên slide: "${recognizedText}"`);
      setNotification({ type: 'success', message: 'Đã đưa nội dung vùng khoanh vào ô hỏi AI Tutor.' });
    } catch (error) {
      const fallbackText = String(textHint || '').replace(/\s+/g, ' ').trim();
      if (fallbackText.length >= 2) {
        applySelectedText(fallbackText, {
          source: 'Backend OCR/vision chưa nhận được vùng, tạm dùng text đọc được từ PDF.'
        });
        setQuestionText(`Giải thích đoạn em vừa khoanh: "${fallbackText}"`);
        setNotification({
          type: 'warning',
          message: 'OCR/vision chưa nhận ra vùng ảnh, hệ thống đã dùng text đọc được từ PDF để bạn hỏi tiếp.'
        });
        return;
      }
      setNotification({ type: 'danger', message: `Không OCR được vùng khoanh: ${error.message}` });
    }
  };

  const stopDrawing = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (isDrawing && toolMode === 'pen' && penBoundsRef.current && pdfPagesContainerRef.current && canvasRef.current) {
      const bounds = penBoundsRef.current;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const points = penPointsRef.current;
      const diagonal = Math.hypot(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
      const closeDistance = Math.hypot(points[0].x - points.at(-1).x, points[0].y - points.at(-1).y);
      const isClosed = points.length > 6 && closeDistance < Math.max(48, diagonal * 0.35);
      const pointInPolygon = (point, polygon) => polygon.reduce((inside, current, index) => {
        const previous = polygon[index === 0 ? polygon.length - 1 : index - 1];
        const crosses = (current.y > point.y) !== (previous.y > point.y)
          && point.x < ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;
        return crosses ? !inside : inside;
      }, false);
      const text = isClosed ? Array.from(pdfPagesContainerRef.current.querySelectorAll('[data-pdf-text]'))
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          const center = { x: rect.left + rect.width / 2 - canvasRect.left, y: rect.top + rect.height / 2 - canvasRect.top };
          return pointInPolygon(center, points);
        })
        .map((node) => node.textContent.trim())
        .filter(Boolean)
        .join(' ') : '';

      const cleanPenText = text.replace(/\s+/g, ' ').trim();
      const regionIsLargeEnough = (bounds.maxX - bounds.minX) > 12 && (bounds.maxY - bounds.minY) > 12;
      const hasReadablePdfText = cleanPenText.length >= 12;

      if (isClosed && regionIsLargeEnough) {
        if (hasReadablePdfText) {
          applySelectedText(cleanPenText, {
            source: 'Đã lấy text trực tiếp từ PDF trong vùng khoanh, không gọi LLM/OCR.'
          });
          setQuestionText(`Giải thích đoạn em vừa khoanh: "${cleanPenText}"`);
          setNotification({
            type: 'success',
            message: 'Đã lấy text trực tiếp từ PDF. Chỉ vùng không đọc được chữ mới gọi AI OCR/vision.'
          });
        } else {
          await recognizeImageRegion(bounds, cleanPenText);
        }
        setIsDrawing(false);
        penBoundsRef.current = null;
        penPointsRef.current = [];
        return;
      }

      if (regionIsLargeEnough) {
        setNotification({ type: 'warning', message: isClosed ? 'Không nhận ra text trong vùng khoanh. Hãy khoanh sát chữ hơn.' : 'Hãy khoanh kín một vùng chữ; nét bút chưa tạo thành một vòng khép kín.' });
      }
    }
    setIsDrawing(false);
    penBoundsRef.current = null;
    penPointsRef.current = [];
  };

  const applySelectedText = (text, options = {}) => {
    const cleanText = String(text || '').trim();
    if (cleanText.length < 2) return;

    setSelectedText(cleanText);
    setSelectionSource(options.source || 'Đã lấy đoạn text từ slide.');

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
      setTutorResult({
        ...response,
        lessonId: activeDataLesson?.lessonId || 'lesson-01',
        selectedText,
        question: questionText
      });
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

  const handleUpdateTicketStatus = (ticketId, newStatus, updatedTicket = {}) => {
    setTickets((currentTickets) => currentTickets.map((ticket) => (
      ticket.id === ticketId
        ? { ...ticket, ...updatedTicket, status: updatedTicket.status || newStatus }
        : ticket
    )));
  };

  const teacherFeedbackTickets = tickets.filter((ticket) => {
    const hasFeedback = (ticket.teacherReplies || []).length > 0 || ticket.teacherFeedback;
    const belongsToCurrentStudent = !ticket.studentId || ticket.studentId === 'student-demo-01';
    return hasFeedback && belongsToCurrentStudent;
  });

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
              toolMode === 'eraser' ? 'bg-danger-subtle border border-danger text-danger rounded-3 shadow-sm' : 'text-secondary border-0'
            }`}
            style={toolMode === 'eraser' ? { background: '#fee2e2', color: '#b91c1c' } : {}}
            onClick={() => setToolMode('eraser')}
          >
            🧽 Tẩy
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

        {/* User Profile & Logout */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2 bg-light border px-3 py-1 rounded-pill small">
            <span>{user?.avatar || '👤'}</span>
            <strong className="small">{user?.name || 'Nguyễn Văn A (Học viên)'}</strong>
          </div>

          {onLogout && (
            <button
              className="btn btn-outline-danger btn-sm font-weight-bold d-flex align-items-center gap-1"
              onClick={onLogout}
              title="Đăng xuất khỏi hệ thống"
            >
              🚪 Đăng xuất
            </button>
          )}
        </div>
      </header>

      {/* Mode Banners */}
      {toolMode === 'pen' && (
        <div className="bg-secondary-subtle text-dark py-1 text-center small font-weight-bold border-bottom">
          ✏️ CHẾ ĐỘ BÚT VẼ TỰ DO: Dùng chuột kéo rê để vẽ/khoanh vùng tự do lên trang slide!
        </div>
      )}
      {toolMode === 'eraser' && (
        <div className="bg-danger-subtle text-danger py-1 text-center small font-weight-bold border-bottom">
          🧽 CHẾ ĐỘ TẨY: Kéo chuột lên nét bút đỏ để tẩy phần vừa vẽ trên slide.
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
                          setSelectedText('');
                          setQuestionText('');
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

                {lessonView.slideUrl && (
                  <div className="border rounded-3 overflow-hidden bg-light mb-4">
                    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white small">
                      <strong>PDF có thể chọn text</strong>
                      <span>{pdfPageCount ? `${pdfPageCount} trang · cuộn để xem tất cả` : 'Đang tải PDF…'}</span>
                    </div>
                    <div
                      className="p-2 overflow-auto bg-light"
                      ref={pdfPagesContainerRef}
                      style={{ height: '620px' }}
                      title="Cuộn để xem tất cả trang PDF"
                    >
                      {pdfLoading && <div className="small text-muted p-3">Đang tải PDF và lớp text…</div>}
                      {pdfError && <div className="alert alert-warning m-2 small">{pdfError}</div>}
                      <div className="position-relative" style={{ minHeight: '100%' }}>
                        {pdfDocument && Array.from({ length: pdfPageCount }, (_, index) => (
                          <PdfPage
                            key={`${lessonView.id}-${index + 1}`}
                            documentProxy={pdfDocument}
                            pageNumber={index + 1}
                            onTextMouseUp={handleTextMouseUp}
                            onRendered={handlePdfPageRendered}
                            toolMode={toolMode}
                          />
                        ))}
                        <canvas
                          ref={canvasRef}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="position-absolute top-0 start-0"
                          style={{
                            pointerEvents: toolMode === 'pen' || toolMode === 'eraser' ? 'auto' : 'none',
                            zIndex: toolMode === 'pen' || toolMode === 'eraser' ? 10 : 1,
                            cursor: toolMode === 'pen' ? 'crosshair' : toolMode === 'eraser' ? 'cell' : 'default',
                            touchAction: 'none',
                            userSelect: 'none'
                          }}
                        />
                      </div>
                    </div>
                    <div className="small text-muted px-3 py-2 border-top bg-white">
                      Cuộn để xem toàn bộ trang. Chọn <strong>Highlight</strong> rồi bôi đen chữ trong PDF, hoặc dùng <strong>Bút</strong> khoanh kín vùng chữ để đưa đúng đoạn đó vào AI Tutor. <a href={lessonView.slideUrl} target="_blank" rel="noreferrer">Mở PDF gốc</a>
                    </div>
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

            {teacherFeedbackTickets.length > 0 && (
              <div className="mt-3 border rounded-3 p-3 bg-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <strong className="text-dark">Phản hồi từ giảng viên</strong>
                  <span className="badge bg-success">{teacherFeedbackTickets.length} ticket</span>
                </div>
                {teacherFeedbackTickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="bg-white border rounded-3 p-2 mb-2 small">
                    <div className="d-flex justify-content-between gap-2">
                      <strong>{ticket.conceptLabel || ticket.id}</strong>
                      <span className="text-muted">{ticket.lastFeedbackAt || ticket.createdAt}</span>
                    </div>
                    <div className="text-muted mt-1">Về câu hỏi: "{ticket.question}"</div>
                    {(ticket.teacherReplies || []).map((reply) => (
                      <div key={reply.id} className="mt-2 p-2 rounded-2" style={{ background: '#ecfdf5', color: '#065f46' }}>
                        <strong>{reply.teacherName || 'Giảng viên/TA'}:</strong> {reply.message}
                      </div>
                    ))}
                    {ticket.teacherFeedback && (!ticket.teacherReplies || ticket.teacherReplies.length === 0) && (
                      <div className="mt-2 p-2 rounded-2" style={{ background: '#ecfdf5', color: '#065f46' }}>
                        <strong>Giảng viên/TA:</strong> {ticket.teacherFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizFlow
          context={{
            lessonId: activeDataLesson?.lessonId || 'lesson-01',
            studentId: 'student-demo-01',
            conceptId: tutorResult?.conceptId || 'concept-contextual',
            conceptLabel: tutorResult?.conceptLabel || 'Kiem tra diem vua thac mac',
            selectedText: tutorResult?.selectedText || selectedText,
            question: tutorResult?.question || questionText,
            answer: tutorResult?.answer || ''
          }}
          onClose={() => setShowQuiz(false)}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default StudentFlow;
