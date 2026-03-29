import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

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

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.name}"?`)) {
      return;
    }

    try {
      // TODO: Call delete API based on role
      alert('Chức năng xóa sẽ được triển khai sau');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Không thể xóa người dùng');
    }
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
          <button className="btn btn-primary">
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
                <td colSpan="8" className="text-center">Không có dữ liệu</td>
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

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết người dùng</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{selectedUser.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tên:</span>
                  <span className="detail-value">{selectedUser.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Vai trò:</span>
                  <span className="detail-value">{selectedUser.role}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Số điện thoại:</span>
                  <span className="detail-value">{selectedUser.phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedUser.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Địa chỉ:</span>
                  <span className="detail-value">{selectedUser.address || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
