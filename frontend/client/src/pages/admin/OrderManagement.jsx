import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.donHangDaiLy.getAll);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]); // Mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người đặt</th>
              <th>Đại lý</th>
              <th>Số lượng</th>
              <th>Tổng giá trị</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.maDonHang}>
                  <td>{order.maDonHang}</td>
                  <td>{order.maNongDan}</td>
                  <td>{order.maDaiLy}</td>
                  <td>{order.tongSoLuong || 0}</td>
                  <td>{(order.tongGiaTri || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{order.ngayDat ? new Date(order.ngayDat).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>
                    <span className="badge badge-warning">{order.trangThai || 'Đang xử lý'}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-view">👁️</button>
                      <button className="btn-action btn-edit">✏️</button>
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
