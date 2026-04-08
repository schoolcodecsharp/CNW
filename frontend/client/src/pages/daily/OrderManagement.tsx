import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function OrderManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('from-farmers'); // 'from-farmers' or 'from-supermarkets'
  const [ordersFromFarmers, setOrdersFromFarmers] = useState([]);
  const [ordersToSupermarkets, setOrdersToSupermarkets] = useState([]);
  const [nongdanList, setNongdanList] = useState([]);
  const [sieuThiList, setSieuThiList] = useState([]);
  const [batches, setBatches] = useState([]);
  const [tonKho, setTonKho] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalFarmer, setShowModalFarmer] = useState(false);
  const [showModalSupermarket, setShowModalSupermarket] = useState(false);
  const [maDaiLy, setMaDaiLy] = useState(null);
  const [formDataFarmer, setFormDataFarmer] = useState({
    maNongDan: '',
    maLo: '',
    soLuong: '',
    donGia: '',
    ghiChu: ''
  });
  const [formDataSupermarket, setFormDataSupermarket] = useState({
    maSieuThi: '',
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
      
      // Get daily ID
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        (dl: any) => dl.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentDaily) {
        setLoading(false);
        return;
      }

      setMaDaiLy(currentDaily.maDaiLy);

      // Load orders from farmers (nông dân tạo đơn bán cho đại lý)
      const farmersRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByDaiLy(currentDaily.maDaiLy));
      setOrdersFromFarmers(farmersRes.data.data || []);

      // Load orders to supermarkets (đại lý tạo đơn bán cho siêu thị)
      const supermarketsRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getByDaiLy(currentDaily.maDaiLy));
      setOrdersToSupermarkets(supermarketsRes.data.data || []);

      // Load nongdan list
      const nongdanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      setNongdanList(nongdanRes.data.data || []);

      // Load available batches from all farmers
      const allBatchesRes = await axios.get(API_ENDPOINTS.loNongSan.getAll);
      const availableBatches = (allBatchesRes.data.data || []).filter((b: any) => 
        b.trangThai === 'tai_trang_trai' && b.soLuongHienTai > 0
      );
      setBatches(availableBatches);

      // Load ton kho (inventory) for this daily
      const tonKhoRes = await axios.get(API_ENDPOINTS.tonKho.getByDaiLy(currentDaily.maDaiLy));
      const availableTonKho = (tonKhoRes.data.data || []).filter((tk: any) => tk.soLuong > 0);
      setTonKho(availableTonKho);

      // Load sieuthi list
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      setSieuThiList(sieuThiRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFromFarmer = async (orderId: number) => {
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

  const handleRejectFromFarmer = async (orderId: number) => {
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

  const handleOpenModalFarmer = () => {
    setFormDataFarmer({
      maNongDan: '',
      maLo: '',
      soLuong: '',
      donGia: '',
      ghiChu: ''
    });
    setShowModalFarmer(true);
  };

  const handleOpenModalSupermarket = () => {
    setFormDataSupermarket({
      maSieuThi: '',
      maLo: '',
      soLuong: '',
      donGia: '',
      ghiChu: ''
    });
    setShowModalSupermarket(true);
  };

  const handleSubmitFarmer = async (e: any) => {
    e.preventDefault();
    
    try {
      // Validate số lượng
      const selectedBatch = batches.find((b: any) => b.maLo === parseInt(formDataFarmer.maLo));
      if (!selectedBatch) {
        alert('❌ Vui lòng chọn lô nông sản!');
        return;
      }
      if (parseFloat(formDataFarmer.soLuong) > selectedBatch.soLuongHienTai) {
        alert('❌ Số lượng vượt quá số lượng hiện có của lô!');
        return;
      }

      const payload = {
        MaDaiLy: maDaiLy,
        MaNongDan: parseInt(formDataFarmer.maNongDan),
        ChiTietDonHang: [{
          MaLo: parseInt(formDataFarmer.maLo),
          SoLuong: parseFloat(formDataFarmer.soLuong),
          DonGia: parseFloat(formDataFarmer.donGia)
        }],
        GhiChu: formDataFarmer.ghiChu || null
      };

      await axios.post(API_ENDPOINTS.donHangDaiLy.create, payload);
      alert('✅ Tạo đơn mua hàng thành công! Đang chờ nông dân xác nhận.');
      
      setShowModalFarmer(false);
      await loadData();
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleSubmitSupermarket = async (e: any) => {
    e.preventDefault();
    
    try {
      // Validate số lượng
      const selectedTonKho = tonKho.find((tk: any) => tk.maLo === parseInt(formDataSupermarket.maLo));
      if (!selectedTonKho) {
        alert('❌ Vui lòng chọn lô hàng từ kho!');
        return;
      }
      if (parseFloat(formDataSupermarket.soLuong) > selectedTonKho.soLuong) {
        alert('❌ Số lượng vượt quá số lượng tồn kho!');
        return;
      }

      const payload = {
        MaSieuThi: parseInt(formDataSupermarket.maSieuThi),
        MaDaiLy: maDaiLy,
        GhiChu: formDataSupermarket.ghiChu || null
      };

      await axios.post(API_ENDPOINTS.donHangSieuThi.create, payload);
      alert('✅ Tạo đơn bán hàng thành công! Đang chờ siêu thị xác nhận.');
      
      setShowModalSupermarket(false);
      await loadData();
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const getAvailableBatchesByFarmer = () => {
    if (!formDataFarmer.maNongDan) return [];
    return batches.filter((b: any) => b.maNongDan === parseInt(formDataFarmer.maNongDan));
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
            className="btn btn-success" 
            onClick={handleOpenModalFarmer}
            disabled={batches.length === 0}
          >
            ➕ Tạo đơn mua từ nông dân
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleOpenModalSupermarket}
            disabled={tonKho.length === 0}
          >
            ➕ Tạo đơn bán cho siêu thị
          </button>
        </div>
      </div>

      {batches.length === 0 && (
        <div className="alert alert-warning">
          ⚠️ Chưa có lô nông sản khả dụng từ nông dân
        </div>
      )}

      {tonKho.length === 0 && (
        <div className="alert alert-warning">
          ⚠️ Chưa có hàng tồn kho để bán cho siêu thị
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'from-farmers' ? 'active' : ''}`}
          onClick={() => setActiveTab('from-farmers')}
        >
          🌾 Đơn từ nông dân ({ordersFromFarmers.length})
          <span className="tab-desc">Nông dân muốn bán</span>
        </button>
        <button 
          className={`tab ${activeTab === 'from-supermarkets' ? 'active' : ''}`}
          onClick={() => setActiveTab('from-supermarkets')}
        >
          🏪 Đơn bán cho siêu thị ({ordersToSupermarkets.length})
          <span className="tab-desc">Tôi muốn bán</span>
        </button>
      </div>

      {/* Tab Content: Orders from Farmers */}
      {activeTab === 'from-farmers' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Nông dân</th>
                <th>Ngày đặt</th>
                <th>Tổng SL</th>
                <th>Tổng giá trị</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {ordersFromFarmers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    Chưa có đơn hàng nào từ nông dân
                  </td>
                </tr>
              ) : (
                ordersFromFarmers.map((order: any) => (
                  <tr key={order.maDonHang}>
                    <td>{order.maDonHang}</td>
                    <td>{order.tenNongDan}</td>
                    <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td>{order.tongSoLuong} kg</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongGiaTri)}</td>
                    <td>{getStatusBadge(order.trangThai)}</td>
                    <td>{order.ghiChu || '-'}</td>
                    <td>
                      {order.trangThai === 'chua_nhan' && (
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-success"
                            onClick={() => handleAcceptFromFarmer(order.maDonHang)}
                          >
                            ✓ Chấp nhận
                          </button>
                          <button 
                            className="btn-action btn-danger"
                            onClick={() => handleRejectFromFarmer(order.maDonHang)}
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

      {/* Tab Content: Orders to Supermarkets */}
      {activeTab === 'from-supermarkets' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Siêu thị</th>
                <th>Ngày đặt</th>
                <th>Tổng SL</th>
                <th>Tổng giá trị</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {ordersToSupermarkets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">Chưa có đơn hàng nào</td>
                </tr>
              ) : (
                ordersToSupermarkets.map((order: any) => (
                  <tr key={order.maDonHang}>
                    <td>{order.maDonHang}</td>
                    <td>{order.tenSieuThi}</td>
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

      {/* Modal: Create order to buy from farmer */}
      {showModalFarmer && (
        <div className="modal-overlay" onClick={() => setShowModalFarmer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Tạo đơn mua từ nông dân</h2>
              <button className="btn-close" onClick={() => setShowModalFarmer(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmitFarmer}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <span className="label-icon">🌾</span>
                    Nông dân <span className="required">*</span>
                  </label>
                  <select
                    value={formDataFarmer.maNongDan}
                    onChange={(e) => setFormDataFarmer({...formDataFarmer, maNongDan: e.target.value, maLo: ''})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn nông dân --</option>
                    {nongdanList.map((nd: any) => (
                      <option key={nd.maNongDan} value={nd.maNongDan}>
                        {nd.hoTen}
                      </option>
                    ))}
                  </select>
                </div>

                {formDataFarmer.maNongDan && (
                  <>
                    <div className="form-group">
                      <label>
                        <span className="label-icon">📦</span>
                        Lô nông sản <span className="required">*</span>
                      </label>
                      <select
                        value={formDataFarmer.maLo}
                        onChange={(e) => setFormDataFarmer({...formDataFarmer, maLo: e.target.value})}
                        required
                        className="form-control"
                      >
                        <option value="">-- Chọn lô nông sản --</option>
                        {getAvailableBatchesByFarmer().map((batch: any) => (
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
                        value={formDataFarmer.soLuong}
                        onChange={(e) => setFormDataFarmer({...formDataFarmer, soLuong: e.target.value})}
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
                        value={formDataFarmer.donGia}
                        onChange={(e) => setFormDataFarmer({...formDataFarmer, donGia: e.target.value})}
                        required
                        placeholder="Nhập đơn giá"
                        className="form-control"
                      />
                    </div>

                    {formDataFarmer.soLuong && formDataFarmer.donGia && (
                      <div className="form-group">
                        <label>💵 Tổng giá trị</label>
                        <div className="total-value">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            parseFloat(formDataFarmer.soLuong) * parseFloat(formDataFarmer.donGia)
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
                        value={formDataFarmer.ghiChu}
                        onChange={(e) => setFormDataFarmer({...formDataFarmer, ghiChu: e.target.value})}
                        placeholder="Nhập ghi chú (nếu có)"
                        rows={3}
                        className="form-control"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModalFarmer(false)}>
                  <span>✕</span> Hủy
                </button>
                <button type="submit" className="btn btn-success" disabled={!formDataFarmer.maNongDan}>
                  <span>➕</span> Tạo đơn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create order to sell to supermarket */}
      {showModalSupermarket && (
        <div className="modal-overlay" onClick={() => setShowModalSupermarket(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Tạo đơn bán cho siêu thị</h2>
              <button className="btn-close" onClick={() => setShowModalSupermarket(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmitSupermarket}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <span className="label-icon">🏪</span>
                    Siêu thị <span className="required">*</span>
                  </label>
                  <select
                    value={formDataSupermarket.maSieuThi}
                    onChange={(e) => setFormDataSupermarket({...formDataSupermarket, maSieuThi: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn siêu thị --</option>
                    {sieuThiList.map((st: any) => (
                      <option key={st.maSieuThi} value={st.maSieuThi}>
                        {st.tenSieuThi}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">📦</span>
                    Lô hàng từ kho <span className="required">*</span>
                  </label>
                  <select
                    value={formDataSupermarket.maLo}
                    onChange={(e) => setFormDataSupermarket({...formDataSupermarket, maLo: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn lô hàng --</option>
                    {tonKho.map((tk: any) => (
                      <option key={tk.maLo} value={tk.maLo}>
                        {tk.tenSanPham} - Kho {tk.tenKho} (Tồn: {tk.soLuong} kg)
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
                    value={formDataSupermarket.soLuong}
                    onChange={(e) => setFormDataSupermarket({...formDataSupermarket, soLuong: e.target.value})}
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
                    value={formDataSupermarket.donGia}
                    onChange={(e) => setFormDataSupermarket({...formDataSupermarket, donGia: e.target.value})}
                    required
                    placeholder="Nhập đơn giá"
                    className="form-control"
                  />
                </div>

                {formDataSupermarket.soLuong && formDataSupermarket.donGia && (
                  <div className="form-group">
                    <label>💵 Tổng giá trị</label>
                    <div className="total-value">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        parseFloat(formDataSupermarket.soLuong) * parseFloat(formDataSupermarket.donGia)
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
                    value={formDataSupermarket.ghiChu}
                    onChange={(e) => setFormDataSupermarket({...formDataSupermarket, ghiChu: e.target.value})}
                    placeholder="Nhập ghi chú (nếu có)"
                    rows={3}
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModalSupermarket(false)}>
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
          color: #3b82f6;
          background: #eff6ff;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-desc {
          font-size: 12px;
          font-weight: normal;
          color: #9ca3af;
        }

        .btn-success {
          background: #10b981;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-success:hover {
          background: #059669;
        }

        .btn-action.btn-success {
          padding: 6px 12px;
        }

        .btn-action.btn-danger {
          background: #ef4444;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-action.btn-danger:hover {
          background: #dc2626;
        }

        .alert-info {
          background: #eff6ff;
          border: 1px solid #3b82f6;
          color: #1e40af;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .alert-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .total-value {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
          padding: 12px;
          background: #eff6ff;
          border-radius: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
