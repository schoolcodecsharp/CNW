import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.loNongSan.getAll);
      setBatches(response.data.data || []);
    } catch (error) {
      console.error('Error loading batches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách lô hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý lô hàng</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã lô</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn vị</th>
              <th>Mã trang trại</th>
              <th>Ngày thu hoạch</th>
              <th>Hạn sử dụng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch.maLoNongSan}>
                  <td>{batch.maLoNongSan}</td>
                  <td>{batch.tenSanPham || 'N/A'}</td>
                  <td>{batch.soLuong}</td>
                  <td>{batch.donVi}</td>
                  <td>{batch.maTrangTrai}</td>
                  <td>{batch.ngayThuHoach ? new Date(batch.ngayThuHoach).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>{batch.hanSuDung ? new Date(batch.hanSuDung).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>
                    <span className="badge badge-success">Còn hạn</span>
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

export default BatchManagement;
