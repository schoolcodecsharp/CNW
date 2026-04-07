import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import NongDanOverview from './NongDanOverview';
import FarmManagement from './FarmManagement';
import BatchManagement from './BatchManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import Profile from './Profile';
import './NongDanDashboard.css';

function NongDanDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [displayName, setDisplayName] = useState('Nông dân');

  useEffect(() => {
    loadUserInfo();
  }, [user]);

  const loadUserInfo = async () => {
    try {
      if (!user || !user.maTaiKhoan) return;

      const response = await axios.get(API_ENDPOINTS.nongDan.getAll);
      if (response.data.success && response.data.data) {
        const currentUser = response.data.data.find(
          (nd: any) => nd.maTaiKhoan === user.maTaiKhoan
        );
        if (currentUser && currentUser.hoTen) {
          setDisplayName(currentUser.hoTen);
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
    { id: 'dashboard', icon: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop', label: 'Tổng quan', path: '/nongdan' },
    { id: 'farms', icon: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=80&h=80&fit=crop', label: 'Trang trại của tôi', path: '/nongdan/farms' },
    { id: 'batches', icon: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=80&h=80&fit=crop', label: 'Lô nông sản', path: '/nongdan/batches' },
    { id: 'products', icon: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=80&h=80&fit=crop', label: 'Sản phẩm', path: '/nongdan/products' },
    { id: 'orders', icon: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=80&h=80&fit=crop', label: 'Đơn hàng', path: '/nongdan/orders' },
    { id: 'profile', icon: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', label: 'Hồ sơ', path: '/nongdan/profile' }
  ];

  return (
    <div className="nongdan-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100&h=100&fit=crop" alt="Logo" className="logo-icon" />
            <span className="logo-text" style={{ color: '#10b981' }}>Nông Dân</span>
          </div>
          <div className="user-info">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="user-avatar" />
            <div className="user-details">
              <div className="user-name">{displayName}</div>
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
              <img src={item.icon} alt={item.label} className="menu-icon" />
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
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default NongDanDashboard;
