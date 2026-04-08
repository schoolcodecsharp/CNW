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
  const [batches, setBatches] = useState([]);
  const [dailyList, setDailyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [maNongDan, setMaNongDan] = useState(null);
  const [formData, setFormData] = useState({
    maDaiLy: '',
    maLo: '',
    soLuong: '',
    donGia: '',
    ghiChu: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

      setMaNongDan(currentFarmer.maNongDan);

      // Load orders sent by this farmer (đơn nông dân tạo)
      const sentRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByNongDan(currentFarmer.maNongDan));
      setSentOrders(sentRes.data.data || []);

      // Load orders received (đơn đại lý tạo để mua từ nông dân)
      // TODO: Cần API endpoint mới để lấy đơn hàng mà đại lý tạo cho nông dân này
      setReceivedOrders([]);

      // Load batches (only available batches)
      const batchesRes = await axios.get(API_ENDPOINTS.loNongSan.getByNongDan(currentFarmer.maNongDan));
      const availableBatches = (batchesRes.data.data || []).filter(b => 
        b.trangThai === 'tai_trang_trai' && b.soLuongHienTai > 0
      );
      setBatches(availableBatches);

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
      maLo: '',
      soLuong: '',
      donGia: '',
      ghiChu: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      // Validate số lượng
      const selectedBatch = batches.find((b: any) => b.maLo === parseInt(formData.maLo));
      if (parseFloat(formData.soLuong) > selectedBatch.soLuongHienTai) {
        alert('❌ Số lượng vượt quá số lượng hiện có của lô!');
        return;
      }

      const payload = {
        MaDaiLy: parseInt(formData.maDaiLy),
        MaNongDan: maNongDan,
        ChiTietDonHang: [{
          MaLo: parseInt(formData.maLo),
          SoLuong: parseFloat(formData.soLuong),
          DonGia: parseFloat(formData.donGia)
        }],
        GhiChu: formData.ghiChu || null
      };

      await axios.post(API_ENDPOINTS.donHangDaiLy.create, payload);
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
      await axios.put(API_ENDPOINTS.donHangDaiLy.xacNhan(orderId));
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
      await axios.put(API_ENDPOINTS.donHangDaiLy.huyDon(orderId));
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
            disabled={batches.length === 0}
          >
            ➕ Tạo đơn bán hàng
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
          <span className="tab-desc">Đại lý muốn mua</span>
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          📤 Đơn hàng đi ({sentOrders.length})
          <span className="tab-desc">Tôi muốn bán</span>
        </button>
      </div>

      {batches.length === 0 && activeTab === 'sent' && (
        <div className="alert alert-warning">
          ⚠️ Bạn cần có lô nông sản khả dụng để tạo đơn hàng
        </div>
      )}

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
              <h2>➕ Tạo đơn bán hàng cho đại lý</h2>
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
                    <span className="label-icon">📦</span>
                    Lô nông sản <span className="required">*</span>
                  </label>
                  <select
                    value={formData.maLo}
                    onChange={(e) => setFormData({...formData, maLo: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn lô nông sản --</option>
                    {batches.map((batch: any) => (
                      <option key={batch.maLo} value={batch.maLo}>
                        {batch.tenSanPham} - {batch.tenTrangTrai} (Còn: {batch.soLuongHienTai} kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">⚖️</span>
                    Số lượng (kg) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.soLuong}
                    onChange={(e) => setFormData({...formData, soLuong: e.target.value})}
                    required
                    placeholder="Nhập số lượng"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">💰</span>
                    Đơn giá (VNĐ/kg) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.donGia}
                    onChange={(e) => setFormData({...formData, donGia: e.target.value})}
                    required
                    placeholder="Nhập đơn giá"
                    className="form-control"
                  />
                </div>

                {formData.soLuong && formData.donGia && (
                  <div className="form-group">
                    <label>💵 Tổng giá trị</label>
                    <div className="total-value">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        parseFloat(formData.soLuong) * parseFloat(formData.donGia)
                      )}
                    </div>
                  </div>
                )}

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
          color: #10b981;
          background: #f0fdf4;
        }

        .tab.active {
          color: #10b981;
          border-bottom-color: #10b981;
        }

        .tab-desc {
          font-size: 12px;
          font-weight: normal;
          color: #9ca3af;
        }

        .total-value {
          font-size: 24px;
          font-weight: bold;
          color: #10b981;
          padding: 12px;
          background: #f0fdf4;
          border-radius: 8px;
          text-align: center;
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
