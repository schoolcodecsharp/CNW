import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { nongdanService } from '../../services/nongdanService';
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

function OrderManagement() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<DonHang[]>([]);
  const [donHangMoi, setDonHangMoi] = useState<DonHang[]>([]);
  const [donHangHoanDon, setDonHangHoanDon] = useState<DonHang[]>([]);
  const [batches, setBatches] = useState([]);
  const [dailyList, setDailyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [maNongDan, setMaNongDan] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'moi' | 'hoan' | 'tatca'>('moi');
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
        (nd: any) => nd.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentFarmer) {
        setLoading(false);
        return;
      }

      const currentMaNongDan = currentFarmer.maNongDan;
      setMaNongDan(currentMaNongDan);

      // Load all data in parallel
      const [ordersRes, moiRes, hoanRes, batchesRes, dailyRes] = await Promise.all([
        axios.get(API_ENDPOINTS.donHangDaiLy.getByNongDan(currentMaNongDan)),
        nongdanService.getDonHangChuaXacNhan(currentMaNongDan).catch(() => ({ data: [] })),
        nongdanService.getDonHangHoanDon(currentMaNongDan).catch(() => ({ data: [] })),
        axios.get(API_ENDPOINTS.loNongSan.getByNongDan(currentMaNongDan)),
        axios.get(API_ENDPOINTS.daiLy.getAll)
      ]);

      setAllOrders(ordersRes.data.data || []);
      setDonHangMoi(moiRes.data || []);
      setDonHangHoanDon(hoanRes.data || []);
      
      const availableBatches = (batchesRes.data.data || []).filter((b: any) => 
        b.trangThai === 'tai_trang_trai' && b.soLuongHienTai > 0
      );
      setBatches(availableBatches);
      setDailyList(dailyRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // === XÁC NHẬN ĐƠN HÀNG MỚI ===
  const handleXacNhan = async (maDonHang: number) => {
    if (!confirm('✅ Xác nhận đơn hàng này?\n\nSố lượng trong lô sẽ bị TRỪ ĐI và đơn hàng chuyển sang chờ kiểm định.')) return;
    try {
      const res = await nongdanService.xacNhanDonHang(maDonHang, maNongDan!);
      alert(res.message || '✅ Đã xác nhận! Đơn hàng chuyển sang chờ kiểm định từ đại lý.');
      loadData();
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === HỦY ĐƠN HÀNG ===
  const handleHuy = async (maDonHang: number, isHoanDon: boolean) => {
    const msg = isHoanDon
      ? '❌ Hủy đơn hàng vĩnh viễn?\n\nSản phẩm lỗi/hỏng sẽ KHÔNG được hoàn lại số lượng vào lô.'
      : '❌ Hủy đơn hàng này?';
    if (!confirm(msg)) return;
    try {
      const res = await nongdanService.huyDonHang(maDonHang, maNongDan!);
      alert(res.message || '✅ Đã hủy đơn hàng.');
      loadData();
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === XỬ LÝ HOÀN ĐƠN (gửi lại kiểm định) ===
  const handleXuLyHoanDon = async (maDonHang: number) => {
    if (!confirm('✅ Đã xử lý xong sản phẩm?\n\nSố lượng sẽ được CỘNG LẠI vào lô và gửi lại cho đại lý kiểm định.')) return;
    try {
      const res = await nongdanService.xuLyHoanDon(maDonHang, maNongDan!);
      alert(res.message || '✅ Đã gửi lại cho đại lý kiểm định.');
      loadData();
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // === TẠO ĐƠN BÁN HÀNG ===
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const selectedBatch = batches.find((b: any) => b.maLo === parseInt(formData.maLo));
      if (selectedBatch && parseFloat(formData.soLuong) > (selectedBatch as any).soLuongHienTai) {
        alert('❌ Số lượng vượt quá số lượng hiện có!');
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
      loadData();
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      'chua_nhan': { cls: 'badge-warning', label: '⏳ Chờ xác nhận' },
      'cho_kiem_duyet': { cls: 'badge-info', label: '🔍 Chờ kiểm định' },
      'da_nhan': { cls: 'badge-success', label: '✅ Đã nhập kho' },
      'hoan_don': { cls: 'badge-danger', label: '↩️ Hoàn đơn' },
      'da_huy': { cls: 'badge-danger', label: '❌ Đã hủy' },
    };
    const s = map[status] || { cls: '', label: status };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  const { currentPage, pageSize, paginatedData: paginatedOrders, totalItems, handlePageChange } =
    usePagination({ data: allOrders, initialPageSize: 10 });

  if (loading) return <div className="loading">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Quản lý đơn hàng</h1>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'moi' ? '#f59e0b' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('moi')}>
          <div className="stat-icon" style={{ background: '#fef3c7' }}>📥</div>
          <div className="stat-label">Đơn hàng mới</div>
          <div className="stat-value">{donHangMoi.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'hoan' ? '#ef4444' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('hoan')}>
          <div className="stat-icon" style={{ background: '#fee2e2' }}>↩️</div>
          <div className="stat-label">Đơn hoàn trả</div>
          <div className="stat-value">{donHangHoanDon.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'tatca' ? '#667eea' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('tatca')}>
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>📋</div>
          <div className="stat-label">Tất cả đơn hàng</div>
          <div className="stat-value">{allOrders.length}</div>
        </div>
      </div>

      {/* ===== TAB: ĐƠN HÀNG MỚI ===== */}
      {activeTab === 'moi' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📥 Đơn hàng chưa xác nhận</h3>
          {donHangMoi.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">✅</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hàng mới cần xử lý</p>
            </div>
          ) : (
            <>
              <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                <strong>💡 Hướng dẫn:</strong> Ấn <strong>✓</strong> để xác nhận (số lượng lô sẽ bị trừ, đơn chuyển sang chờ kiểm định). Ấn <strong>✕</strong> để hủy đơn.
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
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangMoi.map(dh => (
                    <tr key={dh.maDonHang}>
                      <td><strong>#{dh.maDonHang}</strong></td>
                      <td>{dh.tenDaiLy}</td>
                      <td>{formatDate(dh.ngayDat)}</td>
                      <td>{dh.tongSoLuong} kg</td>
                      <td>{formatCurrency(dh.tongGiaTri)}</td>
                      <td>{dh.ghiChu || '-'}</td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleXacNhan(dh.maDonHang)} title="Xác nhận đơn hàng">
                            ✓ Xác nhận
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleHuy(dh.maDonHang, false)} title="Hủy đơn hàng">
                            ✕ Hủy
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

      {/* ===== TAB: ĐƠN HOÀN TRẢ ===== */}
      {activeTab === 'hoan' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>↩️ Đơn hàng hoàn trả (Kiểm định không đạt)</h3>
          {donHangHoanDon.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">✅</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hàng hoàn trả</p>
            </div>
          ) : (
            <>
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <strong>⚠️ Lưu ý:</strong> Ấn <strong>✓</strong> để gửi lại kiểm định (số lượng được cộng lại vào lô). Ấn <strong>✕</strong> để hủy vĩnh viễn (sản phẩm lỗi/hỏng sẽ MẤT).
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Đại lý</th>
                    <th>Ngày đặt</th>
                    <th>Số lượng</th>
                    <th>Giá trị</th>
                    <th>Lý do hoàn</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangHoanDon.map(dh => (
                    <tr key={dh.maDonHang} style={{ background: '#fef2f2' }}>
                      <td><strong>#{dh.maDonHang}</strong></td>
                      <td>{dh.tenDaiLy}</td>
                      <td>{formatDate(dh.ngayDat)}</td>
                      <td>{dh.tongSoLuong} kg</td>
                      <td>{formatCurrency(dh.tongGiaTri)}</td>
                      <td style={{ color: '#dc2626' }}>{dh.ghiChu || 'Không đạt kiểm định'}</td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => handleXuLyHoanDon(dh.maDonHang)} title="Gửi lại kiểm định">
                            ✓ Gửi lại
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleHuy(dh.maDonHang, true)} title="Hủy vĩnh viễn">
                            ✕ Hủy vĩnh viễn
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

      {/* ===== TAB: TẤT CẢ ĐƠN HÀNG ===== */}
      {activeTab === 'tatca' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📋 Tất cả đơn hàng</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Đại lý</th>
                <th>Ngày đặt</th>
                <th>Số lượng</th>
                <th>Giá trị</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr><td colSpan={8} className="text-center">Chưa có đơn hàng nào</td></tr>
              ) : (
                paginatedOrders.map((order: any) => (
                  <tr key={order.maDonHang}>
                    <td><strong>#{order.maDonHang}</strong></td>
                    <td>{order.tenDaiLy}</td>
                    <td>{formatDate(order.ngayDat)}</td>
                    <td>{order.tongSoLuong} kg</td>
                    <td>{formatCurrency(order.tongGiaTri)}</td>
                    <td>{getStatusBadge(order.trangThai)}</td>
                    <td>{order.ghiChu || '-'}</td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        {order.trangThai === 'chua_nhan' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleXacNhan(order.maDonHang)} title="Xác nhận đơn hàng">
                              ✓
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleHuy(order.maDonHang, false)} title="Hủy đơn hàng">
                              ✕
                            </button>
                          </>
                        )}
                        {order.trangThai === 'hoan_don' && (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={() => handleXuLyHoanDon(order.maDonHang)} title="Gửi lại kiểm định">
                              ✓
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleHuy(order.maDonHang, true)} title="Hủy vĩnh viễn">
                              ✕
                            </button>
                          </>
                        )}
                        {(order.trangThai === 'cho_kiem_duyet' || order.trangThai === 'da_nhan' || order.trangThai === 'da_huy') && (
                          <span style={{ color: '#9ca3af', fontSize: '13px' }}>-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination current={currentPage} total={totalItems} pageSize={pageSize} onChange={handlePageChange} />
        </div>
      )}

      {/* ===== MODAL TẠO ĐƠN ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Tạo đơn bán hàng cho đại lý</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label><span className="label-icon">🏪</span> Đại lý <span className="required">*</span></label>
                  <select value={formData.maDaiLy} onChange={e => setFormData({...formData, maDaiLy: e.target.value})} required className="form-control">
                    <option value="">-- Chọn đại lý --</option>
                    {dailyList.map((d: any) => <option key={d.maDaiLy} value={d.maDaiLy}>{d.tenDaiLy}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label><span className="label-icon">📦</span> Lô nông sản <span className="required">*</span></label>
                  <select value={formData.maLo} onChange={e => setFormData({...formData, maLo: e.target.value})} required className="form-control">
                    <option value="">-- Chọn lô --</option>
                    {batches.map((b: any) => <option key={b.maLo} value={b.maLo}>{b.tenSanPham} - {b.tenTrangTrai} (Còn: {b.soLuongHienTai} kg)</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label><span className="label-icon">⚖️</span> Số lượng (kg) <span className="required">*</span></label>
                  <input type="number" step="0.01" value={formData.soLuong} onChange={e => setFormData({...formData, soLuong: e.target.value})} required placeholder="Nhập số lượng" className="form-control" />
                </div>
                <div className="form-group">
                  <label><span className="label-icon">💰</span> Đơn giá (VNĐ/kg) <span className="required">*</span></label>
                  <input type="number" step="1000" value={formData.donGia} onChange={e => setFormData({...formData, donGia: e.target.value})} required placeholder="Nhập đơn giá" className="form-control" />
                </div>
                {formData.soLuong && formData.donGia && (
                  <div className="form-group">
                    <label>💵 Tổng giá trị</label>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', padding: '12px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                      {formatCurrency(parseFloat(formData.soLuong) * parseFloat(formData.donGia))}
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label><span className="label-icon">📝</span> Ghi chú</label>
                  <textarea value={formData.ghiChu} onChange={e => setFormData({...formData, ghiChu: e.target.value})} placeholder="Nhập ghi chú (nếu có)" rows={3} className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>✕ Hủy</button>
                <button type="submit" className="btn btn-primary">➕ Tạo đơn hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .btn-sm { padding: 8px 16px; font-size: 13px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .btn-sm:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .btn.btn-success { background: #10b981; color: white; }
        .btn.btn-success:hover { background: #059669; }
        .btn.btn-danger { background: #ef4444; color: white; }
        .btn.btn-danger:hover { background: #dc2626; }
      `}</style>
    </div>
  );
}

export default OrderManagement;
