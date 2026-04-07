import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function OrderManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maSieuThi, setMaSieuThi] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

      setMaSieuThi(currentSieuThi.maSieuThi);

      // Load orders from daily
      const ordersRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getBySieuThi(currentSieuThi.maSieuThi));
      setOrders(ordersRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (maDonHang) => {
    if (!window.confirm('Xác nhận chấp nhận đơn hàng này?')) return;
    
    try {
      await axios.put(API_ENDPOINTS.donHangSieuThi.updateTrangThai(maDonHang), {
        TrangThai: 'da_nhan'
      });
      alert('✅ Đã chấp nhận đơn hàng');
      await loadData();
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleRejectOrder = async (maDonHang) => {
    if (!window.confirm('Xác nhận từ chối đơn hàng này?')) return;
    
    try {
      await axios.put(API_ENDPOINTS.donHangSieuThi.updateTrangThai(maDonHang), {
        TrangThai: 'da_huy'
      });
      alert('✅ Đã từ chối đơn hàng');
      await loadData();
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'chua_nhan': <span className="badge badge-warning">⏳ Chờ xác nhận</span>,
      'da_nhan': <span className="badge badge-success">✅ Đã chấp nhận</span>,
      'dang_xu_ly': <span className="badge badge-info">🔄 Đang xử lý</span>,
      'hoan_thanh': <span className="badge badge-success">✅ Hoàn thành</span>,
      'da_huy': <span className="badge badge-danger">❌ Đã từ chối</span>
    };
    return badges[status] || <span className="badge">{status}</span>;
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Quản lý đơn hàng</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Đại lý</th>
              <th>Ngày đặt</th>
              <th>Ngày giao</th>
              <th>Tổng SL</th>
              <th>Tổng giá trị</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">Chưa có đơn hàng nào</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.maDonHang}>
                  <td>{order.maDonHang}</td>
                  <td>{order.tenDaiLy}</td>
                  <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                  <td>{order.ngayGiao ? new Date(order.ngayGiao).toLocaleDateString('vi-VN') : '-'}</td>
                  <td>{order.tongSoLuong} kg</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongGiaTri)}</td>
                  <td>{getStatusBadge(order.trangThai)}</td>
                  <td>{order.ghiChu || '-'}</td>
                  <td>
                    {order.trangThai === 'chua_nhan' && (
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleAcceptOrder(order.maDonHang)}
                        >
                          ✅ Chấp nhận
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRejectOrder(order.maDonHang)}
                        >
                          ❌ Từ chối
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
