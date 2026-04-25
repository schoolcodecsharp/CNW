import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';
import './AdminDashboard.css';

interface KiemDinh {
  maKiemDinh: number;
  maLo: number;
  nguoiKiemDinh: string;
  maDaiLy?: number;
  maSieuThi?: number;
  ngayKiemDinh: string;
  ketQua: string;
  trangThai: string;
  bienBan?: string;
  ghiChu?: string;
  soChungNhanLo: string;
  tenSanPham: string;
}

const KiemDinhManagement = () => {
  const [kiemDinhList, setKiemDinhList] = useState<KiemDinh[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKetQua, setFilterKetQua] = useState('');
  const [selectedKiemDinh, setSelectedKiemDinh] = useState<KiemDinh | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredData = kiemDinhList.filter(item => {
    const matchSearch = 
      item.soChungNhanLo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nguoiKiemDinh.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchKetQua = !filterKetQua || item.ketQua === filterKetQua;
    
    return matchSearch && matchKetQua;
  });

  const { currentPage, pageSize, paginatedData, handlePageChange } = 
    usePagination({ data: filteredData, initialPageSize: 10 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.kiemDinh.getAll);
      console.log('Kiểm định response:', response.data);
      
      // API trả về array trực tiếp, không có wrapper success
      const data = Array.isArray(response.data) ? response.data : [];
      setKiemDinhList(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách kiểm định:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (kiemDinh: KiemDinh) => {
    setSelectedKiemDinh(kiemDinh);
    setShowDetailModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa phiếu kiểm định này?')) return;
    
    try {
      await axios.delete(API_ENDPOINTS.kiemDinh.delete(id));
      alert('Xóa phiếu kiểm định thành công');
      loadData();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Lỗi khi xóa phiếu kiểm định');
    }
  };

  const getKetQuaBadge = (ketQua: string) => {
    const badges: Record<string, string> = {
      'dat': 'badge-success',
      'khong_dat': 'badge-danger',
      'A': 'badge-success',
      'B': 'badge-warning',
      'C': 'badge-info'
    };
    return badges[ketQua] || 'badge-secondary';
  };

  const getKetQuaText = (ketQua: string) => {
    const texts: Record<string, string> = {
      'dat': 'Đạt',
      'khong_dat': 'Không đạt',
      'A': 'Loại A',
      'B': 'Loại B',
      'C': 'Loại C'
    };
    return texts[ketQua] || ketQua;
  };

  const stats = {
    total: kiemDinhList.length,
    dat: kiemDinhList.filter(k => k.ketQua === 'dat' || k.ketQua === 'A').length,
    khongDat: kiemDinhList.filter(k => k.ketQua === 'khong_dat').length,
    tyLeDat: kiemDinhList.length > 0 
      ? ((kiemDinhList.filter(k => k.ketQua === 'dat' || k.ketQua === 'A').length / kiemDinhList.length) * 100).toFixed(1)
      : '0'
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Quản Lý Kiểm Định</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Tổng phiếu</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.dat}</div>
            <div className="stat-label">Đạt chuẩn</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">{stats.khongDat}</div>
            <div className="stat-label">Không đạt</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.tyLeDat}%</div>
            <div className="stat-label">Tỷ lệ đạt</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Tìm theo mã lô, sản phẩm, người kiểm định..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterKetQua} 
          onChange={(e) => setFilterKetQua(e.target.value)}
          className="filter-select"
        >
          <option value="">Tất cả kết quả</option>
          <option value="dat">Đạt</option>
          <option value="khong_dat">Không đạt</option>
          <option value="A">Loại A</option>
          <option value="B">Loại B</option>
          <option value="C">Loại C</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã KĐ</th>
              <th>Mã lô</th>
              <th>Sản phẩm</th>
              <th>Người kiểm định</th>
              <th>Ngày kiểm định</th>
              <th>Kết quả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.maKiemDinh}>
                  <td>{item.maKiemDinh}</td>
                  <td>{item.soChungNhanLo}</td>
                  <td>{item.tenSanPham}</td>
                  <td>{item.nguoiKiemDinh}</td>
                  <td>{new Date(item.ngayKiemDinh).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${getKetQuaBadge(item.ketQua)}`}>
                      {getKetQuaText(item.ketQua)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.trangThai === 'hoan_thanh' ? 'badge-success' : 'badge-warning'}`}>
                      {item.trangThai === 'hoan_thanh' ? 'Hoàn thành' : 'Đang xử lý'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewDetail(item)}
                        className="btn-view"
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => handleDelete(item.maKiemDinh)}
                        className="btn-delete"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        current={currentPage}
        total={filteredData.length}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      {showDetailModal && selectedKiemDinh && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết phiếu kiểm định #{selectedKiemDinh.maKiemDinh}</h3>
              <button onClick={() => setShowDetailModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Mã lô:</label>
                  <span>{selectedKiemDinh.soChungNhanLo}</span>
                </div>
                <div className="detail-item">
                  <label>Sản phẩm:</label>
                  <span>{selectedKiemDinh.tenSanPham}</span>
                </div>
                <div className="detail-item">
                  <label>Người kiểm định:</label>
                  <span>{selectedKiemDinh.nguoiKiemDinh}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày kiểm định:</label>
                  <span>{new Date(selectedKiemDinh.ngayKiemDinh).toLocaleString('vi-VN')}</span>
                </div>
                <div className="detail-item">
                  <label>Kết quả:</label>
                  <span className={`badge ${getKetQuaBadge(selectedKiemDinh.ketQua)}`}>
                    {getKetQuaText(selectedKiemDinh.ketQua)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái:</label>
                  <span>{selectedKiemDinh.trangThai === 'hoan_thanh' ? 'Hoàn thành' : 'Đang xử lý'}</span>
                </div>
                {selectedKiemDinh.maDaiLy && (
                  <div className="detail-item">
                    <label>Mã đại lý:</label>
                    <span>{selectedKiemDinh.maDaiLy}</span>
                  </div>
                )}
                {selectedKiemDinh.maSieuThi && (
                  <div className="detail-item">
                    <label>Mã siêu thị:</label>
                    <span>{selectedKiemDinh.maSieuThi}</span>
                  </div>
                )}
                {selectedKiemDinh.bienBan && (
                  <div className="detail-item full-width">
                    <label>Biên bản:</label>
                    <p className="detail-text">{selectedKiemDinh.bienBan}</p>
                  </div>
                )}
                {selectedKiemDinh.ghiChu && (
                  <div className="detail-item full-width">
                    <label>Ghi chú:</label>
                    <p className="detail-text">{selectedKiemDinh.ghiChu}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KiemDinhManagement;
