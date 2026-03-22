# TÀI LIỆU API - HỆ THỐNG CHUỖI CUNG ỨNG NÔNG SẢN

## NONGDAN SERVICE (Port: 5251)

### 1. NÔNG DÂN (NongDan)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/nong-dan/get-all | GET | Lấy danh sách tất cả nông dân |
| /api/nong-dan/get-by-id/{id} | GET | Lấy thông tin nông dân theo ID |
| /api/nong-dan/create | POST | Tạo nông dân mới (kèm tài khoản) |
| /api/nong-dan/update/{id} | PUT | Cập nhật thông tin nông dân |
| /api/nong-dan/delete/{id} | DELETE | Xóa nông dân |

**Body tạo nông dân:**
```json
{
  "tenDangNhap": "nongdan01",
  "matKhau": "123456",
  "hoTen": "Nguyễn Văn A",
  "soDienThoai": "0901234567",
  "email": "nongdan@email.com",
  "diaChi": "Hà Nội"
}
```

---

### 2. SẢN PHẨM (SanPham)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/san-pham/get-all | GET | Lấy danh sách tất cả sản phẩm |
| /api/san-pham/get-by-id/{id} | GET | Lấy thông tin sản phẩm theo ID |
| /api/san-pham/create | POST | Tạo sản phẩm mới |
| /api/san-pham/update/{id} | PUT | Cập nhật thông tin sản phẩm |
| /api/san-pham/delete/{id} | DELETE | Xóa sản phẩm |

**Body tạo sản phẩm:**
```json
{
  "tenSanPham": "Gạo ST25",
  "donViTinh": "kg",
  "moTa": "Gạo ngon nhất thế giới"
}
```

---

### 3. TRANG TRẠI (TrangTrai)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/trang-trai/get-all | GET | Lấy danh sách tất cả trang trại |
| /api/trang-trai/get-by-id/{id} | GET | Lấy thông tin trang trại theo ID |
| /api/trang-trai/get-by-nong-dan/{maNongDan} | GET | Lấy trang trại theo mã nông dân |
| /api/trang-trai/create | POST | Tạo trang trại mới |
| /api/trang-trai/update/{id} | PUT | Cập nhật thông tin trang trại |
| /api/trang-trai/delete/{id} | DELETE | Xóa trang trại |

**Body tạo trang trại:**
```json
{
  "maNongDan": 1,
  "tenTrangTrai": "Trang trại ABC",
  "diaChi": "Đồng Tháp",
  "soChungNhan": "CN-2024-001"
}
```

---

### 4. LÔ NÔNG SẢN (LoNongSan)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/lo-nong-san/get-all | GET | Lấy danh sách tất cả lô nông sản |
| /api/lo-nong-san/get-by-id/{id} | GET | Lấy thông tin lô theo ID |
| /api/lo-nong-san/get-by-trang-trai/{maTrangTrai} | GET | Lấy lô theo trang trại |
| /api/lo-nong-san/get-by-nong-dan/{maNongDan} | GET | Lấy lô theo nông dân |
| /api/lo-nong-san/create | POST | Tạo lô nông sản mới |
| /api/lo-nong-san/update/{id} | PUT | Cập nhật thông tin lô |
| /api/lo-nong-san/delete/{id} | DELETE | Xóa lô nông sản |

**Body tạo lô nông sản:**
```json
{
  "maTrangTrai": 1,
  "maSanPham": 1,
  "soLuongBanDau": 1000,
  "soChungNhanLo": "LO-2024-001"
}
```

---

### 5. ĐƠN HÀNG ĐẠI LÝ (DonHangDaiLy)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/don-hang-dai-ly/get-all | GET | Lấy tất cả đơn hàng (kèm chi tiết) |
| /api/don-hang-dai-ly/get-by-id/{id} | GET | Lấy đơn hàng theo ID (kèm chi tiết) |
| /api/don-hang-dai-ly/get-by-nong-dan/{maNongDan} | GET | Lấy đơn hàng theo nông dân |
| /api/don-hang-dai-ly/get-by-dai-ly/{maDaiLy} | GET | Lấy đơn hàng theo đại lý |
| /api/don-hang-dai-ly/create | POST | Tạo đơn hàng mới (kèm chi tiết) |
| /api/don-hang-dai-ly/update/{id} | PUT | Cập nhật đơn hàng |
| /api/don-hang-dai-ly/xac-nhan/{id} | PUT | Xác nhận đơn hàng |
| /api/don-hang-dai-ly/xuat-don/{id} | PUT | Xuất đơn hàng |
| /api/don-hang-dai-ly/huy-don/{id} | PUT | Hủy đơn hàng |
| /api/don-hang-dai-ly/delete/{id} | DELETE | Xóa đơn hàng |

**Chi tiết đơn hàng:**

| API | Method | Mô tả |
|-----|--------|-------|
| /api/don-hang-dai-ly/{maDonHang}/chi-tiet | GET | Lấy chi tiết đơn hàng |
| /api/don-hang-dai-ly/{maDonHang}/chi-tiet | POST | Thêm lô sản phẩm vào đơn |
| /api/don-hang-dai-ly/{maDonHang}/chi-tiet/{maLo} | PUT | Cập nhật chi tiết |
| /api/don-hang-dai-ly/{maDonHang}/chi-tiet/{maLo} | DELETE | Xóa lô khỏi đơn hàng |

**Body tạo đơn hàng (kèm chi tiết):**
```json
{
  "maDaiLy": 1,
  "maNongDan": 1,
  "loaiDon": "dai_ly",
  "ngayGiao": "2024-12-30",
  "ghiChu": "Giao hàng trước 10h sáng",
  "chiTietDonHang": [
    { "maLo": 1, "soLuong": 100, "donGia": 50000 },
    { "maLo": 2, "soLuong": 50, "donGia": 75000 }
  ]
}
```

**Body thêm chi tiết:**
```json
{
  "maLo": 3,
  "soLuong": 200,
  "donGia": 60000
}
```

---
- ---------------------------------------------------------------------------------------------------------------------------------
## DAILY SERVICE (Port: 5151)

### 1. ĐẠI LÝ (DaiLy)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/dai-ly/get-all | GET | Lấy danh sách tất cả đại lý |
| /api/dai-ly/get-by-id/{id} | GET | Lấy thông tin đại lý theo ID |
| /api/dai-ly/create | POST | Tạo đại lý mới |
| /api/dai-ly/update/{id} | PUT | Cập nhật thông tin đại lý |
| /api/dai-ly/delete/{id} | DELETE | Xóa đại lý |

**Body tạo đại lý:**
```json
{
  "tenDangNhap": "daily01",
  "matKhau": "123456",
  "tenDaiLy": "Đại lý ABC",
  "soDienThoai": "0901234567",
  "email": "daily@email.com",
  "diaChi": "TP.HCM"
}
```

---

### 2. KHO (Kho)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/kho/get-all | GET | Lấy danh sách tất cả kho |
| /api/kho/get-by-id/{id} | GET | Lấy thông tin kho theo ID |
| /api/kho/get-by-ma-dai-ly/{maDaiLy} | GET | Lấy kho theo đại lý |
| /api/kho/create | POST | Tạo kho mới |
| /api/kho/update/{id} | PUT | Cập nhật thông tin kho |
| /api/kho/delete/{id} | DELETE | Xóa kho |

**Body tạo kho:**
```json
{
  "maDaiLy": 1,
  "tenKho": "Kho chính",
  "diaChi": "Quận 7, TP.HCM",
  "sucChua": 10000
}
```

---

### 3. KIỂM ĐỊNH (KiemDinh)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/kiem-dinh/get-all | GET | Lấy danh sách tất cả kiểm định |
| /api/kiem-dinh/get-by-id/{id} | GET | Lấy thông tin kiểm định theo ID |
| /api/kiem-dinh/create | POST | Tạo kiểm định mới |
| /api/kiem-dinh/update/{id} | PUT | Cập nhật thông tin kiểm định |
| /api/kiem-dinh/delete/{id} | DELETE | Xóa kiểm định |

---

### 4. ĐƠN HÀNG ĐẠI LÝ (từ góc nhìn Đại lý)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/don-hang-dai-ly/get-all | GET | Lấy tất cả đơn hàng |
| /api/don-hang-dai-ly/get-by-id/{id} | GET | Lấy đơn hàng theo ID |
| /api/don-hang-dai-ly/get-by-ma-dai-ly/{maDaiLy} | GET | Lấy đơn hàng theo đại lý |
| /api/don-hang-dai-ly/create | POST | Tạo đơn hàng mới |
| /api/don-hang-dai-ly/update-trang-thai/{id} | PUT | Cập nhật trạng thái đơn |
| /api/don-hang-dai-ly/delete/{id} | DELETE | Xóa đơn hàng |

---

### 5. ĐƠN HÀNG SIÊU THỊ (DonHangSieuThi)

| API | Method | Mô tả |
|-----|--------|-------|
| /api/don-hang-sieu-thi/get-all | GET | Lấy tất cả đơn hàng siêu thị |
| /api/don-hang-sieu-thi/get-by-id/{id} | GET | Lấy đơn hàng theo ID |
| /api/don-hang-sieu-thi/get-by-ma-dai-ly/{maDaiLy} | GET | Lấy đơn hàng theo đại lý |
| /api/don-hang-sieu-thi/tao-don-hang | POST | Tạo đơn hàng mới |
| /api/don-hang-sieu-thi/them-chi-tiet | POST | Thêm chi tiết cho đơn hàng |
| /api/don-hang-sieu-thi/nhan-hang/{id} | PUT | Xác nhận nhận hàng |
| /api/don-hang-sieu-thi/cap-nhat-chi-tiet | PUT | Cập nhật chi tiết đơn hàng |
| /api/don-hang-sieu-thi/xoa-chi-tiet | DELETE | Xóa chi tiết trong đơn hàng |

**Body tạo đơn hàng siêu thị:**
```json
{
  "maDaiLy": 1,
  "maSieuThi": 1,
  "loaiDon": "sieu_thi",
  "ghiChu": "Giao hàng gấp",
  "chiTietDonHang": [
    { "maLo": 1, "soLuong": 500, "donGia": 55000 }
  ]
}
```

---

## GATEWAY (Port: 5041)

Tất cả API được truy cập qua Gateway với prefix:
- **NongDan Service:** `/api-nongdan/...`
- **DaiLy Service:** `/api-daily/...`
- **SieuThi Service:** `/api-sieuthi/...`
- **Admin Service:** `/api-admin/...`

### Ví dụ:
| Trực tiếp | Qua Gateway |
|-----------|-------------|
| http://localhost:5251/api/nong-dan/get-all | http://localhost:5041/api-nongdan/nong-dan/get-all |
| http://localhost:5151/api/dai-ly/get-all | http://localhost:5041/api-daily/dai-ly/get-all |

### ĐĂNG NHẬP

| API | Method | Mô tả |
|-----|--------|-------|
| /api/login | POST | Đăng nhập hệ thống |

**Body đăng nhập (form-data):**
```
TenDangNhap: admin
MatKhau: 123456
```

**Response:**
```json
{
  "MaTaiKhoan": 1,
  "TenDangNhap": "admin",
  "LoaiTaiKhoan": "admin",
  "MaNongDan": null,
  "MaDaiLy": null,
  "HoTen": "Admin",
  "Token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## TRẠNG THÁI ĐƠN HÀNG

| Trạng thái | Mô tả |
|------------|-------|
| cho_xu_ly | Chờ xử lý |
| da_xac_nhan | Đã xác nhận |
| dang_chuan_bi | Đang chuẩn bị |
| da_xuat | Đã xuất hàng |
| dang_van_chuyen | Đang vận chuyển |
| da_giao | Đã giao |
| da_nhan | Đã nhận |
| da_huy | Đã hủy |
