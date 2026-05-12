import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import '../../components/Common.css';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    tenSanPham: '',
    donViTinh: '',
    moTa: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.sanPham.getAll);
      setProducts(res.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        tenSanPham: product.tenSanPham,
        donViTinh: product.donViTinh,
        moTa: product.moTa || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        tenSanPham: '',
        donViTinh: '',
        moTa: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update
        const payload = {
          TenSanPham: formData.tenSanPham,
          DonViTinh: formData.donViTinh,
          MoTa: formData.moTa || null
        };
        await axios.put(
          API_ENDPOINTS.sanPham.update(editingProduct.maSanPham),
          payload
        );
        alert('✅ Cập nhật sản phẩm thành công!');
      } else {
        // Create
        const payload = {
          TenSanPham: formData.tenSanPham,
          DonViTinh: formData.donViTinh,
          MoTa: formData.moTa || null
        };
        await axios.post(API_ENDPOINTS.sanPham.create, payload);
        alert('✅ Tạo sản phẩm thành công!');
      }
      
      handleCloseModal();
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.tenSanPham}"?`)) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.sanPham.delete(product.maSanPham));
      
      await loadProducts();
      
      alert('✅ Xóa sản phẩm thành công!');
    } catch (error) {
      console.error('Error deleting product:', error);
      
      if (error.response?.status === 404 || error.response?.data?.message?.includes('Không tìm thấy')) {
        await loadProducts();
        alert('✅ Xóa sản phẩm thành công!');
      } else {
        alert('❌ ' + (error.response?.data?.message || 'Không thể xóa sản phẩm'));
      }
    }
  };

  // Hàm lấy ảnh sản phẩm dựa trên tên
  const getProductImage = (tenSanPham: string) => {
    const name = tenSanPham.toLowerCase();
    
    // Map tên sản phẩm với ảnh tương ứng
    if (name.includes('cà chua') || name.includes('ca chua')) {
      return 'https://images.unsplash.com/photo-1546470427-227e2e1e8c8e?w=400&h=400&fit=crop';
    } else if (name.includes('rau cải') || name.includes('cải')) {
      return 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=400&h=400&fit=crop';
    } else if (name.includes('xoài') || name.includes('xoai')) {
      return 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop';
    } else if (name.includes('ớt') || name.includes('ot')) {
      return 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=400&fit=crop';
    } else if (name.includes('hành') || name.includes('hanh')) {
      return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop';
    } else if (name.includes('rau muống') || name.includes('muong')) {
      return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop';
    } else if (name.includes('bắp cải') || name.includes('bap cai')) {
      return 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop';
    } else {
      // Ảnh mặc định cho rau củ
      return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop';
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách sản phẩm...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🥬 Quản lý sản phẩm</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            ➕ Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Chưa có sản phẩm nào</h3>
            <p>Hãy thêm sản phẩm đầu tiên của bạn</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              ➕ Thêm sản phẩm
            </button>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.maSanPham} className="product-card">
              <div className="product-image-container">
                <img 
                  src={getProductImage(product.tenSanPham)} 
                  alt={product.tenSanPham}
                  className="product-image"
                  onError={(e) => {
                    // Fallback nếu ảnh không load được
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop';
                  }}
                />
              </div>
              <h3>{product.tenSanPham}</h3>
              <div className="product-details">
                <p><strong>Đơn vị tính:</strong> {product.donViTinh}</p>
                <p><strong>Mô tả:</strong> {product.moTa || 'Chưa có mô tả'}</p>
                <p className="product-date">
                  📅 {new Date(product.ngayTao).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="product-actions">
                <button 
                  className="btn-action btn-edit"
                  onClick={() => handleOpenModal(product)}
                >
                  ✏️ Sửa
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(product)}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm mới'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <span className="label-icon">🏷️</span>
                    Tên sản phẩm <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) => setFormData({...formData, tenSanPham: e.target.value})}
                    required
                    placeholder="Ví dụ: Cà chua, Dưa chuột, Rau muống..."
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">⚖️</span>
                    Đơn vị tính <span className="required">*</span>
                  </label>
                  <select
                    value={formData.donViTinh}
                    onChange={(e) => setFormData({...formData, donViTinh: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn đơn vị tính --</option>
                    <option value="kg">kg (Kilogram)</option>
                    <option value="tấn">tấn</option>
                    <option value="bó">bó</option>
                    <option value="cái">cái</option>
                    <option value="quả">quả</option>
                    <option value="túi">túi</option>
                    <option value="thùng">thùng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">📝</span>
                    Mô tả
                  </label>
                  <textarea
                    value={formData.moTa}
                    onChange={(e) => setFormData({...formData, moTa: e.target.value})}
                    placeholder="Nhập mô tả về sản phẩm (nếu có)"
                    rows={4}
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  <span>✕</span> Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{editingProduct ? '💾' : '➕'}</span> {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        .product-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
          text-align: center;
          overflow: hidden;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }

        .product-image-container {
          width: 100%;
          height: 200px;
          margin-bottom: 15px;
          border-radius: 12px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-icon {
          font-size: 64px;
          margin-bottom: 15px;
        }

        .product-card h3 {
          margin: 0 0 15px 0;
          font-size: 20px;
          color: #333;
        }

        .product-details {
          text-align: left;
          margin-bottom: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .product-details p {
          margin: 8px 0;
          font-size: 14px;
          color: #666;
        }

        .product-date {
          color: #999;
          font-size: 13px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .product-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
}

export default ProductManagement;
