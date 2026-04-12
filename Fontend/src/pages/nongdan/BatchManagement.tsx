import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

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
    ngayThuHoach: '',
    hanSuDung: '',
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
      const batchesRes = await axios.get(API_ENDPOINTS.loNongSan.getByNongDan(currentFarmer.maNongDan));
      setBatches(batchesRes.data.data || []);

      // Load farms
      const farmsRes = await axios.get(API_ENDPOINTS.trangTrai.getByNongDan(currentFarmer.maNongDan));
      setFarms(farmsRes.data.data || []);

      // Load products
      const productsRes = await axios.get(API_ENDPOINTS.sanPham.getAll);
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
        ngayThuHoach: batch.ngayThuHoach ? batch.ngayThuHoach.split('T')[0] : '',
        hanSuDung: batch.hanSuDung ? batch.hanSuDung.split('T')[0] : '',
        soChungNhanLo: batch.soChungNhanLo || ''
      });
    } else {
      setEditingBatch(null);
      setFormData({
        maTrangTrai: '',
        maSanPham: '',
        soLuongBanDau: '',
        ngayThuHoach: '',
        hanSuDung: '',
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
        // Update - gửi với PascalCase
        const payload = {
          SoChungNhanLo: formData.soChungNhanLo || null,
          NgayThuHoach: formData.ngayThuHoach || null,
          HanSuDung: formData.hanSuDung || null
        };
        await axios.put(
          API_ENDPOINTS.loNongSan.update(editingBatch.maLo),
          payload
        );
        alert('✅ Cập nhật lô nông sản thành công!');
      } else {
        // Create - gửi với PascalCase
        const payload = {
          MaTrangTrai: parseInt(formData.maTrangTrai),
          MaSanPham: parseInt(formData.maSanPham),
          SoLuongBanDau: parseFloat(formData.soLuongBanDau),
          NgayThuHoach: formData.ngayThuHoach || null,
          HanSuDung: formData.hanSuDung || null,
          SoChungNhanLo: formData.soChungNhanLo || null
        };
        await axios.post(
          API_ENDPOINTS.loNongSan.create,
          payload
        );
        alert('✅ Tạo lô nông sản thành công!');
      }
      
      handleCloseModal();
      await loadData();
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleDelete = async (batch) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lô "${batch.maLo}"?`)) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.loNongSan.delete(batch.maLo));
      
      // Reload danh sách ngay lập tức
      await loadData();
      
      alert('✅ Xóa lô nông sản thành công!');
    } catch (error) {
      console.error('Error deleting batch:', error);
      
      // Nếu lỗi 404 hoặc không tìm thấy nhưng thực tế đã xóa, vẫn reload
      if (error.response?.status === 404 || error.response?.data?.message?.includes('Không tìm thấy')) {
        await loadData();
        alert('✅ Xóa lô nông sản thành công!');
      } else {
        alert('❌ ' + (error.response?.data?.message || 'Không thể xóa lô'));
      }
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
                <td colSpan={9} className="text-center">Chưa có lô nông sản nào</td>
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
                  <label>Ngày thu hoạch</label>
                  <input
                    type="date"
                    value={formData.ngayThuHoach}
                    onChange={(e) => setFormData({...formData, ngayThuHoach: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Hạn sử dụng</label>
                  <input
                    type="date"
                    value={formData.hanSuDung}
                    onChange={(e) => setFormData({...formData, hanSuDung: e.target.value})}
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
