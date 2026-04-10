import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function InventoryManagement() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maDaiLy, setMaDaiLy] = useState<number | null>(null);

  useEffect(() => {
    loadDaiLyInfo();
  }, []);

  useEffect(() => {
    if (maDaiLy) {
      loadInventory();
    }
  }, [maDaiLy]);

  const loadDaiLyInfo = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.daiLy.getAll);
      if (response.data.success && response.data.data) {
        const currentDaily = response.data.data.find(
          (dl: any) => dl.maTaiKhoan === user?.maTaiKhoan
        );
        if (currentDaily) {
          setMaDaiLy(currentDaily.maDaiLy);
        }
      }
    } catch (error) {
      console.error('Error loading daily info:', error);
    }
  };

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.tonKho.getByDaiLy(maDaiLy!));
      
      if (response.data.success) {
        setInventory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu tồn kho...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Quản lý tồn kho</h1>
        <p style={{ color: '#64748b', marginTop: '10px' }}>
          Theo dõi số lượng hàng tồn kho trong các kho của bạn
        </p>
      </div>

      {inventory.length === 0 ? (
        <div className="empty-message">
          <div style={{ fontSize: '3em', marginBottom: '15px' }}>📊</div>
          <div>Chưa có hàng tồn kho</div>
          <div style={{ fontSize: '0.9em', marginTop: '8px' }}>
            Hàng tồn kho sẽ xuất hiện khi bạn nhập hàng vào kho
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã kho</th>
                <th>Tên kho</th>
                <th>Mã lô</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Cập nhật cuối</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item: any, index) => (
                <tr key={index}>
                  <td><strong>#{item.maKho}</strong></td>
                  <td>{item.tenKho}</td>
                  <td><strong>#{item.maLo}</strong></td>
                  <td>{item.tenSanPham}</td>
                  <td><strong style={{ color: '#10b981' }}>{item.soLuong}</strong></td>
                  <td>{item.donViTinh}</td>
                  <td>{new Date(item.capNhatCuoi).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;
