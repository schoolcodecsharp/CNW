import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function InventoryManagement() {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [allInventory, setAllInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maSieuThi, setMaSieuThi] = useState<number | null>(null);
  const [expandedWarehouses, setExpandedWarehouses] = useState<Set<number>>(new Set());

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

      // Tải danh sách kho của siêu thị
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getBySieuThi(currentSieuThi.maSieuThi));
      if (warehousesRes.data.success) {
        setWarehouses(warehousesRes.data.data || []);
      }

      // Tải tồn kho - Siêu thị không có API tonKho riêng, sẽ hiển thị từ đơn hàng đã nhận
      // Tạm thời để trống, có thể mở rộng sau
      setAllInventory([]);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWarehouseInventory = (maKho: number) => {
    return allInventory.filter(item => item.maKho === maKho);
  };

  const toggleWarehouse = (maKho: number) => {
    const newExpanded = new Set(expandedWarehouses);
    if (newExpanded.has(maKho)) {
      newExpanded.delete(maKho);
    } else {
      newExpanded.add(maKho);
    }
    setExpandedWarehouses(newExpanded);
  };



  if (loading) {
    return <div className="loading">Đang tải danh sách tồn kho...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Quản lý tồn kho</h1>
        <p style={{ color: '#64748b', marginTop: '10px' }}>
          Theo dõi hàng tồn kho trong các kho của siêu thị
        </p>
      </div>

      {warehouses.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3em', marginBottom: '15px' }}>📊</div>
          <p>Bạn chưa có kho nào</p>
          <div style={{ fontSize: '0.9em', marginTop: '8px', color: '#6b7280' }}>
            Hãy tạo kho trong mục "Quản lý kho" để bắt đầu
          </div>
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
                <th>Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse: any) => {
                const inventory = getWarehouseInventory(warehouse.maKho);
                const isExpanded = expandedWarehouses.has(warehouse.maKho);
                
                return (
                  <>
                    <tr key={warehouse.maKho}>
                      <td><strong>#{warehouse.maKho}</strong></td>
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
                        <button 
                          className="btn-view-inventory"
                          onClick={() => toggleWarehouse(warehouse.maKho)}
                        >
                          {isExpanded ? '▼ Ẩn' : '▶ Xem'} ({inventory.length} lô)
                        </button>
                      </td>
                    </tr>
                    {isExpanded && inventory.length > 0 && (
                      <tr className="inventory-row">
                        <td colSpan={6}>
                          <div className="inventory-details">
                            <h4>📦 Tồn kho chi tiết</h4>
                            <table className="inventory-table">
                              <thead>
                                <tr>
                                  <th>Mã lô</th>
                                  <th>Sản phẩm</th>
                                  <th>Số lượng</th>
                                  <th>Đơn vị</th>
                                  <th>Cập nhật cuối</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inventory.map((item: any) => (
                                  <tr key={item.maLo}>
                                    <td>#{item.maLo}</td>
                                    <td>{item.tenSanPham || 'N/A'}</td>
                                    <td><strong style={{ color: '#10b981' }}>{item.soLuong}</strong></td>
                                    <td>{item.donViTinh || 'kg'}</td>
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
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .btn-view-inventory {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .btn-view-inventory:hover {
          background: #7c3aed;
        }

        .inventory-row {
          background: #f9fafb;
        }

        .inventory-details {
          padding: 20px;
        }

        .inventory-details h4 {
          margin: 0 0 16px 0;
          color: #374151;
          font-size: 16px;
        }

        .inventory-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .inventory-table thead {
          background: #f3f4f6;
        }

        .inventory-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 13px;
        }

        .inventory-table td {
          padding: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
        }

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

export default InventoryManagement;
