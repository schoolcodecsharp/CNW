import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function OrderManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Get farmer ID
      const nongdanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      const currentFarmer = nongdanRes.data.data?.find(
        nd => nd.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentFarmer) {
        setLoading(false);
        return;
      }

      // Load orders
      const ordersRes = await axios.get(`${API_ENDPOINTS.nongDan.base}/don-hang-dai-ly/get-by-nong-dan/${currentFarmer.maNongDan}`);
      setOrders(ordersRes.data.data || []);

    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_ENDPOINTS.nongDan.base}/don-hang-dai-ly/update-trang-thai/${orderId}`,
        { trangThai: newStatus }
      );
      alert('Cập nhật trạng thái thành công!');
      loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Không thể cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'cho_xu_ly': 'warning',
      'dang_xu_ly': 'info',
      'dang_giao': 'primary',
      'hoan_thanh': 'success',
      'huy': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'cho_xu_ly': 'Chờ xử lý',
      'dang_xu_ly': 'Đang xử lý',
      'dang_giao': 'Đang giao',
      'hoan_thanh': 'Hoàn thành',
      'huy': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.trangThai === filterStatus);

  if (loading) {
    return <div className="loading">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Lọc theo trạng thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả ({orders.length})</option>
            <option value="cho_xu_ly">Chờ xử lý ({orders.filter(o => o.trangThai === 'cho_xu_ly').length})</option>
            <option value="dang_xu_ly">Đang xử lý ({orders.filter(o => o.trangThai === 'dang_xu_ly').length})</option>
            <option value="dang_giao">Đang giao ({orders.filter(o => o.trangThai === 'dang_giao').length})</option>
            <option value="hoan_thanh">Hoàn thành ({orders.filter(o => o.trangThai === 'hoan_thanh').length})</option>
            <option value="huy">Đã hủy ({orders.filter(o => o.trangThai === 'huy').length})</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Đại lý</th>
              <th>Loại đơn</th>
              <th>Ngày đặt</th>
              <th>Ngày giao</th>
              <th>Tổng SL</th>
              <th>Tổng giá trị</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">Không có đơn hàng nào</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.maDonHang}>
                  <td>{order.maDonHang}</td>
                  <td>{order.tenDaiLy || 'N/A'}</td>
                  <td>{order.loaiDon}</td>
                  <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                  <td>{order.ngayGiao ? new Date(order.ngayGiao).toLocaleDateString('vi-VN') : 'Chưa xác định'}</td>
                  <td>{order.tongSoLuong || 0} kg</td>
                  <td>{order.tongGiaTri?.toLocaleString('vi-VN') || 0} đ</td>
                  <td>
                    <span className={`badge badge-${getStatusBadgeClass(order.trangThai)}`}>
                      {getStatusText(order.trangThai)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {order.trangThai === 'cho_xu_ly' && (
                        <button 
                          className="btn-action btn-success"
                          onClick={() => handleUpdateStatus(order.maDonHang, 'dang_xu_ly')}
                          title="Xác nhận đơn"
                        >
                          ✓
                        </button>
                      )}
                      {order.trangThai === 'dang_xu_ly' && (
                        <button 
                          className="btn-action btn-primary"
                          onClick={() => handleUpdateStatus(order.maDonHang, 'dang_giao')}
                          title="Bắt đầu giao hàng"
                        >
                          🚚
                        </button>
                      )}
                      {order.trangThai === 'dang_giao' && (
                        <button 
                          className="btn-action btn-success"
                          onClick={() => handleUpdateStatus(order.maDonHang, 'hoan_thanh')}
                          title="Hoàn thành"
                        >
                          ✓
                        </button>
                      )}
                      {(order.trangThai === 'cho_xu_ly' || order.trangThai === 'dang_xu_ly') && (
                        <button 
                          className="btn-action btn-danger"
                          onClick={() => handleUpdateStatus(order.maDonHang, 'huy')}
                          title="Hủy đơn"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;
