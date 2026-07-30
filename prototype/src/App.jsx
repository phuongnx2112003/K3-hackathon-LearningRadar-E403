import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import StudentSlideReader from './pages/vlearn/StudentSlideReader';
import TeacherRadarDashboard from './pages/vlearn/TeacherRadarDashboard';
import EvalPlayground from './pages/vlearn/EvalPlayground';
import './styles/learning-radar.css';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="d-flex min-vh-100 bg-light">
        {/* Left Sidebar */}
        <aside className="sidebar-container d-flex flex-column">
          {/* Logo Brand */}
          <div className="sidebar-logo d-flex align-items-center gap-3">
            <div className="sidebar-logo-icon">
              <span className="text-white font-weight-bold fs-5">⚡</span>
            </div>
            <div>
              <h6 className="text-white font-weight-bold mb-0">LearningRadar</h6>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>AI Tutor cho VLearn</small>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="nav flex-column mt-3 flex-grow-1">
            <small className="text-uppercase text-muted px-3 mb-2 font-weight-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
              CHỨC NĂNG DỰ ÁN
            </small>

            <NavLink 
              to="/student" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="fs-5">📖</span>
              <span>Student Reader</span>
            </NavLink>

            <NavLink 
              to="/teacher" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="fs-5">📊</span>
              <span>Teacher Radar</span>
            </NavLink>

            <NavLink 
              to="/eval" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="fs-5">🧪</span>
              <span>Eval Suite (50 Qs)</span>
            </NavLink>

            <small className="text-uppercase text-muted px-3 mt-4 mb-2 font-weight-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
              KHÁM PHÁ & THAM KHẢO
            </small>

            <a href="#doc" onClick={(e) => { e.preventDefault(); alert("AI Spec chốt tại spec.md 23:59 Ngày 1"); }} className="sidebar-link">
              <span className="fs-5">📄</span>
              <span>AI Spec.md</span>
            </a>

            <a href="#data" onClick={(e) => { e.preventDefault(); alert("Chatlog mining: 1,261 queries, 369 users, 585 conversations."); }} className="sidebar-link">
              <span className="fs-5">🗃️</span>
              <span>Data Mining Stats</span>
            </a>
          </nav>

          {/* User Profile Card at Bottom */}
          <div className="p-3 border-top border-secondary border-opacity-25 mt-auto">
            <div className="d-flex align-items-center gap-3 p-2 rounded background-dark" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center font-weight-bold" style={{ width: 38, height: 38 }}>
                AI
              </div>
              <div className="overflow-hidden">
                <h6 className="text-white mb-0 small text-truncate">Nhóm 03 - Team Hackathon</h6>
                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                  <span className="live-pulse"></span> Track A: VLearn
                </small>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <div className="d-flex flex-column flex-grow-1 overflow-auto">
          {/* Top Header Navbar */}
          <header className="top-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <h5 className="font-weight-bold mb-0 text-dark">Prototype Workspace</h5>
              <span className="live-badge d-flex align-items-center gap-2">
                <span className="live-pulse"></span> Engine: Gemini 1.5 Flash (Fallback Mock)
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="input-group input-group-sm" style={{ width: 220 }}>
                <span className="input-group-text bg-light border-0">🔍</span>
                <input type="text" className="form-control bg-light border-0" placeholder="Tìm slide, bài học..." />
              </div>

              <div className="position-relative cursor-pointer p-2 rounded-circle hover-bg-light">
                <span className="fs-5">🔔</span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  3
                </span>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <main className="p-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Navigate to="/student" replace />} />
              <Route path="/student" element={<StudentSlideReader />} />
              <Route path="/teacher" element={<TeacherRadarDashboard />} />
              <Route path="/eval" element={<EvalPlayground />} />
              <Route path="*" element={<Navigate to="/student" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
