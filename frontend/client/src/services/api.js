import axios from 'axios';

const API_BASE_URL = 'http://localhost:6000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API Services
export const apiService = {
  // Tính tổng từ 1 đến n
  tinhTong: async (n) => {
    const response = await api.get(`/TinhTong/${n}`);
    return response.data;
  },

  // Tính tổng hai số
  tinhTongHaiSo: async (a, b) => {
    const response = await api.post('/TinhTongHaiSo', { a, b });
    return response.data;
  },

  // Lấy danh sách nông dân
  getNongDan: async () => {
    const response = await api.get('/api/nongdan');
    return response.data;
  },

  // Lấy danh sách trang trại
  getTrangTrai: async () => {
    const response = await api.get('/api/trangtrai');
    return response.data;
  },

  // Lấy danh sách lô nông sản
  getLoNongSan: async () => {
    const response = await api.get('/api/lonongsan');
    return response.data;
  }
};

export default apiService;
