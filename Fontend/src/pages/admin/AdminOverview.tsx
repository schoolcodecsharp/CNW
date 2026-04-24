import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

interface Activity {
  time: string;
  user: string;
  action: string;
  type: string;
  icon: string;
}

function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarms: 0,
    totalBatches: 0,
    totalOrders: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Tải thống kê - Lấy tất cả người dùng
      const [nongdanRes, dailyRes, sieuthiRes, trangtraiRes, loRes, donhangDaiLyRes, donhangSieuThiRes] = await Promise.all([
        axios.get(API_ENDPOINTS.nongDan.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.daiLy.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.sieuThi.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.trangTrai.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.loNongSan.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.donHangDaiLy.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.donHangSieuThi.getAll).catch(() => ({ data: { data: [] } }))
      ]);

      const totalUsers = (nongdanRes.data.data?.length || 0) + 
                        (dailyRes.data.data?.length || 0) + 
                        (sieuthiRes.data.data?.length || 0);

      const totalOrders = (donhangDaiLyRes.data.data?.length || 0) + 
                         (donhangSieuThiRes.data.data?.length || 0);

      setStats({
        totalUsers,
        totalFarms: trangtraiRes.data.data?.length || 0,
        totalBatches: loRes.data.data?.length || 0,
        totalOrders
      });

      // Tạo hoạt động gần đây từ dữ liệu thật
      const activities: Activity[] = [];
      
      // Lô nông sản mới nhất
      const batches = loRes.data.data || [];
      batches.slice(0, 3).forEach((batch: any) => {
        activities.push({
          time: formatTime(batch.ngayTao),
          user: `Lô ${batch.maLo}`,
          action: `Tạo lô nông sản mới - ${batch.tenSanPham || 'Sản phẩm'}`,
          type: 'batch',
          icon: '📦'
        });
      });

      // Đơn hàng đại lý mới nhất
      const ordersDaiLy = donhangDaiLyRes.data.data || [];
      ordersDaiLy.slice(0, 2).forEach((order: any) => {
        activities.push({
          time: formatTime(order.ngayDat),
          user: order.tenDaiLy || 'Đại lý',
          action: `Đặt đơn hàng #${order.maDonHang}`,
          type: 'order',
          icon: '🛒'
        });
      });

      // Đơn hàng siêu thị mới nhất
      const ordersSieuThi = donhangSieuThiRes.data.data || [];
      ordersSieuThi.slice(0, 2).forEach((order: any) => {
        activities.push({
          time: formatTime(order.ngayDat),
          user: order.tenSieuThi || 'Siêu thị',
          action: `Đặt đơn hàng #${order.maDonHang}`,
          type: 'order',
          icon: '🏬'
        });
      });

      // Sắp xếp theo thời gian
      activities.sort((a, b) => {
        // Sắp xếp theo thứ tự mới nhất
        return 0; // Giữ nguyên thứ tự đã có
      });

      setRecentActivities(activities.slice(0, 8));

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Vừa xong';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="page-container admin-overview">
      <div className="page-header">
        <div>
          <h1>Bảng điều khiển</h1>
          <p className="page-subtitle">Tổng quan hệ thống quản lý chuỗi cung ứng nông sản</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={loadData}>
            <span>🔄</span> Làm mới
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-users">
          <div className="kpi-icon">
            <span>👥</span>
          </div>
          <div className="kpi-content">
            <h3>Người dùng</h3>
            <p className="kpi-value">{stats.totalUsers}</p>
            <span className="kpi-label">Tổng số tài khoản</span>
          </div>
          <div className="kpi-trend positive">
            <span>↗</span> Hoạt động
          </div>
        </div>

        <div className="kpi-card kpi-farms">
          <div className="kpi-icon">
            <span>🌾</span>
          </div>
          <div className="kpi-content">
            <h3>Trang trại</h3>
            <p className="kpi-value">{stats.totalFarms}</p>
            <span className="kpi-label">Đang hoạt động</span>
          </div>
          <div className="kpi-trend positive">
            <span>↗</span> Tăng trưởng
          </div>
        </div>

        <div className="kpi-card kpi-batches">
          <div className="kpi-icon">
            <span>📦</span>
          </div>
          <div className="kpi-content">
            <h3>Lô hàng</h3>
            <p className="kpi-value">{stats.totalBatches}</p>
            <span className="kpi-label">Tổng số lô</span>
          </div>
          <div className="kpi-trend positive">
            <span>↗</span> Sản xuất
          </div>
        </div>

        <div className="kpi-card kpi-orders">
          <div className="kpi-icon">
            <span>🛒</span>
          </div>
          <div className="kpi-content">
            <h3>Đơn hàng</h3>
            <p className="kpi-value">{stats.totalOrders}</p>
            <span className="kpi-label">Tổng đơn hàng</span>
          </div>
          <div className="kpi-trend positive">
            <span>↗</span> Giao dịch
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="content-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">⚡</span>
            Hoạt động gần đây
          </h2>
          <span className="section-badge">{recentActivities.length} hoạt động</span>
        </div>
        <div className="activity-list">
          {recentActivities.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>Chưa có hoạt động nào</p>
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div key={index} className={`activity-item activity-${activity.type}`}>
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>{activity.user}</strong> {activity.action}
                  </p>
                  <span className="activity-time">
                    <span className="time-icon">🕐</span> {activity.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="content-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">ℹ️</span>
            Thông tin hệ thống
          </h2>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">📌</div>
            <div className="info-details">
              <span className="info-label">Phiên bản</span>
              <span className="info-value">1.0.0</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">💾</div>
            <div className="info-details">
              <span className="info-label">Database</span>
              <span className="info-value">BTL_HDV1</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">🖥️</div>
            <div className="info-details">
              <span className="info-label">Server</span>
              <span className="info-value">NVT</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">🟢</div>
            <div className="info-details">
              <span className="info-label">Trạng thái</span>
              <span className="info-value status-active">Hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
