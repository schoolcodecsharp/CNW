import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Load orders from different services
      const [dailyOrdersRes, sieuThiOrdersRes] = await Promise.all([
        axios.get(API_ENDPOINTS.donHangDaiLy.getAll).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.donHangSieuThi.getAll).catch(() => ({ data: { data: [] } }))
      ]);

      // Combine and format orders
      const allOrders = [
        ...(dailyOrdersRes.data.data || []).map(o => ({
          ...o,
          orderType: 'Đại lý',
          orderTypeCode: 'daily',
          customerName: o.tenDaiLy || 'N/A',
          orderId: o.maDonHang,
          orderDate: o.ngayDat,
          totalAmount: o.tongGiaTri || 0,
          status: o.trangThai || 'cho_xac_nhan'
        })),
        ...(sieuThiOrdersRes.data.data || []).map(o => ({
          ...o,
          orderType: 'Siêu thị',
          orderTypeCode: 'sieuthi',
          customerName: o.tenSieuThi || 'N/A',
          orderId: o.maDonHang,
          orderDate: o.ngayDat,
          totalAmount: o.tongGiaTri || 0,
          status: o.trangThai || 'cho_xac_nhan'
        }))
      ];

      // Sort by date descending
      allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    try {
      // Load order details
      let detailsRes;
      if (order.orderTypeCode === 'daily') {
        detailsRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getById(order.orderId));
      } else {
        detailsRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getById(order.orderId));
      }
      
      setSelectedOrder({
        ...order,
        details: detailsRes.data.data
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      alert('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleUpdateStatus = async (order, newStatus) => {
    try {
      if (order.orderTypeCode === 'daily') {
        await axios.put(API_ENDPOINTS.donHangDaiLy.updateStatus(order.orderId), {
          trangThai: newStatus
        });
      } else {
        await axios.put(API_ENDPOINTS.donHangSieuThi.updateStatus(order.orderId), {
          trangThai: newStatus
        });
      }
      
      alert('Cập nhật trạng thái thành công');
      loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'cho_xac_nhan': { label: 'Chờ xác nhận', class: 'warning' },
      'da_xac_nhan': { label: 'Đã xác nhận', class: 'info' },
      'dang_giao': { label: 'Đang giao', class: 'primary' },
      'hoan_thanh': { label: 'Hoàn thành', class: 'success' },
      'da_huy': { label: 'Đã hủy', class: 'danger' }
    };
    
    const statusInfo = statusMap[status] || { label: status, class: 'secondary' };
    return <span className={`badge badge-${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const filteredOrders = orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (filterType !== 'all' && o.orderTypeCode !== filterType) return false;
    return true;
  });

  if (loading) {
    return <div className="loading">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý đơn hàng</h1>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Tổng đơn</span>
            <span className="stat-value">{orders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Chờ xác nhận</span>
            <span className="stat-value">{orders.filter(o => o.status === 'cho_xac_nhan').length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Hoàn thành</span>
            <span className="stat-value">{orders.filter(o => o.status === 'hoan_thanh').length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Loại đơn:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="daily">Đại lý</option>
            <option value="sieuthi">Siêu thị</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="cho_xac_nhan">Chờ xác nhận</option>
            <option value="da_xac_nhan">Đã xác nhận</option>
            <option value="dang_giao">Đang giao</option>
            <option value="hoan_thanh">Hoàn thành</option>
            <option value="da_huy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người đặt</th>
              <th>Đại lý/Siêu thị</th>
              <th>Số lượng</th>
              <th>Tổng giá trị</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={`${order.orderTypeCode}-${order.orderId}`}>
                  <td>{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <span className={`badge badge-${order.orderTypeCode === 'daily' ? 'info' : 'primary'}`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td>{order.soLuong || 'N/A'}</td>
                  <td>{order.totalAmount ? order.totalAmount.toLocaleString('vi-VN') + ' đ' : 'N/A'}</td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleViewOrder(order)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      {order.status === 'cho_xac_nhan' && (
                        <button 
                          className="btn-action btn-success"
                          onClick={() => handleUpdateStatus(order, 'da_xac_nhan')}
                          title="Xác nhận"
                        >
                          ✓
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

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng #{selectedOrder.orderId}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <div className="info-row">
                  <span className="label">Loại đơn:</span>
                  <span className="value">{selectedOrder.orderType}</span>
                </div>
                <div className="info-row">
                  <span className="label">Khách hàng:</span>
                  <span className="value">{selectedOrder.customerName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Ngày đặt:</span>
                  <span className="value">
                    {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Trạng thái:</span>
                  <span className="value">{getStatusBadge(selectedOrder.status)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tổng giá trị:</span>
                  <span className="value">
                    {selectedOrder.totalAmount ? selectedOrder.totalAmount.toLocaleString('vi-VN') + ' đ' : 'N/A'}
                  </span>
                </div>
              </div>

              {selectedOrder.details && selectedOrder.details.chiTiet && (
                <div className="order-items">
                  <h3>Chi tiết sản phẩm</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.details.chiTiet.map((item, index) => (
                        <tr key={index}>
                          <td>{item.tenSanPham || 'N/A'}</td>
                          <td>{item.soLuong}</td>
                          <td>{item.donGia ? item.donGia.toLocaleString('vi-VN') + ' đ' : 'N/A'}</td>
                          <td>{item.thanhTien ? item.thanhTien.toLocaleString('vi-VN') + ' đ' : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
