import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function BatchManagement() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [farms, setFarms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [maNongDan, setMaNongDan] = useState(null);
  const [formData, setFormData] = useState({
    maTrangTrai: '',
    maSanPham: '',
    soLuongBanDau: '',
    soChungNhanLo: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get farmer ID
      const nongdanRes = await axios.get(API_ENDPOINTS.nongDan.getAll);
      const currentFarmer = nongdanRes.data.data?.find(
        nd => nd.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentFarmer) {
        setLoading(false);
        return;
      }

      setMaNongDan(currentFarmer.maNongDan);

      // Load batches
      const batchesRes = await axios.get(`${API_ENDPOINTS.nongDan.base}/lo-nong-san/get-by-nong-dan/${currentFarmer.maNongDan}`);
      setBatches(batchesRes.data.data || []);

      // Load farms
      const farmsRes = await axios.get(`${API_ENDPOINTS.nongDan.base}/trang-trai/get-by-nong-dan/${currentFarmer.maNongDan}`);
      setFarms(farmsRes.data.data || []);

      // Load products
      const productsRes = await axios.get(`${API_ENDPOINTS.nongDan.base}/san-pham/get-all`);
      setProducts(productsRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (batch = null) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        maTrangTrai: batch.maTrangTrai,
        maSanPham: batch.maSanPham,
        soLuongBanDau: batch.soLuongBanDau,
        soChungNhanLo: batch.soChungNhanLo || ''
      });
    } else {
      setEditingBatch(null);
      setFormData({
        maTrangTrai: '',
        maSanPham: '',
        soLuongBanDau: '',
        soChungNhanLo: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBatch(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBatch) {
        // Update
        await axios.put(
          `${API_ENDPOINTS.nongDan.base}/lo-nong-san/update/${editingBatch.maLo}`,
          {
            soChungNhanLo: formData.soChungNhanLo
          }
        );
        alert('Cập nhật lô nông sản thành công!');
      } else {
        // Create
        await axios.post(
          `${API_ENDPOINTS.nongDan.base}/lo-nong-san/create`,
          formData
        );
        alert('Tạo lô nông sản thành công!');
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (batch) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lô "${batch.maLo}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_ENDPOINTS.nongDan.base}/lo-nong-san/delete/${batch.maLo}`);
      alert('Xóa lô nông sản thành công!');
      loadData();
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Không thể xóa lô: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách lô nông sản...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý lô nông sản</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => handleOpenModal()}
            disabled={farms.length === 0}
          >
            ➕ Thêm lô mới
          </button>
        </div>
      </div>

      {farms.length === 0 && (
        <div className="alert alert-warning">
          Bạn cần tạo trang trại trước khi tạo lô nông sản
        </div>
      )}

      {/* Batches Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã lô</th>
              <th>Trang trại</th>
              <th>Sản phẩm</th>
              <th>SL ban đầu</th>
              <th>SL hiện tại</th>
              <th>Mã QR</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">Chưa có lô nông sản nào</td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch.maLo}>
                  <td>{batch.maLo}</td>
                  <td>{batch.tenTrangTrai}</td>
                  <td>{batch.tenSanPham}</td>
                  <td>{batch.soLuongBanDau} kg</td>
                  <td>{batch.soLuongHienTai} kg</td>
                  <td><code>{batch.maQR}</code></td>
                  <td>
                    <span className={`badge badge-${batch.trangThai}`}>
                      {batch.trangThai === 'tai_trang_trai' ? 'Tại trang trại' :
                       batch.trangThai === 'dang_van_chuyen' ? 'Đang vận chuyển' :
                       batch.trangThai === 'da_giao' ? 'Đã giao' : batch.trangThai}
                    </span>
                  </td>
                  <td>{new Date(batch.ngayTao).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleOpenModal(batch)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(batch)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBatch ? 'Cập nhật lô nông sản' : 'Thêm lô nông sản mới'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Trang trại <span className="required">*</span></label>
                  <select
                    value={formData.maTrangTrai}
                    onChange={(e) => setFormData({...formData, maTrangTrai: e.target.value})}
                    required
                    disabled={editingBatch}
                  >
                    <option value="">-- Chọn trang trại --</option>
                    {farms.map(farm => (
                      <option key={farm.maTrangTrai} value={farm.maTrangTrai}>
                        {farm.tenTrangTrai}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sản phẩm <span className="required">*</span></label>
                  <select
                    value={formData.maSanPham}
                    onChange={(e) => setFormData({...formData, maSanPham: e.target.value})}
                    required
                    disabled={editingBatch}
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map(product => (
                      <option key={product.maSanPham} value={product.maSanPham}>
                        {product.tenSanPham} ({product.donViTinh})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Số lượng ban đầu (kg) <span className="required">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.soLuongBanDau}
                    onChange={(e) => setFormData({...formData, soLuongBanDau: e.target.value})}
                    required
                    disabled={editingBatch}
                    placeholder="Nhập số lượng"
                  />
                </div>
                <div className="form-group">
                  <label>Số chứng nhận lô</label>
                  <input
                    type="text"
                    value={formData.soChungNhanLo}
                    onChange={(e) => setFormData({...formData, soChungNhanLo: e.target.value})}
                    placeholder="Nhập số chứng nhận (nếu có)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBatch ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchManagement;
