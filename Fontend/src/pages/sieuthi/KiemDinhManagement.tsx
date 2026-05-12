import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

interface DonHang {
  maDonHang: number;
  maDaiLy: number;
  tenDaiLy: string;
  diaChiDaiLy?: string;
  soDienThoaiDaiLy?: string;
  ngayDat: string;
  trangThai: string;
  tongSoLuong: number;
  tongGiaTri: number;
  ghiChu?: string;
}

interface Kho {
  maKho: number;
  tenKho: string;
  diaChi: string;
}

const KiemDinhManagement = () => {
  const { user } = useAuth();
  const [maSieuThi, setMaSieuThi] = useState<number>(0);
  const [khoList, setKhoList] = useState<Kho[]>([]);
  const [donHangList, setDonHangList] = useState<DonHang[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Toast notification
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Modal state
  const [showKhoModal, setShowKhoModal] = useState(false);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);
  const [selectedKho, setSelectedKho] = useState<number>(0);
  const [ghiChuKiemDinh, setGhiChuKiemDinh] = useState<string>('');

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setInitialLoading(true);
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      const currentSieuThi = sieuThiRes.data.data?.find(
        (st: any) => st.maTaiKhoan === user?.maTaiKhoan
      );
      if (!currentSieuThi) { 
        setInitialLoading(false); 
        return; 
      }
      
      setMaSieuThi(currentSieuThi.maSieuThi);
      await loadAllData(currentSieuThi.maSieuThi);
    } catch (error) {
      console.error('Error init:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadAllData = async (id: number) => {
    try {
      const [khoRes, donHangRes] = await Promise.all([
        axios.get(API_ENDPOINTS.kho.getBySieuThi(id)).catch(() => ({ data: { data: [] } })),
        axios.get(API_ENDPOINTS.donHangSieuThi.choKiemDinh(id)).catch(() => ({ data: { data: [] } }))
      ]);

      setKhoList(khoRes.data.data || []);
      setDonHangList(donHangRes.data.data || []);
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

  // === KIỂM ĐỊNH ĐẠT ===
  const handleKiemDinhDat = (dh: DonHang) => {
    if (khoList.length === 0) { 
      alert('⚠️ Chưa có kho! Tạo kho trước khi kiểm định.'); 
      return; 
    }
    setSelectedDonHang(dh);
    setSelectedKho(khoList[0].maKho);
    setGhiChuKiemDinh('');
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
        API_ENDPOINTS.donHangSieuThi.kiemDinh(selectedDonHang.maDonHang),
        { 
          maSieuThi: maSieuThi, 
          maKho: selectedKho, 
          ketQua: 'dat',
          ghiChu: ghiChuKiemDinh || null
        }
      );
      
      // Reload dữ liệu
      await loadAllData(maSieuThi);
      
      // Reset selected
      setSelectedDonHang(null);
      setGhiChuKiemDinh('');
      
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

  // === KIỂM ĐỊNH KHÔNG ĐẠT ===
  const handleKiemDinhKhongDat = async (dh: DonHang) => {
    const lyDo = prompt(`❌ Kiểm định KHÔNG ĐẠT?\n\nĐơn #${dh.maDonHang} sẽ hoàn về đại lý ${dh.tenDaiLy}.\n\nNhập lý do không đạt:`);
    
    if (lyDo === null) return; // User cancelled
    
    try {
      setLoading(true);
      const res = await axios.put(
        API_ENDPOINTS.donHangSieuThi.kiemDinh(dh.maDonHang),
        { 
          maSieuThi: maSieuThi, 
          maKho: null, 
          ketQua: 'khong_dat',
          ghiChu: lyDo || 'Không đạt kiểm định'
        }
      );
      
      // Reload dữ liệu
      await loadAllData(maSieuThi);
      
      // Hiển thị thông báo
      const message = res.data?.message || 'Kiểm định không đạt, đã hoàn đơn về đại lý';
      showToast(message, 'success');
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      showToast(errorMsg, 'error');
      console.error('Lỗi kiểm định:', error);
    } finally {
      setLoading(false);
    }
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
        <h1>🔍 Kiểm định đơn hàng từ đại lý</h1>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="stat-icon" style={{ background: '#dbeafe' }}>🔍</div>
          <div className="stat-label">Chờ kiểm định</div>
          <div className="stat-value">{donHangList.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: '#d1fae5' }}>🏭</div>
          <div className="stat-label">Số kho</div>
          <div className="stat-value">{khoList.length}</div>
        </div>
      </div>

      {khoList.length === 0 && (
        <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
          ⚠️ <strong>Chưa có kho!</strong> Bạn cần tạo kho trước khi kiểm định đơn hàng.
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="table-container">
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🔍 Đơn hàng chờ kiểm định</h3>
        {donHangList.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px' }}>
            <div className="empty-icon">📋</div>
            <p style={{ color: '#6b7280' }}>Không có đơn hàng chờ kiểm định</p>
          </div>
        ) : (
          <>
            <div className="alert alert-info" style={{ marginBottom: '16px' }}>
              <strong>💡 Hướng dẫn:</strong> Ấn <strong>✓ Đạt</strong> để kiểm định đạt (chọn kho nhập hàng). Ấn <strong>✕ Không đạt</strong> để kiểm định không đạt (hoàn về đại lý).
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Đại lý</th>
                  <th>SĐT</th>
                  <th>Địa chỉ</th>
                  <th>Ngày đặt</th>
                  <th>Số lượng</th>
                  <th>Giá trị</th>
                  <th>Ghi chú</th>
                  <th style={{ textAlign: 'center' }}>Kiểm định</th>
                </tr>
              </thead>
              <tbody>
                {donHangList.map(dh => (
                  <tr key={dh.maDonHang}>
                    <td><strong>#{dh.maDonHang}</strong></td>
                    <td>{dh.tenDaiLy}</td>
                    <td>{dh.soDienThoaiDaiLy || '-'}</td>
                    <td>{dh.diaChiDaiLy || '-'}</td>
                    <td>{formatDate(dh.ngayDat)}</td>
                    <td>{dh.tongSoLuong} kg</td>
                    <td>{formatCurrency(dh.tongGiaTri)}</td>
                    <td>{dh.ghiChu || '-'}</td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        <button 
                          className="btn btn-success btn-sm" 
                          onClick={() => handleKiemDinhDat(dh)} 
                          disabled={khoList.length === 0} 
                          title="Kiểm định đạt - Nhập kho"
                        >
                          ✓ Đạt
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleKiemDinhKhongDat(dh)} 
                          title="Không đạt - Hoàn đơn"
                        >
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

      {/* ===== MODAL CHỌN KHO ===== */}
      {showKhoModal && selectedDonHang && (
        <div className="modal-overlay" onClick={() => setShowKhoModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✅ Kiểm định đạt - Chọn kho nhập hàng</h2>
              <button className="btn-close" onClick={() => setShowKhoModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '10px', marginBottom: '20px', borderLeft: '4px solid #10b981' }}>
                <p style={{ margin: '6px 0' }}><strong>Đơn hàng:</strong> #{selectedDonHang.maDonHang}</p>
                <p style={{ margin: '6px 0' }}><strong>Đại lý:</strong> {selectedDonHang.tenDaiLy}</p>
                <p style={{ margin: '6px 0' }}><strong>Số lượng:</strong> {selectedDonHang.tongSoLuong} kg</p>
                <p style={{ margin: '6px 0' }}><strong>Giá trị:</strong> {formatCurrency(selectedDonHang.tongGiaTri)}</p>
              </div>
              
              <div className="form-group">
                <label><span className="label-icon">🏭</span> Chọn kho <span className="required">*</span></label>
                <select 
                  value={selectedKho} 
                  onChange={e => setSelectedKho(parseInt(e.target.value))} 
                  className="form-control"
                >
                  {khoList.map(kho => (
                    <option key={kho.maKho} value={kho.maKho}>
                      {kho.tenKho} {kho.diaChi ? `- ${kho.diaChi}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><span className="label-icon">📝</span> Ghi chú kiểm định</label>
                <textarea
                  value={ghiChuKiemDinh}
                  onChange={e => setGhiChuKiemDinh(e.target.value)}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                  className="form-control"
                />
              </div>
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
                onClick={confirmKiemDinhDat}
                disabled={loading}
              >
                {loading ? '⏳ Đang xử lý...' : '✅ Xác nhận nhập kho'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-sm { 
          padding: 8px 16px; 
          font-size: 13px; 
          border: none; 
          border-radius: 6px; 
          cursor: pointer; 
          font-weight: 500; 
          transition: all 0.2s; 
        }
        .btn-sm:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); 
        }
        .btn.btn-success { 
          background: #10b981; 
          color: white; 
        }
        .btn.btn-success:hover { 
          background: #059669; 
        }
        .btn.btn-success:disabled { 
          background: #9ca3af; 
          cursor: not-allowed; 
          transform: none; 
          box-shadow: none; 
        }
        .btn.btn-danger { 
          background: #ef4444; 
          color: white; 
        }
        .btn.btn-danger:hover { 
          background: #dc2626; 
        }
        
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
      `}</style>
    </div>
  );
};

export default KiemDinhManagement;
