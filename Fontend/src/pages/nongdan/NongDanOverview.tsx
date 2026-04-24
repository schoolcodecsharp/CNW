import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function NongDanOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFarms: 0,
    totalBatches: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentBatches, setRecentBatches] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Lấy ID nông dân từ user
      const nongdanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      const currentFarmer = nongdanRes.data.data?.find(
        nd => nd.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentFarmer) {
        setLoading(false);
        return;
      }

      const maNongDan = currentFarmer.maNongDan;

      // Tải danh sách trang trại
      const farmsRes = await axios.get(API_ENDPOINTS.trangTrai.getByNongDan(maNongDan))
        .catch(() => ({ data: { data: [] } }));
      const farms = farmsRes.data.data || [];

      // Tải danh sách lô nông sản
      const batchesRes = await axios.get(API_ENDPOINTS.loNongSan.getByNongDan(maNongDan))
        .catch(() => ({ data: { data: [] } }));
      const batches = batchesRes.data.data || [];

      // Tải danh sách đơn hàng
      const ordersRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByNongDan(maNongDan))
        .catch(() => ({ data: { data: [] } }));
      const orders = ordersRes.data.data || [];

      // Tính tổng doanh thu từ các đơn hàng đã hoàn thành
      const totalRevenue = orders
        .filter(o => o.trangThai === 'hoan_thanh' || o.trangThai === 'da_nhan')
        .reduce((sum, o) => sum + (o.tongGiaTri || 0), 0);

      setStats({
        totalFarms: farms.length,
        totalBatches: batches.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue
      });

      setRecentBatches(batches.slice(0, 5));
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
        <h1>🌾 Tổng quan trang trại</h1>
        <p style={{ color: '#64748b', marginTop: '10px' }}>
          Chào mừng trở lại! Đây là tổng quan về hoạt động trang trại của bạn.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Trang trại</span>
            <span className="kpi-icon">🌾</span>
          </div>
          <div className="kpi-value">{stats.totalFarms}</div>
          <div className="kpi-change">Tổng số trang trại đang quản lý</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Lô nông sản</span>
            <span className="kpi-icon">📦</span>
          </div>
          <div className="kpi-value">{stats.totalBatches}</div>
          <div className="kpi-change">Lô đang trong kho</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Đơn hàng</span>
            <span className="kpi-icon">🛒</span>
          </div>
          <div className="kpi-value">{stats.totalOrders}</div>
          <div className="kpi-change">Tổng số đơn hàng</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Doanh thu</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-value">
            {new Intl.NumberFormat('vi-VN', { 
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(stats.totalRevenue)}đ
          </div>
          <div className="kpi-change">Tổng doanh thu từ đơn hàng</div>
        </div>
      </div>

      {/* Recent Batches */}
      <div className="section-card">
        <h2>📦 Lô nông sản gần đây</h2>
        {recentBatches.length === 0 ? (
          <div className="empty-message">
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>📦</div>
            <div>Chưa có lô nông sản nào</div>
            <div style={{ fontSize: '0.9em', marginTop: '8px' }}>
              Hãy tạo lô nông sản đầu tiên của bạn
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã lô</th>
                  <th>Trang trại</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {recentBatches.map((batch) => (
                  <tr key={batch.maLo}>
                    <td><strong>#{batch.maLo}</strong></td>
                    <td>{batch.tenTrangTrai}</td>
                    <td>{batch.tenSanPham}</td>
                    <td><strong>{batch.soLuongHienTai} kg</strong></td>
                    <td>
                      <span className={`badge badge-${batch.trangThai}`}>
                        {batch.trangThai === 'tai_trang_trai' ? '🏡 Tại trang trại' :
                         batch.trangThai === 'dang_van_chuyen' ? '🚚 Đang vận chuyển' :
                         batch.trangThai === 'da_giao' ? '✅ Đã giao' : batch.trangThai}
                      </span>
                    </td>
                    <td>{new Date(batch.ngayTao).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="section-card">
        <h2>🛒 Đơn hàng gần đây</h2>
        {recentOrders.length === 0 ? (
          <div className="empty-message">
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>🛒</div>
            <div>Chưa có đơn hàng nào</div>
            <div style={{ fontSize: '0.9em', marginTop: '8px' }}>
              Đơn hàng sẽ xuất hiện khi có đại lý đặt hàng
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Đại lý</th>
                  <th>Ngày đặt</th>
                  <th>Tổng giá trị</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.maDonHang}>
                    <td><strong>#{order.maDonHang}</strong></td>
                    <td>{order.tenDaiLy || 'N/A'}</td>
                    <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td><strong>{order.tongGiaTri?.toLocaleString('vi-VN')} đ</strong></td>
                    <td>
                      <span className={`badge badge-${order.trangThai}`}>
                        {order.trangThai === 'chua_nhan' ? '⏳ Chờ xác nhận' :
                         order.trangThai === 'da_nhan' ? '✅ Đã nhận' :
                         order.trangThai === 'dang_xu_ly' ? '🔄 Đang xử lý' :
                         order.trangThai === 'hoan_thanh' ? '✅ Hoàn thành' :
                         order.trangThai === 'da_huy' ? '❌ Đã hủy' : order.trangThai}
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

export default NongDanOverview;
