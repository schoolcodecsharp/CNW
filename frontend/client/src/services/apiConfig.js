// API Configuration - Sử dụng Gateway
const GATEWAY_URL = 'http://localhost:5041';

export const API_BASE_URLS = {
  auth: `${GATEWAY_URL}/api-auth`,
  admin: `${GATEWAY_URL}/api-admin`,
  nongdan: `${GATEWAY_URL}/api-nongdan`,
  daily: `${GATEWAY_URL}/api-daily`,
  sieuthi: `${GATEWAY_URL}/api-sieuthi`
};

export const API_ENDPOINTS = {
  // Auth Service
  login: `${API_BASE_URLS.auth}/Auth/login`,
  
  // Admin Service  
  admin: {
    health: `${API_BASE_URLS.admin}/Admin/health`
  },
  
  // Nong Dan Service
  nongDan: {
    getAll: `${API_BASE_URLS.nongdan}/nong-dan/get-all`,
    getById: (id) => `${API_BASE_URLS.nongdan}/nong-dan/get-by-id/${id}`,
    create: `${API_BASE_URLS.nongdan}/nong-dan/create`,
    update: (id) => `${API_BASE_URLS.nongdan}/nong-dan/update/${id}`,
    delete: (id) => `${API_BASE_URLS.nongdan}/nong-dan/delete/${id}`
  },
  
  // Trang Trai
  trangTrai: {
    getAll: `${API_BASE_URLS.nongdan}/trang-trai/get-all`,
    getById: (id) => `${API_BASE_URLS.nongdan}/trang-trai/get-by-id/${id}`,
    getByNongDan: (id) => `${API_BASE_URLS.nongdan}/trang-trai/nong-dan/${id}`,
    create: `${API_BASE_URLS.nongdan}/trang-trai/create`,
    update: (id) => `${API_BASE_URLS.nongdan}/trang-trai/update/${id}`,
    delete: (id) => `${API_BASE_URLS.nongdan}/trang-trai/delete/${id}`
  },
  
  // Lo Nong San
  loNongSan: {
    getAll: `${API_BASE_URLS.nongdan}/lo-nong-san/get-all`,
    getById: (id) => `${API_BASE_URLS.nongdan}/lo-nong-san/get-by-id/${id}`,
    getByTrangTrai: (id) => `${API_BASE_URLS.nongdan}/lo-nong-san/trang-trai/${id}`,
    create: `${API_BASE_URLS.nongdan}/lo-nong-san/create`,
    update: (id) => `${API_BASE_URLS.nongdan}/lo-nong-san/update/${id}`,
    delete: (id) => `${API_BASE_URLS.nongdan}/lo-nong-san/delete/${id}`
  },
  
  // San Pham
  sanPham: {
    getAll: `${API_BASE_URLS.nongdan}/san-pham/get-all`,
    getById: (id) => `${API_BASE_URLS.nongdan}/san-pham/get-by-id/${id}`,
    create: `${API_BASE_URLS.nongdan}/san-pham/create`,
    update: (id) => `${API_BASE_URLS.nongdan}/san-pham/update/${id}`,
    delete: (id) => `${API_BASE_URLS.nongdan}/san-pham/delete/${id}`
  },
  
  // Dai Ly Service
  daiLy: {
    getAll: `${API_BASE_URLS.daily}/dai-ly/get-all`,
    getById: (id) => `${API_BASE_URLS.daily}/dai-ly/get-by-id/${id}`,
    create: `${API_BASE_URLS.daily}/dai-ly/create`,
    update: (id) => `${API_BASE_URLS.daily}/dai-ly/update/${id}`,
    delete: (id) => `${API_BASE_URLS.daily}/dai-ly/delete/${id}`
  },
  
  // Kho
  kho: {
    getAll: `${API_BASE_URLS.daily}/kho/get-all`,
    getById: (id) => `${API_BASE_URLS.daily}/kho/get-by-id/${id}`,
    getByDaiLy: (id) => `${API_BASE_URLS.daily}/kho/dai-ly/${id}`,
    create: `${API_BASE_URLS.daily}/kho/create`,
    update: (id) => `${API_BASE_URLS.daily}/kho/update/${id}`,
    delete: (id) => `${API_BASE_URLS.daily}/kho/delete/${id}`
  },
  
  // Kiem Dinh
  kiemDinh: {
    getAll: `${API_BASE_URLS.daily}/kiem-dinh/get-all`,
    getById: (id) => `${API_BASE_URLS.daily}/kiem-dinh/get-by-id/${id}`,
    getByDaiLy: (id) => `${API_BASE_URLS.daily}/kiem-dinh/dai-ly/${id}`,
    create: `${API_BASE_URLS.daily}/kiem-dinh/create`,
    update: (id) => `${API_BASE_URLS.daily}/kiem-dinh/update/${id}`,
    delete: (id) => `${API_BASE_URLS.daily}/kiem-dinh/delete/${id}`
  },
  
  // Don Hang Dai Ly
  donHangDaiLy: {
    getAll: `${API_BASE_URLS.daily}/don-hang-dai-ly/get-all`,
    getById: (id) => `${API_BASE_URLS.daily}/don-hang-dai-ly/get-by-id/${id}`,
    getByDaiLy: (id) => `${API_BASE_URLS.daily}/don-hang-dai-ly/dai-ly/${id}`,
    create: `${API_BASE_URLS.daily}/don-hang-dai-ly/create`,
    updateTrangThai: (id) => `${API_BASE_URLS.daily}/don-hang-dai-ly/update-trang-thai/${id}`,
    delete: (id) => `${API_BASE_URLS.daily}/don-hang-dai-ly/delete/${id}`
  },
  
  // Sieu Thi Service
  sieuThi: {
    getAll: `${API_BASE_URLS.sieuthi}/sieu-thi/get-all`,
    getById: (id) => `${API_BASE_URLS.sieuthi}/sieu-thi/get-by-id/${id}`,
    create: `${API_BASE_URLS.sieuthi}/sieu-thi/create`,
    update: (id) => `${API_BASE_URLS.sieuthi}/sieu-thi/update/${id}`,
    delete: (id) => `${API_BASE_URLS.sieuthi}/sieu-thi/delete/${id}`
  }
};
