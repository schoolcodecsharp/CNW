import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './AuthPages.css';

function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    loaiTaiKhoan: '',
    tenDangNhap: '',
    matKhau: '',
    xacNhanMatKhau: '',
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChi: ''
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

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.matKhau.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.register(formData);

      if (result.success) {
        alert(result.message);
        navigate('/login');
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
      <div className="auth-box auth-box-large">
        <div className="auth-header">
          <Link to="/" className="back-link">← Quay lại</Link>
          <div className="auth-icon">📝</div>
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản mới để sử dụng hệ thống</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
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
                <option value="nong_dan">Nông dân</option>
                <option value="dai_ly">Đại lý</option>
                <option value="sieu_thi">Siêu thị</option>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu *</label>
              <input
                type="password"
                name="xacNhanMatKhau"
                value={formData.xacNhanMatKhau}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Họ tên *</label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                placeholder="Nhập họ tên đầy đủ"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <textarea
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              rows={2}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
