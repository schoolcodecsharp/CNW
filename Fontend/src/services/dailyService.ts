import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

export const dailyService = {
  getAllDaiLy: async () => {
    const response = await axios.get(API_ENDPOINTS.daiLy.getAll);
    return response.data;
  },

  getDaiLyById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.daiLy.getById(id));
    return response.data;
  },

  createDaiLy: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.daiLy.create, data);
    return response.data;
  },

  updateDaiLy: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.daiLy.update(id), data);
    return response.data;
  },

  deleteDaiLy: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.daiLy.delete(id));
    return response.data;
  },

  getAllKho: async () => {
    const response = await axios.get(API_ENDPOINTS.kho.getAll);
    return response.data;
  },

  getKhoById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.kho.getById(id));
    return response.data;
  },

  getKhoByDaiLy: async (daiLyId: number) => {
    const response = await axios.get(API_ENDPOINTS.kho.getByDaiLy(daiLyId));
    return response.data;
  },

  getKhoBySieuThi: async (sieuThiId: number) => {
    const response = await axios.get(API_ENDPOINTS.kho.getBySieuThi(sieuThiId));
    return response.data;
  },

  createKho: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.kho.create, data);
    return response.data;
  },

  updateKho: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.kho.update(id), data);
    return response.data;
  },

  deleteKho: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.kho.delete(id));
    return response.data;
  },

  getAllDonHangDaiLy: async () => {
    const response = await axios.get(API_ENDPOINTS.donHangDaiLy.getAll);
    return response.data;
  },

  getDonHangDaiLyById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangDaiLy.getById(id));
    return response.data;
  },

  getDonHangDaiLyByDaiLy: async (daiLyId: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangDaiLy.getByDaiLy(daiLyId));
    return response.data;
  },

  getDonHangDaiLyByNongDan: async (nongDanId: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangDaiLy.getByNongDan(nongDanId));
    return response.data;
  },

  createDonHangDaiLy: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.donHangDaiLy.create, data);
    return response.data;
  },

  updateTrangThaiDonHang: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.donHangDaiLy.updateTrangThai(id), data);
    return response.data;
  },

  xacNhanDonHang: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.donHangDaiLy.xacNhan(id), data);
    return response.data;
  },

  xuatDonHang: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.donHangDaiLy.xuatDon(id), data);
    return response.data;
  },

  huyDonHang: async (id: number) => {
    const response = await axios.put(API_ENDPOINTS.donHangDaiLy.huyDon(id));
    return response.data;
  },

  deleteDonHangDaiLy: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.donHangDaiLy.delete(id));
    return response.data;
  },

  getAllTonKho: async () => {
    const response = await axios.get(API_ENDPOINTS.tonKho.getAll);
    return response.data;
  },

  getTonKhoByKho: async (khoId: number) => {
    const response = await axios.get(API_ENDPOINTS.tonKho.getByKho(khoId));
    return response.data;
  },

  getTonKhoByDaiLy: async (daiLyId: number) => {
    const response = await axios.get(API_ENDPOINTS.tonKho.getByDaiLy(daiLyId));
    return response.data;
  },

  createTonKho: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.tonKho.create, data);
    return response.data;
  },

  updateTonKho: async (data: any) => {
    const response = await axios.put(API_ENDPOINTS.tonKho.update, data);
    return response.data;
  },

  deleteTonKho: async (data: any) => {
    const response = await axios.delete(API_ENDPOINTS.tonKho.delete, { data });
    return response.data;
  },

  // ========== KIỂM ĐỊNH ĐƠN HÀNG TỪ NÔNG DÂN ==========
  
  getDonHangChoKiemDinh: async (maDaiLy: number) => {
    const response = await axios.get(`${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/cho-kiem-dinh/${maDaiLy}`);
    return response.data;
  },

  kiemDinhDonHang: async (maDonHang: number, maDaiLy: number, maKho: number, ketQuaKiemDinh: boolean) => {
    const response = await axios.put(
      `${API_ENDPOINTS.daily.base}/api/don-hang-dai-ly/kiem-dinh/${maDonHang}`,
      { maDaiLy, maKho, ketQuaKiemDinh }
    );
    return response.data;
  },

  // ========== ĐƠN HÀNG TỪ SIÊU THỊ ==========
  
  getDonHangSieuThiChuaXacNhan: async (maDaiLy: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangSieuThi.chuaXacNhanDaiLy(maDaiLy));
    return response.data;
  },

  getDonHangSieuThiHoanDon: async (maDaiLy: number) => {
    const response = await axios.get(API_ENDPOINTS.donHangSieuThi.hoanDonDaiLy(maDaiLy));
    return response.data;
  },

  xacNhanDonHangSieuThi: async (maDonHang: number, maDaiLy: number) => {
    const response = await axios.put(
      API_ENDPOINTS.donHangSieuThi.xacNhanDaiLy(maDonHang),
      { maDaiLy }
    );
    return response.data;
  },

  xuLyHoanDonSieuThi: async (maDonHang: number, maDaiLy: number) => {
    const response = await axios.put(
      API_ENDPOINTS.donHangSieuThi.xuLyHoanDonDaiLy(maDonHang),
      { maDaiLy }
    );
    return response.data;
  },

  huyDonHangSieuThi: async (maDonHang: number, maDaiLy: number) => {
    const response = await axios.put(
      API_ENDPOINTS.donHangSieuThi.huyDonDaiLy(maDonHang),
      { maDaiLy }
    );
    return response.data;
  }
};

export default dailyService;
