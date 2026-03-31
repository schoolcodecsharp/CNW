import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [farms, setFarms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    maTrangTrai: '',
    maSanPham: '',
    soLuongBanDau: '',
    ngaySanXuat: '',
    ngayHetHan: '',
    maQR: ''
  });

  useEffect(() => {
    loadBatches();
    loadFarms();
    loadProducts();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.loNongSan.getAll);
      setBatches(response.data.data || []);
    } catch (error) {
      console.error('Error loading batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFarms = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.trangTrai.getAll);
      setFarms(response.data.data || []);
    } catch (error) {
      console.error('Error loading farms:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.sanPham.getAll);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedBatch(null);
    setFormData({
      maTrangTrai: '',
      maSanPham: '',
      soLuongBanDau: '',
      ngaySanXuat: '',
      ngayHetHan: '',
      maQR: ''
    });
    setShowModal(true);
  };

  const handleEdit = (batch) => {
    setModalMode('edit');
    setSelectedBatch(batch);
    setFormData({
      maTrangTrai: batch.maTrangTrai,
      maSanPham: batch.maSanPham,
      soLuongBanDau: batch.soLuongBanDau,
      ngaySanXuat: batch.ngaySanXuat ? batch.ngaySanXuat.split('T')[0] : '',
      ngayHetHan: batch.ngayHetHan ? batch.ngayHetHan.split('T')[0] : '',
      maQR: batch.maQR || ''
    });
    setShowModal(true);
  };

  const handleView = (batch) => {
    setModalMode('view');
    setSelectedBatch(batch);
    setShowModal(true);
  };

  const handleDelete = async (batch) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lô hàng "${batch.maQR}"?`)) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.loNongSan.delete(batch.maLo));
      alert('Xóa lô hàng thành công');
      loadBatches();
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa lô hàng');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await axios.post(API_ENDPOINTS.loNongSan.create, formData);
        alert('Thêm lô hàng thành công');
      } else if (modalMode === 'edit') {
        await axios.put(API_ENDPOINTS.loNongSan.update(selectedBatch.maLo), formData);
        alert('Cập nhật lô hàng thành công');
      }
      setShowModal(false);
      loadBatches();
    } catch (error) {
      console.error('Error saving batch:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu lô hàng');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (batch) => {
    const today = new Date();
    const expDate = new Date(batch.ngayHetHan);
    const daysUntilExp = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (batch.soLuongConLai === 0) {
      return <span className="badge badge-secondary">Hết hàng</span>;
    } else if (daysUntilExp < 0) {
      return <span className="badge badge-danger">Hết hạn</span>;
    } else if (daysUntilExp <= 7) {
      return <span className="badge badge-warning">Sắp hết hạn</span>;
    } else {
      return <span className="badge badge-success">Còn hàng</span>;
    }
  };

  const filteredBatches = batches.filter(b => {
    if (filterStatus === 'all') return true;
    
    const today = new Date();
    const expDate = new Date(b.ngayHetHan);
    const daysUntilExp = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (filterStatus === 'available' && b.soLuongConLai > 0 && daysUntilExp > 7) return true;
    if (filterStatus === 'expiring' && daysUntilExp <= 7 && daysUntilExp >= 0) return true;
    if (filterStatus === 'expired' && daysUntilExp < 0) return true;
    if (filterStatus === 'out_of_stock' && b.soLuongConLai === 0) return true;
    
    return false;
  });

  if (loading) {
    return <div className="loading">Đang tải danh sách lô hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý lô hàng</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            ➕ Thêm lô hàng
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Tổng lô hàng</span>
          <span className="stat-value">{batches.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Còn hàng</span>
          <span className="stat-value">
            {batches.filter(b => b.soLuongConLai > 0 && new Date(b.ngayHetHan) > new Date()).length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sắp hết hạn</span>
          <span className="stat-value">
            {batches.filter(b => {
              const days = Math.ceil((new Date(b.ngayHetHan) - new Date()) / (1000 * 60 * 60 * 24));
              return days <= 7 && days >= 0;
            }).length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Hết hàng</span>
          <span className="stat-value">{batches.filter(b => b.soLuongConLai === 0).length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="available">Còn hàng</option>
            <option value="expiring">Sắp hết hạn</option>
            <option value="expired">Hết hạn</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã lô</th>
              <th>Mã QR</th>
              <th>Trang trại</th>
              <th>Sản phẩm</th>
              <th>SL ban đầu</th>
              <th>SL còn lại</th>
              <th>Ngày SX</th>
              <th>Hạn sử dụng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              filteredBatches.map((batch) => (
                <tr key={batch.maLo}>
                  <td>{batch.maLo}</td>
                  <td>{batch.maQR || 'N/A'}</td>
                  <td>{batch.tenTrangTrai || 'N/A'}</td>
                  <td>{batch.tenSanPham || 'N/A'}</td>
                  <td>{batch.soLuongBanDau}</td>
                  <td>{batch.soLuongConLai}</td>
                  <td>{batch.ngaySanXuat ? new Date(batch.ngaySanXuat).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>{batch.ngayHetHan ? new Date(batch.ngayHetHan).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>{getStatusBadge(batch)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleView(batch)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => handleEdit(batch)}
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'add' && '➕ Thêm lô hàng mới'}
                {modalMode === 'edit' && '✏️ Chỉnh sửa lô hàng'}
                {modalMode === 'view' && '👁️ Chi tiết lô hàng'}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {modalMode === 'view' ? (
              <div className="modal-body">
                <div className="view-field">
                  <label>Mã lô:</label>
                  <p>{selectedBatch?.maLo}</p>
                </div>
                <div className="view-field">
                  <label>Mã QR:</label>
                  <p>{selectedBatch?.maQR || 'N/A'}</p>
                </div>
                <div className="view-field">
                  <label>Trang trại:</label>
                  <p>{selectedBatch?.tenTrangTrai || 'N/A'}</p>
                </div>
                <div className="view-field">
                  <label>Sản phẩm:</label>
                  <p>{selectedBatch?.tenSanPham || 'N/A'}</p>
                </div>
                <div className="view-field">
                  <label>Số lượng ban đầu:</label>
                  <p>{selectedBatch?.soLuongBanDau}</p>
                </div>
                <div className="view-field">
                  <label>Số lượng còn lại:</label>
                  <p>{selectedBatch?.soLuongConLai}</p>
                </div>
                <div className="view-field">
                  <label>Ngày sản xuất:</label>
                  <p>{selectedBatch?.ngaySanXuat ? new Date(selectedBatch.ngaySanXuat).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
                <div className="view-field">
                  <label>Hạn sử dụng:</label>
                  <p>{selectedBatch?.ngayHetHan ? new Date(selectedBatch.ngayHetHan).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Trang trại <span className="required">*</span></label>
                    <select
                      name="maTrangTrai"
                      value={formData.maTrangTrai}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === 'edit'}
                    >
                      <option value="">-- Chọn trang trại --</option>
                      {farms.map(farm => (
                        <option key={farm.maTrangTrai} value={farm.maTrangTrai}>
                          {farm.tenTrangTrai} (Mã: {farm.maTrangTrai})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Sản phẩm <span className="required">*</span></label>
                    <select
                      name="maSanPham"
                      value={formData.maSanPham}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === 'edit'}
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(product => (
                        <option key={product.maSanPham} value={product.maSanPham}>
                          {product.tenSanPham}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Số lượng ban đầu <span className="required">*</span></label>
                    <input
                      type="number"
                      name="soLuongBanDau"
                      value={formData.soLuongBanDau}
                      onChange={handleInputChange}
                      required
                      min="1"
                      step="0.01"
                      placeholder="Nhập số lượng"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày sản xuất <span className="required">*</span></label>
                    <input
                      type="date"
                      name="ngaySanXuat"
                      value={formData.ngaySanXuat}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Hạn sử dụng <span className="required">*</span></label>
                    <input
                      type="date"
                      name="ngayHetHan"
                      value={formData.ngayHetHan}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mã QR</label>
                    <input
                      type="text"
                      name="maQR"
                      value={formData.maQR}
                      onChange={handleInputChange}
                      maxLength={50}
                      placeholder="Nhập mã QR (tùy chọn)"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchManagement;
