import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DaiLyManagement() {
  const [dailyList, setDailyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedDaily, setSelectedDaily] = useState(null);
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    tenDaiLy: '',
    diaChi: '',
    soDienThoai: '',
    email: ''
  });

  useEffect(() => {
    loadDaiLy();
  }, []);

  const loadDaiLy = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5041/api/admin/daily');
      setDailyList(response.data.data || []);
    } catch (error) {
      console.error('Error loading dai ly:', error);
      alert('Lỗi khi tải danh sách đại lý');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedDaily(null);
    setFormData({
      tenDangNhap: '',
      matKhau: '',
      tenDaiLy: '',
      diaChi: '',
      soDienThoai: '',
      email: ''
    });
    setShowModal(true);
  };

  const handleEdit = (daily) => {
    setModalMode('edit');
    setSelectedDaily(daily);
    setFormData({
      tenDangNhap: daily.tenDangNhap || '',
      matKhau: '',
      tenDaiLy: daily.tenDaiLy || '',
      diaChi: daily.diaChi || '',
      soDienThoai: daily.soDienThoai || '',
      email: daily.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (daily) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đại lý "${daily.tenDaiLy}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5041/api/admin/daily/${daily.maDaiLy}`);
      alert('Xóa đại lý thành công');
      loadDaiLy();
    } catch (error) {
      console.error('Error deleting daily:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa đại lý');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:5041/api/admin/daily', formData);
        alert('Thêm đại lý thành công');
      } else if (modalMode === 'edit') {
        await axios.put(`http://localhost:5041/api/admin/daily/${selectedDaily.maDaiLy}`, {
          tenDaiLy: formData.tenDaiLy,
          diaChi: formData.diaChi,
          soDienThoai: formData.soDienThoai,
          email: formData.email
        });
        alert('Cập nhật đại lý thành công');
      }
      setShowModal(false);
      loadDaiLy();
    } catch (error) {
      console.error('Error saving daily:', error);
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
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Tên đăng nhập</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {dailyList.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              dailyList.map((daily) => (
                <tr key={daily.maDaiLy}>
                  <td>{daily.maDaiLy}</td>
                  <td>{daily.tenDaiLy}</td>
                  <td>{daily.diaChi || 'N/A'}</td>
                  <td>{daily.soDienThoai || 'N/A'}</td>
                  <td>{daily.email || 'N/A'}</td>
                  <td>{daily.tenDangNhap}</td>
                  <td>
                    <span className={`badge ${daily.trangThai === 'hoat_dong' ? 'badge-success' : 'badge-danger'}`}>
                      {daily.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'add' ? '➕ Thêm đại lý mới' : '✏️ Chỉnh sửa đại lý'}
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
                  <label>Tên đại lý <span className="required">*</span></label>
                  <input
                    type="text"
                    name="tenDaiLy"
                    value={formData.tenDaiLy}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    placeholder="Nhập tên đại lý"
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

export default DaiLyManagement;
