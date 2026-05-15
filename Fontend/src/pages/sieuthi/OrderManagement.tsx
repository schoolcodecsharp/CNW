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
  const [dailyBatches, setDailyBatches] = useState<{[key: number]: any[]}>({});
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [maSieuThi, setMaSieuThi] = useState(null);
  const [formData, setFormData] = useState({
    maDaiLy: '',
    maLo: '',
    soLuong: '',
    donGia: '',
    ngayGiao: '',
    ghiChu: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load danh sách đại lý song song (không phụ thuộc siêu thị)
      const dailyPromise = axios.get(API_ENDPOINTS.daiLy.getAll)
        .then(res => {
          console.log('Đại lý response:', res.data);
          const list = res.data.data || res.data || [];
          console.log('Số lượng đại lý:', list.length);
          setDailyList(Array.isArray(list) ? list : []);
        })
        .catch(err => {
          console.error('Error loading dai ly:', err);
          setDailyList([]);
        });

      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      console.log('Siêu thị response:', sieuThiRes.data);
      
      const currentSieuThi = sieuThiRes.data.data?.find(
        (st: any) => st.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentSieuThi) {
        console.error('Không tìm thấy siêu thị cho user:', user);
        await dailyPromise; // Đợi load đại lý xong
        setLoading(false);
        return;
      }

      console.log('Current siêu thị:', currentSieuThi);
      setMaSieuThi(currentSieuThi.maSieuThi);

      // Load orders song song với đại lý
      const ordersPromise = axios.get(API_ENDPOINTS.donHangSieuThi.getBySieuThi(currentSieuThi.maSieuThi))
        .then(res => {
          console.log('Orders response:', res.data);
          setAllOrders(res.data.data || []);
        })
        .catch(err => {
          console.error('Error loading orders:', err);
          setAllOrders([]);
        });

      // Đợi tất cả hoàn thành
      await Promise.all([dailyPromise, ordersPromise]);

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
      ngayGiao: '',
      ghiChu: ''
    });
    setShowModal(true);
  };

  const loadBatchesByDaily = async (maDaiLy: number) => {
    // Nếu đã tải rồi thì không tải lại
    if (dailyBatches[maDaiLy]) {
      console.log('Using cached batches for daily:', maDaiLy, dailyBatches[maDaiLy]);
      return;
    }

    try {
      setLoadingBatches(true);
      console.log('Loading batches for daily:', maDaiLy);
      
      // Lấy danh sách kho của đại lý
      const khoRes = await axios.get(API_ENDPOINTS.kho.getByDaiLy(maDaiLy));
      const khoList = khoRes.data.data || [];
      console.log('Kho list:', khoList);
      
      if (khoList.length === 0) {
        console.warn('Đại lý không có kho nào');
        setDailyBatches(prev => ({ ...prev, [maDaiLy]: [] }));
        setLoadingBatches(false);
        return;
      }

      // Lấy tồn kho của tất cả kho của đại lý
      const tonKhoRes = await axios.get(API_ENDPOINTS.tonKho.getAll);
      const allTonKho = tonKhoRes.data.data || [];
      console.log('All ton kho:', allTonKho);
      
      // Lọc tồn kho thuộc các kho của đại lý
      const maKhoList = khoList.map((k: any) => k.maKho);
      const tonKhoDaily = allTonKho.filter((tk: any) => 
        maKhoList.includes(tk.maKho) && tk.soLuong > 0
      );
      console.log('Ton kho of daily:', tonKhoDaily);

      // Lấy thông tin lô nông sản
      const loNongSanRes = await axios.get(API_ENDPOINTS.loNongSan.getAll);
      const allBatches = loNongSanRes.data.data || [];
      console.log('All batches:', allBatches);
      
      // Kết hợp thông tin
      const availableBatches = tonKhoDaily.map((tk: any) => {
        const batch = allBatches.find((b: any) => b.maLo === tk.maLo);
        return {
          ...tk,
          tenSanPham: batch?.tenSanPham || 'N/A',
          donViTinh: batch?.donViTinh || 'kg'
        };
      });
      
      console.log('Available batches for daily:', availableBatches);

      setDailyBatches(prev => ({
        ...prev,
        [maDaiLy]: availableBatches
      }));
    } catch (error) {
      console.error('Error loading batches for daily:', error);
      setDailyBatches(prev => ({ ...prev, [maDaiLy]: [] }));
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleDailyChange = async (maDaiLy: string) => {
    console.log('Selected daily:', maDaiLy);
    setFormData({...formData, maDaiLy, maLo: '', soLuong: '', donGia: ''});
    if (maDaiLy) {
      await loadBatchesByDaily(parseInt(maDaiLy));
    }
  };

  const getAvailableBatchesByDaily = () => {
    if (!formData.maDaiLy) return [];
    const maDaiLy = parseInt(formData.maDaiLy);
    return dailyBatches[maDaiLy] || [];
  };

  const getSelectedBatch = () => {
    if (!formData.maLo) return null;
    const batches = getAvailableBatchesByDaily();
    return batches.find((b: any) => b.maLo === parseInt(formData.maLo));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const selectedBatch = getSelectedBatch();
      if (!selectedBatch) {
        alert('❌ Vui lòng chọn sản phẩm!');
        return;
      }
      
      if (parseFloat(formData.soLuong) > selectedBatch.soLuong) {
        alert(`❌ Số lượng vượt quá tồn kho! Tồn kho hiện tại: ${selectedBatch.soLuong} ${selectedBatch.donViTinh}`);
        return;
      }

      const payload = {
        MaSieuThi: maSieuThi,
        MaDaiLy: parseInt(formData.maDaiLy),
        NgayGiao: formData.ngayGiao || null,
        ChiTietDonHangs: [{
          MaLo: parseInt(formData.maLo),
          SoLuong: parseFloat(formData.soLuong),
          DonGia: parseFloat(formData.donGia)
        }],
        GhiChu: formData.ghiChu || null
      };

      console.log('Creating order with payload:', payload);
      
      const response = await axios.post(API_ENDPOINTS.donHangSieuThi.create, payload);
      
      console.log('Create order response:', response.data);
      alert('✅ Tạo đơn hàng thành công!');
      
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Error creating order:', error);
      console.error('Error response:', error.response?.data);
      
      // Hiển thị error chi tiết
      let errorMessage = 'Có lỗi xảy ra';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
          // Thêm debug info nếu có
          if (errorData.debug) {
            console.error('Debug info:', errorData.debug);
          }
          if (errorData.errors) {
            console.error('Validation errors:', errorData.errors);
          }
          if (errorData.stackTrace) {
            console.error('Stack trace:', errorData.stackTrace);
          }
        }
      }
      
      alert('❌ ' + errorMessage);
    }
  };

  // REMOVED: handleAcceptOrder and handleRejectOrder
  // User said to remove action buttons from supermarket order page
  // Supermarket only views orders, doesn't confirm/cancel
  // Actions are handled by distributor in KiemDinhManagement page

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'chua_nhan': <span className="badge badge-warning">⏳ Chờ xác nhận</span>,
      'cho_kiem_duyet': <span className="badge badge-info">🔍 Chờ kiểm định</span>,
      'da_nhan': <span className="badge badge-success">✅ Đã nhập kho</span>,
      'dang_xu_ly': <span className="badge badge-info">🔄 Đang xử lý</span>,
      'hoan_don': <span className="badge badge-danger">↩️ Hoàn đơn</span>,
      'hoan_thanh': <span className="badge badge-success">✅ Hoàn thành</span>,
      'da_huy': <span className="badge badge-danger">❌ Đã hủy</span>
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
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
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
                    onChange={(e) => handleDailyChange(e.target.value)}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn đại lý --</option>
                    {dailyList.filter((daily: any) => daily.trangThai !== 'da_xoa').map((daily: any) => (
                      <option key={daily.maDaiLy} value={daily.maDaiLy}>
                        {daily.tenDaiLy}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.maDaiLy && (
                  <>
                    <div className="form-group">
                      <label>
                        <span className="label-icon">📦</span>
                        Sản phẩm <span className="required">*</span>
                      </label>
                      {loadingBatches ? (
                        <div style={{padding: '10px', textAlign: 'center', color: '#6b7280'}}>
                          Đang tải danh sách sản phẩm...
                        </div>
                      ) : (
                        <select
                          value={formData.maLo}
                          onChange={(e) => setFormData({...formData, maLo: e.target.value})}
                          required
                          className="form-control"
                        >
                          <option value="">-- Chọn sản phẩm --</option>
                          {getAvailableBatchesByDaily().length === 0 ? (
                            <option value="" disabled>Đại lý này chưa có sản phẩm nào</option>
                          ) : (
                            getAvailableBatchesByDaily().map((batch: any) => (
                              <option key={batch.maLo} value={batch.maLo}>
                                {batch.tenSanPham} - Lô #{batch.maLo} (Còn: {batch.soLuong} {batch.donViTinh})
                              </option>
                            ))
                          )}
                        </select>
                      )}
                    </div>

                    {formData.maLo && (
                      <>
                        <div className="form-group">
                          <label>
                            <span className="label-icon">⚖️</span>
                            Số lượng ({getSelectedBatch()?.donViTinh || 'kg'}) <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.soLuong}
                            onChange={(e) => setFormData({...formData, soLuong: e.target.value})}
                            required
                            placeholder="Nhập số lượng"
                            className="form-control"
                            max={getSelectedBatch()?.soLuong || 0}
                          />
                          <small style={{ color: '#6b7280', marginTop: '5px', display: 'block' }}>
                            Tồn kho: {getSelectedBatch()?.soLuong || 0} {getSelectedBatch()?.donViTinh || 'kg'}
                          </small>
                        </div>

                        <div className="form-group">
                          <label>
                            <span className="label-icon">💰</span>
                            Đơn giá (VNĐ/{getSelectedBatch()?.donViTinh || 'kg'}) <span className="required">*</span>
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
                            <span className="label-icon">📅</span>
                            Ngày giao mong muốn
                          </label>
                          <input
                            type="date"
                            value={formData.ngayGiao}
                            onChange={(e) => setFormData({...formData, ngayGiao: e.target.value})}
                            className="form-control"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </>
                    )}
                  </>
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

                <div className="alert alert-info" style={{ marginTop: '15px' }}>
                  <strong>ℹ️ Lưu ý:</strong> Đơn hàng sẽ được tạo và gửi đến đại lý. 
                  Đại lý sẽ xử lý và giao hàng cho bạn.
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <span>✕</span> Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={!formData.maDaiLy || !formData.maLo}>
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

        .total-value {
          font-size: 24px;
          font-weight: bold;
          color: #8b5cf6;
          padding: 12px;
          background: #f3e8ff;
          border-radius: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
