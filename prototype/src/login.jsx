import React, { useState } from 'react';
import learningRadarLogo from '../assets/learningradar_logo_icon.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      role: 'lapcoach',
      roleName: 'Lab Coach',
      avatar: '👨‍🏫'
    },
    labcoach: {
      username: 'labcoach',
      password: '123',
      name: 'Lab Coach',
      role: 'lapcoach',
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

    const isCoach = cleanUser.includes('coach') || cleanUser.includes('teacher') || cleanUser.includes('giangvien') || cleanUser.includes('gv');
    const account = ACCOUNTS[cleanUser] || (isCoach ? ACCOUNTS.giangvien : ACCOUNTS.hocvien);
    const name = displayName.trim();

    if (account.role === 'student' && !name) {
      setError('Vui lòng nhập tên hiển thị để giảng viên nhận diện ticket của bạn.');
      return;
    }

    onLogin({
      ...account,
      username: cleanUser,
      name: account.role === 'student' ? name : (name || account.name)
    });
  };

  return (
    <div className="login-page-shell">
      <div className="login-card">
        <div className="login-card-header">
          <div className="login-logo">
            <img src={learningRadarLogo} alt="LearningRadar" />
          </div>
          <h1>LearningRadar</h1>
          <p>Hệ thống Trợ giảng AI & Đánh giá học tập</p>
        </div>

        <div className="login-card-body">
          {error && (
            <div className="alert alert-danger py-2 mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Tên tài khoản</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">♟</span>
                <input
                  type="text"
                  placeholder="Nhập tên tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <label>Mật khẩu</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">▣</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  ◉
                </button>
              </div>
            </div>

            <div className="login-field">
              <label>Tên hiển thị của học viên</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">♙</span>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                />
              </div>
              <p className="login-help-text">Tên này chỉ được đính kèm vào ticket để Lab Coach nhận diện bạn.</p>
            </div>

            <button
              type="submit"
              className="login-submit-button"
            >
              Đăng nhập
            </button>
          </form>
        </div>

        <div className="login-card-footer">
          LearningRadar Platform
        </div>
      </div>
    </div>
  );
};

export default Login;
