import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';
import '../../components/Common.css';

function OrderManagement() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [dailyList, setDailyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [maSieuThi, setMaSieuThi] = useState(null);
  const [formData, setFormData] = useState({
    maDaiLy: '',
    ghiChu: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      console.log('Siêu thị response:', sieuThiRes.data);
      
      const currentSieuThi = sieuThiRes.data.data?.find(
        (st: any) => st.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentSieuThi) {
        console.error('Không tìm thấy siêu thị cho user:', user);
        setLoading(false);
        return;
      }

      console.log('Current siêu thị:', currentSieuThi);
      setMaSieuThi(currentSieuThi.maSieuThi);

      const ordersRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getBySieuThi(currentSieuThi.maSieuThi));
      console.log('Orders response:', ordersRes.data);
      setAllOrders(ordersRes.data.data || []);

      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      console.log('Đại lý response:', dailyRes.data);
      console.log('Số lượng đại lý:', dailyRes.data.data?.length || 0);
      setDailyList(dailyRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      maDaiLy: '',
      ghiChu: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const payload = {
        MaSieuThi: maSieuThi,
        MaDaiLy: parseInt(formData.maDaiLy),
        NgayGiao: null,
        GhiChu: formData.ghiChu || null
      };

      console.log('Creating order with payload:', payload);
      
      // API endpoint: POST /api/DonHangSieuThi/tao-don-hang
      const response = await axios.post(API_ENDPOINTS.donHangSieuThi.create, payload);
      
      console.log('Create order response:', response.data);
      alert('✅ Tạo đơn hàng thành công!');
      
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Error creating order:', error);
      console.error('Error response:', error.response?.data);
      alert('❌ ' + (error.response?.data?.message || error.response?.data || 'Có lỗi xảy ra'));
    }
  };

  const handleAcceptOrder = async (orderId: number, maDaiLy: number) => {
    // Cần chọn kho để nhận hàng
    try {
      // Tải danh sách kho của siêu thị
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getBySieuThi(maSieuThi!));
      
      if (!warehousesRes.data.success || !warehousesRes.data.data || warehousesRes.data.data.length === 0) {
        alert('❌ Bạn chưa có kho nào! Vui lòng tạo kho trước khi nhận hàng.');
        return;
      }

      const warehouses = warehousesRes.data.data;
      
      // Nếu chỉ có 1 kho, tự động chọn
      let selectedWarehouse = warehouses[0].maKho;
      
      // Nếu có nhiều kho, cho người dùng chọn
      if (warehouses.length > 1) {
        const warehouseOptions = warehouses.map((w: any) => 
          `${w.maKho}. ${w.tenKho} (${w.diaChi || 'Không có địa chỉ'})`
        ).join('\n');
        
        const choice = prompt(`Chọn kho để nhận hàng:\n${warehouseOptions}\n\nNhập mã kho:`);
        
        if (!choice) return; // User cancelled
        
        selectedWarehouse = parseInt(choice);
        
        if (!warehouses.find((w: any) => w.maKho === selectedWarehouse)) {
          alert('❌ Mã kho không hợp lệ!');
          return;
        }
      }

      if (!window.confirm(`Xác nhận nhận hàng vào kho #${selectedWarehouse}?`)) return;
      
      // API endpoint: PUT /api/DonHangSieuThi/nhan-hang/{id}
      await axios.put(`${API_ENDPOINTS.donHangSieuThi.base}/nhan-hang/${orderId}`, {
        MaKho: selectedWarehouse
      });
      
      alert('✅ Đã nhận hàng thành công!');
      await loadData();
    } catch (error: any) {
      console.error('Error accepting order:', error);
      alert('❌ ' + (error.response?.data?.message || error.response?.data || 'Có lỗi xảy ra'));
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    
    try {
      // API endpoint: PUT /api/DonHangSieuThi/huy-don-hang/{id}
      await axios.put(`${API_ENDPOINTS.donHangSieuThi.base}/huy-don-hang/${orderId}`);
      alert('✅ Đã hủy đơn hàng!');
      await loadData();
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      alert('❌ ' + (error.response?.data?.message || error.response?.data || 'Có lỗi xảy ra'));
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'chua_nhan': <span className="badge badge-warning">⏳ Chờ xác nhận</span>,
      'da_nhan': <span className="badge badge-success">✅ Đã chấp nhận</span>,
      'dang_xu_ly': <span className="badge badge-info">🔄 Đang xử lý</span>,
      'hoan_thanh': <span className="badge badge-success">✅ Hoàn thành</span>,
      'da_huy': <span className="badge badge-danger">❌ Đã từ chối</span>
    };
    return badges[status] || <span className="badge">{status}</span>;
  };

  // Sử dụng hook phân trang
  const {
    currentPage,
    pageSize,
    paginatedData: paginatedOrders,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = usePagination({ data: allOrders, initialPageSize: 10 });

  if (loading) {
    return <div className="loading">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Quản lý đơn hàng</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleOpenModal}
          >
            ➕ Tạo đơn mua hàng
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Đại lý</th>
              <th>Ngày đặt</th>
              <th>Tổng SL</th>
              <th>Tổng giá trị</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order: any) => (
                <tr key={order.maDonHang}>
                  <td>{order.maDonHang}</td>
                  <td>{order.tenDaiLy}</td>
                  <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                  <td>{order.tongSoLuong} kg</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongGiaTri)}</td>
                  <td>{getStatusBadge(order.trangThai)}</td>
                  <td>
                    {order.trangThai === 'chua_nhan' && (
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-success"
                          onClick={() => handleAcceptOrder(order.maDonHang, order.maDaiLy)}
                          title="Nhận hàng"
                        >
                          ✓
                        </button>
                        <button 
                          className="btn-action btn-danger"
                          onClick={() => handleRejectOrder(order.maDonHang)}
                          title="Hủy đơn"
                        >
                          ✕
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

      {/* Phân trang */}
      <TablePagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Tạo đơn mua hàng từ đại lý</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <span className="label-icon">🏪</span>
                    Đại lý <span className="required">*</span>
                  </label>
                  <select
                    value={formData.maDaiLy}
                    onChange={(e) => setFormData({...formData, maDaiLy: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn đại lý --</option>
                    {dailyList.map((daily: any) => (
                      <option key={daily.maDaiLy} value={daily.maDaiLy}>
                        {daily.tenDaiLy}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">📝</span>
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                    placeholder="Nhập ghi chú (nếu có)"
                    rows={3}
                    className="form-control"
                  />
                </div>

                <div className="alert alert-info" style={{ marginTop: '15px' }}>
                  <strong>ℹ️ Lưu ý:</strong> Đơn hàng sẽ được tạo và gửi đến đại lý. 
                  Đại lý sẽ xử lý và giao hàng cho bạn.
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <span>✕</span> Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>➕</span> Tạo đơn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .action-buttons {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .btn-action {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-action.btn-success {
          background: #10b981;
          color: white;
        }

        .btn-action.btn-success:hover {
          background: #059669;
        }

        .btn-action.btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-action.btn-danger:hover {
          background: #dc2626;
        }

        .alert-info {
          background: #dbeafe;
          border: 1px solid #3b82f6;
          color: #1e40af;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
