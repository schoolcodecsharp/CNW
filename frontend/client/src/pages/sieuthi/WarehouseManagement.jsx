import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function WarehouseManagement() {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [maSieuThi, setMaSieuThi] = useState(null);
  const [formData, setFormData] = useState({
    tenKho: '',
    diaChi: ''
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
      
      if (!currentSieuThi) {
        setLoading(false);
        return;
      }

      setMaSieuThi(currentSieuThi.maSieuThi);

      // Load warehouses
      const warehousesRes = await axios.get(`${API_ENDPOINTS.sieuThi.base}/kho/get-by-sieu-thi/${currentSieuThi.maSieuThi}`);
      setWarehouses(warehousesRes.data.data || []);

    } catch (error) {
      console.error('Error loading warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (warehouse = null) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setFormData({
        tenKho: warehouse.tenKho,
        diaChi: warehouse.diaChi || ''
      });
    } else {
      setEditingWarehouse(null);
      setFormData({
        tenKho: '',
        diaChi: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWarehouse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingWarehouse) {
        // Update
        await axios.put(
          `${API_ENDPOINTS.sieuThi.base}/kho/update/${editingWarehouse.maKho}`,
          formData
        );
        alert('Cập nhật kho thành công!');
      } else {
        // Create
        await axios.post(
          `${API_ENDPOINTS.sieuThi.base}/kho/create`,
          {
            loaiKho: 'sieuthi',
            maSieuThi: maSieuThi,
            ...formData
          }
        );
        alert('Tạo kho thành công!');
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (warehouse) => {
    if (!window.confirm(`Bạn có chắc muốn xóa kho "${warehouse.tenKho}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_ENDPOINTS.sieuThi.base}/kho/delete/${warehouse.maKho}`);
      alert('Xóa kho thành công!');
      loadData();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      alert('Không thể xóa kho: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách kho...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý kho</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            ➕ Thêm kho
          </button>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="warehouses-grid">
        {warehouses.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa có kho nào</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              Tạo kho đầu tiên
            </button>
          </div>
        ) : (
          warehouses.map((warehouse) => (
            <div key={warehouse.maKho} className="warehouse-card">
              <div className="warehouse-icon">🏬</div>
              <h3>{warehouse.tenKho}</h3>
              <div className="warehouse-details">
                <p><strong>Địa chỉ:</strong> {warehouse.diaChi || 'Chưa cập nhật'}</p>
                <p><strong>Trạng thái:</strong> 
                  <span className={`badge badge-${warehouse.trangThai}`}>
                    {warehouse.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </p>
                <p><strong>Tồn kho:</strong> {warehouse.tongSoLuong || 0} kg</p>
                <p><strong>Số lô:</strong> {warehouse.tongSoLoHang || 0} lô</p>
              </div>
              <div className="warehouse-actions">
                <button 
                  className="btn-action btn-edit"
                  onClick={() => handleOpenModal(warehouse)}
                >
                  ✏️ Sửa
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(warehouse)}
                >
                  🗑️ Xóa
                </button>
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
              <h2>{editingWarehouse ? 'Cập nhật kho' : 'Thêm kho mới'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên kho <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.tenKho}
                    onChange={(e) => setFormData({...formData, tenKho: e.target.value})}
                    required
                    placeholder="Nhập tên kho"
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.diaChi}
                    onChange={(e) => setFormData({...formData, diaChi: e.target.value})}
                    placeholder="Nhập địa chỉ kho"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingWarehouse ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WarehouseManagement;
