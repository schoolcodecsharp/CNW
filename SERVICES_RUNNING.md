# 🚀 Hệ Thống Đang Chạy

## ✅ Tất Cả Dịch Vụ Đã Khởi Động Thành Công

### Backend Services (6 services)

1. **Gateway** - http://localhost:5041
   - Cổng chính cho tất cả API requests
   - Xử lý routing và authentication

2. **AuthService** - http://localhost:5297
   - Xử lý đăng nhập, đăng ký
   - Quản lý JWT tokens

3. **AdminService** - http://localhost:5000
   - Quản lý người dùng
   - Chức năng admin

4. **NongDanService** - http://localhost:5251
   - Quản lý nông trại, sản phẩm, lô hàng
   - Xử lý đơn hàng từ nông dân

5. **DaiLyService** - http://localhost:5214
   - Quản lý đại lý
   - Đặt hàng và quản lý kho đại lý

6. **SieuThiService** - http://localhost:5291
   - Quản lý siêu thị
   - Đặt hàng và quản lý kho siêu thị

### Frontend

**React App** - http://localhost:3000
- Giao diện người dùng
- Kết nối với backend qua Gateway

## 🔐 Tài Khoản Test

### Admin
- Username: `admin`
- Password: `admin123`
- Loại: `admin`

### Nông Dân
- Username: `nongdan1`
- Password: `123456`
- Loại: `nongdan`

### Đại Lý
- Username: `daily1`
- Password: `123456`
- Loại: `daily`

### Siêu Thị
- Username: `sieuthi1`
- Password: `123456`
- Loại: `sieuthi`

## 📊 Database

- Server: `NVT`
- Database: `BTL_HDV1`
- Connection: Trusted Connection (Windows Authentication)

## 🎯 Cách Sử Dụng

1. Mở trình duyệt và truy cập: http://localhost:3000
2. Đăng nhập bằng một trong các tài khoản test ở trên
3. Hệ thống sẽ tự động chuyển đến dashboard tương ứng với loại tài khoản

## ⚠️ Lưu Ý

- Tất cả services đang chạy trong Development mode
- Không tắt các terminal đang chạy
- Nếu cần dừng, nhấn Ctrl+C trong từng terminal
- Database phải đang chạy SQL Server với tên server `NVT`

## 🔄 Khởi Động Lại

Nếu cần khởi động lại, chạy lần lượt:

```bash
# Backend (trong thư mục Agri_Supply_Chain_API)
cd Gateway && dotnet run
cd AuthService && dotnet run
cd AdminService && dotnet run
cd NongDanService && dotnet run
cd DaiLyService && dotnet run
cd SieuThiService && dotnet run

# Frontend (trong thư mục frontend/client)
npm start
```
