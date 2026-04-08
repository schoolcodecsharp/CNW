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
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/nong-dan/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/nong-dan/get-by-id/${id}`,
    create: `${API_BASE_URLS.nongdan}/nong-dan/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/nong-dan/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/nong-dan/delete/${id}`
  },
  
  // Trang Trai
  trangTrai: {
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/trang-trai/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/trang-trai/get-by-id/${id}`,
    getByNongDan: (id: number) => `${API_BASE_URLS.nongdan}/trang-trai/get-by-nong-dan/${id}`,
    create: `${API_BASE_URLS.nongdan}/trang-trai/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/trang-trai/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/trang-trai/delete/${id}`
  },
  
  // Lo Nong San
  loNongSan: {
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/lo-nong-san/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/lo-nong-san/get-by-id/${id}`,
    getByTrangTrai: (id: number) => `${API_BASE_URLS.nongdan}/lo-nong-san/trang-trai/${id}`,
    getByNongDan: (id: number) => `${API_BASE_URLS.nongdan}/lo-nong-san/get-by-nong-dan/${id}`,
    create: `${API_BASE_URLS.nongdan}/lo-nong-san/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/lo-nong-san/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/lo-nong-san/delete/${id}`
  },
  
  // San Pham
  sanPham: {
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/san-pham/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/san-pham/get-by-id/${id}`,
    create: `${API_BASE_URLS.nongdan}/san-pham/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/san-pham/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/san-pham/delete/${id}`
  },
  
  // Dai Ly Service
  daiLy: {
    base: API_BASE_URLS.daily,
    getAll: `${API_BASE_URLS.daily}/dai-ly/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/dai-ly/get-by-id/${id}`,
    create: `${API_BASE_URLS.daily}/dai-ly/create`,
    update: (id: number) => `${API_BASE_URLS.daily}/dai-ly/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/dai-ly/delete/${id}`
  },
  
  // Kho
  kho: {
    base: API_BASE_URLS.daily,
    getAll: `${API_BASE_URLS.daily}/kho/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/kho/get-by-id/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.daily}/kho/dai-ly/${id}`,
    create: `${API_BASE_URLS.daily}/kho/create`,
    update: (id: number) => `${API_BASE_URLS.daily}/kho/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/kho/delete/${id}`
  },
  
  // Kiem Dinh
  kiemDinh: {
    getAll: `${API_BASE_URLS.daily}/kiem-dinh/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/kiem-dinh/get-by-id/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.daily}/kiem-dinh/dai-ly/${id}`,
    create: `${API_BASE_URLS.daily}/kiem-dinh/create`,
    update: (id: number) => `${API_BASE_URLS.daily}/kiem-dinh/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/kiem-dinh/delete/${id}`
  },
  
  // Don Hang Dai Ly
  donHangDaiLy: {
    base: API_BASE_URLS.daily,
    getAll: `${API_BASE_URLS.daily}/don-hang-dai-ly/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/get-by-id/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/get-by-dai-ly/${id}`,
    getByNongDan: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/get-by-nong-dan/${id}`,
    create: `${API_BASE_URLS.daily}/don-hang-dai-ly/create`,
    updateTrangThai: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/update/${id}`,
    xacNhan: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/xac-nhan/${id}`,
    xuatDon: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/xuat-don/${id}`,
    huyDon: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/huy-don/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/don-hang-dai-ly/delete/${id}`
  },
  
  // Sieu Thi Service
  sieuThi: {
    base: API_BASE_URLS.sieuthi,
    getAll: `${API_BASE_URLS.sieuthi}/sieu-thi/get-all`,
    getById: (id: number) => `${API_BASE_URLS.sieuthi}/sieu-thi/get-by-id/${id}`,
    create: `${API_BASE_URLS.sieuthi}/sieu-thi/create`,
    update: (id: number) => `${API_BASE_URLS.sieuthi}/sieu-thi/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.sieuthi}/sieu-thi/delete/${id}`
  },
  
  // Don Hang Sieu Thi
  donHangSieuThi: {
    base: API_BASE_URLS.sieuthi,
    getAll: `${API_BASE_URLS.sieuthi}/DonHangSieuThi/get-all`,
    getById: (id: number) => `${API_BASE_URLS.sieuthi}/DonHangSieuThi/${id}`,
    getBySieuThi: (id: number) => `${API_BASE_URLS.sieuthi}/DonHangSieuThi/sieu-thi/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.sieuthi}/DonHangSieuThi/dai-ly/${id}`,
    create: `${API_BASE_URLS.sieuthi}/DonHangSieuThi/tao-don-hang`,
    updateTrangThai: (id: number) => `${API_BASE_URLS.sieuthi}/DonHangSieuThi/nhan-hang/${id}`,
    delete: (id: number) => `${API_BASE_URLS.sieuthi}/DonHangSieuThi/huy-don-hang/${id}`
  }
};
