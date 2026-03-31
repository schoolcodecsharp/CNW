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
      
      // Get distributor ID
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        dl => dl.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentDaily) {
        setLoading(false);
        return;
      }

      // Load orders
      const ordersRes = await axios.get(`${API_ENDPOINTS.daiLy.base}/don-hang-dai-ly/get-by-dai-ly/${currentDaily.maDaiLy}`);
      setOrders(ordersRes.data.data || []);

    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
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
              <th>Nông dân</th>
              <th>Loại đơn</th>
              <th>Ngày đặt</th>
              <th>Ngày giao</th>
              <th>Tổng SL</th>
              <th>Tổng giá trị</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">Không có đơn hàng nào</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.maDonHang}>
                  <td>{order.maDonHang}</td>
                  <td>{order.tenNongDan || 'N/A'}</td>
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
                  <td>{order.ghiChu || '-'}</td>
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
