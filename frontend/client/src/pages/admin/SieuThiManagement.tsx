import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SieuThiManagement() {
  const [sieuThiList, setSieuThiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSieuThi, setSelectedSieuThi] = useState(null);
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    tenSieuThi: '',
    diaChi: '',
    soDienThoai: '',
    email: ''
  });

  useEffect(() => {
    loadSieuThi();
  }, []);

  const loadSieuThi = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5041/api/admin/sieuthi');
      setSieuThiList(response.data.data || []);
    } catch (error) {
      console.error('Error loading sieu thi:', error);
      alert('Lỗi khi tải danh sách siêu thị');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedSieuThi(null);
    setFormData({
      tenDangNhap: '',
      matKhau: '',
      tenSieuThi: '',
      diaChi: '',
      soDienThoai: '',
      email: ''
    });
    setShowModal(true);
  };

  const handleEdit = (sieuThi) => {
    setModalMode('edit');
    setSelectedSieuThi(sieuThi);
    setFormData({
      tenDangNhap: sieuThi.tenDangNhap || '',
      matKhau: '',
      tenSieuThi: sieuThi.tenSieuThi || '',
      diaChi: sieuThi.diaChi || '',
      soDienThoai: sieuThi.soDienThoai || '',
      email: sieuThi.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (sieuThi) => {
    if (!window.confirm(`Bạn có chắc muốn xóa siêu thị "${sieuThi.tenSieuThi}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5041/api/admin/sieuthi/${sieuThi.maSieuThi}`);
      alert('Xóa siêu thị thành công');
      loadSieuThi();
    } catch (error) {
      console.error('Error deleting sieu thi:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa siêu thị');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:5041/api/admin/sieuthi', formData);
        alert('Thêm siêu thị thành công');
      } else if (modalMode === 'edit') {
        await axios.put(`http://localhost:5041/api/admin/sieuthi/${selectedSieuThi.maSieuThi}`, {
          tenSieuThi: formData.tenSieuThi,
          diaChi: formData.diaChi,
          soDienThoai: formData.soDienThoai,
          email: formData.email
        });
        alert('Cập nhật siêu thị thành công');
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
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Tên đăng nhập</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sieuThiList.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              sieuThiList.map((sieuThi) => (
                <tr key={sieuThi.maSieuThi}>
                  <td>{sieuThi.maSieuThi}</td>
                  <td>{sieuThi.tenSieuThi}</td>
                  <td>{sieuThi.diaChi || 'N/A'}</td>
                  <td>{sieuThi.soDienThoai || 'N/A'}</td>
                  <td>{sieuThi.email || 'N/A'}</td>
                  <td>{sieuThi.tenDangNhap}</td>
                  <td>
                    <span className={`badge ${sieuThi.trangThai === 'hoat_dong' ? 'badge-success' : 'badge-danger'}`}>
                      {sieuThi.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'add' ? '➕ Thêm siêu thị mới' : '✏️ Chỉnh sửa siêu thị'}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {modalMode === 'add' && (
                  <>
                    <div className="form-group">
                      <label>Tên đăng nhập <span className="required">*</span></label>
                      <input
                        type="text"
                        name="tenDangNhap"
                        value={formData.tenDangNhap}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>

                    <div className="form-group">
                      <label>Mật khẩu <span className="required">*</span></label>
                      <input
                        type="password"
                        name="matKhau"
                        value={formData.matKhau}
                        onChange={handleInputChange}
                        required
                        maxLength={255}
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Tên siêu thị <span className="required">*</span></label>
                  <input
                    type="text"
                    name="tenSieuThi"
                    value={formData.tenSieuThi}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    placeholder="Nhập tên siêu thị"
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
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    maxLength={15}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    maxLength={100}
                    placeholder="Nhập email"
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
          </div>
        </div>
      )}
    </div>
  );
}

export default SieuThiManagement;
