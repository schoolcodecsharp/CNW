import React, { useState, useEffect } from 'react';
import { dailyService } from '../services/dailyService';
import './DaiLyKiemDinh.css';

interface DonHang {
  maDonHang: number;
  maNongDan: number;
  tenNongDan: string;
  sdtNongDan: string;
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

const DaiLyKiemDinh: React.FC<Props> = ({ maDaiLy }) => {
  const [donHangList, setDonHangList] = useState<DonHang[]>([]);
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
      
      // Gọi API lấy kho qua Gateway
      const resKho = await dailyService.getKhoByDaiLy(maDaiLy);
      console.log('Response kho:', resKho);
      
      const khoData = resKho.data || [];
      console.log('Số lượng kho:', khoData.length);
      setKhoList(khoData);
      
      // Gọi API lấy đơn hàng chờ kiểm định qua Gateway
      const resDonHang = await dailyService.getDonHangChoKiemDinh(maDaiLy);
      console.log('Response đơn hàng:', resDonHang);
      
      const donHangData = resDonHang.data || [];
      console.log('Số lượng đơn hàng:', donHangData.length);
      setDonHangList(donHangData);
      
    } catch (error: any) {
      console.error('LỖI khi tải dữ liệu:', error);
      console.error('Chi tiết lỗi:', error.response);
      alert('❌ Không thể tải dữ liệu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

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
      console.log('Kiểm định ĐẠT - maDonHang:', selectedDonHang.maDonHang, 'maKho:', selectedKho);
      const res = await dailyService.kiemDinhDonHang(
        selectedDonHang.maDonHang,
        maDaiLy,
        selectedKho,
        true
      );
      console.log('Response kiểm định:', res);
      alert(res.message || '✅ Đã nhập kho thành công!');
      setShowKiemDinhModal(false);
      setSelectedDonHang(null);
      loadData();
    } catch (error: any) {
      console.error('LỖI kiểm định:', error);
      console.error('Chi tiết lỗi:', error.response);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleKiemDinhKhongDat = async (donHang: DonHang) => {
    if (!confirm(`❌ Xác nhận kiểm định KHÔNG ĐẠT?\n\nĐơn hàng #${donHang.maDonHang} sẽ được hoàn về nông dân ${donHang.tenNongDan}`)) {
      return;
    }

    try {
      console.log('Kiểm định KHÔNG ĐẠT - maDonHang:', donHang.maDonHang);
      const res = await dailyService.kiemDinhDonHang(
        donHang.maDonHang,
        maDaiLy,
        0,
        false
      );
      console.log('Response kiểm định:', res);
      alert(res.message || '↩️ Đã hoàn đơn về nông dân!');
      loadData();
    } catch (error: any) {
      console.error('LỖI kiểm định:', error);
      console.error('Chi tiết lỗi:', error.response);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

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
        <h1>🔍 Kiểm định đơn hàng</h1>
        <div className="header-actions">
          <div className="header-stats">
            <span className="stat-badge">
              Chờ kiểm định: <strong>{donHangList.length}</strong>
            </span>
            <span className="stat-badge">
              Số kho: <strong>{khoList.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {khoList.length === 0 && (
        <div className="alert alert-warning">
          ⚠️ <strong>Chưa có kho!</strong> Bạn cần tạo kho trước khi kiểm định đơn hàng.
        </div>
      )}

      {donHangList.length === 0 ? (
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
              {donHangList.map(dh => (
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
      `}</style>
    </div>
  );
};

export default DaiLyKiemDinh;
