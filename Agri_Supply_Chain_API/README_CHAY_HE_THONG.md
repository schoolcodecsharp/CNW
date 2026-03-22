# HƯỚNG DẪN CHẠY HỆ THỐNG

## 🚀 CÁCH 1: Chạy tất cả services cùng lúc (KHUYẾN NGHỊ)

### Windows PowerShell:
```powershell
cd CNW/Agri_Supply_Chain_API
.\start-all-services.ps1
```

### Windows CMD:
```cmd
cd CNW\Agri_Supply_Chain_API
start-all-services.bat
```

Script sẽ tự động khởi động tất cả 6 services:
- Gateway (Port 5041)
- AuthService (Port 5297)
- AdminService (Port 5274)
- NongDanService (Port 5251)
- DaiLyService (Port 5214)
- SieuThiService (Port 5291)

---

## 🔧 CÁCH 2: Chạy từng service riêng lẻ

### Gateway:
```bash
cd Gateway
dotnet run
```

### AuthService:
```bash
cd AuthService
dotnet run
```

### AdminService:
```bash
cd AdminService
dotnet run
```

### NongDanService:
```bash
cd NongDanService
dotnet run
```

### DaiLyService:
```bash
cd DaiLyService
dotnet run
```

### SieuThiService:
```bash
cd SieuThiService
dotnet run
```

---

## 📋 YÊU CẦU HỆ THỐNG

1. **.NET 8.0 SDK** đã được cài đặt
2. **SQL Server** đang chạy
3. **Database QL_NongSan** đã được tạo

---

## 🗄️ THIẾT LẬP DATABASE

### Bước 1: Tạo database
```sql
-- Chạy file DATABASE.sql trong thư mục gốc
-- Hoặc chạy lệnh:
sqlcmd -S localhost -i DATABASE.sql
```

### Bước 2: Kiểm tra connection string
Tất cả các file `appsettings.json` đã được cấu hình với:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=QL_NongSan;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

Nếu SQL Server của bạn khác, hãy cập nhật connection string trong các file:
- AdminService/appsettings.json
- AuthService/appsettings.json
- DaiLyService/appsettings.json
- NongDanService/appsettings.json
- SieuThiService/appsettings.json
- Gateway/appsettings.json

---

## 🌐 TRUY CẬP HỆ THỐNG

### API Gateway (Cổng chính):
- URL: http://localhost:5041
- Swagger: http://localhost:5041/swagger

### Giao diện Web:
Mở file trong trình duyệt:
```
CNW/Agri_Supply_Chain_API/GiaoDien/Dangnhap/Dangnhap.html
```

---

## 🔑 TÀI KHOẢN MẪU

Sau khi chạy script DATABASE.sql, bạn có các tài khoản:

### Admin:
- Tên đăng nhập: admin1
- Mật khẩu: hash1

### Nông dân:
- Tên đăng nhập: nd1
- Mật khẩu: hash1

### Đại lý:
- Tên đăng nhập: dl1
- Mật khẩu: hash1

### Siêu thị:
- Tên đăng nhập: st1
- Mật khẩu: hash1

---

## 📦 CÀI ĐẶT THƯ VIỆN

Nếu thiếu thư viện, chạy lệnh sau trong từng thư mục service:

```bash
dotnet restore
```

Hoặc cài đặt toàn bộ solution:
```bash
dotnet restore Agri_Supply_Chain_API.sln
```

---

## ❌ XỬ LÝ LỖI

### Lỗi: Port đã được sử dụng
Đóng ứng dụng đang sử dụng port hoặc thay đổi port trong `Properties/launchSettings.json`

### Lỗi: Không kết nối được database
1. Kiểm tra SQL Server đang chạy
2. Kiểm tra connection string
3. Kiểm tra database QL_NongSan đã tồn tại

### Lỗi: Thiếu thư viện
```bash
dotnet restore
dotnet build
```

---

## 🛑 DỪNG HỆ THỐNG

### Nếu dùng PowerShell script:
Nhấn `Ctrl+C` trong cửa sổ PowerShell

### Nếu dùng BAT file:
Đóng từng cửa sổ CMD của mỗi service

### Nếu chạy riêng lẻ:
Nhấn `Ctrl+C` trong terminal của từng service

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra log trong terminal của từng service
2. Kiểm tra Swagger UI để test API
3. Kiểm tra Console log trong trình duyệt (F12)
