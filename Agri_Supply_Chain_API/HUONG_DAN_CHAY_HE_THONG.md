# HƯỚNG DẪN CHẠY HỆ THỐNG CHUỖI CUNG ỨNG NÔNG SẢN

## ✅ CÁC API ĐÃ CHẠY THÀNH CÔNG

Tất cả các services đã được khởi động:

### 🔹 Gateway (Cổng chính)
- **URL:** http://localhost:5041
- **Swagger:** http://localhost:5041/swagger

### 🔹 Auth Service (Xác thực)
- **URL:** http://localhost:5297
- **Swagger:** http://localhost:5297/swagger

### 🔹 Admin Service (Quản trị)
- **URL:** http://localhost:5274
- **Swagger:** http://localhost:5274/swagger

### 🔹 NongDan Service (Nông dân)
- **URL:** http://localhost:5251
- **Swagger:** http://localhost:5251/swagger

### 🔹 DaiLy Service (Đại lý)
- **URL:** http://localhost:5214
- **Swagger:** http://localhost:5214/swagger

### 🔹 SieuThi Service (Siêu thị)
- **URL:** http://localhost:5291
- **Swagger:** http://localhost:5291/swagger

---

## 🌐 GIAO DIỆN WEB

### Trang đăng nhập:
📂 Mở file: `D:\BTL_HDV\Agri_Supply_Chain_API\GiaoDien\Dangnhap\Dangnhap.html`

Hoặc truy cập trực tiếp:
```
file:///D:/BTL_HDV/Agri_Supply_Chain_API/GiaoDien/Dangnhap/Dangnhap.html
```

---

## 🔑 TÀI KHOẢN ĐĂNG NHẬP

### Theo tài liệu API, bạn có thể sử dụng:

**Tài khoản Admin:**
- Tên đăng nhập: `admin`
- Mật khẩu: `123456`
- Loại tài khoản: `admin`

**Lưu ý:** 
- Nếu tài khoản trên không hoạt động, bạn cần kiểm tra database để xem tài khoản nào đã được tạo
- Hoặc sử dụng chức năng đăng ký tài khoản mới trong giao diện

---

## 📝 CÁCH SỬ DỤNG

### 1. Đăng nhập vào hệ thống:
   - Mở file `Dangnhap.html` trong trình duyệt
   - Chọn loại tài khoản (admin/nongdan/daily/sieuthi)
   - Nhập tên đăng nhập và mật khẩu
   - Nhấn "Đăng nhập"

### 2. Truy cập Swagger để test API:
   - Gateway: http://localhost:5041/swagger
   - Hoặc truy cập từng service riêng lẻ theo URL ở trên

### 3. Test API Login qua Swagger:
   - Vào http://localhost:5041/swagger
   - Tìm endpoint `/api/login`
   - Nhấn "Try it out"
   - Nhập form-data:
     ```
     TenDangNhap: admin
     MatKhau: 123456
     ```
   - Nhấn "Execute"

---

## 🔧 KIỂM TRA DATABASE

Nếu không đăng nhập được, bạn cần kiểm tra database SQL Server:

```sql
-- Xem tất cả tài khoản
SELECT * FROM TaiKhoan;

-- Xem thông tin admin
SELECT tk.*, a.* 
FROM TaiKhoan tk
LEFT JOIN Admin a ON tk.MaTaiKhoan = a.MaTaiKhoan
WHERE tk.LoaiTaiKhoan = 'admin';
```

---

## 📌 LƯU Ý

1. Đảm bảo SQL Server đang chạy
2. Kiểm tra connection string trong các file `appsettings.json`
3. Nếu chưa có dữ liệu, cần chạy script SQL để tạo database và insert dữ liệu mẫu
4. Tất cả các API services phải chạy để hệ thống hoạt động đầy đủ

---

## 🎯 CÁC TRANG GIAO DIỆN

Sau khi đăng nhập thành công, bạn sẽ được chuyển đến:

- **Admin:** `GiaoDien/Admin/Admin.html`
- **Nông dân:** `GiaoDien/Nongdan/Nongdan.html`
- **Đại lý:** `GiaoDien/Daily/Daily.html`
- **Siêu thị:** `GiaoDien/Sieuthi/Sieuthi.html`

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, kiểm tra:
1. Console log trong trình duyệt (F12)
2. Output của các API services
3. Kết nối database
4. CORS settings trong các service
