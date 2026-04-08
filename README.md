# 🌾 Hệ Thống Quản Lý Chuỗi Cung Ứng Nông Sản

Hệ thống quản lý chuỗi cung ứng nông sản từ trang trại đến siêu thị, sử dụng kiến trúc Microservices.

## 📋 Tổng Quan

Dự án này là một hệ thống quản lý chuỗi cung ứng nông sản hoàn chỉnh, bao gồm:
- **Backend**: .NET Core 8.0 Microservices Architecture
- **Frontend**: React.js với Node.js backend
- **Database**: SQL Server
- **API Gateway**: Ocelot

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────────┐
│  API Gateway    │
│   (Ocelot)      │
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┬────────┐
    │         │        │        │        │
┌───▼───┐ ┌──▼──┐ ┌───▼───┐ ┌──▼──┐ ┌──▼──┐
│ Auth  │ │Admin│ │NongDan│ │DaiLy│ │SieuT│
│Service│ │Serv.│ │Service│ │Serv.│ │hi S.│
└───┬───┘ └──┬──┘ └───┬───┘ └──┬──┘ └──┬──┘
    │        │        │        │       │
    └────────┴────────┴────────┴───────┘
                     │
              ┌──────▼──────┐
              │ SQL Server  │
              │  BTL_HDV1   │
              └─────────────┘
```

## 🚀 Công Nghệ Sử Dụng

### Backend
- .NET Core 8.0
- ASP.NET Core Web API
- Ocelot API Gateway
- Entity Framework Core
- SQL Server
- JWT Authentication

### Frontend
- React 18
- React Router v6
- Axios
- Context API
- CSS3 (Modern Design)

## 📦 Cấu Trúc Dự Án

```
├── Agri_Supply_Chain_API/          # Backend Microservices
│   ├── Gateway/                    # API Gateway (Port 5041)
│   ├── AuthService/                # Authentication Service (Port 5297)
│   ├── AdminService/               # Admin Management (Port 5000)
│   ├── NongDanService/             # Farmer Management (Port 5251)
│   ├── DaiLyService/               # Distributor Management (Port 5214)
│   ├── SieuThiService/             # Supermarket Management (Port 5291)
│   ├── Database_Setup.sql          # Database schema
│   ├── SETUP_DATABASE_QUICK.sql    # Quick setup with sample data
│   └── INSERT_SAMPLE_DATA.sql      # Sample data insertion
│
└── frontend/                       # Frontend Application
    ├── server.js                   # Node.js backend (Port 6000)
    └── client/                     # React app (Port 3000)
        ├── public/
        └── src/
            ├── components/         # Reusable components
            ├── context/            # React Context (Auth)
            ├── pages/              # Page components
            │   ├── admin/          # Admin dashboard
            │   ├── nongdan/        # Farmer dashboard
            │   ├── daily/          # Distributor dashboard
            │   └── sieuthi/        # Supermarket dashboard
            └── services/           # API services
```

## 🔧 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- .NET Core SDK 8.0+
- Node.js 16+
- SQL Server 2019+
- Visual Studio 2022 hoặc VS Code

### 1. Setup Database

```sql
-- Mở SQL Server Management Studio
-- Kết nối đến server: NVT (hoặc localhost)
-- Chạy các script theo thứ tự:

1. SETUP_DATABASE_QUICK.sql      -- Tạo database và tài khoản
2. INSERT_SAMPLE_DATA.sql        -- Thêm dữ liệu mẫu
```

### 2. Chạy Backend Services

```bash
# Mở terminal tại thư mục Agri_Supply_Chain_API

# Chạy Gateway
cd Gateway
dotnet run

# Chạy AuthService (terminal mới)
cd AuthService
dotnet run

# Chạy các services khác tương tự...
```

### 3. Chạy Frontend

```bash
# Mở terminal tại thư mục frontend/client
cd frontend/client

# Cài đặt dependencies
npm install --legacy-peer-deps

# Chạy React app
npm start
```

## 🌐 Truy Cập Hệ Thống

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5041
- **Swagger UI**:
  - AuthService: http://localhost:5297/swagger
  - AdminService: http://localhost:5000/swagger
  - NongDanService: http://localhost:5251/swagger
  - DaiLyService: http://localhost:5214/swagger
  - SieuThiService: http://localhost:5291/swagger

## 👥 Tài Khoản Demo

| Loại TK | Username | Password | Mô tả |
|---------|----------|----------|-------|
| Admin | admin | admin123 | Quản trị hệ thống |
| Nông dân | nongdan1 | 123456 | Trần Văn Nông |
| Nông dân | nongdan2 | 123456 | Lê Thị Hoa |
| Đại lý | daily1 | 123456 | Đại Lý Nông Sản Xanh |
| Đại lý | daily2 | 123456 | Đại Lý Thực Phẩm Sạch |
| Siêu thị | sieuthi1 | 123456 | Co.opMart Đà Lạt |
| Siêu thị | sieuthi2 | 123456 | BigC Đà Lạt |

## 🎨 Tính Năng

### Admin Dashboard
- Quản lý người dùng
- Quản lý trang trại
- Quản lý lô nông sản
- Quản lý đơn hàng
- Báo cáo và thống kê

### Nông Dân Dashboard (Green Theme)
- Tổng quan trang trại
- Quản lý trang trại
- Quản lý lô nông sản
- Quản lý đơn hàng
- Danh sách sản phẩm

### Đại Lý Dashboard (Blue Theme)
- Tổng quan kho hàng
- Quản lý kho
- Quản lý đơn hàng từ nông dân
- Đặt hàng cho siêu thị
- Kiểm định chất lượng

### Siêu Thị Dashboard (Purple Theme)
- Tổng quan đơn hàng
- Quản lý kho
- Quản lý đơn hàng
- Đặt hàng từ đại lý

## 🔐 Bảo Mật

- JWT Authentication
- Password hashing
- CORS configuration
- API Gateway routing
- Role-based access control

## 📱 Responsive Design

Giao diện được thiết kế responsive, hỗ trợ:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🛠️ Development

### Backend Development
```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run specific service
cd <ServiceName>
dotnet run
```

### Frontend Development
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Build for production
npm run build
```

## 📝 API Documentation

Tất cả các API đều có Swagger UI documentation. Truy cập `/swagger` trên mỗi service để xem chi tiết.

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License.

## 👨‍💻 Tác Giả

Dự án được phát triển bởi nhóm sinh viên

## 📞 Liên Hệ

- Email: [your-email@example.com]
- GitHub: [your-github-profile]

---


