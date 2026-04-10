import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function Reports() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStock: 0,
    totalShipped: 0,
    totalUsers: 0
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      // Load data for reports
      const [nongdanRes, loRes] = await Promise.all([
        axios.get(API_ENDPOINTS.nongDan.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.loNongSan.getAll).catch(() => ({ data: { data: [] } }))
      ]);

      setStats({
        totalRevenue: 0, // TODO: Calculate from orders
        totalStock: loRes.data.data?.length || 0,
        totalShipped: 0, // TODO: Calculate from orders
        totalUsers: nongdanRes.data.data?.length || 0
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Báo cáo tổng hợp</h1>
        <div className="header-actions">
          <button className="btn btn-primary">📊 Xuất báo cáo</button>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="report-icon">💰</div>
          <div className="report-content">
            <h3>Doanh thu</h3>
            <p className="report-value">{stats.totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
            <span className="report-label">Tổng doanh thu</span>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon">📦</div>
          <div className="report-content">
            <h3>Tồn kho</h3>
            <p className="report-value">{stats.totalStock}</p>
            <span className="report-label">Lô hàng trong kho</span>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon">🚚</div>
          <div className="report-content">
            <h3>Đã xuất</h3>
            <p className="report-value">{stats.totalShipped}</p>
            <span className="report-label">Lô hàng đã giao</span>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon">👥</div>
          <div className="report-content">
            <h3>Người dùng</h3>
            <p className="report-value">{stats.totalUsers}</p>
            <span className="report-label">Tổng số người dùng</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Biểu đồ thống kê</h2>
        </div>
        <div className="chart-placeholder">
          <p>📈 Biểu đồ sẽ được hiển thị ở đây</p>
          <p className="text-muted">Tích hợp Chart.js hoặc Recharts để hiển thị biểu đồ</p>
        </div>
      </div>
    </div>
  );
}

export default Reports;
