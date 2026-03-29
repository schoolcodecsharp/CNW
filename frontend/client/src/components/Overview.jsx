import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './Common.css';

function Overview() {
  const [stats, setStats] = useState({
    totalNongDan: 0,
    totalTrangTrai: 0,
    totalLoNongSan: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [nongdan, trangtrai, lonongsan] = await Promise.all([
        apiService.getNongDan(),
        apiService.getTrangTrai(),
        apiService.getLoNongSan()
      ]);

      setStats({
        totalNongDan: nongdan.data?.length || 0,
        totalTrangTrai: trangtrai.data?.length || 0,
        totalLoNongSan: lonongsan.data?.length || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Tổng quan hệ thống</h1>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
            👨‍🌾
          </div>
          <div className="stat-info">
            <h3>Tổng nông dân</h3>
            <p className="stat-number">{stats.totalNongDan}</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
            🌾
          </div>
          <div className="stat-info">
            <h3>Tổng trang trại</h3>
            <p className="stat-number">{stats.totalTrangTrai}</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            📦
          </div>
          <div className="stat-info">
            <h3>Tổng lô nông sản</h3>
            <p className="stat-number">{stats.totalLoNongSan}</p>
          </div>
        </div>
      </div>

      <div className="info-box">
        <div className="info-icon">ℹ️</div>
        <div>
          <h3>Chào mừng đến với hệ thống quản lý chuỗi cung ứng nông sản!</h3>
          <p>Sử dụng menu bên trái để quản lý nông dân, trang trại và lô nông sản.</p>
        </div>
      </div>
    </div>
  );
}

export default Overview;
