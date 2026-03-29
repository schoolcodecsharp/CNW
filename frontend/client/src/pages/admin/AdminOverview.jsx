import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarms: 0,
    totalBatches: 0,
    totalOrders: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
      const [nongdanRes, trangtraiRes, loRes] = await Promise.all([
        axios.get(API_ENDPOINTS.nongDan.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.trangTrai.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.loNongSan.getAll).catch(() => ({ data: { data: [] } }))
      ]);

      setStats({
        totalUsers: nongdanRes.data.data?.length || 0,
        totalFarms: trangtraiRes.data.data?.length || 0,
        totalBatches: loRes.data.data?.length || 0,
        totalOrders: 0 // TODO: Add orders API
      });

      // Mock recent activities
      setRecentActivities([
        { time: '10 phút trước', user: 'Nông dân A', action: 'Đăng ký lô nông sản mới' },
        { time: '30 phút trước', user: 'Đại lý B', action: 'Cập nhật trạng thái đơn hàng' },
        { time: '1 giờ trước', user: 'Siêu thị C', action: 'Tạo đơn hàng mới' },
        { time: '2 giờ trước', user: 'Nông dân D', action: 'Cập nhật thông tin trang trại' }
      ]);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bảng điều khiển</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={loadData}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
            👥
          </div>
          <div className="kpi-content">
            <h3>Người dùng</h3>
            <p className="kpi-value">{stats.totalUsers}</p>
            <span className="kpi-label">Tổng số tài khoản</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#e8f5e9', color: '#388e3c' }}>
            🌾
          </div>
          <div className="kpi-content">
            <h3>Trang trại</h3>
            <p className="kpi-value">{stats.totalFarms}</p>
            <span className="kpi-label">Đang hoạt động</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#fff3e0', color: '#f57c00' }}>
            📦
          </div>
          <div className="kpi-content">
            <h3>Lô hàng</h3>
            <p className="kpi-value">{stats.totalBatches}</p>
            <span className="kpi-label">Tổng số lô</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#fce4ec', color: '#c2185b' }}>
            🛒
          </div>
          <div className="kpi-content">
            <h3>Đơn hàng</h3>
            <p className="kpi-value">{stats.totalOrders}</p>
            <span className="kpi-label">Đang xử lý</span>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="content-section">
        <div className="section-header">
          <h2>Hoạt động gần đây</h2>
        </div>
        <div className="activity-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">📌</div>
              <div className="activity-content">
                <p className="activity-text">
                  <strong>{activity.user}</strong> {activity.action}
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="content-section">
        <div className="section-header">
          <h2>Thông tin hệ thống</h2>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Phiên bản:</span>
            <span className="info-value">1.0.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Database:</span>
            <span className="info-value">BTL_HDV1</span>
          </div>
          <div className="info-item">
            <span className="info-label">Server:</span>
            <span className="info-value">NVT</span>
          </div>
          <div className="info-item">
            <span className="info-label">Trạng thái:</span>
            <span className="info-value status-active">🟢 Hoạt động</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
