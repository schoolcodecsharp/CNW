import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function FarmManagement() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.trangTrai.getAll);
      setFarms(response.data.data || []);
    } catch (error) {
      console.error('Error loading farms:', error);
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
        <h1>Quản lý trang trại</h1>
        <div className="header-actions">
          <button className="btn btn-primary">➕ Thêm trang trại</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên trang trại</th>
              <th>Diện tích</th>
              <th>Vị trí</th>
              <th>Chứng nhận</th>
              <th>Mã nông dân</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {farms.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              farms.map((farm) => (
                <tr key={farm.maTrangTrai}>
                  <td>{farm.maTrangTrai}</td>
                  <td>{farm.tenTrangTrai}</td>
                  <td>{farm.dienTich}</td>
                  <td>{farm.viTri}</td>
                  <td>{farm.chungNhan || 'N/A'}</td>
                  <td>{farm.maNongDan}</td>
                  <td>
                    <span className="badge badge-success">Hoạt động</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-view">👁️</button>
                      <button className="btn-action btn-edit">✏️</button>
                      <button className="btn-action btn-delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FarmManagement;
