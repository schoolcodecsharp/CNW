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
  const [donHangChoXacNhan, setDonHangChoXacNhan] = useState<DonHang[]>([]);
  const [donHangHoanDon, setDonHangHoanDon] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [maNongDan, setMaNongDan] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'choxacnhan' | 'hoan' | 'tatca'>('choxacnhan');

  // Toast
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false, message: '', type: 'success'
  });

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

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
      const [ordersRes, chuaXacNhanRes, hoanRes] = await Promise.all([
        axios.get(API_ENDPOINTS.donHangDaiLy.getByNongDan(currentMaNongDan)),
        nongdanService.getDonHangChuaXacNhan(currentMaNongDan).catch(() => ({ data: [] })),
        nongdanService.getDonHangHoanDon(currentMaNongDan).catch(() => ({ data: [] })),
      ]);

      setAllOrders(ordersRes.data.data || []);
      setDonHangChoXacNhan(chuaXacNhanRes.data || []);
      setDonHangHoanDon(hoanRes.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // === XÁC NHẬN ĐƠN HÀNG (Tick) ===
  const handleXacNhan = async (maDonHang: number) => {
    if (!confirm('✅ Xác nhận đơn hàng này?\n\nĐơn hàng sẽ chuyển sang trạng thái chờ kiểm duyệt bởi đại lý.')) return;
    try {
      const res = await nongdanService.xacNhanDonHang(maDonHang, maNongDan!);
      showToast(res.message || '✅ Đã xác nhận đơn hàng. Chờ đại lý kiểm duyệt.', 'success');
      loadData();
    } catch (error: any) {
      showToast('❌ Lỗi: ' + (error.response?.data?.message || error.message), 'error');
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
      showToast(res.message || '✅ Đã hủy đơn hàng.', 'success');
      loadData();
    } catch (error: any) {
      showToast('❌ Lỗi: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  // === XỬ LÝ HOÀN ĐƠN (gửi lại kiểm định) ===
  const handleXuLyHoanDon = async (maDonHang: number) => {
    if (!confirm('✅ Đã xử lý xong sản phẩm?\n\nSố lượng sẽ được CỘNG LẠI vào lô và gửi lại cho đại lý kiểm định.')) return;
    try {
      const res = await nongdanService.xuLyHoanDon(maDonHang, maNongDan!);
      showToast(res.message || '✅ Đã gửi lại cho đại lý kiểm định.', 'success');
      loadData();
    } catch (error: any) {
      showToast('❌ Lỗi: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      'chua_nhan': { cls: 'badge-warning', label: '⏳ Chờ xác nhận' },
      'cho_kiem_duyet': { cls: 'badge-info', label: '🔍 Chờ kiểm duyệt' },
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
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 10000,
          minWidth: '300px', maxWidth: '500px', animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white', padding: '16px 20px', borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 500 }}>{toast.message}</div>
            <button onClick={() => setToast({ ...toast, show: false })} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
              width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>✕</button>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>📦 Quản lý đơn hàng</h1>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card" style={{ borderLeft: `4px solid ${activeTab === 'choxacnhan' ? '#f59e0b' : '#e5e7eb'}`, cursor: 'pointer' }} onClick={() => setActiveTab('choxacnhan')}>
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
          <div className="stat-label">Chờ xác nhận</div>
          <div className="stat-value">{donHangChoXacNhan.length}</div>
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

      {/* ===== TAB: CHỜ XÁC NHẬN ===== */}
      {activeTab === 'choxacnhan' && (
        <div className="table-container">
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>⏳ Đơn hàng chờ xác nhận (Đại lý đặt cho bạn)</h3>
          {donHangChoXacNhan.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">✅</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hàng chờ xác nhận</p>
            </div>
          ) : (
            <>
              <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                <strong>💡 Hướng dẫn:</strong> Ấn <strong>✓ Xác nhận</strong> để chấp nhận đơn hàng (chuyển sang chờ kiểm duyệt). Ấn <strong>✕ Hủy</strong> để từ chối đơn hàng.
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
                  {donHangChoXacNhan.map(dh => (
                    <tr key={dh.maDonHang} style={{ background: '#fffbeb' }}>
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
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>↩️ Đơn hàng hoàn trả (Kiểm duyệt không đạt)</h3>
          {donHangHoanDon.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">✅</div>
              <p style={{ color: '#6b7280' }}>Không có đơn hàng hoàn trả</p>
            </div>
          ) : (
            <>
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <strong>⚠️ Lưu ý:</strong> Ấn <strong>✓ Gửi lại</strong> để gửi lại kiểm duyệt (số lượng được cộng lại vào lô). Ấn <strong>✕ Hủy vĩnh viễn</strong> để hủy (sản phẩm lỗi/hỏng sẽ MẤT).
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
                      <td style={{ color: '#dc2626' }}>{dh.ghiChu || 'Không đạt kiểm duyệt'}</td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => handleXuLyHoanDon(dh.maDonHang)} title="Gửi lại kiểm duyệt">
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
                            <button className="btn btn-primary btn-sm" onClick={() => handleXuLyHoanDon(order.maDonHang)} title="Gửi lại kiểm duyệt">
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

      <style>{`
        .btn-sm { padding: 8px 16px; font-size: 13px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .btn-sm:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .btn.btn-success { background: #10b981; color: white; }
        .btn.btn-success:hover { background: #059669; }
        .btn.btn-danger { background: #ef4444; color: white; }
        .btn.btn-danger:hover { background: #dc2626; }
        .alert-info { background: #dbeafe; border: 1px solid #3b82f6; color: #1e40af; padding: 12px; border-radius: 8px; font-size: 14px; }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
