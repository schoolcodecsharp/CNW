import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';

function SieuThiManagement() {
  const [sieuThiList, setSieuThiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view': xem, 'add': thêm, 'edit': sửa
  const [selectedSieuThi, setSelectedSieuThi] = useState(null);
  const [formData, setFormData] = useState({
    tenSieuThi: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    // Thông tin tài khoản (chỉ dùng khi thêm mới)
    tenDangNhap: '',
    matKhau: ''
  });

  useEffect(() => {
    loadSieuThi();
  }, []);

  const loadSieuThi = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      setSieuThiList(response.data.data || []);
    } catch (error) {
      console.error('Error loading sieu thi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedSieuThi(null);
    setFormData({
      tenSieuThi: '',
      soDienThoai: '',
      email: '',
      diaChi: '',
      tenDangNhap: '',
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleEdit = (sieuThi) => {
    setModalMode('edit');
    setSelectedSieuThi(sieuThi);
    setFormData({
      tenSieuThi: sieuThi.tenSieuThi || '',
      soDienThoai: sieuThi.soDienThoai || '',
      email: sieuThi.email || '',
      diaChi: sieuThi.diaChi || '',
      tenDangNhap: '', // Không cho phép sửa tài khoản
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleView = (sieuThi) => {
    setModalMode('view');
    setSelectedSieuThi(sieuThi);
    setShowModal(true);
  };

  const handleDelete = async (sieuThi) => {
    if (!window.confirm(`Bạn có chắc muốn xóa siêu thị "${sieuThi.tenSieuThi}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(API_ENDPOINTS.sieuThi.delete(sieuThi.maSieuThi));
      
      // Tải lại danh sách ngay lập tức
      await loadSieuThi();
      
      // Hiển thị thông báo thành công
      alert('✅ Xóa siêu thị thành công!');
    } catch (error) {
      console.error('Error deleting sieu thi:', error);
      
      // Nếu lỗi 404 hoặc không tìm thấy nhưng thực tế đã xóa, vẫn tải lại
      if (error.response?.status === 404 || error.response?.data?.message?.includes('Không tìm thấy')) {
        await loadSieuThi();
        alert('✅ Xóa siêu thị thành công!');
      } else {
        alert('❌ ' + (error.response?.data?.message || 'Không thể xóa siêu thị'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        // Khi thêm mới, gửi dữ liệu với PascalCase
        const payload = {
          TenDangNhap: formData.tenDangNhap,
          MatKhau: formData.matKhau,
          TenSieuThi: formData.tenSieuThi,
          SoDienThoai: formData.soDienThoai,
          Email: formData.email,
          DiaChi: formData.diaChi
        };
        await axios.post(API_ENDPOINTS.sieuThi.create, payload);
        alert('✅ Thêm siêu thị thành công!');
      } else if (modalMode === 'edit') {
        // Khi sửa, gửi dữ liệu với PascalCase (không sửa tài khoản)
        const payload = {
          TenSieuThi: formData.tenSieuThi,
          SoDienThoai: formData.soDienThoai,
          Email: formData.email || null,
          DiaChi: formData.diaChi || null
        };
        await axios.put(API_ENDPOINTS.sieuThi.update(selectedSieuThi.maSieuThi), payload);
        alert('✅ Cập nhật siêu thị thành công!');
      }

      setShowModal(false);
      loadSieuThi();
    } catch (error) {
      console.error('Error saving sieu thi:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu siêu thị');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sử dụng hook phân trang
  const {
    currentPage,
    pageSize,
    paginatedData: paginatedSieuThi,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = usePagination({ data: sieuThiList, initialPageSize: 10 });

  if (loading) {
    return <div className="loading">Đang tải danh sách siêu thị...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý siêu thị</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            ➕ Thêm siêu thị
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên siêu thị</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSieuThi.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              paginatedSieuThi.map((sieuThi) => (
                <tr key={sieuThi.maSieuThi}>
                  <td>{sieuThi.maSieuThi}</td>
                  <td>{sieuThi.tenSieuThi}</td>
                  <td>{sieuThi.soDienThoai || 'N/A'}</td>
                  <td>{sieuThi.email || 'N/A'}</td>
                  <td>{sieuThi.diaChi || 'N/A'}</td>
                  <td>
                    <span className="badge badge-success">Hoạt động</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleView(sieuThi)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(sieuThi)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(sieuThi)}
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

      {/* Phân trang */}
      <TablePagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-user-detail" onClick={(e) => e.stopPropagation()}>
            {modalMode === 'view' && selectedSieuThi ? (
              <>
                <div className="modal-header">
                  <div className="modal-title-section">
                    <div className="user-avatar-large">🏬</div>
                    <div>
                      <h2>{selectedSieuThi.tenSieuThi}</h2>
                      <span className="badge badge-sieu_thi badge-large">Siêu thị</span>
                    </div>
                  </div>
                  <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                
                <div className="modal-body">
                  <div className="user-detail-card">
                    <h3 className="section-title">
                      <span className="section-icon">📋</span>
                      Thông tin siêu thị
                    </h3>
                    <div className="detail-grid-modern">
                      <div className="detail-item-modern">
                        <div className="detail-icon">🆔</div>
                        <div className="detail-content">
                          <span className="detail-label">Mã siêu thị</span>
                          <span className="detail-value">{selectedSieuThi.maSieuThi}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">🏬</div>
                        <div className="detail-content">
                          <span className="detail-label">Tên siêu thị</span>
                          <span className="detail-value">{selectedSieuThi.tenSieuThi}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📞</div>
                        <div className="detail-content">
                          <span className="detail-label">Số điện thoại</span>
                          <span className="detail-value">{selectedSieuThi.soDienThoai || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📧</div>
                        <div className="detail-content">
                          <span className="detail-label">Email</span>
                          <span className="detail-value">{selectedSieuThi.email || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern full-width">
                        <div className="detail-icon">📍</div>
                        <div className="detail-content">
                          <span className="detail-label">Địa chỉ</span>
                          <span className="detail-value">{selectedSieuThi.diaChi || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    <span>✕</span> Đóng
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEdit(selectedSieuThi)}>
                    <span>✏️</span> Chỉnh sửa
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>{modalMode === 'add' ? '➕ Thêm siêu thị mới' : '✏️ Chỉnh sửa siêu thị'}</h2>
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
                          <span className="section-icon">🏬</span>
                          Thông tin siêu thị
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label htmlFor="tenSieuThi">
                        <span className="label-icon">🏬</span>
                        Tên siêu thị <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="tenSieuThi"
                        name="tenSieuThi"
                        value={formData.tenSieuThi}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập tên siêu thị"
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

export default SieuThiManagement;
