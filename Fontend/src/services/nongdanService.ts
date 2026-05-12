import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

export const nongdanService = {
  getAllNongDan: async () => {
    const response = await axios.get(API_ENDPOINTS.nongDan.getAll);
    return response.data;
  },

  getNongDanById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.nongDan.getById(id));
    return response.data;
  },

  createNongDan: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.nongDan.create, data);
    return response.data;
  },

  updateNongDan: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.nongDan.update(id), data);
    return response.data;
  },

  deleteNongDan: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.nongDan.delete(id));
    return response.data;
  },

  getAllTrangTrai: async () => {
    const response = await axios.get(API_ENDPOINTS.trangTrai.getAll);
    return response.data;
  },

  getTrangTraiById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.trangTrai.getById(id));
    return response.data;
  },

  getTrangTraiByNongDan: async (nongDanId: number) => {
    const response = await axios.get(API_ENDPOINTS.trangTrai.getByNongDan(nongDanId));
    return response.data;
  },

  createTrangTrai: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.trangTrai.create, data);
    return response.data;
  },

  updateTrangTrai: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.trangTrai.update(id), data);
    return response.data;
  },

  deleteTrangTrai: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.trangTrai.delete(id));
    return response.data;
  },

  getAllLoNongSan: async () => {
    const response = await axios.get(API_ENDPOINTS.loNongSan.getAll);
    return response.data;
  },

  getLoNongSanById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.loNongSan.getById(id));
    return response.data;
  },

  getLoNongSanByTrangTrai: async (trangTraiId: number) => {
    const response = await axios.get(API_ENDPOINTS.loNongSan.getByTrangTrai(trangTraiId));
    return response.data;
  },

  getLoNongSanByNongDan: async (nongDanId: number) => {
    const response = await axios.get(API_ENDPOINTS.loNongSan.getByNongDan(nongDanId));
    return response.data;
  },

  createLoNongSan: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.loNongSan.create, data);
    return response.data;
  },

  updateLoNongSan: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.loNongSan.update(id), data);
    return response.data;
  },

  deleteLoNongSan: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.loNongSan.delete(id));
    return response.data;
  },

  getAllSanPham: async () => {
    const response = await axios.get(API_ENDPOINTS.sanPham.getAll);
    return response.data;
  },

  getSanPhamById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.sanPham.getById(id));
    return response.data;
  },

  createSanPham: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.sanPham.create, data);
    return response.data;
  },

  updateSanPham: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.sanPham.update(id), data);
    return response.data;
  },

  deleteSanPham: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.sanPham.delete(id));
    return response.data;
  },

  // ========== ĐƠN HÀNG ==========
  
  // Lấy đơn hàng chưa xác nhận
  getDonHangChuaXacNhan: async (maNongDan: number) => {
    const response = await axios.get(`${API_ENDPOINTS.nongDan.base}/api/nong-dan-don-hang/chua-xac-nhan/${maNongDan}`);
    return response.data;
  },

  // Lấy đơn hàng hoàn đơn
  getDonHangHoanDon: async (maNongDan: number) => {
    const response = await axios.get(`${API_ENDPOINTS.nongDan.base}/api/nong-dan-don-hang/hoan-don/${maNongDan}`);
    return response.data;
  },

  // Xác nhận đơn hàng (Tick)
  xacNhanDonHang: async (maDonHang: number, maNongDan: number) => {
    const response = await axios.put(
      `${API_ENDPOINTS.nongDan.base}/api/nong-dan-don-hang/xac-nhan/${maDonHang}`,
      null,  // Gửi null thay vì {}
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  // Xử lý hoàn đơn (Tick - Gửi lại kiểm định)
  xuLyHoanDon: async (maDonHang: number, maNongDan: number) => {
    const response = await axios.put(
      `${API_ENDPOINTS.nongDan.base}/api/nong-dan-don-hang/xu-ly-hoan-don/${maDonHang}`,
      null,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  // Hủy đơn hàng
  huyDonHang: async (maDonHang: number, maNongDan: number) => {
    const response = await axios.put(
      `${API_ENDPOINTS.nongDan.base}/api/nong-dan-don-hang/huy-don/${maDonHang}`,
      null,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  // Lấy chi tiết đơn hàng
  getChiTietDonHang: async (maDonHang: number) => {
    const response = await axios.get(`${API_ENDPOINTS.nongDan.base}/api/nong-dan-don-hang/${maDonHang}/chi-tiet`);
    return response.data;
  }
};

export default nongdanService;
