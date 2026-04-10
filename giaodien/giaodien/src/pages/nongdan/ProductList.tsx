import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_ENDPOINTS.nongDan.base}/san-pham/get-all`);
      setProducts(res.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách sản phẩm...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Danh sách sản phẩm</h1>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có sản phẩm nào trong hệ thống</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.maSanPham} className="product-card">
              <div className="product-icon">🥬</div>
              <h3>{product.tenSanPham}</h3>
              <div className="product-details">
                <p><strong>Đơn vị:</strong> {product.donViTinh}</p>
                <p><strong>Mô tả:</strong> {product.moTa || 'Chưa có mô tả'}</p>
                <p className="product-date">
                  Ngày tạo: {new Date(product.ngayTao).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
