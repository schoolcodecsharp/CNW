import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function WarehouseManagement() {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [maSieuThi, setMaSieuThi] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    tenKho: '',
    diaChi: ''
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.maTaiKhoan) {
        console.error('User not logged in or missing maTaiKhoan');
        setLoading(false);
        return;
      }

      // Get sieuthi ID by MaTaiKhoan
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      
      if (!sieuThiRes.data.success || !sieuThiRes.data.data) {
        console.error('Failed to load sieuthi');
        setLoading(false);
        return;
      }

      const currentSieuThi = sieuThiRes.data.data.find(
        (st: any) => st.maTaiKhoan === user.maTaiKhoan
      );
      
      if (!currentSieuThi) {
        console.error('Current sieuthi not found for maTaiKhoan:', user.maTaiKhoan);
        setLoading(false);
        return;
      }

      console.log('Found sieuthi:', currentSieuThi);
      setMaSieuThi(currentSieuThi.maSieuThi);

      // Load warehouses for this sieuthi
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getBySieuThi(currentSieuThi.maSieuThi));
      
      if (warehousesRes.data.success) {
        setWarehouses(warehousesRes.data.data || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (warehouse: any = null) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setFormData({
        tenKho: warehouse.tenKho || '',
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!maSieuThi) {
      alert('Không tìm thấy thông tin siêu thị. Vui lòng đăng nhập lại.');
      return;
    }
    
    try {
      if (editingWarehouse) {
        // Update
        await axios.put(
          API_ENDPOINTS.kho.update(editingWarehouse.maKho),
          {
            TenKho: formData.tenKho,
            DiaChi: formData.diaChi || null,
            TrangThai: 'hoat_dong'
          }
        );
        alert('✅ Cập nhật kho thành công!');
      } else {
        // Create - Sử dụng PascalCase để khớp với backend DTO
        console.log('Creating warehouse with MaSieuThi:', maSieuThi);
        const response = await axios.post(
          API_ENDPOINTS.kho.create,
          {
            LoaiKho: 'sieuthi',
            MaDaiLy: null,
            MaSieuThi: maSieuThi,
            TenKho: formData.tenKho,
            DiaChi: formData.diaChi || null
          }
        );
        console.log('Create response:', response.data);
        alert('✅ Tạo kho thành công!');
      }
      
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Error saving warehouse:', error);
      console.error('Error response:', error.response?.data);
      alert('❌ Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa kho này?')) return;
    
    try {
      await axios.delete(API_ENDPOINTS.kho.delete(id));
      alert('✅ Xóa kho thành công!');
      await loadData();
    } catch (error: any) {
      console.error('Error deleting warehouse:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách kho...</div>;
  }

  if (!maSieuThi) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Không tìm thấy thông tin siêu thị. Vui lòng đăng nhập lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏭 Quản lý kho</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => handleOpenModal()}
          >
            ➕ Thêm kho
          </button>
        </div>
      </div>

      {warehouses.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có kho nào</p>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            ➕ Tạo kho đầu tiên
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã kho</th>
                <th>Tên kho</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse: any) => (
                <tr key={warehouse.maKho}>
                  <td>{warehouse.maKho}</td>
                  <td>{warehouse.tenKho}</td>
                  <td>{warehouse.diaChi || '-'}</td>
                  <td>
                    {warehouse.trangThai === 'hoat_dong' ? (
                      <span className="badge badge-success">✅ Hoạt động</span>
                    ) : (
                      <span className="badge badge-secondary">⏸️ Ngừng hoạt động</span>
                    )}
                  </td>
                  <td>{warehouse.ngayTao ? new Date(warehouse.ngayTao).toLocaleDateString('vi-VN') : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleOpenModal(warehouse)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(warehouse.maKho)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWarehouse ? '✏️ Cập nhật kho' : '➕ Thêm kho mới'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <span className="label-icon">🏭</span>
                    Tên kho <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tenKho}
                    onChange={(e) => setFormData({...formData, tenKho: e.target.value})}
                    required
                    placeholder="Nhập tên kho"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">📍</span>
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={formData.diaChi}
                    onChange={(e) => setFormData({...formData, diaChi: e.target.value})}
                    placeholder="Nhập địa chỉ"
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <span>✕</span> Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{editingWarehouse ? '💾' : '➕'}</span> {editingWarehouse ? 'Cập nhật' : 'Thêm kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f9fafb;
          border-radius: 12px;
          margin: 20px 0;
        }

        .empty-state p {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

export default WarehouseManagement;
