import React, { useState, useEffect } from 'react';
import { nongdanService } from '../services/nongdanService';
import './NongDanDonHang.css';

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

interface Props {
  maNongDan: number;
}

const NongDanDonHang: React.FC<Props> = ({ maNongDan }) => {
  const [donHangHoanDon, setDonHangHoanDon] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDonHang();
  }, [maNongDan]);

  const loadDonHang = async () => {
    setLoading(true);
    try {
      const resHoan = await nongdanService.getDonHangHoanDon(maNongDan).catch(() => ({ data: [] }));
      setDonHangHoanDon(resHoan.data || []);
    } catch (error: any) {
      console.error('Lỗi khi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleXuLyHoanDon = async (maDonHang: number) => {
    if (!confirm('Đã xử lý xong sản phẩm?')) return;

    try {
      const res = await nongdanService.xuLyHoanDon(maDonHang, maNongDan);
      alert('✅ Đã xử lý hoàn đơn, chuyển lại sang chờ kiểm định');
      await loadDonHang();
    } catch (error: any) {
      console.error('Lỗi xử lý hoàn đơn:', error);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleHuy = async (maDonHang: number) => {
    const message = 'Hủy đơn hàng này? Sản phẩm lỗi/hỏng sẽ KHÔNG được hoàn lại số lượng.';
    
    if (!confirm(message)) return;

    try {
      const res = await nongdanService.huyDonHang(maDonHang, maNongDan);
      alert('✅ Đã hủy đơn hàng');
      await loadDonHang();
    } catch (error: any) {
      console.error('Lỗi hủy:', error);
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
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="nongdan-donhang">
      <h2>Quản lý đơn hàng</h2>

      <div className="tab-content">
        <h3>Đơn hàng hoàn đơn (Kiểm định không đạt)</h3>
        {donHangHoanDon.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <p>Không có đơn hàng hoàn đơn</p>
          </div>
        ) : (
          <div className="donhang-list">
            {donHangHoanDon.map(dh => (
              <div key={dh.maDonHang} className="donhang-item hoan-don">
                <div className="donhang-header">
                  <h4>Đơn hàng #{dh.maDonHang}</h4>
                  <span className="badge badge-return">Hoàn đơn</span>
                </div>
                <div className="donhang-info">
                  <p><strong>Đại lý:</strong> {dh.tenDaiLy}</p>
                  <p><strong>Ngày đặt:</strong> {formatDate(dh.ngayDat)}</p>
                  <p><strong>Số lượng:</strong> {dh.tongSoLuong} kg</p>
                  <p><strong>Giá trị:</strong> {formatCurrency(dh.tongGiaTri)}</p>
                  {dh.ghiChu && (
                    <p className="error-note">
                      <strong>Lý do:</strong> {dh.ghiChu}
                    </p>
                  )}
                </div>
                <div className="donhang-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleXuLyHoanDon(dh.maDonHang)}
                  >
                    ✓ Đã xử lý - Gửi lại kiểm định
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleHuy(dh.maDonHang)}
                  >
                    ✗ Hủy (Sản phẩm lỗi/hỏng)
                  </button>
                </div>
                <div className="info-box">
                  <p>✓ <strong>Tick:</strong> Số lượng sẽ được cộng lại vào lô và gửi lại cho đại lý kiểm định</p>
                  <p>✗ <strong>Hủy:</strong> Số lượng KHÔNG được hoàn lại (sản phẩm lỗi/hỏng)</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NongDanDonHang;
