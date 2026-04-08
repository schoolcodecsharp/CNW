import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function InventoryManagement() {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [maSieuThi, setMaSieuThi] = useState(null);
  const [formData, setFormData] = useState({
    tenKho: '',
    diaChi: '',
    sucChua: '',
    ghiChu: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      const currentSieuThi = sieuThiRes.data.data?.find(
        (st: any) => st.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentSieuThi) {
        setLoading(false);
        return;
      }

      setMaSieuThi(currentSieuThi.maSieuThi);

      // Load warehouses - cần API endpoint
      // const warehousesRes = await axios.get(API_ENDPOINTS.khoSieuThi.getBySieuThi(currentSieuThi.maSieuThi));
      // setWarehouses(warehousesRes.data.data || []);

      // Load inventory - cần API endpoint
      // const inventoryRes = await axios.get(API_ENDPOINTS.tonKhoSieuThi.getBySieuThi(currentSieuThi.maSieuThi));
      // setInventory(inventoryRes.data.data || []);

      // Temporary mock data
      setWarehouses([]);
      setInventory([]);

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
        diaChi: warehouse.diaChi || '',
        sucChua: warehouse.sucChua || '',
        ghiChu: warehouse.ghiChu || ''
      });
    } else {
      setEditingWarehouse(null);
      setFormData({
        tenKho: '',
        diaChi: '',
        sucChua: '',
        ghiChu: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const payload = {
        MaSieuThi: maSieuThi,
        TenKho: formData.tenKho,
        DiaChi: formData.diaChi,
        SucChua: parseFloat(formData.sucChua),
        GhiChu: formData.ghiChu || null
      };

      // Cần API endpoint
      // if (editingWarehouse) {
      //   await axios.put(API_ENDPOINTS.khoSieuThi.update(editingWarehouse.maKho), payload);
      //   alert('✅ Cập nhật kho thành công!');
      // } else {
      //   await axios.post(API_ENDPOINTS.khoSieuThi.create, payload);
      //   alert('✅ Tạo kho thành công!');
      // }
      
      alert('✅ Chức năng đang phát triển!');
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Error saving warehouse:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa kho này?')) return;
    
    try {
      // await axios.delete(API_ENDPOINTS.khoSieuThi.delete(id));
      alert('✅ Chức năng đang phát triển!');
      await loadData();
    } catch (error: any) {
      console.error('Error deleting warehouse:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách tồn kho...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Quản lý tồn kho</h1>
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
        <>
          <div className="table-container">
            <h3>Danh sách kho</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã kho</th>
                  <th>Tên kho</th>
                  <th>Địa chỉ</th>
                  <th>Sức chứa</th>
                  <th>Đã sử dụng</th>
                  <th>Còn trống</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse: any) => (
                  <tr key={warehouse.maKho}>
                    <td>{warehouse.maKho}</td>
                    <td>{warehouse.tenKho}</td>
                    <td>{warehouse.diaChi}</td>
                    <td>{warehouse.sucChua} tấn</td>
                    <td>{warehouse.daSuDung || 0} tấn</td>
                    <td>{warehouse.sucChua - (warehouse.daSuDung || 0)} tấn</td>
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

          <div className="table-container" style={{marginTop: '30px'}}>
            <h3>Tồn kho chi tiết</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kho</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn vị</th>
                  <th>Ngày nhập</th>
                  <th>Hạn sử dụng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">Chưa có hàng tồn kho</td>
                  </tr>
                ) : (
                  inventory.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item.tenKho}</td>
                      <td>{item.tenSanPham}</td>
                      <td>{item.soLuong}</td>
                      <td>{item.donViTinh}</td>
                      <td>{new Date(item.ngayNhap).toLocaleDateString('vi-VN')}</td>
                      <td>{item.hanSuDung ? new Date(item.hanSuDung).toLocaleDateString('vi-VN') : '-'}</td>
                      <td>
                        {item.trangThai === 'con_han' ? (
                          <span className="badge badge-success">✅ Còn hạn</span>
                        ) : (
                          <span className="badge badge-danger">⚠️ Gần hết hạn</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
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
                    Địa chỉ <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.diaChi}
                    onChange={(e) => setFormData({...formData, diaChi: e.target.value})}
                    required
                    placeholder="Nhập địa chỉ"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">📦</span>
                    Sức chứa (tấn) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sucChua}
                    onChange={(e) => setFormData({...formData, sucChua: e.target.value})}
                    required
                    placeholder="Nhập sức chứa"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">📝</span>
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                    placeholder="Nhập ghi chú (nếu có)"
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

        h3 {
          margin-bottom: 15px;
          color: #374151;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
}

export default InventoryManagement;
