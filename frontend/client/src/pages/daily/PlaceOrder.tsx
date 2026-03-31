import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function PlaceOrder() {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [maDaiLy, setMaDaiLy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    maNongDan: '',
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
      
      // Get distributor ID
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        dl => dl.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (currentDaily) {
        setMaDaiLy(currentDaily.maDaiLy);
      }

      // Load farmers
      const farmersRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      setFarmers(farmersRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!maDaiLy) {
      alert('Không tìm thấy thông tin đại lý');
      return;
    }

    try {
      await axios.post(
        `${API_ENDPOINTS.daiLy.base}/don-hang-dai-ly/create`,
        {
          maDaiLy: maDaiLy,
          maNongDan: parseInt(formData.maNongDan),
          loaiDon: 'dai_ly',
          ngayGiao: formData.ngayGiao || null,
          tongSoLuong: parseFloat(formData.tongSoLuong) || null,
          tongGiaTri: parseFloat(formData.tongGiaTri) || null,
          ghiChu: formData.ghiChu || null
        }
      );
      
      alert('Đặt hàng thành công!');
      
      // Reset form
      setFormData({
        maNongDan: '',
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
        <h1>Đặt hàng từ nông dân</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chọn nông dân <span className="required">*</span></label>
            <select
              value={formData.maNongDan}
              onChange={(e) => setFormData({...formData, maNongDan: e.target.value})}
              required
            >
              <option value="">-- Chọn nông dân --</option>
              {farmers.map(farmer => (
                <option key={farmer.maNongDan} value={farmer.maNongDan}>
                  {farmer.hoTen} - {farmer.soDienThoai}
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
              rows={4}
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
          <li>Chọn nông dân bạn muốn đặt hàng</li>
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
