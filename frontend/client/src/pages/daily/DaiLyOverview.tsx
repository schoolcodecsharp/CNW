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
    totalInventory: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentInventory, setRecentInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

      const maDaiLy = currentDaily.maDaiLy;

      // Load orders
      const ordersRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByDaiLy(maDaiLy))
        .catch(() => ({ data: { data: [] } }));
      const orders = ordersRes.data.data || [];
      
      // Load warehouses
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getByDaiLy(maDaiLy))
        .catch(() => ({ data: { data: [] } }));
      const warehouses = warehousesRes.data.data || [];

      // Load inventory
      const inventoryRes = await axios.get(API_ENDPOINTS.tonKho.getByDaiLy(maDaiLy))
        .catch(() => ({ data: { data: [] } }));
      const inventory = inventoryRes.data.data || [];

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.trangThai === 'chua_nhan').length,
        totalWarehouses: warehouses.length,
        totalInventory: inventory.length
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentInventory(inventory.slice(0, 5));

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
        <h1>🏪 Tổng quan đại lý</h1>
        <p style={{ color: '#64748b', marginTop: '10px' }}>
          Chào mừng trở lại! Đây là tổng quan về hoạt động kinh doanh của bạn.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Đơn hàng</span>
            <span className="kpi-icon">📦</span>
          </div>
          <div className="kpi-value">{stats.totalOrders}</div>
          <div className="kpi-change">Tổng số đơn hàng</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Chờ xác nhận</span>
            <span className="kpi-icon">⏳</span>
          </div>
          <div className="kpi-value">{stats.pendingOrders}</div>
          <div className="kpi-change">Đơn hàng cần xử lý</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Kho hàng</span>
            <span className="kpi-icon">🏪</span>
          </div>
          <div className="kpi-value">{stats.totalWarehouses}</div>
          <div className="kpi-change">Tổng số kho đang quản lý</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Tồn kho</span>
            <span className="kpi-icon">📊</span>
          </div>
          <div className="kpi-value">{stats.totalInventory}</div>
          <div className="kpi-change">Lô hàng trong kho</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="section-card">
        <h2>📦 Đơn hàng gần đây</h2>
        {recentOrders.length === 0 ? (
          <div className="empty-message">
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>📦</div>
            <div>Chưa có đơn hàng nào</div>
            <div style={{ fontSize: '0.9em', marginTop: '8px' }}>
              Đơn hàng sẽ xuất hiện khi có giao dịch
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Loại đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng giá trị</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.maDonHang}>
                    <td><strong>#{order.maDonHang}</strong></td>
                    <td>
                      {order.loaiDon === 'daily_to_nongdan' ? '🌾 Từ nông dân' : '🏬 Đến siêu thị'}
                    </td>
                    <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td><strong>{order.tongGiaTri?.toLocaleString('vi-VN')} đ</strong></td>
                    <td>
                      <span className={`badge badge-${order.trangThai}`}>
                        {order.trangThai === 'chua_nhan' ? '⏳ Chưa nhận' :
                         order.trangThai === 'da_nhan' ? '✅ Đã nhận' :
                         order.trangThai === 'dang_xu_ly' ? '🔄 Đang xử lý' :
                         order.trangThai === 'hoan_thanh' ? '✅ Hoàn thành' : order.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Inventory */}
      <div className="section-card">
        <h2>📊 Tồn kho gần đây</h2>
        {recentInventory.length === 0 ? (
          <div className="empty-message">
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>📊</div>
            <div>Chưa có hàng tồn kho</div>
            <div style={{ fontSize: '0.9em', marginTop: '8px' }}>
              Hàng tồn kho sẽ xuất hiện khi nhập hàng
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kho</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn vị</th>
                  <th>Cập nhật cuối</th>
                </tr>
              </thead>
              <tbody>
                {recentInventory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.tenKho}</td>
                    <td><strong>{item.tenSanPham}</strong></td>
                    <td><strong>{item.soLuong}</strong></td>
                    <td>{item.donViTinh}</td>
                    <td>{new Date(item.capNhatCuoi).toLocaleDateString('vi-VN')}</td>
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
