import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function OrderManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [sentOrders, setSentOrders] = useState([]);
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
      
      // Get supermarket ID
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      const currentSieuThi = sieuThiRes.data.data?.find(
        (st: any) => st.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentSieuThi) {
        setLoading(false);
        return;
      }

      setMaSieuThi(currentSieuThi.maSieuThi);

      // Load orders received from daily (đại lý tạo đơn bán cho siêu thị)
      const receivedRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getBySieuThi(currentSieuThi.maSieuThi));
      setReceivedOrders(receivedRes.data.data || []);

      // Load orders sent to daily (siêu thị tạo đơn mua từ đại lý)
      // TODO: Cần API endpoint mới
      setSentOrders([]);

      // Load daily list
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
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
        GhiChu: formData.ghiChu || null
      };

      await axios.post(API_ENDPOINTS.donHangSieuThi.create, payload);
      alert('✅ Tạo đơn hàng thành công! Đang chờ đại lý xác nhận.');
      
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleAcceptOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc muốn chấp nhận đơn hàng này?')) return;
    
    try {
      await axios.put(API_ENDPOINTS.donHangSieuThi.updateTrangThai(orderId), {
        TrangThai: 'da_nhan'
      });
      alert('✅ Đã chấp nhận đơn hàng!');
      await loadData();
    } catch (error: any) {
      console.error('Error accepting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc muốn từ chối đơn hàng này?')) return;
    
    try {
      await axios.delete(API_ENDPOINTS.donHangSieuThi.delete(orderId));
      alert('✅ Đã từ chối đơn hàng!');
      await loadData();
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
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

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          📥 Đơn hàng đến ({receivedOrders.length})
          <span className="tab-desc">Đại lý muốn bán</span>
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          📤 Đơn hàng đi ({sentOrders.length})
          <span className="tab-desc">Tôi muốn mua</span>
        </button>
      </div>

      {/* Tab Content: Received Orders */}
      {activeTab === 'received' && (
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
              {receivedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Chưa có đơn hàng nào từ đại lý
                  </td>
                </tr>
              ) : (
                receivedOrders.map((order: any) => (
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
                            onClick={() => handleAcceptOrder(order.maDonHang)}
                          >
                            ✓ Chấp nhận
                          </button>
                          <button 
                            className="btn-action btn-danger"
                            onClick={() => handleRejectOrder(order.maDonHang)}
                          >
                            ✕ Từ chối
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
      )}

      {/* Tab Content: Sent Orders */}
      {activeTab === 'sent' && (
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
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {sentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">Chưa có đơn hàng nào</td>
                </tr>
              ) : (
                sentOrders.map((order: any) => (
                  <tr key={order.maDonHang}>
                    <td>{order.maDonHang}</td>
                    <td>{order.tenDaiLy}</td>
                    <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td>{order.tongSoLuong} kg</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongGiaTri)}</td>
                    <td>{getStatusBadge(order.trangThai)}</td>
                    <td>{order.ghiChu || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
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
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .tab:hover {
          color: #8b5cf6;
          background: #f5f3ff;
        }

        .tab.active {
          color: #8b5cf6;
          border-bottom-color: #8b5cf6;
        }

        .tab-desc {
          font-size: 12px;
          font-weight: normal;
          color: #9ca3af;
        }

        .btn-success {
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-success:hover {
          background: #059669;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-danger:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
