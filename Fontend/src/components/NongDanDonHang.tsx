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
  const [donHangMoi, setDonHangMoi] = useState<DonHang[]>([]);
  const [donHangHoanDon, setDonHangHoanDon] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'moi' | 'hoan'>('moi');

  useEffect(() => {
    loadDonHang();
  }, [maNongDan]);

  const loadDonHang = async () => {
    setLoading(true);
    try {
      const [resMoi, resHoan] = await Promise.all([
        nongdanService.getDonHangChuaXacNhan(maNongDan),
        nongdanService.getDonHangHoanDon(maNongDan)
      ]);
      
      setDonHangMoi(resMoi.data || []);
      setDonHangHoanDon(resHoan.data || []);
    } catch (error: any) {
      console.error('Lỗi khi tải đơn hàng:', error);
      alert('Không thể tải danh sách đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleXacNhan = async (maDonHang: number) => {
    if (!confirm('Xác nhận đơn hàng này?\n\nSố lượng trong lô sẽ bị TRỪ ĐI ngay lập tức.')) return;

    try {
      const res = await nongdanService.xacNhanDonHang(maDonHang, maNongDan);
      alert(res.message || 'Đã xác nhận đơn hàng, chuyển sang chờ kiểm định từ đại lý');
      loadDonHang();
    } catch (error: any) {
      console.error('Lỗi khi xác nhận:', error);
      alert('Không thể xác nhận đơn hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleXuLyHoanDon = async (maDonHang: number) => {
    if (!confirm('Đã xử lý xong sản phẩm?\n\nSố lượng sẽ được CỘNG LẠI vào lô và gửi lại cho đại lý kiểm định.')) return;

    try {
      const res = await nongdanService.xuLyHoanDon(maDonHang, maNongDan);
      alert(res.message || 'Đã xử lý hoàn đơn, chuyển lại sang chờ kiểm định');
      loadDonHang();
    } catch (error: any) {
      console.error('Lỗi khi xử lý hoàn đơn:', error);
      alert('Không thể xử lý hoàn đơn: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleHuy = async (maDonHang: number, isHoanDon: boolean) => {
    const message = isHoanDon
      ? 'Hủy đơn hàng này?\n\nSản phẩm lỗi/hỏng sẽ KHÔNG được hoàn lại số lượng vào lô.'
      : 'Hủy đơn hàng này?';
    
    if (!confirm(message)) return;

    try {
      const res = await nongdanService.huyDonHang(maDonHang, maNongDan);
      alert(res.message || 'Đã hủy đơn hàng');
      loadDonHang();
    } catch (error: any) {
      console.error('Lỗi khi hủy:', error);
      alert('Không thể hủy đơn hàng: ' + (error.response?.data?.message || error.message));
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

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'moi' ? 'active' : ''}`}
          onClick={() => setActiveTab('moi')}
        >
          Đơn hàng mới ({donHangMoi.length})
        </button>
        <button 
          className={`tab ${activeTab === 'hoan' ? 'active' : ''}`}
          onClick={() => setActiveTab('hoan')}
        >
          Đơn hàng hoàn đơn ({donHangHoanDon.length})
        </button>
      </div>

      {activeTab === 'moi' && (
        <div className="tab-content">
          <h3>Đơn hàng chưa xác nhận</h3>
          {donHangMoi.length === 0 ? (
            <p className="empty">Không có đơn hàng mới</p>
          ) : (
            <div className="donhang-list">
              {donHangMoi.map(dh => (
                <div key={dh.maDonHang} className="donhang-item">
                  <div className="donhang-header">
                    <h4>Đơn hàng #{dh.maDonHang}</h4>
                    <span className="badge badge-new">Mới</span>
                  </div>
                  <div className="donhang-info">
                    <p><strong>Đại lý:</strong> {dh.tenDaiLy}</p>
                    <p><strong>Ngày đặt:</strong> {formatDate(dh.ngayDat)}</p>
                    <p><strong>Số lượng:</strong> {dh.tongSoLuong}</p>
                    <p><strong>Giá trị:</strong> {formatCurrency(dh.tongGiaTri)}</p>
                    {dh.ghiChu && <p><strong>Ghi chú:</strong> {dh.ghiChu}</p>}
                  </div>
                  <div className="donhang-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleXacNhan(dh.maDonHang)}
                    >
                      ✓ Xác nhận
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleHuy(dh.maDonHang, false)}
                    >
                      ✗ Hủy
                    </button>
                  </div>
                  <div className="warning">
                    ⚠️ Khi xác nhận, số lượng trong lô sẽ bị trừ đi ngay
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'hoan' && (
        <div className="tab-content">
          <h3>Đơn hàng hoàn đơn (Kiểm định không đạt)</h3>
          {donHangHoanDon.length === 0 ? (
            <p className="empty">Không có đơn hàng hoàn đơn</p>
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
                    <p><strong>Số lượng:</strong> {dh.tongSoLuong}</p>
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
                      onClick={() => handleHuy(dh.maDonHang, true)}
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
      )}
    </div>
  );
};

export default NongDanDonHang;
