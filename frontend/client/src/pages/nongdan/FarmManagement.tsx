import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function FarmManagement() {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [maNongDan, setMaNongDan] = useState(null);
  const [formData, setFormData] = useState({
    tenTrangTrai: '',
    diaChi: '',
    soChungNhan: ''
  });

  useEffect(() => {
    loadFarmerAndFarms();
  }, [user]);

  const loadFarmerAndFarms = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.maTaiKhoan) {
        console.error('User not logged in or missing maTaiKhoan');
        setLoading(false);
        return;
      }

      // Get farmer ID by MaTaiKhoan
      const nongdanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      
      if (!nongdanRes.data.success || !nongdanRes.data.data) {
        console.error('Failed to load farmers');
        setLoading(false);
        return;
      }

      const currentFarmer = nongdanRes.data.data.find(
        (nd: any) => nd.maTaiKhoan === user.maTaiKhoan
      );
      
      if (!currentFarmer) {
        console.error('Current farmer not found for maTaiKhoan:', user.maTaiKhoan);
        setLoading(false);
        return;
      }

      console.log('Found farmer:', currentFarmer);
      setMaNongDan(currentFarmer.maNongDan);

      // Load farms for this farmer
      const farmsRes = await axios.get(API_ENDPOINTS.trangTrai.getByNongDan(currentFarmer.maNongDan));
      
      if (farmsRes.data.success) {
        setFarms(farmsRes.data.data || []);
      }

    } catch (error) {
      console.error('Error loading farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (farm = null) => {
    if (farm) {
      setEditingFarm(farm);
      setFormData({
        tenTrangTrai: farm.tenTrangTrai,
        diaChi: farm.diaChi || '',
        soChungNhan: farm.soChungNhan || ''
      });
    } else {
      setEditingFarm(null);
      setFormData({
        tenTrangTrai: '',
        diaChi: '',
        soChungNhan: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFarm(null);
    setFormData({
      tenTrangTrai: '',
      diaChi: '',
      soChungNhan: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!maNongDan) {
      alert('Không tìm thấy thông tin nông dân. Vui lòng đăng nhập lại.');
      return;
    }
    
    try {
      if (editingFarm) {
        // Update
        await axios.put(
          API_ENDPOINTS.trangTrai.update(editingFarm.maTrangTrai),
          {
            TenTrangTrai: formData.tenTrangTrai,
            DiaChi: formData.diaChi,
            SoChungNhan: formData.soChungNhan
          }
        );
        alert('Cập nhật trang trại thành công!');
      } else {
        // Create - Sử dụng PascalCase để khớp với backend DTO
        console.log('Creating farm with MaNongDan:', maNongDan);
        const response = await axios.post(
          API_ENDPOINTS.trangTrai.create,
          {
            MaNongDan: maNongDan,
            TenTrangTrai: formData.tenTrangTrai,
            DiaChi: formData.diaChi || '',
            SoChungNhan: formData.soChungNhan || ''
          }
        );
        console.log('Create response:', response.data);
        alert('Tạo trang trại thành công!');
      }
      
      handleCloseModal();
      loadFarmerAndFarms();
    } catch (error: any) {
      console.error('Error saving farm:', error);
      console.error('Error response:', error.response?.data);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (farm) => {
    if (!window.confirm(`Bạn có chắc muốn xóa trang trại "${farm.tenTrangTrai}"?`)) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.trangTrai.delete(farm.maTrangTrai));
      alert('Xóa trang trại thành công!');
      loadFarmerAndFarms();
    } catch (error) {
      console.error('Error deleting farm:', error);
      alert('Không thể xóa trang trại: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách trang trại...</div>;
  }

  if (!maNongDan) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Không tìm thấy thông tin nông dân. Vui lòng đăng nhập lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý trang trại</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            ➕ Thêm trang trại
          </button>
        </div>
      </div>

      {/* Farms Grid */}
      <div className="farms-grid">
        {farms.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa có trang trại nào</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              Tạo trang trại đầu tiên
            </button>
          </div>
        ) : (
          farms.map((farm) => (
            <div key={farm.maTrangTrai} className="farm-card">
              <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop" alt="Farm" className="farm-image" />
              <div className="farm-content">
                <h3>{farm.tenTrangTrai}</h3>
                <div className="farm-details">
                  <p><strong>📍 Địa chỉ:</strong> {farm.diaChi || 'Chưa cập nhật'}</p>
                  <p><strong>📜 Số chứng nhận:</strong> {farm.soChungNhan || 'Chưa có'}</p>
                  <p><strong>📅 Ngày tạo:</strong> {new Date(farm.ngayTao).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="farm-actions">
                  <button 
                    className="btn-action btn-edit"
                    onClick={() => handleOpenModal(farm)}
                  >
                    ✏️ Sửa
                  </button>
                  <button 
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(farm)}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFarm ? 'Cập nhật trang trại' : 'Thêm trang trại mới'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên trang trại <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.tenTrangTrai}
                    onChange={(e) => setFormData({...formData, tenTrangTrai: e.target.value})}
                    required
                    placeholder="Nhập tên trang trại"
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.diaChi}
                    onChange={(e) => setFormData({...formData, diaChi: e.target.value})}
                    placeholder="Nhập địa chỉ trang trại"
                  />
                </div>
                <div className="form-group">
                  <label>Số chứng nhận</label>
                  <input
                    type="text"
                    value={formData.soChungNhan}
                    onChange={(e) => setFormData({...formData, soChungNhan: e.target.value})}
                    placeholder="Nhập số chứng nhận (nếu có)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFarm ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmManagement;
