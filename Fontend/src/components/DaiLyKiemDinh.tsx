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
}

interface Props {
  maDaiLy: number;
}

const DaiLyKiemDinh: React.FC<Props> = ({ maDaiLy }) => {
  const [donHangList, setDonHangList] = useState<DonHang[]>([]);
  const [khoList, setKhoList] = useState<Kho[]>([]);
  const [selectedKho, setSelectedKho] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [maDaiLy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resDonHang, resKho] = await Promise.all([
        dailyService.getDonHangChoKiemDinh(maDaiLy),
        dailyService.getKhoByDaiLy(maDaiLy)
      ]);
      
      setDonHangList(resDonHang.data || []);
      setKhoList(resKho.data || []);
      
      // Set kho mặc định cho mỗi đơn hàng
      if (resKho.data && resKho.data.length > 0) {
        const defaultKho: { [key: number]: number } = {};
        (resDonHang.data || []).forEach((dh: DonHang) => {
          defaultKho[dh.maDonHang] = resKho.data[0].maKho;
        });
        setSelectedKho(defaultKho);
      }
    } catch (error: any) {
      console.error('Lỗi khi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleKiemDinh = async (maDonHang: number, ketQua: boolean) => {
    const maKho = selectedKho[maDonHang];
    
    if (ketQua && !maKho) {
      alert('Vui lòng chọn kho để nhập hàng');
      return;
    }

    const message = ketQua
      ? `Kiểm định ĐẠT?\n\nĐơn hàng sẽ được nhập vào kho đã chọn.`
      : `Kiểm định KHÔNG ĐẠT?\n\nĐơn hàng sẽ được hoàn về nông dân để xử lý.`;
    
    if (!confirm(message)) return;

    try {
      const res = await dailyService.kiemDinhDonHang(maDonHang, maDaiLy, maKho || 0, ketQua);
      alert(res.message || (ketQua ? 'Đã nhập kho thành công' : 'Đã hoàn đơn về nông dân'));
      loadData();
    } catch (error: any) {
      console.error('Lỗi khi kiểm định:', error);
      alert('Không thể kiểm định đơn hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleKhoChange = (maDonHang: number, maKho: number) => {
    setSelectedKho(prev => ({
      ...prev,
      [maDonHang]: maKho
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="daily-kiemdinh">
      <h2>Kiểm định đơn hàng</h2>

      {khoList.length === 0 && (
        <div className="alert alert-warning">
          ⚠️ Bạn chưa có kho nào. Vui lòng tạo kho trước khi kiểm định đơn hàng.
        </div>
      )}

      {donHangList.length === 0 ? (
        <p className="empty">Không có đơn hàng chờ kiểm định</p>
      ) : (
        <div className="donhang-list">
          {donHangList.map(dh => (
            <div key={dh.maDonHang} className="donhang-item">
              <div className="donhang-header">
                <h4>Đơn hàng #{dh.maDonHang}</h4>
                <span className="badge badge-pending">Chờ kiểm định</span>
              </div>
              
              <div className="donhang-info">
                <div className="info-row">
                  <div className="info-col">
                    <p><strong>Nông dân:</strong> {dh.tenNongDan}</p>
                    <p><strong>SĐT:</strong> {dh.sdtNongDan}</p>
                  </div>
                  <div className="info-col">
                    <p><strong>Ngày đặt:</strong> {formatDate(dh.ngayDat)}</p>
                    <p><strong>Số lượng:</strong> {dh.tongSoLuong}</p>
                  </div>
                  <div className="info-col">
                    <p><strong>Giá trị:</strong> {formatCurrency(dh.tongGiaTri)}</p>
                  </div>
                </div>
                
                {dh.ghiChu && (
                  <div className="note-box">
                    <strong>Ghi chú:</strong> {dh.ghiChu}
                  </div>
                )}
              </div>

              <div className="kiemdinh-section">
                <div className="kho-select">
                  <label htmlFor={`kho-${dh.maDonHang}`}>
                    <strong>Chọn kho nhập hàng:</strong>
                  </label>
                  <select
                    id={`kho-${dh.maDonHang}`}
                    value={selectedKho[dh.maDonHang] || ''}
                    onChange={(e) => handleKhoChange(dh.maDonHang, parseInt(e.target.value))}
                    className="kho-dropdown"
                  >
                    <option value="">-- Chọn kho --</option>
                    {khoList.map(kho => (
                      <option key={kho.maKho} value={kho.maKho}>
                        {kho.tenKho} - {kho.diaChi}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="donhang-actions">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleKiemDinh(dh.maDonHang, true)}
                    disabled={!selectedKho[dh.maDonHang]}
                  >
                    ✓ Đạt - Nhập kho
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleKiemDinh(dh.maDonHang, false)}
                  >
                    ✗ Không đạt - Hoàn đơn
                  </button>
                </div>
              </div>

              <div className="info-box">
                <p>✓ <strong>Đạt:</strong> Đơn hàng sẽ được nhập vào kho đã chọn</p>
                <p>✗ <strong>Không đạt:</strong> Đơn hàng sẽ được hoàn về nông dân để xử lý</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DaiLyKiemDinh;
