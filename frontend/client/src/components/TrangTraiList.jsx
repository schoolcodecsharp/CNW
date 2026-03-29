import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './Common.css';

function TrangTraiList() {
  const [trangtraiList, setTrangtraiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrangTrai();
  }, []);

  const loadTrangTrai = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTrangTrai();
      setTrangtraiList(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading trang trai:', err);
      setError('Không thể tải danh sách trang trại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách trang trại...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Danh sách trang trại</h1>
        <button className="btn btn-primary">+ Thêm trang trại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {trangtraiList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌾</div>
          <h3>Chưa có trang trại nào</h3>
          <p>Danh sách trang trại sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên trang trại</th>
                <th>Diện tích</th>
                <th>Vị trí</th>
                <th>Mã nông dân</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {trangtraiList.map((trangtrai) => (
                <tr key={trangtrai.maTrangTrai}>
                  <td>{trangtrai.maTrangTrai}</td>
                  <td>{trangtrai.tenTrangTrai}</td>
                  <td>{trangtrai.dienTich}</td>
                  <td>{trangtrai.viTri}</td>
                  <td>{trangtrai.maNongDan}</td>
                  <td>
                    <span className={`badge ${trangtrai.trangThai === 'hoat_dong' ? 'badge-success' : 'badge-warning'}`}>
                      {trangtrai.trangThai}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-edit">✏️</button>
                    <button className="btn-action btn-delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TrangTraiList;
