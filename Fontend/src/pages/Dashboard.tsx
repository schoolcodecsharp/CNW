import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Components
import Overview from '../components/Overview';
import NongDanList from '../components/NongDanList';
import TrangTraiList from '../components/TrangTraiList';
import LoNongSanList from '../components/LoNongSanList';
import Calculator from '../components/Calculator';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('overview');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Tổng quan', path: '/dashboard' },
    { id: 'nongdan', icon: '👨‍🌾', label: 'Nông dân', path: '/dashboard/nongdan' },
    { id: 'trangtrai', icon: '🌾', label: 'Trang trại', path: '/dashboard/trangtrai' },
    { id: 'lonongsan', icon: '📦', label: 'Lô nông sản', path: '/dashboard/lonongsan' },
    { id: 'calculator', icon: '🧮', label: 'Tính toán', path: '/dashboard/calculator' }
  ];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">🌾</div>
          <h2>Nông sản</h2>
        </div>

        <div className="menu">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.username || 'User'}</div>
              <div className="user-role">{user?.role || 'Người dùng'}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/nongdan" element={<NongDanList />} />
          <Route path="/trangtrai" element={<TrangTraiList />} />
          <Route path="/lonongsan" element={<LoNongSanList />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
