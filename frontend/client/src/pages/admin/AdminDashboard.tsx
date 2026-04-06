import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import NongDanManagement from './NongDanManagement';
import DaiLyManagement from './DaiLyManagement';
import SieuThiManagement from './SieuThiManagement';
import FarmManagement from './FarmManagement';
import BatchManagement from './BatchManagement';
import OrderManagement from './OrderManagement';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Bảng điều khiển', path: '/admin' },
    { id: 'users', icon: '👥', label: 'Quản lý người dùng', path: '/admin/users' },
    { id: 'nongdan', icon: '👨‍🌾', label: 'Quản lý nông dân', path: '/admin/nongdan' },
    { id: 'daily', icon: '🏪', label: 'Quản lý đại lý', path: '/admin/daily' },
    { id: 'sieuthi', icon: '🏬', label: 'Quản lý siêu thị', path: '/admin/sieuthi' },
    { id: 'farms', icon: '🌾', label: 'Quản lý trang trại', path: '/admin/farms' },
    { id: 'batches', icon: '📦', label: 'Quản lý lô hàng', path: '/admin/batches' },
    { id: 'orders', icon: '🛒', label: 'Quản lý đơn hàng', path: '/admin/orders' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">Admin Panel</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">{user?.tenDangNhap || 'Admin'}</div>
              <div className="user-role">Quản trị viên</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/nongdan" element={<NongDanManagement />} />
          <Route path="/daily" element={<DaiLyManagement />} />
          <Route path="/sieuthi" element={<SieuThiManagement />} />
          <Route path="/farms" element={<FarmManagement />} />
          <Route path="/batches" element={<BatchManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
