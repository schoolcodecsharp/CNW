import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './Common.css';

function NongDanList() {
  const [nongdanList, setNongdanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNongDan();
  }, []);

  const loadNongDan = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNongDan();
      setNongdanList(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading nong dan:', err);
      setError('Không thể tải danh sách nông dân');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách nông dân...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Danh sách nông dân</h1>
        <button className="btn btn-primary">+ Thêm nông dân</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {nongdanList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍🌾</div>
          <h3>Chưa có nông dân nào</h3>
          <p>Danh sách nông dân sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {nongdanList.map((nongdan) => (
                <tr key={nongdan.maNongDan}>
                  <td>{nongdan.maNongDan}</td>
                  <td>{nongdan.hoTen}</td>
                  <td>{nongdan.soDienThoai}</td>
                  <td>{nongdan.email}</td>
                  <td>{nongdan.diaChi}</td>
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

export default NongDanList;
