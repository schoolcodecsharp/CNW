import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { sieuthiService } from '../../services/sieuthiService';
import { useAuth } from '../../context/AuthContext';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';
import '../../components/Common.css';

interface DonHang {
  maDonHang: number;
  maDaiLy: number;
  tenDaiLy: string;
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
  maSieuThi?: number;
  ngayKiemDinh: string;
  ketQua: string;
  ghiChu?: string;
  soChungNhanLo: string;
  tenSanPham: string;
}

const KiemDinhManagement = () => {
  const { user } = useAuth();
  const [maSieuThi, setMaSieuThi] = useState<number>(0);
  const [khoList, setKhoList] = useState<Kho[]>([]);
  const [loading, setLoading] = useState(true);

  // Đơn hàng chờ kiểm định từ đại lý
  const [donHangChoKD, setDonHangChoKD] = useState<DonHang[]>([]);

  // Lịch sử kiểm định
  const [kiemDinhList, setKiemDinhList] = useState<KiemDinh[]>([]);

  // Modal state
  const [showKhoModal, setShowKhoModal] = useState(false);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);
  const [selectedKho, setSelectedKho] = useState<number>(0);

  // Tab state
  const [activeTab, setActiveTab] = useState<'kiemdinh' | 'lichsu'>('kiemdinh');

  const { currentPage, pageSize, paginatedData, handlePageChange } =
    usePagination({ data: kiemDinhList, initialPageSize: 10 });

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setLoading(true);
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      const currentST = sieuThiRes.data.data?.find(
        (st: any) => st.maTaiKhoan === user?.maTaiKhoan
      );
      if (!currentST) { setLoading(false); return; }

      setMaSieuThi(currentST.maSieuThi);
      await loadAllData(currentST.maSieuThi);
    } catch (error) {
      console.error('Error init:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async (id: number) => {
    try {
      const [khoRes, choKDRes, kdRes] = await Promise.all([
        axios.get(API_ENDPOINTS.kho.getBySieuThi(id)).catch(() => ({ data: { data: [] } })),
        sieuthiService.getDonHangChoKiemDinh(id).catch(() => ({ data: [] })),
        axios.get(API_ENDPOINTS.kiemDinh.getAll).catch(() => ({ data: [] }))
      ]);

      setKhoList(khoRes.data.data || []);
      setDonHangChoKD(choKDRes.data || []);

      const allKd = Array.isArray(kdRes.data) ? kdRes.data : [];
      setKiemDinhList(allKd.filter((k: KiemDinh) => k.maSieuThi === id));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // === KIỂM ĐỊNH ĐẠT ===
  const handleKiemDinhDat = (dh: DonHang) => {
    if (khoList.length === 0) { alert('⚠️ Chưa có kho! Tạo kho trước khi kiểm định.'); return; }
    setSelectedDonHang(dh);
    setSelectedKho(khoList[0].maKho);
    setShowKhoModal(true);
  };

  const confirmKiemDinhDat = async () => {
    if (!selectedDonHang || !selectedKho) { alert('⚠️ Vui lòng chọn kho!'); return; }
    try {
      const res = await sieuthiService.kiemDinhDonHang(selectedDonHang.maDonHang, maSieuThi, selectedKho, true);
      alert(res.message || '✅ Kiểm định đạt! Đã nhập kho.');
      setShowKhoModal(false);
      setSelectedDonHang(null);
      loadAllData(maSieuThi);
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === KIỂM ĐỊNH KHÔNG ĐẠT ===
  const handleKiemDinhKhongDat = async (dh: DonHang) => {
    if (!confirm(`❌ Kiểm định KHÔNG ĐẠT?\n\nĐơn #${dh.maDonHang} sẽ hoàn về đại lý ${dh.tenDaiLy}.`)) return;
    try {
      const res = await sieuthiService.kiemDinhDonHang(dh.maDonHang, maSieuThi, 0, false);
      alert(res.message || '↩️ Đã hoàn đơn về đại lý!');
      loadAllData(maSieuThi);
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
      'A': { cls: 'badge-success', label: 'Loại A' },
      'B': { cls: 'badge-warning', label: 'Loại B' },
      'C': { cls: 'badge-info', label: 'Loại C' },
    };
    const s = map[k] || { cls: '', label: k };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  if (loading) return <div className="loading">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Kiểm định đơn hàng</h1>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'kiemdinh' ? '#3b82f6' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('kiemdinh')}>
          <div className="stat-icon" style={{ background: '#dbeafe' }}>🔍</div>
          <div className="stat-label">Chờ kiểm định</div>
          <div className="stat-value">{donHangChoKD.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'lichsu' ? '#667eea' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('lichsu')}>
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>📋</div>
          <div className="stat-label">Lịch sử kiểm định</div>
          <div className="stat-value">{kiemDinhList.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #e5e7eb' }}>
          <div className="stat-icon" style={{ background: '#f0fdf4' }}>🏪</div>
          <div className="stat-label">Kho hiện có</div>
          <div className="stat-value">{khoList.length}</div>
        </div>
      </div>

      {khoList.length === 0 && activeTab === 'kiemdinh' && (
        <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
          ⚠️ <strong>Chưa có kho!</strong> Bạn cần tạo kho trước khi kiểm định đơn hàng.
        </div>
      )}

      {/* ===== TAB: KIỂM ĐỊNH ĐƠN TỪ ĐẠI LÝ ===== */}
      {activeTab === 'kiemdinh' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🔍 Kiểm định đơn hàng từ đại lý</h3>
          {donHangChoKD.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">📋</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hàng chờ kiểm định</p>
            </div>
          ) : (
            <>
              <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                <strong>💡 Hướng dẫn:</strong> Ấn <strong>✓</strong> để kiểm định đạt (chọn kho nhập hàng). Ấn <strong>✕</strong> để kiểm định không đạt (hoàn về đại lý).
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Đại lý</th>
                    <th>Ngày đặt</th>
                    <th>Số lượng</th>
                    <th>Giá trị</th>
                    <th>Ghi chú</th>
                    <th style={{ textAlign: 'center' }}>Kiểm định</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangChoKD.map(dh => (
                    <tr key={dh.maDonHang}>
                      <td><strong>#{dh.maDonHang}</strong></td>
                      <td>{dh.tenDaiLy}</td>
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
                <p style={{ margin: '6px 0' }}><strong>Đại lý:</strong> {selectedDonHang.tenDaiLy}</p>
                <p style={{ margin: '6px 0' }}><strong>Số lượng:</strong> {selectedDonHang.tongSoLuong} kg</p>
                <p style={{ margin: '6px 0' }}><strong>Giá trị:</strong> {formatCurrency(selectedDonHang.tongGiaTri)}</p>
              </div>
              <div className="form-group">
                <label><span className="label-icon">🏪</span> Chọn kho <span className="required">*</span></label>
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
