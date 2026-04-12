import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

// Siêu Thị Service
export const sieuthiService = {
  // Siêu thị
  getAllSieuThi: async () => {
    const response = await axios.get(API_ENDPOINTS.sieuThi.getAll);
    return response.data;
  },

  getSieuThiById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.sieuThi.getById(id));
    return response.data;
  },

  createSieuThi: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.sieuThi.create, data);
    return response.data;
  },

  updateSieuThi: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.sieuThi.update(id), data);
    return response.data;
  },

  deleteSieuThi: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.sieuThi.delete(id));
    return response.data;
  },

  // Đơn hàng siêu thị
  getAllDonHangSieuThi: async () => {
    const response = await axios.get(API_ENDPOINTS.donHangSieuThi.getAll);
    return response.data;
  },

  getDonHangSieuThiById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangSieuThi.getById(id));
    return response.data;
  },

  getDonHangSieuThiBySieuThi: async (sieuThiId: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangSieuThi.getBySieuThi(sieuThiId));
    return response.data;
  },

  getDonHangSieuThiByDaiLy: async (daiLyId: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangSieuThi.getByDaiLy(daiLyId));
    return response.data;
  },

  createDonHangSieuThi: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.donHangSieuThi.create, data);
    return response.data;
  },

  updateTrangThaiDonHang: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.donHangSieuThi.updateTrangThai(id), data);
    return response.data;
  },

  deleteDonHangSieuThi: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.donHangSieuThi.delete(id));
    return response.data;
  }
};

export default sieuthiService;
