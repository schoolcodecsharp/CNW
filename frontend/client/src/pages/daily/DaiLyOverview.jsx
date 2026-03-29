import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function DaiLyOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWarehouses: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalInventory: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get distributor ID
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        dl => dl.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentDaily) {
        setLoading(false);
        return;
      }

      const maDaiLy = currentDaily.maDaiLy;

      // Load warehouses
      const warehousesRes = await axios.get(`${API_ENDPOINTS.daiLy.base}/kho/get-by-dai-ly/${maDaiLy}`)
        .catch(() => ({ data: { data: [] } }));
      const warehouses = warehousesRes.data.data || [];

      // Load orders
      const ordersRes = await axios.get(`${API_ENDPOINTS.daiLy.base}/don-hang-dai-ly/get-by-dai-ly/${maDaiLy}`)
        .catch(() => ({ data: { data: [] } }));
      const orders = ordersRes.data.data || [];

      setStats({
        totalWarehouses: warehouses.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.trangThai === 'cho_xu_ly').length,
        totalInventory: warehouses.reduce((sum, w) => sum + (w.tongSoLuong || 0), 0)
      });

      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard:', error);
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
        <h1>Tổng quan</h1>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Kho hàng</span>
            <span className="kpi-icon">🏪</span>
          </div>
          <div className="kpi-value">{stats.totalWarehouses}</div>
          <div className="kpi-change">Tổng số kho</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Tồn kho</span>
            <span className="kpi-icon">📦</span>
          </div>
          <div className="kpi-value">{stats.totalInventory}</div>
          <div className="kpi-change">Tổng số lượng (kg)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Đơn hàng</span>
            <span className="kpi-icon">🛒</span>
          </div>
          <div className="kpi-value">{stats.totalOrders}</div>
          <div className="kpi-change">Tổng số đơn</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Chờ xử lý</span>
            <span className="kpi-icon">⏳</span>
          </div>
          <div className="kpi-value">{stats.pendingOrders}</div>
          <div className="kpi-change">Đơn hàng mới</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="section-card">
        <h2>Đơn hàng gần đây</h2>
        {recentOrders.length === 0 ? (
          <p className="empty-message">Chưa có đơn hàng nào</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Nông dân</th>
                  <th>Ngày đặt</th>
                  <th>Tổng giá trị</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.maDonHang}>
                    <td>{order.maDonHang}</td>
                    <td>{order.tenNongDan || 'N/A'}</td>
                    <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td>{order.tongGiaTri?.toLocaleString('vi-VN')} đ</td>
                    <td>
                      <span className={`badge badge-${order.trangThai}`}>
                        {order.trangThai === 'cho_xu_ly' ? 'Chờ xử lý' :
                         order.trangThai === 'dang_xu_ly' ? 'Đang xử lý' :
                         order.trangThai === 'hoan_thanh' ? 'Hoàn thành' : order.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DaiLyOverview;
