import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import SieuThiOverview from './SieuThiOverview';
import WarehouseManagement from './WarehouseManagement';
import InventoryManagement from './InventoryManagement';
import TraceabilityManagement from './TraceabilityManagement';
import OrderManagement from './OrderManagement';
import KiemDinhManagement from './KiemDinhManagement';
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
    { id: 'dashboard', icon: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop', label: 'Tổng quan', path: '/sieuthi' },
    { id: 'orders', icon: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=80&h=80&fit=crop', label: 'Đơn hàng', path: '/sieuthi/orders' },
    { id: 'warehouse', icon: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=80&h=80&fit=crop', label: 'Quản lý kho', path: '/sieuthi/warehouse' },
    { id: 'inventory', icon: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=80&h=80&fit=crop', label: 'Tồn kho', path: '/sieuthi/inventory' },
    { id: 'kiemdinh', icon: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', label: 'Kiểm định', path: '/sieuthi/kiemdinh' },
    { id: 'traceability', icon: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=80&h=80&fit=crop', label: 'Truy xuất nguồn gốc', path: '/sieuthi/traceability' }
  ];

  return (
    <div className="sieuthi-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop" alt="Logo" className="logo-icon" />
            <span className="logo-text" style={{ color: '#8b5cf6' }}>Siêu Thị</span>
          </div>
          <div className="user-info">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="User" className="user-avatar" />
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
          <Route path="/" element={<SieuThiOverview />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/warehouse" element={<WarehouseManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/kiemdinh" element={<KiemDinhManagement />} />
          <Route path="/traceability" element={<TraceabilityManagement />} />
        </Routes>
      </main>
    </div>
  );
}

export default SieuThiDashboard;
