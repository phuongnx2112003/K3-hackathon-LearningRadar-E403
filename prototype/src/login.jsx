import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ACCOUNTS = {
    hocvien: {
      username: 'hocvien',
      password: '123',
      name: 'Học viên',
      role: 'student',
      roleName: 'Học viên',
      avatar: '🎓'
    },
    giangvien: {
      username: 'giangvien',
      password: '123',
      name: 'Lab Coach',
      role: 'teacher',
      roleName: 'Lab Coach',
      avatar: '👨‍🏫'
    },
    labcoach: {
      username: 'labcoach',
      password: '123',
      name: 'Lab Coach',
      role: 'teacher',
      roleName: 'Lab Coach',
      avatar: '👨‍🏫'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();

    if (!cleanUser) {
      setError('Vui lòng nhập tên tài khoản.');
      return;
    }

    if (ACCOUNTS[cleanUser]) {
      onLogin(ACCOUNTS[cleanUser]);
    } else {
      if (cleanUser.includes('coach') || cleanUser.includes('teacher') || cleanUser.includes('giangvien') || cleanUser.includes('gv')) {
        onLogin({ ...ACCOUNTS.giangvien, username: cleanUser });
      } else {
        onLogin({ ...ACCOUNTS.hocvien, username: cleanUser });
      }
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3" style={{ background: '#f8fafc' }}>
      <div className="card border shadow-sm rounded-4 overflow-hidden" style={{ maxWidth: '400px', width: '100%' }}>
        
        {/* Minimal Header */}
        <div className="p-4 text-center border-bottom bg-white">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 mb-2 font-weight-bold" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
            LR
          </div>
          <h5 className="font-weight-bold text-dark mb-1">LearningRadar</h5>
          <p className="text-muted small mb-0">Hệ thống Trợ giảng AI & Đánh giá học tập</p>
        </div>

        {/* Form Body */}
        <div className="card-body p-4 bg-white">
          {error && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small font-weight-bold text-secondary mb-1">Tên tài khoản</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small font-weight-bold text-secondary mb-1">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 font-weight-bold shadow-sm"
              style={{ background: '#4f46e5', border: 'none' }}
            >
              Đăng nhập
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="card-footer bg-light p-3 text-center border-top">
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            LearningRadar Platform
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
