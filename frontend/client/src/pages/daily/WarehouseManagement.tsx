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
  const [maDaiLy, setMaDaiLy] = useState<number | null>(null);
  const [expandedWarehouses, setExpandedWarehouses] = useState<Set<number>>(new Set());
  const [warehouseInventory, setWarehouseInventory] = useState<{[key: number]: any[]}>({});
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

      // Get daily ID by MaTaiKhoan
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      
      if (!dailyRes.data.success || !dailyRes.data.data) {
        console.error('Failed to load daily');
        setLoading(false);
        return;
      }

      const currentDaily = dailyRes.data.data.find(
        (dl: any) => dl.maTaiKhoan === user.maTaiKhoan
      );
      
      if (!currentDaily) {
        console.error('Current daily not found for maTaiKhoan:', user.maTaiKhoan);
        setLoading(false);
        return;
      }

      const maDaiLyValue = currentDaily.maDaiLy || currentDaily.MaDaiLy;
      setMaDaiLy(maDaiLyValue);

      // Load warehouses for this daily
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getByDaiLy(maDaiLyValue));
      
      if (warehousesRes.data.success) {
        setWarehouses(warehousesRes.data.data || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWarehouseInventory = async (maKho: number) => {
    try {
      const response = await axios.get(API_ENDPOINTS.tonKho.getByKho(maKho));
      if (response.data.success) {
        setWarehouseInventory(prev => ({
          ...prev,
          [maKho]: response.data.data || []
        }));
      }
    } catch (error) {
      console.error('Error loading warehouse inventory:', error);
    }
  };

  const toggleWarehouse = async (maKho: number) => {
    const newExpanded = new Set(expandedWarehouses);
    if (newExpanded.has(maKho)) {
      newExpanded.delete(maKho);
    } else {
      newExpanded.add(maKho);
      // Load inventory if not loaded yet
      if (!warehouseInventory[maKho]) {
        await loadWarehouseInventory(maKho);
      }
    }
    setExpandedWarehouses(newExpanded);
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
    
    if (!maDaiLy) {
      alert('Không tìm thấy thông tin đại lý. Vui lòng đăng nhập lại.');
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
        console.log('Creating warehouse with MaDaiLy:', maDaiLy);
        const response = await axios.post(
          API_ENDPOINTS.kho.create,
          {
            LoaiKho: 'daily',
            MaDaiLy: maDaiLy,
            MaSieuThi: null,
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

  if (!maDaiLy) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Không tìm thấy thông tin đại lý. Vui lòng đăng nhập lại.</p>
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
        <div className="warehouse-list">
          {warehouses.map((warehouse: any) => (
            <div key={warehouse.maKho} className="warehouse-card">
              <div className="warehouse-header" onClick={() => toggleWarehouse(warehouse.maKho)}>
                <div className="warehouse-info">
                  <div className="warehouse-title">
                    <span className="expand-icon">
                      {expandedWarehouses.has(warehouse.maKho) ? '▼' : '▶'}
                    </span>
                    <h3>🏭 {warehouse.tenKho}</h3>
                    <span className="warehouse-id">#{warehouse.maKho}</span>
                  </div>
                  <div className="warehouse-details">
                    <span className="detail-item">
                      📍 {warehouse.diaChi || 'Chưa có địa chỉ'}
                    </span>
                    <span className="detail-item">
                      {warehouse.trangThai === 'hoat_dong' ? (
                        <span className="badge badge-success">✅ Hoạt động</span>
                      ) : (
                        <span className="badge badge-secondary">⏸️ Ngừng hoạt động</span>
                      )}
                    </span>
                    <span className="detail-item">
                      📅 {warehouse.ngayTao ? new Date(warehouse.ngayTao).toLocaleDateString('vi-VN') : '-'}
                    </span>
                  </div>
                </div>
                <div className="warehouse-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn-action btn-edit"
                    onClick={() => handleOpenModal(warehouse)}
                    title="Chỉnh sửa kho"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(warehouse.maKho)}
                    title="Xóa kho"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {expandedWarehouses.has(warehouse.maKho) && (
                <div className="warehouse-inventory">
                  <h4>📦 Tồn kho</h4>
                  {!warehouseInventory[warehouse.maKho] ? (
                    <div className="loading-inventory">Đang tải...</div>
                  ) : warehouseInventory[warehouse.maKho].length === 0 ? (
                    <div className="empty-inventory">
                      <p>Kho này chưa có hàng</p>
                    </div>
                  ) : (
                    <div className="inventory-table-container">
                      <table className="inventory-table">
                        <thead>
                          <tr>
                            <th>Mã lô</th>
                            <th>Sản phẩm</th>
                            <th>Mã QR</th>
                            <th>Số lượng tồn</th>
                            <th>Cập nhật cuối</th>
                          </tr>
                        </thead>
                        <tbody>
                          {warehouseInventory[warehouse.maKho].map((item: any) => (
                            <tr key={item.maLo}>
                              <td>
                                <span className="batch-id">#{item.maLo}</span>
                              </td>
                              <td>
                                <strong>{item.tenSanPham || 'N/A'}</strong>
                              </td>
                              <td>
                                <code className="qr-code">{item.maQR || 'N/A'}</code>
                              </td>
                              <td>
                                <span className="quantity">{item.soLuong} kg</span>
                              </td>
                              <td>
                                {item.capNhatCuoi 
                                  ? new Date(item.capNhatCuoi).toLocaleString('vi-VN')
                                  : '-'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
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
