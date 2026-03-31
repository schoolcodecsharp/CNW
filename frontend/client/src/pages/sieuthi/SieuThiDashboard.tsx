import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SieuThiOverview from './SieuThiOverview';
import WarehouseManagement from './WarehouseManagement';
import OrderManagement from './OrderManagement';
import PlaceOrder from './PlaceOrder';
import './SieuThiDashboard.css';

function SieuThiDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tổng quan', path: '/sieuthi' },
    { id: 'warehouse', icon: '🏬', label: 'Quản lý kho', path: '/sieuthi/warehouse' },
    { id: 'orders', icon: '📦', label: 'Đơn hàng', path: '/sieuthi/orders' },
    { id: 'place-order', icon: '🛒', label: 'Đặt hàng', path: '/sieuthi/place-order' }
  ];

  return (
    <div className="sieuthi-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏬</span>
            <span className="logo-text">Siêu Thị</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">🏪</div>
            <div className="user-details">
              <div className="user-name">{user?.tenDangNhap || 'Siêu thị'}</div>
              <div className="user-role">Nhà bán lẻ</div>
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
          <Route path="/" element={<SieuThiOverview />} />
          <Route path="/warehouse" element={<WarehouseManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/place-order" element={<PlaceOrder />} />
        </Routes>
      </main>
    </div>
  );
}

export default SieuThiDashboard;
