import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function PlaceOrder() {
  const { user } = useAuth();
  const [distributors, setDistributors] = useState([]);
  const [maSieuThi, setMaSieuThi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    maDaiLy: '',
    ngayGiao: '',
    tongSoLuong: '',
    tongGiaTri: '',
    ghiChu: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get supermarket ID
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      const currentSieuThi = sieuThiRes.data.data?.find(
        st => st.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (currentSieuThi) {
        setMaSieuThi(currentSieuThi.maSieuThi);
      }

      // Load distributors
      const distributorsRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      setDistributors(distributorsRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!maSieuThi) {
      alert('Không tìm thấy thông tin siêu thị');
      return;
    }

    try {
      await axios.post(
        `${API_ENDPOINTS.sieuThi.base}/don-hang-sieu-thi/create`,
        {
          maSieuThi: maSieuThi,
          maDaiLy: parseInt(formData.maDaiLy),
          loaiDon: 'sieu_thi',
          ngayGiao: formData.ngayGiao || null,
          tongSoLuong: parseFloat(formData.tongSoLuong) || null,
          tongGiaTri: parseFloat(formData.tongGiaTri) || null,
          ghiChu: formData.ghiChu || null
        }
      );
      
      alert('Đặt hàng thành công!');
      
      // Reset form
      setFormData({
        maDaiLy: '',
        ngayGiao: '',
        tongSoLuong: '',
        tongGiaTri: '',
        ghiChu: ''
      });
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Đặt hàng từ đại lý</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chọn đại lý <span className="required">*</span></label>
            <select
              value={formData.maDaiLy}
              onChange={(e) => setFormData({...formData, maDaiLy: e.target.value})}
              required
            >
              <option value="">-- Chọn đại lý --</option>
              {distributors.map(distributor => (
                <option key={distributor.maDaiLy} value={distributor.maDaiLy}>
                  {distributor.tenDaiLy} - {distributor.soDienThoai}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày giao dự kiến</label>
              <input
                type="date"
                value={formData.ngayGiao}
                onChange={(e) => setFormData({...formData, ngayGiao: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Tổng số lượng (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.tongSoLuong}
                onChange={(e) => setFormData({...formData, tongSoLuong: e.target.value})}
                placeholder="Nhập số lượng"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tổng giá trị (VNĐ)</label>
            <input
              type="number"
              step="1000"
              value={formData.tongGiaTri}
              onChange={(e) => setFormData({...formData, tongGiaTri: e.target.value})}
              placeholder="Nhập giá trị đơn hàng"
            />
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              value={formData.ghiChu}
              onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
              placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-large">
              🛒 Đặt hàng
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="info-card">
        <h3>📋 Hướng dẫn đặt hàng</h3>
        <ul>
          <li>Chọn đại lý bạn muốn đặt hàng</li>
          <li>Nhập thông tin số lượng và giá trị (tùy chọn)</li>
          <li>Chọn ngày giao hàng dự kiến</li>
          <li>Thêm ghi chú nếu cần</li>
          <li>Nhấn "Đặt hàng" để hoàn tất</li>
        </ul>
      </div>
    </div>
  );
}

export default PlaceOrder;
