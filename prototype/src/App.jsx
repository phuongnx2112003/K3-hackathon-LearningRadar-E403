import React, { useState } from 'react';
import Login from './login';
import StudentFlow from './student-flow';
import TeacherDashboard from './teacher-dashboard';
import { INITIAL_TICKETS } from './mock-data';
import learningRadarLogo from '../assets/learningradar_logo_icon.png';

function App({ onSubmitQuestion }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lr_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('lr_user', JSON.stringify(user));
    } catch (err) {
      console.warn('Failed to save user in sessionStorage:', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('lr_user');
    } catch (err) {
      console.warn('Failed to remove user from sessionStorage:', err);
    }
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev.filter((t) => t.id !== newTicket.id)]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === 'student') {
    return (
      <StudentFlow
        user={currentUser}
        onLogout={handleLogout}
        onSubmitQuestion={onSubmitQuestion}
        tickets={tickets}
        onAddTicket={handleAddTicket}
      />
    );
  }

  // Lab Coach portal
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <header className="coach-topbar">
        <div className="coach-brand">
          <div className="coach-logo">
            <img src={learningRadarLogo} alt="LearningRadar" />
          </div>
          <div>
            <h1>LearningRadar — Cổng Lab Coach</h1>
            <p>K3 Hackathon E403</p>
          </div>
        </div>

        <div className="coach-topbar-actions">
          <div className="coach-role-pill">
            <span>{currentUser.avatar || '👨‍🏫'}</span>
            <strong>{currentUser.name || 'Lab Coach'}</strong>
          </div>

          <button
            className="coach-logout-button"
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
          >
            <span aria-hidden="true">↪</span>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Teacher Dashboard */}
      <main className="flex-grow-1 p-3 p-md-4">
        <div className="container-fluid">
          <TeacherDashboard
            tickets={tickets}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
