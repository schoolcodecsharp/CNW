import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function OrderManagement() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
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
      
      const nongdanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      const currentFarmer = nongdanRes.data.data?.find(
        nd => nd.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentFarmer) {
        setLoading(false);
        return;
      }

      setMaNongDan(currentFarmer.maNongDan);

      const ordersRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByNongDan(currentFarmer.maNongDan));
      setAllOrders(ordersRes.data.data || []);

      const batchesRes = await axios.get(API_ENDPOINTS.loNongSan.getByNongDan(currentFarmer.maNongDan));
      const availableBatches = (batchesRes.data.data || []).filter(b => 
        b.trangThai === 'tai_trang_trai' && b.soLuongHienTai > 0
      );
      setBatches(availableBatches);

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
      alert('✅ Tạo đơn hàng thành công!');
      
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Error creating order:', error);
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

      {batches.length === 0 && (
        <div className="alert alert-warning">
          ⚠️ Bạn cần có lô nông sản khả dụng để tạo đơn hàng
        </div>
      )}

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
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Chưa có đơn hàng nào</td>
              </tr>
            ) : (
              allOrders.map((order: any) => (
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
        .total-value {
          font-size: 24px;
          font-weight: bold;
          color: #10b981;
          padding: 12px;
          background: #f0fdf4;
          border-radius: 8px;
          text-align: center;
        }

        .alert-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
