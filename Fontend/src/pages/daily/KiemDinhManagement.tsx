import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';
import TablePagination from '../../components/TablePagination';
import usePagination from '../../hooks/usePagination';
import './DaiLyDashboard.css';

interface LoNongSan {
  maLo: number;
  soChungNhanLo: string;
  tenSanPham: string;
  soLuongHienTai: number;
  ngayThuHoach: string;
  trangThai: string;
  maDonHang: number;
  ngayDat: string;
}

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
  const { user } = useAuth();
  const [kiemDinhList, setKiemDinhList] = useState<KiemDinh[]>([]);
  const [loNongSanList, setLoNongSanList] = useState<LoNongSan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    maLo: 0,
    nguoiKiemDinh: '',
    ketQua: 'dat',
    bienBan: '',
    ghiChu: ''
  });

  const { currentPage, pageSize, paginatedData, handlePageChange } = 
    usePagination({ data: kiemDinhList, initialPageSize: 10 });

  useEffect(() => {
    loadData();
    loadLoNongSan();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.kiemDinh.getAll);
      
      // API trả về array trực tiếp
      const allKiemDinh = Array.isArray(response.data) ? response.data : [];
      const filtered = allKiemDinh.filter((k: KiemDinh) => k.maDaiLy === user?.userId);
      setKiemDinhList(filtered);
    } catch (error) {
      console.error('Lỗi khi tải danh sách kiểm định:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLoNongSan = async () => {
    try {
      // Load only lots waiting for inspection for this DaiLy
      const response = await axios.get(API_ENDPOINTS.kiemDinh.getLoChoKiemDinh(user?.userId));
      if (response.data.success) {
        setLoNongSanList(response.data.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách lô chờ kiểm định:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.maLo || !formData.nguoiKiemDinh) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const payload = {
        MaLo: formData.maLo,
        NguoiKiemDinh: formData.nguoiKiemDinh,
        MaDaiLy: user?.userId,
        MaSieuThi: null,
        KetQua: formData.ketQua,
        BienBan: formData.bienBan || null,
        GhiChu: formData.ghiChu || null
      };

      await axios.post(API_ENDPOINTS.kiemDinh.create, payload);
      
      if (formData.ketQua === 'dat') {
        alert('✅ Kiểm định đạt! Lô đã sẵn sàng để nhập kho.');
      } else {
        alert('❌ Kiểm định không đạt! Lô đã được trả về nông dân và đơn hàng đã bị hủy.');
      }
      
      setShowCreateModal(false);
      setFormData({
        maLo: 0,
        nguoiKiemDinh: '',
        ketQua: 'dat',
        bienBan: '',
        ghiChu: ''
      });
      loadData();
      loadLoNongSan(); // Reload to remove inspected lot from list
    } catch (error) {
      console.error('Lỗi khi tạo phiếu kiểm định:', error);
      alert('Lỗi khi tạo phiếu kiểm định');
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

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Quản Lý Kiểm Định</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          + Tạo phiếu kiểm định
        </button>
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
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  Chưa có phiếu kiểm định nào
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
                  <td>{item.ghiChu || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        current={currentPage}
        total={kiemDinhList.length}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo phiếu kiểm định</h3>
              <button onClick={() => setShowCreateModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Chọn lô nông sản <span className="required">*</span></label>
                <select
                  value={formData.maLo}
                  onChange={(e) => setFormData({...formData, maLo: Number(e.target.value)})}
                  required
                >
                  <option value={0}>-- Chọn lô --</option>
                  {loNongSanList.map(lo => (
                    <option key={lo.maLo} value={lo.maLo}>
                      {lo.soChungNhanLo} - {lo.tenSanPham} ({lo.soLuongHienTai} kg) - Đơn #{lo.maDonHang}
                    </option>
                  ))}
                </select>
                {loNongSanList.length === 0 && (
                  <p style={{color: '#6b7280', fontSize: '14px', marginTop: '8px'}}>
                    Không có lô nào chờ kiểm định
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Người kiểm định <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.nguoiKiemDinh}
                  onChange={(e) => setFormData({...formData, nguoiKiemDinh: e.target.value})}
                  placeholder="Nhập tên người kiểm định"
                  required
                />
              </div>

              <div className="form-group">
                <label>Kết quả kiểm định <span className="required">*</span></label>
                <select
                  value={formData.ketQua}
                  onChange={(e) => setFormData({...formData, ketQua: e.target.value})}
                  required
                >
                  <option value="dat">Đạt</option>
                  <option value="khong_dat">Không đạt</option>
                </select>
              </div>

              <div className="form-group">
                <label>Biên bản</label>
                <textarea
                  value={formData.bienBan}
                  onChange={(e) => setFormData({...formData, bienBan: e.target.value})}
                  placeholder="Nhập nội dung biên bản kiểm định"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={formData.ghiChu}
                  onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={2}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Tạo phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KiemDinhManagement;
