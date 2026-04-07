import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function DaiLyOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalWarehouses: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Get daily ID
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        dl => dl.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentDaily) {
        setLoading(false);
        return;
      }

      // Load orders
      const ordersRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByDaiLy(currentDaily.maDaiLy));
      const orders = ordersRes.data.data || [];
      
      // Load warehouses
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getByDaiLy(currentDaily.maDaiLy));
      const warehouses = warehousesRes.data.data || [];

      // Calculate stats
      const pendingOrders = orders.filter(o => o.trangThai === 'chua_nhan').length;
      const totalValue = orders.reduce((sum, o) => sum + (o.tongGiaTri || 0), 0);

      setStats({
        totalOrders: orders.length,
        pendingOrders: pendingOrders,
        totalWarehouses: warehouses.length,
        totalValue: totalValue
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Tổng quan</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Tổng đơn hàng</div>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Chờ xác nhận</div>
            <div className="stat-value">{stats.pendingOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-label">Kho hàng</div>
            <div className="stat-value">{stats.totalWarehouses}</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Tổng giá trị</div>
            <div className="stat-value">
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(stats.totalValue)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-card.warning {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        }

        .stat-card.success {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        }

        .stat-icon {
          font-size: 48px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
}

export default DaiLyOverview;
