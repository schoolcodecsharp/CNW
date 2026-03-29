import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import './AuthPages.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    loaiTaiKhoan: '',
    tenDangNhap: '',
    matKhau: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.loaiTaiKhoan) {
      setError('Vui lòng chọn loại tài khoản');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.login(
        formData.tenDangNhap,
        formData.matKhau,
        formData.loaiTaiKhoan
      );

      if (result.success) {
        login(result.data);
        
        // Redirect based on account type
        const redirectMap = {
          'admin': '/admin',
          'nongdan': '/nongdan',
          'daily': '/daily',
          'sieuthi': '/sieuthi'
        };
        
        navigate(redirectMap[formData.loaiTaiKhoan] || '/');
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
          <Link to="/" className="back-link">← Quay lại</Link>
          <div className="auth-icon">🌾</div>
          <h1>Đăng nhập</h1>
          <p>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Loại tài khoản *</label>
            <select
              name="loaiTaiKhoan"
              value={formData.loaiTaiKhoan}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">-- Chọn loại tài khoản --</option>
              <option value="admin">Admin</option>
              <option value="nongdan">Nông dân</option>
              <option value="daily">Đại lý</option>
              <option value="sieuthi">Siêu thị</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tên đăng nhập *</label>
            <input
              type="text"
              name="tenDangNhap"
              value={formData.tenDangNhap}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu *</label>
            <input
              type="password"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-link">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>

        <div className="demo-accounts">
          <p className="demo-title">Tài khoản demo:</p>
          <div className="demo-list">
            <div className="demo-item">
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="demo-item">
              <strong>Nông dân:</strong> nongdan1 / 123456
            </div>
            <div className="demo-item">
              <strong>Đại lý:</strong> daily1 / 123456
            </div>
            <div className="demo-item">
              <strong>Siêu thị:</strong> sieuthi1 / 123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
