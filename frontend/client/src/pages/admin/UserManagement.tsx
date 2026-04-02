import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'add', 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    roleType: 'nong_dan',
    // Thông tin tài khoản (chỉ dùng khi thêm mới)
    tenDangNhap: '',
    matKhau: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Load all users from different services
      const [nongdanRes, dailyRes, sieuthiRes] = await Promise.all([
        axios.get(API_ENDPOINTS.nongDan.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.daiLy.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.sieuThi.getAll).catch(() => ({ data: { data: [] } }))
      ]);

      // Combine and format users
      const allUsers = [
        ...(nongdanRes.data.data || []).map(u => ({
          ...u,
          id: u.maNongDan,
          name: u.hoTen,
          role: 'Nông dân',
          roleType: 'nong_dan',
          phone: u.soDienThoai,
          email: u.email,
          address: u.diaChi,
          status: 'active'
        })),
        ...(dailyRes.data.data || []).map(u => ({
          ...u,
          id: u.maDaiLy,
          name: u.tenDaiLy,
          role: 'Đại lý',
          roleType: 'dai_ly',
          phone: u.soDienThoai,
          email: u.email,
          address: u.diaChi,
          status: 'active'
        })),
        ...(sieuthiRes.data.data || []).map(u => ({
          ...u,
          id: u.maSieuThi,
          name: u.tenSieuThi,
          role: 'Siêu thị',
          roleType: 'sieu_thi',
          phone: u.soDienThoai,
          email: u.email,
          address: u.diaChi,
          status: 'active'
        }))
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({
      hoTen: '',
      soDienThoai: '',
      email: '',
      diaChi: '',
      roleType: 'nong_dan',
      tenDangNhap: '',
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      hoTen: user.name,
      soDienThoai: user.phone || '',
      email: user.email || '',
      diaChi: user.address || '',
      roleType: user.roleType,
      tenDangNhap: '', // Không cho sửa tài khoản
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setModalMode('view');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.name}"?`)) {
      return;
    }

    try {
      let endpoint;
      if (user.roleType === 'nong_dan') {
        endpoint = API_ENDPOINTS.nongDan.delete(user.id);
      } else if (user.roleType === 'dai_ly') {
        endpoint = API_ENDPOINTS.daiLy.delete(user.id);
      } else if (user.roleType === 'sieu_thi') {
        endpoint = API_ENDPOINTS.sieuThi.delete(user.id);
      }

      await axios.delete(endpoint);
      alert('Xóa người dùng thành công');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload: any = {
        soDienThoai: formData.soDienThoai,
        email: formData.email,
        diaChi: formData.diaChi
      };

      // Adjust payload based on role type and mode
      if (modalMode === 'add') {
        // Khi thêm mới, cần có tài khoản
        payload.tenDangNhap = formData.tenDangNhap;
        payload.matKhau = formData.matKhau;
      }

      if (formData.roleType === 'nong_dan') {
        payload.hoTen = formData.hoTen;
      } else if (formData.roleType === 'dai_ly') {
        payload.tenDaiLy = formData.hoTen;
      } else if (formData.roleType === 'sieu_thi') {
        payload.tenSieuThi = formData.hoTen;
      }

      if (modalMode === 'add') {
        let endpoint;
        if (formData.roleType === 'nong_dan') {
          endpoint = API_ENDPOINTS.nongDan.create;
        } else if (formData.roleType === 'dai_ly') {
          endpoint = API_ENDPOINTS.daiLy.create;
        } else if (formData.roleType === 'sieu_thi') {
          endpoint = API_ENDPOINTS.sieuThi.create;
        }

        await axios.post(endpoint, payload);
        alert('Thêm người dùng thành công');
      } else if (modalMode === 'edit') {
        // Khi sửa, không gửi thông tin tài khoản
        delete payload.tenDangNhap;
        delete payload.matKhau;
        
        let endpoint;
        if (selectedUser.roleType === 'nong_dan') {
          endpoint = API_ENDPOINTS.nongDan.update(selectedUser.id);
        } else if (selectedUser.roleType === 'dai_ly') {
          endpoint = API_ENDPOINTS.daiLy.update(selectedUser.id);
        } else if (selectedUser.roleType === 'sieu_thi') {
          endpoint = API_ENDPOINTS.sieuThi.update(selectedUser.id);
        }

        await axios.put(endpoint, payload);
        alert('Cập nhật người dùng thành công');
      }

      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu người dùng');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.roleType === filterRole);

  if (loading) {
    return <div className="loading">Đang tải danh sách người dùng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddUser}>
            ➕ Thêm người dùng
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Lọc theo vai trò:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tất cả ({users.length})</option>
            <option value="nong_dan">Nông dân ({users.filter(u => u.roleType === 'nong_dan').length})</option>
            <option value="dai_ly">Đại lý ({users.filter(u => u.roleType === 'dai_ly').length})</option>
            <option value="sieu_thi">Siêu thị ({users.filter(u => u.roleType === 'sieu_thi').length})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={`${user.roleType}-${user.id}`}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>
                    <span className={`badge badge-${user.roleType}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.address || 'N/A'}</td>
                  <td>
                    <span className="badge badge-success">Hoạt động</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleViewUser(user)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEditUser(user)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteUser(user)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Improved Design */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-user-detail" onClick={(e) => e.stopPropagation()}>
            {modalMode === 'view' && selectedUser ? (
              <>
                <div className="modal-header">
                  <div className="modal-title-section">
                    <div className="user-avatar-large">
                      {selectedUser.roleType === 'nong_dan' && '👨‍🌾'}
                      {selectedUser.roleType === 'dai_ly' && '🏪'}
                      {selectedUser.roleType === 'sieu_thi' && '🏬'}
                    </div>
                    <div>
                      <h2>{selectedUser.name}</h2>
                      <span className={`badge badge-${selectedUser.roleType} badge-large`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                  <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                
                <div className="modal-body">
                  <div className="user-detail-card">
                    <h3 className="section-title">
                      <span className="section-icon">📋</span>
                      Thông tin cơ bản
                    </h3>
                    <div className="detail-grid-modern">
                      <div className="detail-item-modern">
                        <div className="detail-icon">🆔</div>
                        <div className="detail-content">
                          <span className="detail-label">Mã định danh</span>
                          <span className="detail-value">{selectedUser.id}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">👤</div>
                        <div className="detail-content">
                          <span className="detail-label">Họ và tên</span>
                          <span className="detail-value">{selectedUser.name}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📞</div>
                        <div className="detail-content">
                          <span className="detail-label">Số điện thoại</span>
                          <span className="detail-value">{selectedUser.phone || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📧</div>
                        <div className="detail-content">
                          <span className="detail-label">Email</span>
                          <span className="detail-value">{selectedUser.email || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern full-width">
                        <div className="detail-icon">📍</div>
                        <div className="detail-content">
                          <span className="detail-label">Địa chỉ</span>
                          <span className="detail-value">{selectedUser.address || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">✅</div>
                        <div className="detail-content">
                          <span className="detail-label">Trạng thái</span>
                          <span className="badge badge-success">Hoạt động</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedUser.roleType === 'nong_dan' && selectedUser.maTaiKhoan && (
                    <div className="user-detail-card">
                      <h3 className="section-title">
                        <span className="section-icon">🔐</span>
                        Thông tin tài khoản
                      </h3>
                      <div className="detail-grid-modern">
                        <div className="detail-item-modern">
                          <div className="detail-icon">🔑</div>
                          <div className="detail-content">
                            <span className="detail-label">Mã tài khoản</span>
                            <span className="detail-value">{selectedUser.maTaiKhoan}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    <span>✕</span> Đóng
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEditUser(selectedUser)}>
                    <span>✏️</span> Chỉnh sửa
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>{modalMode === 'add' ? '➕ Thêm người dùng mới' : '✏️ Chỉnh sửa người dùng'}</h2>
                  <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {modalMode === 'add' && (
                      <>
                        <div className="form-section-title">
                          <span className="section-icon">🔐</span>
                          Thông tin tài khoản
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="tenDangNhap">
                            <span className="label-icon">👤</span>
                            Tên đăng nhập <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="tenDangNhap"
                            name="tenDangNhap"
                            value={formData.tenDangNhap}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập tên đăng nhập"
                            className="form-control"
                            minLength={3}
                            maxLength={50}
                          />
                          <small className="form-text">Tên đăng nhập để truy cập hệ thống (3-50 ký tự)</small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="matKhau">
                            <span className="label-icon">🔒</span>
                            Mật khẩu <span className="required">*</span>
                          </label>
                          <input
                            type="password"
                            id="matKhau"
                            name="matKhau"
                            value={formData.matKhau}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập mật khẩu"
                            className="form-control"
                            minLength={6}
                          />
                          <small className="form-text">Mật khẩu tối thiểu 6 ký tự</small>
                        </div>

                        <div className="form-section-title">
                          <span className="section-icon">📋</span>
                          Thông tin cá nhân
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label htmlFor="roleType">
                        <span className="label-icon">👥</span>
                        Vai trò <span className="required">*</span>
                      </label>
                      <select
                        id="roleType"
                        name="roleType"
                        value={formData.roleType}
                        onChange={handleInputChange}
                        required
                        disabled={modalMode === 'edit'}
                        className="form-control"
                      >
                        <option value="nong_dan">Nông dân</option>
                        <option value="dai_ly">Đại lý</option>
                        <option value="sieu_thi">Siêu thị</option>
                      </select>
                      {modalMode === 'edit' && (
                        <small className="form-text">Không thể thay đổi vai trò khi chỉnh sửa</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="hoTen">
                        <span className="label-icon">👤</span>
                        {formData.roleType === 'nong_dan' ? 'Họ và tên' : 'Tên'} <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="hoTen"
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleInputChange}
                        required
                        placeholder={
                          formData.roleType === 'nong_dan' 
                            ? 'Nhập họ và tên' 
                            : formData.roleType === 'dai_ly'
                            ? 'Nhập tên đại lý'
                            : 'Nhập tên siêu thị'
                        }
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
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      <span>✕</span> Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <span>{modalMode === 'add' ? '➕' : '💾'}</span>
                      {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
