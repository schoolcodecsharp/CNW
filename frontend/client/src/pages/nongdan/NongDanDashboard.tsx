import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NongDanOverview from './NongDanOverview';
import FarmManagement from './FarmManagement';
import BatchManagement from './BatchManagement';
import OrderManagement from './OrderManagement';
import ProductList from './ProductList';
import './NongDanDashboard.css';

function NongDanDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tổng quan', path: '/nongdan' },
    { id: 'farms', icon: '🌾', label: 'Trang trại của tôi', path: '/nongdan/farms' },
    { id: 'batches', icon: '📦', label: 'Lô nông sản', path: '/nongdan/batches' },
    { id: 'orders', icon: '🛒', label: 'Đơn hàng', path: '/nongdan/orders' },
    { id: 'products', icon: '🥬', label: 'Sản phẩm', path: '/nongdan/products' }
  ];

  return (
    <div className="nongdan-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">Nông Dân</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">👨‍🌾</div>
            <div className="user-details">
              <div className="user-name">{user?.tenDangNhap || 'Nông dân'}</div>
              <div className="user-role">Người trồng</div>
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
          <Route path="/" element={<NongDanOverview />} />
          <Route path="/farms" element={<FarmManagement />} />
          <Route path="/batches" element={<BatchManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </main>
    </div>
  );
}

export default NongDanDashboard;
