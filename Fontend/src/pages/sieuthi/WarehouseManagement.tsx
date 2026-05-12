import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';
import '../../components/Common.css';

function WarehouseManagement() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maSieuThi, setMaSieuThi] = useState<number | null>(null);

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

      // Lấy ID siêu thị bằng MaTaiKhoan
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

      // Tải danh sách kho của siêu thị này
      const warehousesRes = await axios.get(API_ENDPOINTS.kho.getBySieuThi(currentSieuThi.maSieuThi));
      
      if (warehousesRes.data.success) {
        const warehouses = warehousesRes.data.data || [];
        
        // Load tồn kho từ tất cả các kho
        const allInventory: any[] = [];
        for (const warehouse of warehouses) {
          try {
            const response = await axios.get(`https://localhost:7217/api/KhoHang/${warehouse.maKho}`);
            if (response.data && response.data.tonKhos) {
              const inventoryWithWarehouse = response.data.tonKhos.map((item: any) => ({
                ...item,
                maKho: warehouse.maKho,
                tenKho: warehouse.tenKho,
                diaChiKho: warehouse.diaChi
              }));
              allInventory.push(...inventoryWithWarehouse);
            }
          } catch (error) {
            console.error(`Error loading inventory for warehouse ${warehouse.maKho}:`, error);
          }
        }
        
        setInventory(allInventory);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng hook phân trang
  const {
    currentPage,
    pageSize,
    paginatedData: paginatedInventory,
    totalItems,
    handlePageChange
  } = usePagination({ data: inventory, initialPageSize: 10 });

  if (loading) {
    return <div className="loading">Đang tải danh sách tồn kho...</div>;
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
        <h1>📦 Quản lý tồn kho</h1>
        <div className="header-info">
          <span>Tổng số lô: <strong>{inventory.length}</strong></span>
          <span style={{marginLeft: '20px'}}>
            Tổng số lượng: <strong>{inventory.reduce((sum, item) => sum + item.soLuong, 0).toFixed(2)} kg</strong>
          </span>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có hàng trong kho</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã lô</th>
                <th>Sản phẩm</th>
                <th>Kho</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Ngày sản xuất</th>
                <th>Hạn sử dụng</th>
                <th>Cập nhật cuối</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInventory.map((item: any) => (
                <tr key={`${item.maKho}-${item.maLo}`}>
                  <td><strong>#{item.maLo}</strong></td>
                  <td>{item.tenSanPham || 'N/A'}</td>
                  <td>
                    <div style={{fontSize: '13px'}}>
                      <div><strong>{item.tenKho}</strong></div>
                      <div style={{color: '#6b7280', fontSize: '12px'}}>{item.diaChiKho}</div>
                    </div>
                  </td>
                  <td><strong style={{ color: '#8b5cf6', fontSize: '16px' }}>{item.soLuong}</strong></td>
                  <td>{item.donViTinh || 'kg'}</td>
                  <td>
                    {item.ngaySanXuat 
                      ? new Date(item.ngaySanXuat).toLocaleDateString('vi-VN')
                      : '-'
                    }
                  </td>
                  <td>
                    {item.hanSuDung 
                      ? new Date(item.hanSuDung).toLocaleDateString('vi-VN')
                      : '-'
                    }
                  </td>
                  <td>
                    {item.capNhatCuoi 
                      ? new Date(item.capNhatCuoi).toLocaleString('vi-VN')
                      : '-'
                    }
                  </td>
                  <td>
                    {item.trangThaiLo === 'tai_kho' ? (
                      <span className="badge badge-success">✅ Trong kho</span>
                    ) : (
                      <span className="badge badge-info">{item.trangThaiLo}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <TablePagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      )}

      <style>{`
        .header-info {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #6b7280;
        }

        .header-info strong {
          color: #8b5cf6;
          font-size: 16px;
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

export default WarehouseManagement;
