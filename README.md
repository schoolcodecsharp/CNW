# 🌾 Hệ thống Quản lý Chuỗi Cung ứng Nông sản

Hệ thống quản lý chuỗi cung ứng nông sản từ trang trại đến siêu thị với tính năng truy xuất nguồn gốc.

## 📋 Cấu trúc Database

### File SQL chính (chạy theo thứ tự):

1. **`database_BTL.sql`** - Schema database (bảng, ràng buộc, indexes)
2. **`sp_BTL.sql`** - Stored procedures gốc
3. **`PATCH_SOFT_DELETE_FIXED.sql`** - Patch soft delete (xóa mềm)
4. **`PATCH_ADD_TRANGTHAI_TO_CREATE.sql`** - Patch thêm TrangThai mặc định khi tạo mới
5. **`Du_lieu.sql`** - Dữ liệu mẫu

## 🚀 Cách chạy Database

### Bước 1: Tạo Database
```sql
-- Mở SQL Server Management Studio
-- Chạy file: database_BTL.sql
```

### Bước 2: Tạo Stored Procedures
```sql
-- Chạy file: sp_BTL.sql
```

### Bước 3: Áp dụng Soft Delete
```sql
-- Chạy file: PATCH_SOFT_DELETE_FIXED.sql
```

### Bước 4: Thêm TrangThai mặc định
```sql
-- Chạy file: PATCH_ADD_TRANGTHAI_TO_CREATE.sql
```

### Bước 5: Insert dữ liệu mẫu
```sql
-- Chạy file: Du_lieu.sql
```

## 📊 Tính năng Soft Delete

### Nguyên tắc:
- **Tạo mới**: TrangThai = 'hoat_dong'
- **Xóa**: TrangThai = 'da_xoa' (không xóa vật lý)
- **Hiển thị**: Chỉ hiển thị TrangThai != 'da_xoa'
- **Admin**: Xem tất cả (kể cả đã xóa)

### Cascade Delete:
- Xóa Nông dân → Xóa Trang trại + Tài khoản
- Xóa Đại lý → Xóa Kho + Tài khoản
- Xóa Siêu thị → Xóa Kho + Tài khoản

## 🔑 Tài khoản mặc định

```
Nông dân:  nd1 / 123456
Đại lý:    dl1 / 123456
Siêu thị:  st1 / 123456
Admin:     admin1 / 123456
```

## 🛠️ Tech Stack

- **Backend**: ASP.NET Core 8.0
- **Database**: SQL Server
- **Frontend**: React + TypeScript
- **ORM**: Entity Framework Core

## 📁 Cấu trúc Project

```
CNW/
├── database_BTL.sql                    # Schema database
├── sp_BTL.sql                          # Stored procedures
├── PATCH_SOFT_DELETE_FIXED.sql         # Patch soft delete
├── PATCH_ADD_TRANGTHAI_TO_CREATE.sql   # Patch TrangThai
├── Du_lieu.sql                         # Dữ liệu mẫu
├── Agri_Supply_Chain_API/              # Backend API
│   ├── AdminService/
│   ├── AuthService/
│   ├── NongDanService/
│   ├── DaiLyService/
│   └── SieuThiService/
└── Fontend/                            # Frontend React
    └── src/
        ├── pages/
        ├── components/
        └── services/
```

## 📝 Lưu ý

1. Chạy file SQL theo đúng thứ tự
2. Đảm bảo SQL Server đang chạy
3. Connection string: `Server=NVT;Database=BTL_HDV1;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true`
4. Sau khi chạy xong, reload trang web để thấy dữ liệu

---

**Phát triển bởi**: Nhóm CNW  
**Năm**: 2026
