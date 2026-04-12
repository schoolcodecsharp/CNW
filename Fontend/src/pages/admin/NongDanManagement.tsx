import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function NongDanManagement() {
  const [nongDanList, setNongDanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedNongDan, setSelectedNongDan] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    // Thông tin tài khoản (chỉ dùng khi thêm mới)
    tenDangNhap: '',
    matKhau: ''
  });

  useEffect(() => {
    loadNongDan();
  }, []);

  const loadNongDan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.nongDan.getAll);
      setNongDanList(response.data.data || []);
    } catch (error) {
      console.error('Error loading nong dan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedNongDan(null);
    setFormData({
      hoTen: '',
      soDienThoai: '',
      email: '',
      diaChi: '',
      tenDangNhap: '',
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleEdit = (nongDan) => {
    setModalMode('edit');
    setSelectedNongDan(nongDan);
    setFormData({
      hoTen: nongDan.hoTen || '',
      soDienThoai: nongDan.soDienThoai || '',
      email: nongDan.email || '',
      diaChi: nongDan.diaChi || '',
      tenDangNhap: '', // Không cho sửa tài khoản
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleView = (nongDan) => {
    setModalMode('view');
    setSelectedNongDan(nongDan);
    setShowModal(true);
  };

  const handleDelete = async (nongDan) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nông dân "${nongDan.hoTen}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(API_ENDPOINTS.nongDan.delete(nongDan.maNongDan));
      
      // Reload danh sách ngay lập tức
      await loadNongDan();
      
      // Hiển thị thông báo thành công
      alert('✅ Xóa nông dân thành công!');
    } catch (error) {
      console.error('Error deleting nong dan:', error);
      
      // Nếu lỗi 404 hoặc không tìm thấy nhưng thực tế đã xóa, vẫn reload
      if (error.response?.status === 404 || error.response?.data?.message?.includes('Không tìm thấy')) {
        await loadNongDan();
        alert('✅ Xóa nông dân thành công!');
      } else {
        alert('❌ ' + (error.response?.data?.message || 'Không thể xóa nông dân'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        // Khi thêm mới, gửi cả thông tin tài khoản với PascalCase
        const payload = {
          TenDangNhap: formData.tenDangNhap,
          MatKhau: formData.matKhau,
          HoTen: formData.hoTen,
          SoDienThoai: formData.soDienThoai,
          Email: formData.email,
          DiaChi: formData.diaChi
        };
        await axios.post(API_ENDPOINTS.nongDan.create, payload);
        alert('✅ Thêm nông dân thành công!');
      } else if (modalMode === 'edit') {
        // Khi sửa, chỉ gửi thông tin nông dân (không sửa tài khoản) với PascalCase
        const payload = {
          HoTen: formData.hoTen,
          SoDienThoai: formData.soDienThoai,
          Email: formData.email || null,
          DiaChi: formData.diaChi || null
        };
        await axios.put(API_ENDPOINTS.nongDan.update(selectedNongDan.maNongDan), payload);
        alert('✅ Cập nhật nông dân thành công!');
      }

      setShowModal(false);
      loadNongDan();
    } catch (error) {
      console.error('Error saving nong dan:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu nông dân');
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
    return <div className="loading">Đang tải danh sách nông dân...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý nông dân</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            ➕ Thêm nông dân
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Họ tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {nongDanList.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              nongDanList.map((nongDan) => (
                <tr key={nongDan.maNongDan}>
                  <td>{nongDan.maNongDan}</td>
                  <td>{nongDan.hoTen}</td>
                  <td>{nongDan.soDienThoai || 'N/A'}</td>
                  <td>{nongDan.email || 'N/A'}</td>
                  <td>{nongDan.diaChi || 'N/A'}</td>
                  <td>
                    <span className="badge badge-success">Hoạt động</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleView(nongDan)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(nongDan)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(nongDan)}
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
          <div className="modal-content modal-user-detail" onClick={(e) => e.stopPropagation()}>
            {modalMode === 'view' && selectedNongDan ? (
              <>
                <div className="modal-header">
                  <div className="modal-title-section">
                    <div className="user-avatar-large">👨‍🌾</div>
                    <div>
                      <h2>{selectedNongDan.hoTen}</h2>
                      <span className="badge badge-nongdan badge-large">Nông dân</span>
                    </div>
                  </div>
                  <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                
                <div className="modal-body">
                  <div className="user-detail-card">
                    <h3 className="section-title">
                      <span className="section-icon">📋</span>
                      Thông tin nông dân
                    </h3>
                    <div className="detail-grid-modern">
                      <div className="detail-item-modern">
                        <div className="detail-icon">🆔</div>
                        <div className="detail-content">
                          <span className="detail-label">Mã nông dân</span>
                          <span className="detail-value">{selectedNongDan.maNongDan}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">👨‍🌾</div>
                        <div className="detail-content">
                          <span className="detail-label">Họ tên</span>
                          <span className="detail-value">{selectedNongDan.hoTen}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📞</div>
                        <div className="detail-content">
                          <span className="detail-label">Số điện thoại</span>
                          <span className="detail-value">{selectedNongDan.soDienThoai || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📧</div>
                        <div className="detail-content">
                          <span className="detail-label">Email</span>
                          <span className="detail-value">{selectedNongDan.email || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern full-width">
                        <div className="detail-icon">📍</div>
                        <div className="detail-content">
                          <span className="detail-label">Địa chỉ</span>
                          <span className="detail-value">{selectedNongDan.diaChi || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    <span>✕</span> Đóng
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEdit(selectedNongDan)}>
                    <span>✏️</span> Chỉnh sửa
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>{modalMode === 'add' ? '➕ Thêm nông dân mới' : '✏️ Chỉnh sửa nông dân'}</h2>
                  <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {modalMode === 'add' && (
                      <>
                        <div className="form-section-title">
                          <span className="section-icon">🔐</span>
                          Thông tin tài khoản
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="tenDangNhap">
                            <span className="label-icon">👤</span>
                            Tên đăng nhập <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="tenDangNhap"
                            name="tenDangNhap"
                            value={formData.tenDangNhap}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập tên đăng nhập"
                            className="form-control"
                            minLength={3}
                            maxLength={50}
                          />
                          <small className="form-text">Tên đăng nhập để truy cập hệ thống (3-50 ký tự)</small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="matKhau">
                            <span className="label-icon">🔒</span>
                            Mật khẩu <span className="required">*</span>
                          </label>
                          <input
                            type="password"
                            id="matKhau"
                            name="matKhau"
                            value={formData.matKhau}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập mật khẩu"
                            className="form-control"
                            minLength={6}
                          />
                          <small className="form-text">Mật khẩu tối thiểu 6 ký tự</small>
                        </div>

                        <div className="form-section-title">
                          <span className="section-icon">👨‍🌾</span>
                          Thông tin nông dân
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label htmlFor="hoTen">
                        <span className="label-icon">👨‍🌾</span>
                        Họ tên <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="hoTen"
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập họ tên"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="soDienThoai">
                        <span className="label-icon">📞</span>
                        Số điện thoại <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        id="soDienThoai"
                        name="soDienThoai"
                        value={formData.soDienThoai}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập số điện thoại"
                        pattern="[0-9]{10,11}"
                        className="form-control"
                      />
                      <small className="form-text">Nhập 10-11 chữ số</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        <span className="label-icon">📧</span>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Nhập email"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="diaChi">
                        <span className="label-icon">📍</span>
                        Địa chỉ
                      </label>
                      <textarea
                        id="diaChi"
                        name="diaChi"
                        value={formData.diaChi}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ"
                        rows={3}
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      <span>✕</span> Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <span>{modalMode === 'add' ? '➕' : '💾'}</span>
                      {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NongDanManagement;
