import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import './AuthPages.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.forgotPassword(email);

      if (result.success) {
        setSuccess(result.message);
        setEmail('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Link to="/login" className="back-link">← Quay lại đăng nhập</Link>
          <div className="auth-icon">🔑</div>
          <h1>Quên mật khẩu</h1>
          <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Nhớ mật khẩu? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
