import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function FarmManagement() {
  const [farms, setFarms] = useState([]);
  const [nongDanList, setNongDanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [formData, setFormData] = useState({
    maNongDan: '',
    tenTrangTrai: '',
    diaChi: '',
    soChungNhan: ''
  });

  useEffect(() => {
    loadFarms();
    loadNongDan();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.trangTrai.getAll);
      setFarms(response.data.data || []);
    } catch (error) {
      console.error('Error loading farms:', error);
      alert('Lỗi khi tải danh sách trang trại');
    } finally {
      setLoading(false);
    }
  };

  const loadNongDan = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.nongDan.getAll);
      setNongDanList(response.data.data || []);
    } catch (error) {
      console.error('Error loading nong dan:', error);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedFarm(null);
    setFormData({
      maNongDan: '',
      tenTrangTrai: '',
      diaChi: '',
      soChungNhan: ''
    });
    setShowModal(true);
  };

  const handleEdit = (farm) => {
    setModalMode('edit');
    setSelectedFarm(farm);
    setFormData({
      maNongDan: farm.maNongDan,
      tenTrangTrai: farm.tenTrangTrai || '',
      diaChi: farm.diaChi || '',
      soChungNhan: farm.soChungNhan || ''
    });
    setShowModal(true);
  };

  const handleView = (farm) => {
    setModalMode('view');
    setSelectedFarm(farm);
    setShowModal(true);
  };

  const handleDelete = async (farm) => {
    if (!window.confirm(`Bạn có chắc muốn xóa trang trại "${farm.tenTrangTrai}"?`)) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.trangTrai.delete(farm.maTrangTrai));
      alert('Xóa trang trại thành công');
      loadFarms();
    } catch (error) {
      console.error('Error deleting farm:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa trang trại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await axios.post(API_ENDPOINTS.trangTrai.create, formData);
        alert('Thêm trang trại thành công');
      } else if (modalMode === 'edit') {
        await axios.put(API_ENDPOINTS.trangTrai.update(selectedFarm.maTrangTrai), {
          tenTrangTrai: formData.tenTrangTrai,
          diaChi: formData.diaChi,
          soChungNhan: formData.soChungNhan
        });
        alert('Cập nhật trang trại thành công');
      }
      setShowModal(false);
      loadFarms();
    } catch (error) {
      console.error('Error saving farm:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu trang trại');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách trang trại...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý trang trại</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            ➕ Thêm trang trại
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên trang trại</th>
              <th>Địa chỉ</th>
              <th>Chứng nhận</th>
              <th>Tên nông dân</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {farms.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              farms.map((farm) => (
                <tr key={farm.maTrangTrai}>
                  <td>{farm.maTrangTrai}</td>
                  <td>{farm.tenTrangTrai}</td>
                  <td>{farm.diaChi || 'N/A'}</td>
                  <td>{farm.soChungNhan || 'N/A'}</td>
                  <td>{farm.tenNongDan || 'N/A'}</td>
                  <td>
                    <span className="badge badge-success">Hoạt động</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleView(farm)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => handleEdit(farm)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        onClick={() => handleDelete(farm)}
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
                {modalMode === 'add' && '➕ Thêm trang trại mới'}
                {modalMode === 'edit' && '✏️ Chỉnh sửa trang trại'}
                {modalMode === 'view' && '👁️ Chi tiết trang trại'}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {modalMode === 'view' ? (
              <div className="modal-body">
                <div className="view-field">
                  <label>Mã trang trại:</label>
                  <p>{selectedFarm?.maTrangTrai}</p>
                </div>
                <div className="view-field">
                  <label>Tên trang trại:</label>
                  <p>{selectedFarm?.tenTrangTrai}</p>
                </div>
                <div className="view-field">
                  <label>Địa chỉ:</label>
                  <p>{selectedFarm?.diaChi || 'N/A'}</p>
                </div>
                <div className="view-field">
                  <label>Số chứng nhận:</label>
                  <p>{selectedFarm?.soChungNhan || 'N/A'}</p>
                </div>
                <div className="view-field">
                  <label>Tên nông dân:</label>
                  <p>{selectedFarm?.tenNongDan || 'N/A'}</p>
                </div>
                <div className="view-field">
                  <label>Ngày tạo:</label>
                  <p>{selectedFarm?.ngayTao ? new Date(selectedFarm.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nông dân <span className="required">*</span></label>
                    <select
                      name="maNongDan"
                      value={formData.maNongDan}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === 'edit'}
                    >
                      <option value="">-- Chọn nông dân --</option>
                      {nongDanList.map(nd => (
                        <option key={nd.maNongDan} value={nd.maNongDan}>
                          {nd.hoTen} (Mã: {nd.maNongDan})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tên trang trại <span className="required">*</span></label>
                    <input
                      type="text"
                      name="tenTrangTrai"
                      value={formData.tenTrangTrai}
                      onChange={handleInputChange}
                      required
                      maxLength={100}
                      placeholder="Nhập tên trang trại"
                    />
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ</label>
                    <textarea
                      name="diaChi"
                      value={formData.diaChi}
                      onChange={handleInputChange}
                      maxLength={255}
                      rows={3}
                      placeholder="Nhập địa chỉ trang trại"
                    />
                  </div>

                  <div className="form-group">
                    <label>Số chứng nhận</label>
                    <input
                      type="text"
                      name="soChungNhan"
                      value={formData.soChungNhan}
                      onChange={handleInputChange}
                      maxLength={50}
                      placeholder="Nhập số chứng nhận"
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

export default FarmManagement;
