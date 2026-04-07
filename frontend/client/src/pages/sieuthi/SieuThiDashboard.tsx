import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import SieuThiOverview from './SieuThiOverview';
import WarehouseManagement from './WarehouseManagement';
import OrderManagement from './OrderManagement';
import './SieuThiDashboard.css';

function SieuThiDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [displayName, setDisplayName] = useState('Siêu thị');

  useEffect(() => {
    loadUserInfo();
  }, [user]);

  const loadUserInfo = async () => {
    try {
      if (!user || !user.maTaiKhoan) return;

      const response = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      if (response.data.success && response.data.data) {
        const currentUser = response.data.data.find(
          (st: any) => st.maTaiKhoan === user.maTaiKhoan
        );
        if (currentUser && currentUser.tenSieuThi) {
          setDisplayName(currentUser.tenSieuThi);
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tổng quan', path: '/sieuthi' },
    { id: 'warehouse', icon: '🏬', label: 'Quản lý kho', path: '/sieuthi/warehouse' },
    { id: 'orders', icon: '📦', label: 'Đơn hàng', path: '/sieuthi/orders' }
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
              <div className="user-name">{displayName}</div>
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
        </Routes>
      </main>
    </div>
  );
}

export default SieuThiDashboard;
