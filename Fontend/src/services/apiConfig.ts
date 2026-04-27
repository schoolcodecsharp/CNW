const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://localhost:7217';

export const API_BASE_URLS = {
  auth: GATEWAY_URL,
  admin: GATEWAY_URL,
  nongdan: GATEWAY_URL,
  daily: GATEWAY_URL,
  sieuthi: GATEWAY_URL
};

export const API_ENDPOINTS = {
  // Auth Service
  login: `${API_BASE_URLS.auth}/api/Auth/login`,
  
  // Admin Service  
  admin: {
    health: `${API_BASE_URLS.admin}/api/Admin/health`,
    getAll: `${API_BASE_URLS.admin}/api/Admin`,
    getById: (id: number) => `${API_BASE_URLS.admin}/api/Admin/${id}`,
    create: `${API_BASE_URLS.admin}/api/Admin`,
    update: (id: number) => `${API_BASE_URLS.admin}/api/Admin/${id}`,
    delete: (id: number) => `${API_BASE_URLS.admin}/api/Admin/${id}`
  },
  
  // Nong Dan Service
  nongDan: {
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/api/nong-dan/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/api/nong-dan/get-by-id/${id}`,
    create: `${API_BASE_URLS.nongdan}/api/nong-dan/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/api/nong-dan/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/api/nong-dan/delete/${id}`
  },
  
  // Trang Trai
  trangTrai: {
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/api/trang-trai/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/api/trang-trai/get-by-id/${id}`,
    getByNongDan: (id: number) => `${API_BASE_URLS.nongdan}/api/trang-trai/get-by-nong-dan/${id}`,
    create: `${API_BASE_URLS.nongdan}/api/trang-trai/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/api/trang-trai/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/api/trang-trai/delete/${id}`
  },
  
  // Lo Nong San
  loNongSan: {
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/api/lo-nong-san/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/api/lo-nong-san/get-by-id/${id}`,
    getByTrangTrai: (id: number) => `${API_BASE_URLS.nongdan}/api/lo-nong-san/trang-trai/${id}`,
    getByNongDan: (id: number) => `${API_BASE_URLS.nongdan}/api/lo-nong-san/get-by-nong-dan/${id}`,
    create: `${API_BASE_URLS.nongdan}/api/lo-nong-san/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/api/lo-nong-san/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/api/lo-nong-san/delete/${id}`
  },
  
  // San Pham
  sanPham: {
    base: API_BASE_URLS.nongdan,
    getAll: `${API_BASE_URLS.nongdan}/api/san-pham/get-all`,
    getById: (id: number) => `${API_BASE_URLS.nongdan}/api/san-pham/get-by-id/${id}`,
    create: `${API_BASE_URLS.nongdan}/api/san-pham/create`,
    update: (id: number) => `${API_BASE_URLS.nongdan}/api/san-pham/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.nongdan}/api/san-pham/delete/${id}`
  },
  
  // Dai Ly Service
  daiLy: {
    base: API_BASE_URLS.daily,
    getAll: `${API_BASE_URLS.daily}/api/dai-ly/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/api/dai-ly/get-by-id/${id}`,
    create: `${API_BASE_URLS.daily}/api/dai-ly/create`,
    update: (id: number) => `${API_BASE_URLS.daily}/api/dai-ly/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/api/dai-ly/delete/${id}`
  },
  
  // Kho
  kho: {
    base: API_BASE_URLS.daily,
    getAll: `${API_BASE_URLS.daily}/api/kho/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/api/kho/get-by-id/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.daily}/api/kho/dai-ly/${id}`,
    getBySieuThi: (id: number) => `${API_BASE_URLS.daily}/api/kho/sieu-thi/${id}`,
    create: `${API_BASE_URLS.daily}/api/kho/create`,
    update: (id: number) => `${API_BASE_URLS.daily}/api/kho/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/api/kho/delete/${id}`
  },
  
  // Kiem Dinh
  kiemDinh: {
    getAll: `${API_BASE_URLS.daily}/api/kiem-dinh/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/api/kiem-dinh/${id}`,
    getByMaLo: (maLo: number) => `${API_BASE_URLS.daily}/api/kiem-dinh/lo/${maLo}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.daily}/api/kiem-dinh/dai-ly/${id}`,
    getLoChoKiemDinh: (maDaiLy: number) => `${API_BASE_URLS.daily}/api/kiem-dinh/lo-cho-kiem-dinh/${maDaiLy}`,
    create: `${API_BASE_URLS.daily}/api/kiem-dinh/create`,
    update: (id: number) => `${API_BASE_URLS.daily}/api/kiem-dinh/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/api/kiem-dinh/delete/${id}`
  },
  
  // Don Hang Dai Ly
  donHangDaiLy: {
    base: API_BASE_URLS.daily,
    getAll: `${API_BASE_URLS.daily}/api/don-hang-dai-ly/get-all`,
    getById: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/get-by-id/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/get-by-dai-ly/${id}`,
    getByNongDan: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/get-by-nong-dan/${id}`,
    create: `${API_BASE_URLS.daily}/api/don-hang-dai-ly/create`,
    updateTrangThai: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/update/${id}`,
    xacNhan: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/xac-nhan/${id}`,
    xuatDon: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/xuat-don/${id}`,
    huyDon: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/huy-don/${id}`,
    delete: (id: number) => `${API_BASE_URLS.daily}/api/don-hang-dai-ly/delete/${id}`
  },
  
  // Sieu Thi Service
  sieuThi: {
    base: API_BASE_URLS.sieuthi,
    getAll: `${API_BASE_URLS.sieuthi}/api/sieu-thi/get-all`,
    getById: (id: number) => `${API_BASE_URLS.sieuthi}/api/sieu-thi/get-by-id/${id}`,
    create: `${API_BASE_URLS.sieuthi}/api/sieu-thi/create`,
    update: (id: number) => `${API_BASE_URLS.sieuthi}/api/sieu-thi/update/${id}`,
    delete: (id: number) => `${API_BASE_URLS.sieuthi}/api/sieu-thi/delete/${id}`
  },
  
  // Don Hang Sieu Thi
  donHangSieuThi: {
    base: API_BASE_URLS.sieuthi,
    getAll: `${API_BASE_URLS.sieuthi}/api/DonHangSieuThi/get-all`,
    getById: (id: number) => `${API_BASE_URLS.sieuthi}/api/DonHangSieuThi/${id}`,
    getBySieuThi: (id: number) => `${API_BASE_URLS.sieuthi}/api/DonHangSieuThi/sieu-thi/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.sieuthi}/api/DonHangSieuThi/dai-ly/${id}`,
    create: `${API_BASE_URLS.sieuthi}/api/DonHangSieuThi/tao-don-hang`,
    updateTrangThai: (id: number) => `${API_BASE_URLS.sieuthi}/api/DonHangSieuThi/nhan-hang/${id}`,
    delete: (id: number) => `${API_BASE_URLS.sieuthi}/api/DonHangSieuThi/huy-don-hang/${id}`
  },

  // Ton Kho
  tonKho: {
    base: API_BASE_URLS.daily,
    getAll: `${API_BASE_URLS.daily}/api/ton-kho/get-all`,
    getByKho: (id: number) => `${API_BASE_URLS.daily}/api/ton-kho/kho/${id}`,
    getByDaiLy: (id: number) => `${API_BASE_URLS.daily}/api/ton-kho/dai-ly/${id}`,
    create: `${API_BASE_URLS.daily}/api/ton-kho/create`,
    update: `${API_BASE_URLS.daily}/api/ton-kho/update`,
    delete: `${API_BASE_URLS.daily}/api/ton-kho/delete`
  }
};
