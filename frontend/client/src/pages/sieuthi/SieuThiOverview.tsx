import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function SieuThiOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalValue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get supermarket ID
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      const currentSieuThi = sieuThiRes.data.data?.find(
        st => st.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentSieuThi) {
        setLoading(false);
        return;
      }

      const maSieuThi = currentSieuThi.maSieuThi;

      // Load orders
      const ordersRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getBySieuThi(maSieuThi))
        .catch(() => ({ data: { data: [] } }));
      const orders = ordersRes.data.data || [];

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.trangThai === 'chua_nhan').length,
        completedOrders: orders.filter(o => o.trangThai === 'hoan_thanh').length,
        totalValue: orders.reduce((sum, o) => sum + (o.tongGiaTri || 0), 0)
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
        <h1>🏬 Tổng quan siêu thị</h1>
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
            <span className="kpi-title">Hoàn thành</span>
            <span className="kpi-icon">✅</span>
          </div>
          <div className="kpi-value">{stats.completedOrders}</div>
          <div className="kpi-change">Đơn hàng đã hoàn thành</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Tổng giá trị</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-value">
            {new Intl.NumberFormat('vi-VN', { 
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(stats.totalValue)}đ
          </div>
          <div className="kpi-change">Tổng giá trị đơn hàng</div>
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
              Hãy tạo đơn hàng đầu tiên của bạn
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
    </div>
  );
}

export default SieuThiOverview;
