import React, { useState, useEffect } from 'react';
import { dailyService } from '../services/dailyService';
import './DaiLyKiemDinh.css';

interface DonHang {
  maDonHang: number;
  maNongDan?: number;
  maSieuThi?: number;
  tenNongDan?: string;
  tenSieuThi?: string;
  sdtNongDan?: string;
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
  loaiKho: string;
  trangThai: string;
}

interface Props {
  maDaiLy: number;
}

type TabType = 'cho-kiem-dinh' | 'don-moi' | 'hoan-tra' | 'kho';

const DaiLyKiemDinhFull: React.FC<Props> = ({ maDaiLy }) => {
  const [activeTab, setActiveTab] = useState<TabType>('cho-kiem-dinh');
  
  // Đơn hàng từ nông dân chờ kiểm định
  const [donHangChoKiemDinh, setDonHangChoKiemDinh] = useState<DonHang[]>([]);
  
  // Đơn hàng mới từ siêu thị
  const [donHangMoiSieuThi, setDonHangMoiSieuThi] = useState<DonHang[]>([]);
  
  // Đơn hàng hoàn trả từ siêu thị
  const [donHangHoanTra, setDonHangHoanTra] = useState<DonHang[]>([]);
  
  // Danh sách kho
  const [khoList, setKhoList] = useState<Kho[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showKiemDinhModal, setShowKiemDinhModal] = useState(false);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);
  const [selectedKho, setSelectedKho] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, [maDaiLy]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('=== Đang tải dữ liệu cho maDaiLy:', maDaiLy);
      
      // 1. Lấy danh sách kho
      const resKho = await dailyService.getKhoByDaiLy(maDaiLy);
      const khoData = resKho.data || [];
      setKhoList(khoData);
      
      // 2. Lấy đơn hàng từ nông dân chờ kiểm định
      const resChoKiemDinh = await dailyService.getDonHangChoKiemDinh(maDaiLy);
      setDonHangChoKiemDinh(resChoKiemDinh.data || []);
      
      // 3. Lấy đơn hàng mới từ siêu thị (chưa xác nhận)
      const resDonMoi = await dailyService.getDonHangSieuThiChuaXacNhan(maDaiLy);
      setDonHangMoiSieuThi(resDonMoi.data || []);
      
      // 4. Lấy đơn hàng hoàn trả từ siêu thị
      const resHoanTra = await dailyService.getDonHangSieuThiHoanDon(maDaiLy);
      setDonHangHoanTra(resHoanTra.data || []);
      
      console.log('Đã tải xong:', {
        kho: khoData.length,
        choKiemDinh: resChoKiemDinh.data?.length || 0,
        donMoi: resDonMoi.data?.length || 0,
        hoanTra: resHoanTra.data?.length || 0
      });
      
    } catch (error: any) {
      console.error('LỖI khi tải dữ liệu:', error);
      alert('❌ Không thể tải dữ liệu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ========== XỬ LÝ KIỂM ĐỊNH ĐƠN HÀNG TỪ NÔNG DÂN ==========
  
  const handleOpenKiemDinh = (donHang: DonHang) => {
    if (khoList.length === 0) {
      alert('⚠️ Không có kho! Vui lòng tạo kho trước khi kiểm định.');
      return;
    }
    setSelectedDonHang(donHang);
    setSelectedKho(khoList[0].maKho);
    setShowKiemDinhModal(true);
  };

  const handleKiemDinhDat = async () => {
    if (!selectedDonHang || !selectedKho) {
      alert('⚠️ Vui lòng chọn kho!');
      return;
    }

    try {
      const res = await dailyService.kiemDinhDonHang(
        selectedDonHang.maDonHang,
        maDaiLy,
        selectedKho,
        true
      );
      alert(res.message || '✅ Đã nhập kho thành công!');
      setShowKiemDinhModal(false);
      setSelectedDonHang(null);
      loadData();
    } catch (error: any) {
      console.error('LỖI kiểm định:', error);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleKiemDinhKhongDat = async (donHang: DonHang) => {
    if (!confirm(`❌ Xác nhận kiểm định KHÔNG ĐẠT?\n\nĐơn hàng #${donHang.maDonHang} sẽ được hoàn về nông dân ${donHang.tenNongDan}`)) {
      return;
    }

    try {
      const res = await dailyService.kiemDinhDonHang(
        donHang.maDonHang,
        maDaiLy,
        0,
        false
      );
      alert(res.message || '↩️ Đã hoàn đơn về nông dân!');
      loadData();
    } catch (error: any) {
      console.error('LỖI kiểm định:', error);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // ========== XỬ LÝ ĐƠN HÀNG TỪ SIÊU THỊ ==========
  
  const handleXacNhanDonSieuThi = async (donHang: DonHang) => {
    if (!confirm(`✅ Xác nhận đơn hàng #${donHang.maDonHang} từ ${donHang.tenSieuThi}?`)) {
      return;
    }

    try {
      const res = await dailyService.xacNhanDonHangSieuThi(donHang.maDonHang, maDaiLy);
      alert(res.message || '✅ Đã xác nhận đơn hàng!');
      loadData();
    } catch (error: any) {
      console.error('LỖI xác nhận:', error);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleHuyDonSieuThi = async (donHang: DonHang) => {
    if (!confirm(`❌ Hủy đơn hàng #${donHang.maDonHang} từ ${donHang.tenSieuThi}?`)) {
      return;
    }

    try {
      const res = await dailyService.huyDonHangSieuThi(donHang.maDonHang, maDaiLy);
      alert(res.message || '✅ Đã hủy đơn hàng!');
      loadData();
    } catch (error: any) {
      console.error('LỖI hủy:', error);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleXuLyHoanTra = async (donHang: DonHang) => {
    if (!confirm(`✅ Đã xử lý xong đơn hàng hoàn trả #${donHang.maDonHang}?`)) {
      return;
    }

    try {
      const res = await dailyService.xuLyHoanDonSieuThi(donHang.maDonHang, maDaiLy);
      alert(res.message || '✅ Đã xử lý hoàn trả!');
      loadData();
    } catch (error: any) {
      console.error('LỖI xử lý:', error);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // ========== HELPER FUNCTIONS ==========
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return <div className="loading">⏳ Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Kiểm định & Xử lý đơn hàng</h1>
        <div className="header-stats">
          <span className="stat-badge">
            Chờ kiểm định: <strong>{donHangChoKiemDinh.length}</strong>
          </span>
          <span className="stat-badge">
            Đơn mới: <strong>{donHangMoiSieuThi.length}</strong>
          </span>
          <span className="stat-badge">
            Hoàn trả: <strong>{donHangHoanTra.length}</strong>
          </span>
          <span className="stat-badge">
            Kho: <strong>{khoList.length}</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'cho-kiem-dinh' ? 'active' : ''}`}
          onClick={() => setActiveTab('cho-kiem-dinh')}
        >
          🔍 CHỜ KIỂM ĐỊNH (NÔNG DÂN) ({donHangChoKiemDinh.length})
        </button>
        <button 
          className={`tab ${activeTab === 'don-moi' ? 'active' : ''}`}
          onClick={() => setActiveTab('don-moi')}
        >
          👤 ĐƠN MỚI (SIÊU THỊ) ({donHangMoiSieuThi.length})
        </button>
        <button 
          className={`tab ${activeTab === 'hoan-tra' ? 'active' : ''}`}
          onClick={() => setActiveTab('hoan-tra')}
        >
          📋 HOÀN TRẢ (SIÊU THỊ) ({donHangHoanTra.length})
        </button>
        <button 
          className={`tab ${activeTab === 'kho' ? 'active' : ''}`}
          onClick={() => setActiveTab('kho')}
        >
          🏭 KHO HIỆN CÓ ({khoList.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* TAB 1: CHỜ KIỂM ĐỊNH (NÔNG DÂN) */}
        {activeTab === 'cho-kiem-dinh' && (
          <>
            {khoList.length === 0 && (
              <div className="alert alert-warning">
                ⚠️ <strong>Chưa có kho!</strong> Bạn cần tạo kho trước khi kiểm định đơn hàng.
              </div>
            )}

            {donHangChoKiemDinh.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Không có đơn hàng chờ kiểm định</p>
              </div>
            ) : (
              <div className="table-container">
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
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donHangChoKiemDinh.map(dh => (
                      <tr key={dh.maDonHang}>
                        <td><strong>#{dh.maDonHang}</strong></td>
                        <td>{dh.tenNongDan}</td>
                        <td>{dh.sdtNongDan}</td>
                        <td>{formatDate(dh.ngayDat)}</td>
                        <td>{dh.tongSoLuong} kg</td>
                        <td>{formatCurrency(dh.tongGiaTri)}</td>
                        <td>{dh.ghiChu || '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action btn-success"
                              onClick={() => handleOpenKiemDinh(dh)}
                              disabled={khoList.length === 0}
                              title={khoList.length === 0 ? "Cần tạo kho trước" : "Kiểm định đạt"}
                            >
                              ✓
                            </button>
                            <button 
                              className="btn-action btn-danger"
                              onClick={() => handleKiemDinhKhongDat(dh)}
                              title="Kiểm định không đạt"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* TAB 2: ĐƠN MỚI (SIÊU THỊ) */}
        {activeTab === 'don-moi' && (
          <>
            {donHangMoiSieuThi.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Không có đơn hàng mới từ siêu thị</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã ĐH</th>
                      <th>Siêu thị</th>
                      <th>Ngày đặt</th>
                      <th>Số lượng</th>
                      <th>Giá trị</th>
                      <th>Ghi chú</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donHangMoiSieuThi.map(dh => (
                      <tr key={dh.maDonHang}>
                        <td><strong>#{dh.maDonHang}</strong></td>
                        <td>{dh.tenSieuThi}</td>
                        <td>{formatDate(dh.ngayDat)}</td>
                        <td>{dh.tongSoLuong} kg</td>
                        <td>{formatCurrency(dh.tongGiaTri)}</td>
                        <td>{dh.ghiChu || '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action btn-success"
                              onClick={() => handleXacNhanDonSieuThi(dh)}
                              title="Xác nhận đơn hàng"
                            >
                              ✓ Xác nhận
                            </button>
                            <button 
                              className="btn-action btn-danger"
                              onClick={() => handleHuyDonSieuThi(dh)}
                              title="Hủy đơn hàng"
                            >
                              ✕ Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* TAB 3: HOÀN TRẢ (SIÊU THỊ) */}
        {activeTab === 'hoan-tra' && (
          <>
            {donHangHoanTra.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Không có đơn hàng hoàn trả</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã ĐH</th>
                      <th>Siêu thị</th>
                      <th>Ngày đặt</th>
                      <th>Số lượng</th>
                      <th>Giá trị</th>
                      <th>Lý do</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donHangHoanTra.map(dh => (
                      <tr key={dh.maDonHang}>
                        <td><strong>#{dh.maDonHang}</strong></td>
                        <td>{dh.tenSieuThi}</td>
                        <td>{formatDate(dh.ngayDat)}</td>
                        <td>{dh.tongSoLuong} kg</td>
                        <td>{formatCurrency(dh.tongGiaTri)}</td>
                        <td>{dh.ghiChu || '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action btn-primary"
                              onClick={() => handleXuLyHoanTra(dh)}
                              title="Đã xử lý xong"
                            >
                              ✓ Đã xử lý
                            </button>
                            <button 
                              className="btn-action btn-danger"
                              onClick={() => handleHuyDonSieuThi(dh)}
                              title="Hủy đơn hàng"
                            >
                              ✕ Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* TAB 4: KHO HIỆN CÓ */}
        {activeTab === 'kho' && (
          <>
            {khoList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏭</div>
                <p>Chưa có kho nào</p>
                <p className="text-muted">Vui lòng tạo kho trong mục "Quản lý kho"</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã kho</th>
                      <th>Tên kho</th>
                      <th>Địa chỉ</th>
                      <th>Loại kho</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {khoList.map(kho => (
                      <tr key={kho.maKho}>
                        <td><strong>#{kho.maKho}</strong></td>
                        <td>{kho.tenKho}</td>
                        <td>{kho.diaChi}</td>
                        <td>{kho.loaiKho || '-'}</td>
                        <td>
                          <span className={`badge ${kho.trangThai === 'hoat_dong' ? 'badge-success' : 'badge-secondary'}`}>
                            {kho.trangThai === 'hoat_dong' ? '✅ Hoạt động' : '⏸️ Ngừng'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal chọn kho khi kiểm định đạt */}
      {showKiemDinhModal && selectedDonHang && (
        <div className="modal-overlay" onClick={() => setShowKiemDinhModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✅ Kiểm định đạt - Chọn kho nhập hàng</h2>
              <button className="btn-close" onClick={() => setShowKiemDinhModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="order-info">
                <p><strong>Đơn hàng:</strong> #{selectedDonHang.maDonHang}</p>
                <p><strong>Nông dân:</strong> {selectedDonHang.tenNongDan}</p>
                <p><strong>Số lượng:</strong> {selectedDonHang.tongSoLuong} kg</p>
                <p><strong>Giá trị:</strong> {formatCurrency(selectedDonHang.tongGiaTri)}</p>
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">🏭</span>
                  Chọn kho <span className="required">*</span>
                </label>
                <select
                  value={selectedKho}
                  onChange={(e) => setSelectedKho(parseInt(e.target.value))}
                  className="form-control"
                >
                  {khoList.map(kho => (
                    <option key={kho.maKho} value={kho.maKho}>
                      {kho.tenKho} {kho.diaChi ? `- ${kho.diaChi}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowKiemDinhModal(false)}
              >
                <span>✕</span> Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleKiemDinhDat}
              >
                <span>✅</span> Xác nhận nhập kho
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab {
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
        }

        .tab:hover {
          color: #3b82f6;
          background: #eff6ff;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
          background: #eff6ff;
        }

        .header-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .stat-badge {
          padding: 8px 16px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
        }

        .stat-badge strong {
          color: #3b82f6;
          margin-left: 4px;
        }

        .alert-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .order-info {
          background: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .order-info p {
          margin: 8px 0;
          color: #374151;
        }

        .order-info strong {
          color: #1f2937;
        }

        .text-muted {
          color: #9ca3af;
          font-size: 14px;
          margin-top: 8px;
        }

        .btn-action.btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-action.btn-primary:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default DaiLyKiemDinhFull;
