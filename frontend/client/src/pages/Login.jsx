import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication (replace with real API call)
    if (formData.username === 'admin' && formData.password === 'admin123') {
      const userData = {
        username: formData.username,
        role: 'Admin'
      };
      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">🌾</div>
          <h1>Quản lý Nông sản</h1>
          <p>Hệ thống quản lý chuỗi cung ứng</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Đăng nhập
          </button>
        </form>

        <div className="login-footer">
          <p>Tài khoản mẫu: <strong>admin</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
