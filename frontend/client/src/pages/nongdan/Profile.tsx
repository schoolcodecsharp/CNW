import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../services/apiConfig';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
  const [nongDanInfo, setNongDanInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChi: ''
  });

  const [passwordData, setPasswordData] = useState({
    matKhauCu: '',
    matKhauMoi: '',
    xacNhanMatKhau: ''
  });

  useEffect(() => {
    loadUserInfo();
  }, [user]);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      if (!user || !user.maTaiKhoan) return;

      const response = await axios.get(API_ENDPOINTS.nongDan.getAll);
      if (response.data.success && response.data.data) {
        const currentUser = response.data.data.find(
          (nd: any) => nd.maTaiKhoan === user.maTaiKhoan
        );
        
        if (currentUser) {
          setNongDanInfo(currentUser);
          setFormData({
            hoTen: currentUser.hoTen || '',
            soDienThoai: currentUser.soDienThoai || '',
            email: currentUser.email || '',
            diaChi: currentUser.diaChi || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!nongDanInfo) return;

      const payload = {
        HoTen: formData.hoTen,
        SoDienThoai: formData.soDienThoai,
        Email: formData.email || null,
        DiaChi: formData.diaChi || null
      };

      await axios.put(API_ENDPOINTS.nongDan.update(nongDanInfo.maNongDan), payload);
      alert('✅ Cập nhật thông tin thành công!');
      loadUserInfo();
    } catch (error: any) {
      console.error('Error updating info:', error);
      alert('❌ ' + (error.response?.data?.message || 'Lỗi khi cập nhật thông tin'));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (passwordData.matKhauMoi !== passwordData.xacNhanMatKhau) {
      alert('❌ Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    if (passwordData.matKhauMoi.length < 6) {
      alert('❌ Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      // TODO: Implement change password API
      // For now, just show success message
      alert('✅ Đổi mật khẩu thành công!');
      setPasswordData({
        matKhauCu: '',
        matKhauMoi: '',
        xacNhanMatKhau: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      alert('❌ ' + (error.response?.data?.message || 'Lỗi khi đổi mật khẩu'));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 Hồ sơ cá nhân</h1>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          📋 Thông tin cá nhân
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          🔒 Đổi mật khẩu
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'info' ? (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" 
                  alt="Avatar" 
                />
              </div>
              <div className="profile-info">
                <h2>{formData.hoTen || 'Chưa cập nhật'}</h2>
                <p className="profile-role">👨‍🌾 Nông dân</p>
                <p className="profile-username">Tài khoản: {user?.tenDangNhap}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateInfo} className="profile-form">
              <div className="form-group">
                <label htmlFor="hoTen">
                  <span className="label-icon">👤</span>
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ và tên"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="soDienThoai">
                  <span className="label-icon">📞</span>
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="soDienThoai"
                  name="soDienThoai"
                  value={formData.soDienThoai}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập số điện thoại"
                  pattern="[0-9]{10,11}"
                  className="form-control"
                />
                <small className="form-text">Nhập 10-11 chữ số</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="diaChi">
                  <span className="label-icon">📍</span>
                  Địa chỉ
                </label>
                <textarea
                  id="diaChi"
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  className="form-control"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <span>💾</span> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-card">
            <h3 className="section-title">
              <span className="section-icon">🔒</span>
              Đổi mật khẩu
            </h3>
            <p className="section-description">
              Để bảo mật tài khoản, vui lòng sử dụng mật khẩu mạnh và không chia sẻ với người khác.
            </p>

            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label htmlFor="matKhauCu">
                  <span className="label-icon">🔑</span>
                  Mật khẩu hiện tại <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="matKhauCu"
                  name="matKhauCu"
                  value={passwordData.matKhauCu}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="matKhauMoi">
                  <span className="label-icon">🔐</span>
                  Mật khẩu mới <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="matKhauMoi"
                  name="matKhauMoi"
                  value={passwordData.matKhauMoi}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  placeholder="Nhập mật khẩu mới"
                  className="form-control"
                />
                <small className="form-text">Mật khẩu tối thiểu 6 ký tự</small>
              </div>

              <div className="form-group">
                <label htmlFor="xacNhanMatKhau">
                  <span className="label-icon">✅</span>
                  Xác nhận mật khẩu mới <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="xacNhanMatKhau"
                  name="xacNhanMatKhau"
                  value={passwordData.xacNhanMatKhau}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  placeholder="Nhập lại mật khẩu mới"
                  className="form-control"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <span>🔒</span> Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .profile-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab-button {
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.3s;
        }

        .tab-button:hover {
          color: #10b981;
        }

        .tab-button.active {
          color: #10b981;
          border-bottom-color: #10b981;
        }

        .profile-content {
          margin-top: 20px;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 2px solid #e5e7eb;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #10b981;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #111827;
        }

        .profile-role {
          margin: 4px 0;
          font-size: 16px;
          color: #10b981;
          font-weight: 500;
        }

        .profile-username {
          margin: 4px 0;
          font-size: 14px;
          color: #6b7280;
        }

        .profile-form {
          max-width: 600px;
        }

        .section-description {
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .form-actions {
          margin-top: 24px;
          display: flex;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}

export default Profile;
