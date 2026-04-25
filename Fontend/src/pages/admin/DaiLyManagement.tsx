import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';

function DaiLyManagement() {
  const [dailyList, setDailyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view': xem, 'add': thêm, 'edit': sửa
  const [selectedDaily, setSelectedDaily] = useState(null);
  const [formData, setFormData] = useState({
    tenDaiLy: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    // Thông tin tài khoản (chỉ dùng khi thêm mới)
    tenDangNhap: '',
    matKhau: ''
  });

  useEffect(() => {
    loadDaiLy();
  }, []);

  const loadDaiLy = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.daiLy.getAll);
      setDailyList(response.data.data || []);
    } catch (error) {
      console.error('Error loading dai ly:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedDaily(null);
    setFormData({
      tenDaiLy: '',
      soDienThoai: '',
      email: '',
      diaChi: '',
      tenDangNhap: '',
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleEdit = (daily) => {
    setModalMode('edit');
    setSelectedDaily(daily);
    setFormData({
      tenDaiLy: daily.tenDaiLy || '',
      soDienThoai: daily.soDienThoai || '',
      email: daily.email || '',
      diaChi: daily.diaChi || '',
      tenDangNhap: '', // Không cho phép sửa tài khoản
      matKhau: ''
    });
    setShowModal(true);
  };

  const handleView = (daily) => {
    setModalMode('view');
    setSelectedDaily(daily);
    setShowModal(true);
  };

  const handleDelete = async (daily) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đại lý "${daily.tenDaiLy}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(API_ENDPOINTS.daiLy.delete(daily.maDaiLy));
      
      // Tải lại danh sách ngay lập tức
      await loadDaiLy();
      
      // Hiển thị thông báo thành công
      alert('✅ Xóa đại lý thành công!');
    } catch (error) {
      console.error('Error deleting dai ly:', error);
      
      // Nếu lỗi 404 hoặc không tìm thấy nhưng thực tế đã xóa, vẫn tải lại
      if (error.response?.status === 404 || error.response?.data?.message?.includes('Không tìm thấy')) {
        await loadDaiLy();
        alert('✅ Xóa đại lý thành công!');
      } else {
        alert('❌ ' + (error.response?.data?.message || 'Không thể xóa đại lý'));
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
          TenDaiLy: formData.tenDaiLy,
          SoDienThoai: formData.soDienThoai,
          Email: formData.email,
          DiaChi: formData.diaChi
        };
        await axios.post(API_ENDPOINTS.daiLy.create, payload);
        alert('✅ Thêm đại lý thành công!');
      } else if (modalMode === 'edit') {
        // Khi sửa, gửi dữ liệu với PascalCase (không sửa tài khoản)
        const payload = {
          TenDaiLy: formData.tenDaiLy,
          SoDienThoai: formData.soDienThoai,
          Email: formData.email || null,
          DiaChi: formData.diaChi || null
        };
        await axios.put(API_ENDPOINTS.daiLy.update(selectedDaily.maDaiLy), payload);
        alert('✅ Cập nhật đại lý thành công!');
      }

      setShowModal(false);
      loadDaiLy();
    } catch (error) {
      console.error('Error saving dai ly:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu đại lý');
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
    paginatedData: paginatedDaiLy,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = usePagination({ data: dailyList, initialPageSize: 10 });

  if (loading) {
    return <div className="loading">Đang tải danh sách đại lý...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý đại lý</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            ➕ Thêm đại lý
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên đại lý</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDaiLy.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              paginatedDaiLy.map((daily) => (
                <tr key={daily.maDaiLy}>
                  <td>{daily.maDaiLy}</td>
                  <td>{daily.tenDaiLy}</td>
                  <td>{daily.soDienThoai || 'N/A'}</td>
                  <td>{daily.email || 'N/A'}</td>
                  <td>{daily.diaChi || 'N/A'}</td>
                  <td>
                    <span className="badge badge-success">Hoạt động</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view" 
                        onClick={() => handleView(daily)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(daily)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(daily)}
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
            {modalMode === 'view' && selectedDaily ? (
              <>
                <div className="modal-header">
                  <div className="modal-title-section">
                    <div className="user-avatar-large">🏪</div>
                    <div>
                      <h2>{selectedDaily.tenDaiLy}</h2>
                      <span className="badge badge-dai_ly badge-large">Đại lý</span>
                    </div>
                  </div>
                  <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                
                <div className="modal-body">
                  <div className="user-detail-card">
                    <h3 className="section-title">
                      <span className="section-icon">📋</span>
                      Thông tin đại lý
                    </h3>
                    <div className="detail-grid-modern">
                      <div className="detail-item-modern">
                        <div className="detail-icon">🆔</div>
                        <div className="detail-content">
                          <span className="detail-label">Mã đại lý</span>
                          <span className="detail-value">{selectedDaily.maDaiLy}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">🏪</div>
                        <div className="detail-content">
                          <span className="detail-label">Tên đại lý</span>
                          <span className="detail-value">{selectedDaily.tenDaiLy}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📞</div>
                        <div className="detail-content">
                          <span className="detail-label">Số điện thoại</span>
                          <span className="detail-value">{selectedDaily.soDienThoai || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern">
                        <div className="detail-icon">📧</div>
                        <div className="detail-content">
                          <span className="detail-label">Email</span>
                          <span className="detail-value">{selectedDaily.email || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item-modern full-width">
                        <div className="detail-icon">📍</div>
                        <div className="detail-content">
                          <span className="detail-label">Địa chỉ</span>
                          <span className="detail-value">{selectedDaily.diaChi || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    <span>✕</span> Đóng
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEdit(selectedDaily)}>
                    <span>✏️</span> Chỉnh sửa
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>{modalMode === 'add' ? '➕ Thêm đại lý mới' : '✏️ Chỉnh sửa đại lý'}</h2>
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
                          <span className="section-icon">🏪</span>
                          Thông tin đại lý
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label htmlFor="tenDaiLy">
                        <span className="label-icon">🏪</span>
                        Tên đại lý <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="tenDaiLy"
                        name="tenDaiLy"
                        value={formData.tenDaiLy}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập tên đại lý"
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

export default DaiLyManagement;
