import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import '../../components/Common.css';

function TraceabilityManagement() {
  const [searchCode, setSearchCode] = useState('');
  const [traceData, setTraceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    
    if (!searchCode.trim()) {
      alert('❌ Vui lòng nhập mã QR hoặc mã lô!');
      return;
    }

    try {
      setLoading(true);
      console.log('Tìm kiếm với mã:', searchCode);
      
      // Tìm kiếm lô nông sản theo mã QR hoặc mã lô
      const loNongSanRes = await axios.get(API_ENDPOINTS.loNongSan.getAll);
      console.log('Danh sách lô nông sản:', loNongSanRes.data);
      
      const allBatches = loNongSanRes.data.data || [];
      
      // Tìm lô theo mã QR hoặc mã lô
      const foundBatch = allBatches.find((batch: any) => 
        batch.maQR === searchCode || 
        batch.maLo?.toString() === searchCode
      );
      
      console.log('Lô tìm thấy:', foundBatch);
      
      if (!foundBatch) {
        alert('❌ Không tìm thấy thông tin cho mã: ' + searchCode);
        setTraceData(null);
        setLoading(false);
        return;
      }

      // Lấy thông tin trang trại
      let trangTraiInfo = null;
      if (foundBatch.maTrangTrai) {
        try {
          const trangTraiRes = await axios.get(API_ENDPOINTS.trangTrai.getAll);
          trangTraiInfo = trangTraiRes.data.data?.find((tt: any) => tt.maTrangTrai === foundBatch.maTrangTrai);
        } catch (err) {
          console.error('Error loading trang trai:', err);
        }
      }

      // Lấy thông tin nông dân
      let nongDanInfo = null;
      if (trangTraiInfo?.maNongDan) {
        try {
          const nongDanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
          nongDanInfo = nongDanRes.data.data?.find((nd: any) => nd.maNongDan === trangTraiInfo.maNongDan);
        } catch (err) {
          console.error('Error loading nong dan:', err);
        }
      }

      // Tạo dữ liệu truy xuất
      setTraceData({
        maLo: foundBatch.maLo,
        maQR: foundBatch.maQR,
        tenSanPham: foundBatch.tenSanPham || 'N/A',
        soLuong: foundBatch.soLuongHienTai || foundBatch.soLuongBanDau || 0,
        donViTinh: 'kg',
        trangThai: foundBatch.trangThai || 'tai_trang_trai',
        nongDan: nongDanInfo ? {
          hoTen: nongDanInfo.hoTen || 'N/A',
          sdt: nongDanInfo.soDienThoai || 'N/A',
          diaChi: nongDanInfo.diaChi || 'N/A'
        } : {
          hoTen: 'N/A',
          sdt: 'N/A',
          diaChi: 'N/A'
        },
        trangTrai: trangTraiInfo ? {
          tenTrangTrai: trangTraiInfo.tenTrangTrai || 'N/A',
          diaChi: trangTraiInfo.diaChi || 'N/A',
          dienTich: trangTraiInfo.dienTich || 0
        } : {
          tenTrangTrai: 'N/A',
          diaChi: 'N/A',
          dienTich: 0
        },
        ngayThuHoach: foundBatch.ngayThuHoach || foundBatch.ngayTao,
        hanSuDung: foundBatch.hanSuDung || null,
        daiLy: {
          tenDaiLy: 'N/A',
          diaChi: 'N/A'
        },
        lichSuVanChuyen: [
          { 
            ngay: foundBatch.ngayTao || new Date().toISOString(), 
            trangThai: 'Thu hoạch tại trang trại', 
            nguoiThucHien: nongDanInfo?.hoTen || 'Nông dân' 
          },
          { 
            ngay: foundBatch.ngayTao || new Date().toISOString(), 
            trangThai: 'Đang tại trang trại', 
            nguoiThucHien: trangTraiInfo?.tenTrangTrai || 'Trang trại' 
          }
        ]
      });
      
    } catch (error: any) {
      console.error('Error searching:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm'));
      setTraceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchCode('');
    setTraceData(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Truy xuất nguồn gốc</h1>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>
              <span className="label-icon">📱</span>
              Nhập mã QR hoặc mã lô
            </label>
            <div className="search-input-group">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Nhập mã để tra cứu..."
                className="form-control"
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Đang tìm...' : '🔍 Tra cứu'}
              </button>
              {traceData && (
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  ↻ Làm mới
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {traceData && (
        <div className="trace-result">
          <div className="result-header">
            <h2>📋 Thông tin sản phẩm</h2>
            <span className="badge badge-success">✅ Đã xác thực</span>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>🌾 Thông tin nông sản</h3>
              <div className="info-row">
                <span className="label">Mã lô:</span>
                <span className="value">{traceData.maLo}</span>
              </div>
              <div className="info-row">
                <span className="label">Tên sản phẩm:</span>
                <span className="value">{traceData.tenSanPham}</span>
              </div>
              <div className="info-row">
                <span className="label">Số lượng:</span>
                <span className="value">{traceData.soLuong} {traceData.donViTinh}</span>
              </div>
              <div className="info-row">
                <span className="label">Ngày thu hoạch:</span>
                <span className="value">{new Date(traceData.ngayThuHoach).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="info-row">
                <span className="label">Hạn sử dụng:</span>
                <span className="value">{new Date(traceData.hanSuDung).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>👨‍🌾 Thông tin nông dân</h3>
              <div className="info-row">
                <span className="label">Họ tên:</span>
                <span className="value">{traceData.nongDan.hoTen}</span>
              </div>
              <div className="info-row">
                <span className="label">Số điện thoại:</span>
                <span className="value">{traceData.nongDan.sdt}</span>
              </div>
              <div className="info-row">
                <span className="label">Địa chỉ:</span>
                <span className="value">{traceData.nongDan.diaChi}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>🏡 Thông tin trang trại</h3>
              <div className="info-row">
                <span className="label">Tên trang trại:</span>
                <span className="value">{traceData.trangTrai.tenTrangTrai}</span>
              </div>
              <div className="info-row">
                <span className="label">Địa chỉ:</span>
                <span className="value">{traceData.trangTrai.diaChi}</span>
              </div>
              <div className="info-row">
                <span className="label">Diện tích:</span>
                <span className="value">{traceData.trangTrai.dienTich} ha</span>
              </div>
            </div>

            <div className="info-card">
              <h3>🏪 Thông tin đại lý</h3>
              <div className="info-row">
                <span className="label">Tên đại lý:</span>
                <span className="value">{traceData.daiLy.tenDaiLy}</span>
              </div>
              <div className="info-row">
                <span className="label">Địa chỉ:</span>
                <span className="value">{traceData.daiLy.diaChi}</span>
              </div>
            </div>
          </div>

          <div className="timeline-section">
            <h3>📍 Lịch sử vận chuyển</h3>
            <div className="timeline">
              {traceData.lichSuVanChuyen.map((item: any, index: number) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{new Date(item.ngay).toLocaleDateString('vi-VN')}</div>
                    <div className="timeline-title">{item.trangThai}</div>
                    <div className="timeline-desc">Thực hiện bởi: {item.nguoiThucHien}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!traceData && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>Nhập mã QR hoặc mã lô để tra cứu thông tin nguồn gốc sản phẩm</p>
        </div>
      )}

      <style>{`
        .search-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .search-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .search-input-group {
          display: flex;
          gap: 10px;
        }

        .search-input-group .form-control {
          flex: 1;
        }

        .trace-result {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .result-header h2 {
          margin: 0;
          color: #374151;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .info-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .info-card h3 {
          margin: 0 0 15px 0;
          color: #374151;
          font-size: 16px;
          font-weight: 600;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          color: #6b7280;
          font-weight: 500;
        }

        .info-row .value {
          color: #374151;
          font-weight: 600;
        }

        .timeline-section {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #e5e7eb;
        }

        .timeline-section h3 {
          margin-bottom: 20px;
          color: #374151;
        }

        .timeline {
          position: relative;
          padding-left: 40px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e5e7eb;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 30px;
        }

        .timeline-marker {
          position: absolute;
          left: -34px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #8b5cf6;
        }

        .timeline-content {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid #8b5cf6;
        }

        .timeline-date {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .timeline-title {
          color: #374151;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .timeline-desc {
          color: #6b7280;
          font-size: 14px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state p {
          font-size: 18px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

export default TraceabilityManagement;
