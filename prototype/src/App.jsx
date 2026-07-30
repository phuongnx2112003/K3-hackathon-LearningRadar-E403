import React, { useState } from 'react';
import Login from './login';
import StudentFlow from './student-flow';
import TeacherDashboard from './teacher-dashboard';
import { INITIAL_TICKETS } from './mock-data';

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
      {/* Teacher Top Header */}
      <header className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 shadow-sm">
        <div className="container-fluid px-0">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-primary text-white rounded-3 p-2 font-weight-bold d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
            >
              LR
            </div>
            <div>
              <h6 className="font-weight-bold text-white mb-0">LearningRadar — Cổng Lab Coach</h6>
              <small className="text-white-50" style={{ fontSize: '0.7rem' }}>K3 Hackathon E403</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 border border-secondary px-3 py-1 rounded-pill text-white small">
              <span>{currentUser.avatar || '👨‍🏫'}</span>
              <strong>{currentUser.name || 'Lab Coach'}</strong>
            </div>

            <button
              className="btn btn-outline-light btn-sm font-weight-bold d-flex align-items-center gap-1"
              onClick={handleLogout}
              title="Đăng xuất khỏi hệ thống"
            >
              🚪 Đăng xuất
            </button>
          </div>
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
