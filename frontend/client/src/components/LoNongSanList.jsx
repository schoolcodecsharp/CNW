import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './Common.css';

function LoNongSanList() {
  const [lonongsan, setLoNongSan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLoNongSan();
  }, []);

  const loadLoNongSan = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLoNongSan();
      setLoNongSan(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading lo nong san:', err);
      setError('Không thể tải danh sách lô nông sản');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách lô nông sản...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Danh sách lô nông sản</h1>
        <button className="btn btn-primary">+ Thêm lô nông sản</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {lonongsan.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Chưa có lô nông sản nào</h3>
          <p>Danh sách lô nông sản sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên lô nông sản</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Mã trang trại</th>
                <th>Ngày thu</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {lonongsan.map((lo) => (
                <tr key={lo.maLoNongSan}>
                  <td>{lo.maLoNongSan}</td>
                  <td>{lo.tenLoNongSan}</td>
                  <td>{lo.soLuong}</td>
                  <td>{lo.donVi}</td>
                  <td>{lo.maTrangTrai}</td>
                  <td>{lo.ngayThu}</td>
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

export default LoNongSanList;
