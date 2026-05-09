import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { dailyService } from '../../services/dailyService';
import { useAuth } from '../../context/AuthContext';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';
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

interface KiemDinh {
  maKiemDinh: number;
  maLo: number;
  nguoiKiemDinh: string;
  maDaiLy?: number;
  ngayKiemDinh: string;
  ketQua: string;
  ghiChu?: string;
  soChungNhanLo: string;
  tenSanPham: string;
}

const KiemDinhManagement = () => {
  const { user } = useAuth();
  const [maDaiLy, setMaDaiLy] = useState<number>(0);
  const [khoList, setKhoList] = useState<Kho[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Đơn hàng từ nông dân chờ kiểm định
  const [donHangNongDan, setDonHangNongDan] = useState<DonHang[]>([]);
  
  // Đơn hàng từ siêu thị
  const [donHangSieuThiMoi, setDonHangSieuThiMoi] = useState<DonHang[]>([]);
  const [donHangSieuThiHoan, setDonHangSieuThiHoan] = useState<DonHang[]>([]);
  
  // Lịch sử kiểm định
  const [kiemDinhList, setKiemDinhList] = useState<KiemDinh[]>([]);
  
  // Modal state
  const [showKhoModal, setShowKhoModal] = useState(false);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);
  const [selectedKho, setSelectedKho] = useState<number>(0);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'nongdan' | 'sieuthi_moi' | 'sieuthi_hoan' | 'lichsu'>('nongdan');

  const { currentPage, pageSize, paginatedData, handlePageChange } = 
    usePagination({ data: kiemDinhList, initialPageSize: 10 });

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setLoading(true);
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        (dl: any) => dl.maTaiKhoan === user?.maTaiKhoan
      );
      if (!currentDaily) { setLoading(false); return; }
      
      setMaDaiLy(currentDaily.maDaiLy);
      await loadAllData(currentDaily.maDaiLy);
    } catch (error) {
      console.error('Error init:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async (id: number) => {
    try {
      const [khoRes, ndRes, stMoiRes, stHoanRes, kdRes] = await Promise.all([
        axios.get(API_ENDPOINTS.kho.getByDaiLy(id)).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/cho-kiem-dinh/${id}`).catch(() => ({ data: { data: [] } })),
        dailyService.getDonHangSieuThiChuaXacNhan(id).catch(() => ({ data: [] })),
        dailyService.getDonHangSieuThiHoanDon(id).catch(() => ({ data: [] })),
        axios.get(API_ENDPOINTS.kiemDinh.getAll).catch(() => ({ data: [] }))
      ]);

      setKhoList(khoRes.data.data || []);
      setDonHangNongDan(ndRes.data.data || []);
      setDonHangSieuThiMoi(stMoiRes.data || []);
      setDonHangSieuThiHoan(stHoanRes.data || []);
      
      const allKd = Array.isArray(kdRes.data) ? kdRes.data : [];
      setKiemDinhList(allKd.filter((k: KiemDinh) => k.maDaiLy === id));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // === KIỂM ĐỊNH ĐẠT (Nông dân) ===
  const handleKiemDinhDat = (dh: DonHang) => {
    if (khoList.length === 0) { alert('⚠️ Chưa có kho! Tạo kho trước.'); return; }
    setSelectedDonHang(dh);
    setSelectedKho(khoList[0].maKho);
    setShowKhoModal(true);
  };

  const confirmKiemDinhDat = async () => {
    if (!selectedDonHang || !selectedKho) { alert('⚠️ Chọn kho!'); return; }
    try {
      const res = await axios.put(
        `${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/kiem-dinh/${selectedDonHang.maDonHang}`,
        { maDaiLy: maDaiLy, maKho: selectedKho, ketQuaKiemDinh: true }
      );
      alert(res.data.message || '✅ Kiểm định đạt! Đã nhập kho.');
      setShowKhoModal(false);
      setSelectedDonHang(null);
      loadAllData(maDaiLy);
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === KIỂM ĐỊNH KHÔNG ĐẠT (Nông dân) ===
  const handleKiemDinhKhongDat = async (dh: DonHang) => {
    if (!confirm(`❌ Kiểm định KHÔNG ĐẠT?\n\nĐơn #${dh.maDonHang} sẽ hoàn về nông dân ${dh.tenNongDan}.`)) return;
    try {
      const res = await axios.put(
        `${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/kiem-dinh/${dh.maDonHang}`,
        { maDaiLy: maDaiLy, maKho: 0, ketQuaKiemDinh: false }
      );
      alert(res.data.message || '↩️ Đã hoàn đơn về nông dân!');
      loadAllData(maDaiLy);
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === XÁC NHẬN ĐƠN TỪ SIÊU THỊ ===
  const handleXacNhanSieuThi = async (maDonHang: number) => {
    if (!confirm('✅ Xác nhận đơn hàng từ siêu thị?\n\nĐơn sẽ chuyển sang chờ kiểm định.')) return;
    try {
      const res = await dailyService.xacNhanDonHangSieuThi(maDonHang, maDaiLy);
      alert(res.message || '✅ Đã xác nhận! Chuyển sang chờ kiểm định.');
      loadAllData(maDaiLy);
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === HỦY ĐƠN TỪ SIÊU THỊ ===
  const handleHuySieuThi = async (maDonHang: number, isHoan: boolean) => {
    const msg = isHoan ? '❌ Hủy vĩnh viễn? Sản phẩm sẽ MẤT.' : '❌ Hủy đơn hàng này?';
    if (!confirm(msg)) return;
    try {
      const res = await dailyService.huyDonHangSieuThi(maDonHang, maDaiLy);
      alert(res.message || '✅ Đã hủy.');
      loadAllData(maDaiLy);
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === XỬ LÝ HOÀN ĐƠN SIÊU THỊ ===
  const handleXuLyHoanSieuThi = async (maDonHang: number) => {
    if (!confirm('✅ Gửi lại cho siêu thị kiểm định?')) return;
    try {
      const res = await dailyService.xuLyHoanDonSieuThi(maDonHang, maDaiLy);
      alert(res.message || '✅ Đã gửi lại.');
      loadAllData(maDaiLy);
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  const getKetQuaBadge = (k: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      'dat': { cls: 'badge-success', label: '✅ Đạt' },
      'khong_dat': { cls: 'badge-danger', label: '❌ Không đạt' },
    };
    const s = map[k] || { cls: '', label: k };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  if (loading) return <div className="loading">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Kiểm định & Xử lý đơn hàng</h1>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
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
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'lichsu' ? '#667eea' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('lichsu')}>
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>📋</div>
          <div className="stat-label">Kho hiện có</div>
          <div className="stat-value">{khoList.length}</div>
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
                <strong>💡 Hướng dẫn:</strong> Ấn <strong>✓</strong> để xác nhận (đơn chuyển sang chờ kiểm định từ siêu thị). Ấn <strong>✕</strong> để hủy đơn.
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
                          <button className="btn btn-success btn-sm" onClick={() => handleXacNhanSieuThi(dh.maDonHang)}>✓ Xác nhận</button>
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
                          <button className="btn btn-primary btn-sm" onClick={() => handleXuLyHoanSieuThi(dh.maDonHang)}>✓ Gửi lại</button>
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

      {/* ===== TAB: LỊCH SỬ KIỂM ĐỊNH ===== */}
      {activeTab === 'lichsu' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📋 Lịch sử kiểm định</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã KĐ</th>
                <th>Mã lô</th>
                <th>Sản phẩm</th>
                <th>Người kiểm định</th>
                <th>Ngày kiểm định</th>
                <th>Kết quả</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr><td colSpan={7} className="text-center">Chưa có phiếu kiểm định nào</td></tr>
              ) : (
                paginatedData.map(item => (
                  <tr key={item.maKiemDinh}>
                    <td>{item.maKiemDinh}</td>
                    <td>{item.soChungNhanLo}</td>
                    <td>{item.tenSanPham}</td>
                    <td>{item.nguoiKiemDinh}</td>
                    <td>{formatDate(item.ngayKiemDinh)}</td>
                    <td>{getKetQuaBadge(item.ketQua)}</td>
                    <td>{item.ghiChu || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination current={currentPage} total={kiemDinhList.length} pageSize={pageSize} onChange={handlePageChange} />
        </div>
      )}

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
                <p style={{ margin: '6px 0' }}><strong>Nông dân:</strong> {selectedDonHang.tenNongDan}</p>
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
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowKhoModal(false)}>✕ Hủy</button>
              <button className="btn btn-primary" onClick={confirmKiemDinhDat}>✅ Xác nhận nhập kho</button>
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
      `}</style>
    </div>
  );
};

export default KiemDinhManagement;
