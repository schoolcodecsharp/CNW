import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { dailyService } from '../../services/dailyService';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

interface DonHang {
  maDonHang: number;
  maNongDan?: number;
  tenNongDan?: string;
  sdtNongDan?: string;
  maSieuThi?: number;
  tenSieuThi?: string;
  ngayDat: string;
  trangThai: string;
  tongSoLuong: number;
  tongGiaTri: number;
  ghiChu: string;
}

interface Kho {
  maKho: number;
  tenKho: string;
  diaChi: string;
}

const KiemDinhManagement = () => {
  const { user } = useAuth();
  const [maDaiLy, setMaDaiLy] = useState<number>(0);
  const [khoList, setKhoList] = useState<Kho[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Toast notification
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Đơn hàng từ nông dân chờ kiểm định
  const [donHangNongDan, setDonHangNongDan] = useState<DonHang[]>([]);
  
  // Đơn hàng từ siêu thị
  const [donHangSieuThiMoi, setDonHangSieuThiMoi] = useState<DonHang[]>([]);
  const [donHangSieuThiHoan, setDonHangSieuThiHoan] = useState<DonHang[]>([]);
  
  // Modal state
  const [showKhoModal, setShowKhoModal] = useState(false);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);
  const [selectedKho, setSelectedKho] = useState<number>(0);
  const [modalType, setModalType] = useState<'nongdan' | 'sieuthi'>('nongdan'); // Track modal purpose
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'nongdan' | 'sieuthi_moi' | 'sieuthi_hoan'>('nongdan');

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setInitialLoading(true);
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        (dl: any) => dl.maTaiKhoan === user?.maTaiKhoan
      );
      if (!currentDaily) { setInitialLoading(false); return; }
      
      setMaDaiLy(currentDaily.maDaiLy);
      await loadAllData(currentDaily.maDaiLy);
    } catch (error) {
      console.error('Error init:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadAllData = async (id: number) => {
    try {
      const [khoRes, ndRes, stMoiRes, stHoanRes] = await Promise.all([
        axios.get(API_ENDPOINTS.kho.getByDaiLy(id)).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/cho-kiem-dinh/${id}`).catch(() => ({ data: { data: [] } })),
        dailyService.getDonHangSieuThiChuaXacNhan(id).catch(() => ({ data: [] })),
        dailyService.getDonHangSieuThiHoanDon(id).catch(() => ({ data: [] }))
      ]);

      setKhoList(khoRes.data.data || []);
      setDonHangNongDan(ndRes.data.data || []);
      setDonHangSieuThiMoi(stMoiRes.data || []);
      setDonHangSieuThiHoan(stHoanRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Helper function to show toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // === KIỂM ĐỊNH ĐẠT (Nông dân) ===
  const handleKiemDinhDat = (dh: DonHang) => {
    if (khoList.length === 0) { alert('⚠️ Chưa có kho! Tạo kho trước.'); return; }
    setSelectedDonHang(dh);
    setSelectedKho(khoList[0].maKho);
    setModalType('nongdan');
    setShowKhoModal(true);
  };

  const confirmKiemDinhDat = async () => {
    if (!selectedDonHang || !selectedKho) { 
      showToast('Vui lòng chọn kho!', 'error');
      return; 
    }
    
    // Đóng modal ngay
    setShowKhoModal(false);
    
    try {
      setLoading(true);
      
      const res = await axios.put(
        `${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/kiem-dinh/${selectedDonHang.maDonHang}`,
        { maDaiLy: maDaiLy, maKho: selectedKho, ketQuaKiemDinh: true }
      );
      
      // Reload dữ liệu
      await loadAllData(maDaiLy);
      
      // Reset selected
      setSelectedDonHang(null);
      
      // Hiển thị thông báo thành công
      const message = res.data?.message || 'Kiểm định đạt, đã nhập kho thành công';
      showToast(message, 'success');
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      showToast(errorMsg, 'error');
      console.error('Lỗi kiểm định:', error);
    } finally {
      setLoading(false);
    }
  };

  // === KIỂM ĐỊNH KHÔNG ĐẠT (Nông dân) ===
  const handleKiemDinhKhongDat = async (dh: DonHang) => {
    if (!confirm(`❌ Kiểm định KHÔNG ĐẠT?\n\nĐơn #${dh.maDonHang} sẽ hoàn về nông dân ${dh.tenNongDan}.`)) return;
    
    try {
      setLoading(true);
      const res = await axios.put(
        `${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/kiem-dinh/${dh.maDonHang}`,
        { maDaiLy: maDaiLy, maKho: 0, ketQuaKiemDinh: false }
      );
      
      // Reload dữ liệu
      await loadAllData(maDaiLy);
      
      // Hiển thị thông báo
      const message = res.data?.message || 'Kiểm định không đạt, đã hoàn đơn về nông dân';
      showToast(message, 'success');
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      showToast(errorMsg, 'error');
      console.error('Lỗi kiểm định:', error);
    } finally {
      setLoading(false);
    }
  };

  // === XÁC NHẬN ĐƠN TỪ SIÊU THỊ (CHỌN KHO) ===
  const handleXacNhanSieuThi = (dh: DonHang) => {
    if (khoList.length === 0) { 
      alert('⚠️ Chưa có kho! Tạo kho trước khi xác nhận.'); 
      return; 
    }
    setSelectedDonHang(dh);
    setSelectedKho(khoList[0].maKho);
    setModalType('sieuthi');
    setShowKhoModal(true);
  };

  const confirmXacNhanSieuThi = async () => {
    if (!selectedDonHang || !selectedKho) { 
      showToast('Vui lòng chọn kho!', 'error');
      return; 
    }
    
    // Đóng modal ngay
    setShowKhoModal(false);
    
    try {
      setLoading(true);
      
      // Kiểm tra xem đơn hàng đang ở trạng thái nào
      const isHoanDon = selectedDonHang.trangThai === 'hoan_don';
      
      let res;
      if (isHoanDon) {
        // Xử lý hoàn đơn - gửi lại cho siêu thị
        res = await dailyService.xuLyHoanDonSieuThi(maDaiLy, selectedKho, selectedDonHang.maDonHang);
      } else {
        // Xác nhận đơn mới
        res = await dailyService.xacNhanDonHangSieuThi(selectedDonHang.maDonHang, maDaiLy, selectedKho);
      }
      
      // Reload dữ liệu
      await loadAllData(maDaiLy);
      
      // Reset selected
      setSelectedDonHang(null);
      
      // Hiển thị thông báo
      const message = res.message || (isHoanDon ? 'Đã gửi lại đơn hàng thành công' : 'Đã xác nhận đơn hàng và trừ tồn kho thành công');
      showToast(message, 'success');
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      showToast(errorMsg, 'error');
      console.error('Lỗi xác nhận:', error);
    } finally {
      setLoading(false);
    }
  };

  // === HỦY ĐƠN TỪ SIÊU THỊ ===
  const handleHuySieuThi = async (maDonHang: number, isHoan: boolean) => {
    const msg = isHoan 
      ? '❌ Hủy vĩnh viễn đơn hàng này?\n\nSản phẩm sẽ MẤT và không thể khôi phục!' 
      : '❌ Hủy đơn hàng này?';
    if (!confirm(msg)) return;
    
    try {
      setLoading(true);
      const res = await dailyService.huyDonHangSieuThi(maDonHang, maDaiLy);
      
      // Reload dữ liệu
      await loadAllData(maDaiLy);
      
      // Hiển thị thông báo
      const message = res.message || 'Đã hủy đơn hàng thành công';
      showToast(message, 'success');
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      showToast(errorMsg, 'error');
      console.error('Lỗi hủy đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  // === XỬ LÝ HOÀN ĐƠN SIÊU THỊ ===
  const handleXuLyHoanSieuThi = (dh: DonHang) => {
    if (khoList.length === 0) { 
      alert('⚠️ Chưa có kho! Tạo kho trước khi xử lý hoàn đơn.'); 
      return; 
    }
    setSelectedDonHang(dh);
    setSelectedKho(khoList[0].maKho);
    setModalType('sieuthi');
    setShowKhoModal(true);
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  if (initialLoading) return <div className="loading">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          minWidth: '300px',
          maxWidth: '500px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 500 }}>
              {toast.message}
            </div>
            <button 
              onClick={() => setToast({ ...toast, show: false })}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Loading overlay khi đang xử lý */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px 50px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#333' }}>Đang xử lý...</div>
          </div>
        </div>
      )}
      
      <div className="page-header">
        <h1>🔍 Kiểm định & Xử lý đơn hàng</h1>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'nongdan' ? '#3b82f6' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('nongdan')}>
          <div className="stat-icon" style={{ background: '#dbeafe' }}>🔍</div>
          <div className="stat-label">Chờ kiểm định (Nông dân)</div>
          <div className="stat-value">{donHangNongDan.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'sieuthi_moi' ? '#f59e0b' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('sieuthi_moi')}>
          <div className="stat-icon" style={{ background: '#fef3c7' }}>📥</div>
          <div className="stat-label">Đơn mới (Siêu thị)</div>
          <div className="stat-value">{donHangSieuThiMoi.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'sieuthi_hoan' ? '#ef4444' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('sieuthi_hoan')}>
          <div className="stat-icon" style={{ background: '#fee2e2' }}>↩️</div>
          <div className="stat-label">Hoàn trả (Siêu thị)</div>
          <div className="stat-value">{donHangSieuThiHoan.length}</div>
        </div>
      </div>

      {khoList.length === 0 && activeTab === 'nongdan' && (
        <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
          ⚠️ <strong>Chưa có kho!</strong> Bạn cần tạo kho trước khi kiểm định đơn hàng.
        </div>
      )}

      {/* ===== TAB: KIỂM ĐỊNH ĐƠN TỪ NÔNG DÂN ===== */}
      {activeTab === 'nongdan' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🔍 Kiểm định đơn hàng từ nông dân</h3>
          {donHangNongDan.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">📋</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hàng chờ kiểm định</p>
            </div>
          ) : (
            <>
              <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                <strong>💡 Hướng dẫn:</strong> Ấn <strong>✓</strong> để kiểm định đạt (chọn kho nhập hàng). Ấn <strong>✕</strong> để kiểm định không đạt (hoàn về nông dân).
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Nông dân</th>
                    <th>SĐT</th>
                    <th>Ngày đặt</th>
                    <th>Số lượng</th>
                    <th>Giá trị</th>
                    <th>Ghi chú</th>
                    <th style={{ textAlign: 'center' }}>Kiểm định</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangNongDan.map(dh => (
                    <tr key={dh.maDonHang}>
                      <td><strong>#{dh.maDonHang}</strong></td>
                      <td>{dh.tenNongDan}</td>
                      <td>{dh.sdtNongDan}</td>
                      <td>{formatDate(dh.ngayDat)}</td>
                      <td>{dh.tongSoLuong} kg</td>
                      <td>{formatCurrency(dh.tongGiaTri)}</td>
                      <td>{dh.ghiChu || '-'}</td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleKiemDinhDat(dh)} disabled={khoList.length === 0} title="Kiểm định đạt - Nhập kho">
                            ✓ Đạt
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleKiemDinhKhongDat(dh)} title="Không đạt - Hoàn đơn">
                            ✕ Không đạt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* ===== TAB: ĐƠN MỚI TỪ SIÊU THỊ ===== */}
      {activeTab === 'sieuthi_moi' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📥 Đơn hàng mới từ siêu thị</h3>
          {donHangSieuThiMoi.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">✅</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hàng mới từ siêu thị</p>
            </div>
          ) : (
            <>
              <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                <strong>💡 Hướng dẫn:</strong> Ấn <strong>✓</strong> để xác nhận (chọn kho, trừ tồn kho, đơn chuyển sang chờ kiểm định). Ấn <strong>✕</strong> để hủy đơn.
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Siêu thị</th>
                    <th>Ngày đặt</th>
                    <th>Số lượng</th>
                    <th>Giá trị</th>
                    <th>Ghi chú</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangSieuThiMoi.map(dh => (
                    <tr key={dh.maDonHang}>
                      <td><strong>#{dh.maDonHang}</strong></td>
                      <td>{dh.tenSieuThi}</td>
                      <td>{formatDate(dh.ngayDat)}</td>
                      <td>{dh.tongSoLuong} kg</td>
                      <td>{formatCurrency(dh.tongGiaTri)}</td>
                      <td>{dh.ghiChu || '-'}</td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleXacNhanSieuThi(dh)} disabled={khoList.length === 0}>✓ Xác nhận</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleHuySieuThi(dh.maDonHang, false)}>✕ Hủy</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* ===== TAB: HOÀN TRẢ TỪ SIÊU THỊ ===== */}
      {activeTab === 'sieuthi_hoan' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>↩️ Đơn hoàn trả từ siêu thị</h3>
          {donHangSieuThiHoan.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">✅</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hoàn trả</p>
            </div>
          ) : (
            <>
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <strong>⚠️ Lưu ý:</strong> Ấn <strong>✓</strong> để gửi lại siêu thị kiểm định. Ấn <strong>✕</strong> để hủy vĩnh viễn (sản phẩm MẤT).
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Siêu thị</th>
                    <th>Ngày đặt</th>
                    <th>Số lượng</th>
                    <th>Giá trị</th>
                    <th>Lý do hoàn</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangSieuThiHoan.map(dh => (
                    <tr key={dh.maDonHang} style={{ background: '#fef2f2' }}>
                      <td><strong>#{dh.maDonHang}</strong></td>
                      <td>{dh.tenSieuThi}</td>
                      <td>{formatDate(dh.ngayDat)}</td>
                      <td>{dh.tongSoLuong} kg</td>
                      <td>{formatCurrency(dh.tongGiaTri)}</td>
                      <td style={{ color: '#dc2626' }}>{dh.ghiChu || 'Không đạt kiểm định'}</td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => handleXuLyHoanSieuThi(dh)} disabled={khoList.length === 0}>✓ Gửi lại</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleHuySieuThi(dh.maDonHang, true)}>✕ Hủy vĩnh viễn</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* ===== MODAL CHỌN KHO ===== */}
      {showKhoModal && selectedDonHang && (
        <div className="modal-overlay" onClick={() => setShowKhoModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'nongdan' 
                  ? '✅ Kiểm định đạt - Chọn kho nhập hàng' 
                  : selectedDonHang.trangThai === 'hoan_don'
                    ? '✅ Xử lý hoàn đơn - Chọn kho'
                    : '✅ Xác nhận đơn hàng - Chọn kho'}
              </h2>
              <button className="btn-close" onClick={() => setShowKhoModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ 
                background: modalType === 'nongdan' ? '#f0fdf4' : '#fef3c7', 
                padding: '16px', 
                borderRadius: '10px', 
                marginBottom: '20px', 
                borderLeft: `4px solid ${modalType === 'nongdan' ? '#10b981' : '#f59e0b'}` 
              }}>
                <p style={{ margin: '6px 0' }}><strong>Đơn hàng:</strong> #{selectedDonHang.maDonHang}</p>
                {modalType === 'nongdan' ? (
                  <>
                    <p style={{ margin: '6px 0' }}><strong>Nông dân:</strong> {selectedDonHang.tenNongDan}</p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: '6px 0' }}><strong>Siêu thị:</strong> {selectedDonHang.tenSieuThi}</p>
                  </>
                )}
                <p style={{ margin: '6px 0' }}><strong>Số lượng:</strong> {selectedDonHang.tongSoLuong} kg</p>
                <p style={{ margin: '6px 0' }}><strong>Giá trị:</strong> {formatCurrency(selectedDonHang.tongGiaTri)}</p>
              </div>
              <div className="form-group">
                <label><span className="label-icon">🏭</span> Chọn kho <span className="required">*</span></label>
                <select value={selectedKho} onChange={e => setSelectedKho(parseInt(e.target.value))} className="form-control">
                  {khoList.map(kho => (
                    <option key={kho.maKho} value={kho.maKho}>{kho.tenKho} {kho.diaChi ? `- ${kho.diaChi}` : ''}</option>
                  ))}
                </select>
              </div>
              {modalType === 'sieuthi' && (
                <div className="alert alert-info" style={{ marginTop: '15px' }}>
                  <strong>💡 Lưu ý:</strong> {selectedDonHang.trangThai === 'hoan_don' 
                    ? 'Xác nhận sẽ gửi lại đơn hàng cho siêu thị kiểm định.' 
                    : 'Xác nhận sẽ trừ tồn kho và chuyển đơn sang chờ kiểm định.'}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowKhoModal(false)}
                disabled={loading}
              >
                ✕ Hủy
              </button>
              <button 
                className="btn btn-primary" 
                onClick={modalType === 'nongdan' ? confirmKiemDinhDat : confirmXacNhanSieuThi}
                disabled={loading}
              >
                {loading ? '⏳ Đang xử lý...' : modalType === 'nongdan' ? '✅ Xác nhận nhập kho' : '✅ Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-sm { padding: 8px 16px; font-size: 13px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .btn-sm:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .btn.btn-success { background: #10b981; color: white; }
        .btn.btn-success:hover { background: #059669; }
        .btn.btn-success:disabled { background: #9ca3af; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn.btn-danger { background: #ef4444; color: white; }
        .btn.btn-danger:hover { background: #dc2626; }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default KiemDinhManagement;
