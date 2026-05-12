# 🌾 Hệ thống Quản lý Chuỗi Cung ứng Nông sản

## 📋 Giới thiệu

Hệ thống quản lý chuỗi cung ứng nông sản từ nông dân → đại lý → siêu thị với các tính năng:
- Quản lý đơn hàng
- Kiểm định chất lượng
- Quản lý kho và tồn kho
- Theo dõi lô nông sản

## 🏗️ Kiến trúc hệ thống

### Backend (ASP.NET Core 8.0)
- **Gateway**: Port 7217
- **AuthService**: Port 7217 (Authentication & Authorization)
- **NongDanService**: Port 7090 (Farmer management)
- **DaiLyService**: Port 7002 (Distributor management)
- **SieuThiService**: Port 7087 (Supermarket management)

### Frontend (React + TypeScript)
- **Port**: 5173
- **Framework**: React 18 + Vite
- **UI**: Custom CSS components

### Database
- **SQL Server**: BTL_HDV1
- **Server**: NVT

## 🚀 Cài đặt và Chạy

### 1. Database
```sql
-- Chạy file tạo database và bảng
USE master;
GO
EXEC sp_executesql N'USE [BTL_HDV1]';
GO

-- Import file database_BTL.sql
-- Import file sp_BTL.sql (stored procedures)
```

### 2. Backend
```bash
cd Agri_Supply_Chain_API
dotnet restore
dotnet build
dotnet run --project Gateway
```

### 3. Frontend
```bash
cd Fontend
npm install
npm run dev
```

## 👥 Tài khoản test

| Loại tài khoản | Username | Password |
|----------------|----------|----------|
| Nông dân       | nd1      | 123456   |
| Đại lý         | dl1      | 123456   |
| Siêu thị       | st1      | 123456   |

## 📊 Luồng hoạt động

### Đơn hàng Nông dân → Đại lý
1. Nông dân tạo đơn hàng → `chua_nhan`
2. Đại lý kiểm định:
   - ✅ Đạt → Chọn kho → `da_nhan` (nhập kho)
   - ❌ Không đạt → `hoan_don` (hoàn về nông dân)

### Đơn hàng Siêu thị → Đại lý
1. Siêu thị tạo đơn hàng → `chua_nhan`
2. Đại lý xác nhận:
   - ✅ Xác nhận → Chọn kho → Trừ tồn kho → `cho_kiem_duyet`
   - ❌ Hủy → `da_huy`
3. Siêu thị kiểm định:
   - ✅ Đạt → `da_nhan` (nhập kho siêu thị)
   - ❌ Không đạt → `hoan_don` (hoàn về đại lý)
4. Nếu hoàn đơn, đại lý xử lý:
   - ✅ Gửi lại → Chọn kho → `cho_kiem_duyet`
   - ❌ Hủy vĩnh viễn → `da_huy`

## 📁 Cấu trúc thư mục

```
CNW/
├── Agri_Supply_Chain_API/      # Backend services
│   ├── Gateway/                # API Gateway
│   ├── AuthService/            # Authentication service
│   ├── NongDanService/         # Farmer service
│   ├── DaiLyService/           # Distributor service
│   └── SieuThiService/         # Supermarket service
├── Fontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── context/            # React context
│   └── public/
├── database_BTL.sql            # Database schema
└── sp_BTL.sql                  # Stored procedures
```

## 🔧 Công nghệ sử dụng

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- JWT Authentication

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- React Router

## 📝 Ghi chú

- Hệ thống sử dụng stored procedures cho các thao tác phức tạp
- Authentication sử dụng JWT tokens
- Frontend sử dụng Context API cho state management
- Tất cả API đều có validation và error handling

## 🐛 Troubleshooting

### Backend không chạy
- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string trong appsettings.json
- Chạy `dotnet restore` và `dotnet build`

### Frontend không kết nối được API
- Kiểm tra backend đang chạy
- Kiểm tra API endpoints trong `src/services/apiConfig.ts`
- Kiểm tra CORS settings trong backend

### Database lỗi
- Chạy lại file `database_BTL.sql`
- Chạy lại file `sp_BTL.sql`
- Kiểm tra SQL Server authentication

## 📞 Liên hệ

Dự án bài tập lớn môn Công nghệ Web
