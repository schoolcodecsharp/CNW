import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import '../../components/Common.css';

function OrderManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('from-farmers');
  const [ordersFromFarmers, setOrdersFromFarmers] = useState([]);
  const [ordersToSupermarkets, setOrdersToSupermarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maDaiLy, setMaDaiLy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sieuThiList, setSieuThiList] = useState([]);
  const [khoList, setKhoList] = useState([]);
  const [formData, setFormData] = useState({
    maSieuThi: '',
    maKho: '',
    ghiChu: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get daily ID
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      const currentDaily = dailyRes.data.data?.find(
        dl => dl.maTaiKhoan === user?.maTaiKhoan
      );
      
      if (!currentDaily) {
        setLoading(false);
        return;
      }

      setMaDaiLy(currentDaily.maDaiLy);

      // Load orders from farmers
      const ordersFromRes = await axios.get(API_ENDPOINTS.donHangDaiLy.getByDaiLy(currentDaily.maDaiLy));
      setOrdersFromFarmers(ordersFromRes.data.data || []);

      // Load orders to supermarkets
      const ordersToRes = await axios.get(API_ENDPOINTS.donHangSieuThi.getByDaiLy(currentDaily.maDaiLy));
      setOrdersToSupermarkets(ordersToRes.data.data || []);

      // Load supermarket list
      const sieuThiRes = await axios.get(API_ENDPOINTS.sieuThi.getAll);
      setSieuThiList(sieuThiRes.data.data || []);

      // Load warehouse list
      const khoRes = await axios.get(API_ENDPOINTS.kho.getByDaiLy(currentDaily.maDaiLy));
      setKhoList(khoRes.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (maDonHang) => {
    if (!window.confirm('Xác nhận chấp nhận đơn hàng này?')) return;
    
    try {
      await axios.put(API_ENDPOINTS.donHangDaiLy.updateTrangThai(maDonHang), {
        TrangThai: 'da_nhan'
      });
      alert('✅ Đã chấp nhận đơn hàng');
      await loadData();
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleRejectOrder = async (maDonHang) => {
    if (!window.confirm('Xác nhận từ chối đơn hàng này?')) return;
    
    try {
      await axios.put(API_ENDPOINTS.donHangDaiLy.updateTrangThai(maDonHang), {
        TrangThai: 'da_huy'
      });
      alert('✅ Đã từ chối đơn hàng');
      await loadData();
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleOpenModal = () => {
    setFormData({
      maSieuThi: '',
      maKho: '',
      ghiChu: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        MaSieuThi: parseInt(formData.maSieuThi),
        MaDaiLy: maDaiLy,
        MaKho: parseInt(formData.maKho),
        GhiChu: formData.ghiChu || null
      };

      await axios.post(API_ENDPOINTS.donHangSieuThi.create, payload);
      alert('✅ Tạo đơn hàng thành công! Đang chờ siêu thị xác nhận.');
      
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'chua_nhan': <span className="badge badge-warning">⏳ Chờ xác nhận</span>,
      'da_nhan': <span className="badge badge-success">✅ Đã chấp nhận</span>,
      'dang_xu_ly': <span className="badge badge-info">🔄 Đang xử lý</span>,
      'hoan_thanh': <span className="badge badge-success">✅ Hoàn thành</span>,
      'da_huy': <span className="badge badge-danger">❌ Đã từ chối</span>
    };
    return badges[status] || <span className="badge">{status}</span>;
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Quản lý đơn hàng</h1>
        {activeTab === 'to-supermarkets' && (
          <div className="header-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleOpenModal}
              disabled={khoList.length === 0}
            >
              ➕ Tạo đơn hàng cho siêu thị
            </button>
          </div>
        )}
      </div>

      {khoList.length === 0 && activeTab === 'to-supermarkets' && (
        <div className="alert alert-warning">
          ⚠️ Bạn cần có kho hàng để tạo đơn hàng cho siêu thị
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'from-farmers' ? 'active' : ''}`}
          onClick={() => setActiveTab('from-farmers')}
        >
          📥 Đơn hàng từ nông dân
        </button>
        <button 
          className={`tab ${activeTab === 'to-supermarkets' ? 'active' : ''}`}
          onClick={() => setActiveTab('to-supermarkets')}
        >
          📤 Đơn hàng gửi siêu thị
        </button>
      </div>

      {activeTab === 'from-farmers' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Nông dân</th>
                <th>Ngày đặt</th>
                <th>Ngày giao</th>
                <th>Tổng SL</th>
                <th>Tổng giá trị</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {ordersFromFarmers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center">Chưa có đơn hàng nào</td>
                </tr>
              ) : (
                ordersFromFarmers.map((order) => (
                  <tr key={order.maDonHang}>
                    <td>{order.maDonHang}</td>
                    <td>{order.tenNongDan}</td>
                    <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td>{order.ngayGiao ? new Date(order.ngayGiao).toLocaleDateString('vi-VN') : '-'}</td>
                    <td>{order.tongSoLuong} kg</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongGiaTri)}</td>
                    <td>{getStatusBadge(order.trangThai)}</td>
                    <td>{order.ghiChu || '-'}</td>
                    <td>
                      {order.trangThai === 'chua_nhan' && (
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleAcceptOrder(order.maDonHang)}
                          >
                            ✅ Chấp nhận
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRejectOrder(order.maDonHang)}
                          >
                            ❌ Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'to-supermarkets' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Siêu thị</th>
                <th>Ngày đặt</th>
                <th>Ngày giao</th>
                <th>Tổng SL</th>
                <th>Tổng giá trị</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {ordersToSupermarkets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">Chưa có đơn hàng nào</td>
                </tr>
              ) : (
                ordersToSupermarkets.map((order) => (
                  <tr key={order.maDonHang}>
                    <td>{order.maDonHang}</td>
                    <td>{order.tenSieuThi}</td>
                    <td>{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td>{order.ngayGiao ? new Date(order.ngayGiao).toLocaleDateString('vi-VN') : '-'}</td>
                    <td>{order.tongSoLuong} kg</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongGiaTri)}</td>
                    <td>{getStatusBadge(order.trangThai)}</td>
                    <td>{order.ghiChu || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Tạo đơn hàng cho siêu thị</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <span className="label-icon">🏬</span>
                    Siêu thị <span className="required">*</span>
                  </label>
                  <select
                    value={formData.maSieuThi}
                    onChange={(e) => setFormData({...formData, maSieuThi: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn siêu thị --</option>
                    {sieuThiList.map(st => (
                      <option key={st.maSieuThi} value={st.maSieuThi}>
                        {st.tenSieuThi}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">🏪</span>
                    Kho hàng <span className="required">*</span>
                  </label>
                  <select
                    value={formData.maKho}
                    onChange={(e) => setFormData({...formData, maKho: e.target.value})}
                    required
                    className="form-control"
                  >
                    <option value="">-- Chọn kho hàng --</option>
                    {khoList.map(kho => (
                      <option key={kho.maKho} value={kho.maKho}>
                        {kho.tenKho}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">📝</span>
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                    placeholder="Nhập ghi chú (nếu có)"
                    rows={3}
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <span>✕</span> Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>➕</span> Tạo đơn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 16px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .tab:hover {
          color: #10b981;
        }

        .tab.active {
          color: #10b981;
          border-bottom-color: #10b981;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default OrderManagement;
