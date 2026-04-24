import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function OrderManagement() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [nongdanList, setNongdanList] = useState([]);
  const [batches, setBatches] = useState([]);
  const [farmerBatches, setFarmerBatches] = useState<{[key: number]: any[]}>({});
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModalFarmer, setShowModalFarmer] = useState(false);
  const [showModalAccept, setShowModalAccept] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [maDaiLy, setMaDaiLy] = useState(null);
  const [formDataFarmer, setFormDataFarmer] = useState({
    maNongDan: '',
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
      
      console.log('[OrderManagement] Loading data...');
      console.log('[OrderManagement] User:', user);
      
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      console.log('[OrderManagement] DaiLy response:', dailyRes.data);
      
      const currentDaily = dailyRes.data.data?.find(
        (dl: any) => dl.maTaiKhoan === user?.maTaiKhoan
      );
      
      console.log('[OrderManagement] Current Daily:', currentDaily);
      
      if (!currentDaily) {
        console.error('[OrderManagement] Không tìm thấy đại lý với maTaiKhoan:', user?.maTaiKhoan);
        setLoading(false);
        return;
      }

      setMaDaiLy(currentDaily.maDaiLy);
      console.log('[OrderManagement] MaDaiLy:', currentDaily.maDaiLy);

      // Tải đơn hàng từ nông dân
      console.log('[OrderManagement] Loading orders from farmers...');
      const farmersRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByDaiLy(currentDaily.maDaiLy));
      console.log('[OrderManagement] Farmers orders response:', farmersRes.data);
      const ordersFromFarmers = (farmersRes.data.data || []).map((o: any) => ({...o, loaiDon: 'Từ nông dân'}));

      // Tải đơn hàng bán cho siêu thị
      console.log('[OrderManagement] Loading orders to supermarkets...');
      const supermarketsRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getByDaiLy(currentDaily.maDaiLy));
      console.log('[OrderManagement] Supermarkets orders response:', supermarketsRes.data);
      const ordersToSupermarkets = (supermarketsRes.data.data || []).map((o: any) => ({...o, loaiDon: 'Bán cho siêu thị'}));

      // Gộp tất cả đơn hàng
      const combinedOrders = [...ordersFromFarmers, ...ordersToSupermarkets];
      console.log('[OrderManagement] Combined orders:', combinedOrders);
      setAllOrders(combinedOrders);

      // Tải danh sách nông dân
      const nongdanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      setNongdanList(nongdanRes.data.data || []);

      // Tải danh sách lô nông sản khả dụng từ tất cả nông dân
      const allBatchesRes = await axios.get(API_ENDPOINTS.loNongSan.getAll);
      const availableBatches = (allBatchesRes.data.data || []).filter((b: any) => 
        b.trangThai === 'tai_trang_trai' && b.soLuongHienTai > 0
      );
      console.log('[OrderManagement] Available batches:', availableBatches.length);
      setBatches(availableBatches);

      // Tải danh sách kho của đại lý
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getByDaiLy(currentDaily.maDaiLy));
      setWarehouses(warehousesRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFarmer = async (e: any) => {
    e.preventDefault();
    
    try {
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
      alert('✅ Tạo đơn mua hàng thành công!');
      
      setShowModalFarmer(false);
      await loadData();
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleAcceptOrder = async () => {
    if (!selectedWarehouse) {
      alert('❌ Vui lòng chọn kho để nhận hàng!');
      return;
    }

    try {
      const payload = {
        MaKho: parseInt(selectedWarehouse)
      };

      await axios.put(API_ENDPOINTS.donHangSieuThi.updateTrangThai(selectedOrder.maDonHang), payload);
      alert('✅ Chấp nhận đơn hàng thành công!');
      
      setShowModalAccept(false);
      setSelectedOrder(null);
      setSelectedWarehouse('');
      await loadData();
    } catch (error: any) {
      console.error('Error accepting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleRejectOrder = async (order: any) => {
    if (!confirm(`Bạn có chắc muốn từ chối đơn hàng #${order.maDonHang}?`)) {
      return;
    }

    try {
      await axios.put(API_ENDPOINTS.donHangSieuThi.delete(order.maDonHang));
      alert('✅ Từ chối đơn hàng thành công!');
      await loadData();
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleOpenAcceptModal = (order: any) => {
    setSelectedOrder(order);
    setSelectedWarehouse('');
    setShowModalAccept(true);
  };

  const getAvailableBatchesByFarmer = () => {
    if (!formDataFarmer.maNongDan) return [];
    const maNongDan = parseInt(formDataFarmer.maNongDan);
    return farmerBatches[maNongDan] || [];
  };

  const loadBatchesByFarmer = async (maNongDan: number) => {
    // Nếu đã tải rồi thì không tải lại
    if (farmerBatches[maNongDan]) return;

    try {
      setLoadingBatches(true);
      const response = await axios.get(API_ENDPOINTS.loNongSan.getByNongDan(maNongDan));
      if (response.data.success) {
        const availableBatches = (response.data.data || []).filter((b: any) => 
          b.trangThai === 'tai_trang_trai' && b.soLuongHienTai > 0
        );
        setFarmerBatches(prev => ({
          ...prev,
          [maNongDan]: availableBatches
        }));
      }
    } catch (error) {
      console.error('Error loading batches for farmer:', error);
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleFarmerChange = async (maNongDan: string) => {
    setFormDataFarmer({...formDataFarmer, maNongDan, maLo: ''});
    if (maNongDan) {
      await loadBatchesByFarmer(parseInt(maNongDan));
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
        </div>
      </div>

      {batches.length === 0 && (
        <div className="alert alert-warning">
          ⚠️ Chưa có lô nông sản khả dụng từ nông dân
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Loại đơn</th>
              <th>Mã ĐH</th>
              <th>Đối tác</th>
              <th>Ngày đặt</th>
              <th>Tổng SL</th>
              <th>Tổng giá trị</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">Chưa có đơn hàng nào</td>
              </tr>
            ) : (
              allOrders.map((order: any) => (
                <tr key={`${order.loaiDon}-${order.maDonHang}`}>
                  <td><span className="order-type">{order.loaiDon}</span></td>
                  <td>{order.maDonHang}</td>
                  <td>{order.tenNongDan || order.tenSieuThi}</td>
                  <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                  <td>{order.tongSoLuong} kg</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongGiaTri)}</td>
                  <td>{getStatusBadge(order.trangThai)}</td>
                  <td>
                    {order.loaiDon === 'Bán cho siêu thị' && order.trangThai === 'chua_nhan' ? (
                      <div style={{display: 'flex', gap: '8px'}}>
                        <button 
                          className="btn-action btn-success"
                          onClick={() => handleOpenAcceptModal(order)}
                          title="Chấp nhận đơn hàng"
                        >
                          ✓ Chấp nhận
                        </button>
                        <button 
                          className="btn-action btn-danger"
                          onClick={() => handleRejectOrder(order)}
                          title="Từ chối đơn hàng"
                        >
                          ✕ Từ chối
                        </button>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Tạo đơn mua từ nông dân */}
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
                    onChange={(e) => handleFarmerChange(e.target.value)}
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
                      {loadingBatches ? (
                        <div style={{padding: '10px', textAlign: 'center', color: '#6b7280'}}>
                          Đang tải danh sách lô...
                        </div>
                      ) : (
                        <select
                          value={formDataFarmer.maLo}
                          onChange={(e) => setFormDataFarmer({...formDataFarmer, maLo: e.target.value})}
                          required
                          className="form-control"
                        >
                          <option value="">-- Chọn lô nông sản --</option>
                          {getAvailableBatchesByFarmer().length === 0 ? (
                            <option value="" disabled>Nông dân này chưa có lô nào khả dụng</option>
                          ) : (
                            getAvailableBatchesByFarmer().map((batch: any) => (
                              <option key={batch.maLo} value={batch.maLo}>
                                {batch.tenSanPham} - {batch.tenTrangTrai} (Còn: {batch.soLuongHienTai} kg)
                              </option>
                            ))
                          )}
                        </select>
                      )}
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

      {/* Modal: Chấp nhận đơn hàng từ siêu thị */}
      {showModalAccept && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModalAccept(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✓ Chấp nhận đơn hàng #{selectedOrder.maDonHang}</h2>
              <button className="btn-close" onClick={() => setShowModalAccept(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="order-info">
                <p><strong>Siêu thị:</strong> {selectedOrder.tenSieuThi}</p>
                <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.ngayDat).toLocaleDateString('vi-VN')}</p>
                <p><strong>Tổng số lượng:</strong> {selectedOrder.tongSoLuong} kg</p>
                <p><strong>Tổng giá trị:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.tongGiaTri)}</p>
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">🏪</span>
                  Chọn kho để nhận hàng <span className="required">*</span>
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="">-- Chọn kho --</option>
                  {warehouses.map((kho: any) => (
                    <option key={kho.maKho} value={kho.maKho}>
                      {kho.tenKho} - {kho.diaChi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModalAccept(false)}>
                <span>✕</span> Hủy
              </button>
              <button type="button" className="btn btn-success" onClick={handleAcceptOrder}>
                <span>✓</span> Xác nhận chấp nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .order-type {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          background: #e0f2fe;
          color: #0369a1;
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

        .alert-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
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

        .btn-success:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-action {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
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

        .order-info {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .order-info p {
          margin: 8px 0;
          font-size: 14px;
        }

        .order-info strong {
          color: #374151;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
