# Hệ thống Quản lý Chuỗi Cung ứng Nông sản

Dự án full-stack với Node.js + TypeScript + Express (Backend) và React (Frontend)

## 🚀 Cấu trúc dự án

```
frontend/
├── src/                    # Backend (Node.js + TypeScript + Express)
│   └── server.ts          # Server chính
├── client/                # Frontend (React)
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Pages (Login, Dashboard)
│       ├── services/      # API services
│       └── App.js         # Main App
├── package.json           # Backend dependencies
├── tsconfig.json          # TypeScript config
└── README.md
```

## 📋 Yêu cầu hệ thống

- Node.js >= 14.x
- npm >= 6.x

## 🔧 Cài đặt

### Bước 1: Cài đặt Backend

```bash
cd frontend
npm install
```

### Bước 2: Cài đặt Frontend

```bash
cd client
npm install
```

## 🚀 Chạy ứng dụng

### Chạy Backend (Port 6000)

```bash
# Từ thư mục frontend/
npm run dev
```

hoặc

```bash
npx ts-node src/server.ts
```

Backend sẽ chạy tại: http://localhost:6000

### Chạy Frontend (Port 3000)

Mở terminal mới:

```bash
# Từ thư mục frontend/client/
npm start
```

Frontend sẽ tự động mở tại: http://localhost:3000

### Chạy cả Backend và Frontend cùng lúc

```bash
# Từ thư mục frontend/
npm run dev:all
```

## 🌐 API Endpoints

### Backend API (Port 6000)

- `GET /` - Thông tin API
- `GET /TinhTong/:id` - Tính tổng từ 1 đến n
- `POST /TinhTongHaiSo` - Tính tổng hai số
  ```json
  {
    "a": 10,
    "b": 20
  }
  ```
- `GET /api/nongdan` - Danh sách nông dân
- `GET /api/trangtrai` - Danh sách trang trại
- `GET /api/lonongsan` - Danh sách lô nông sản

## 🔐 Đăng nhập

- Username: `admin`
- Password: `admin123`

## 📚 Công nghệ sử dụng

### Backend
- Node.js
- TypeScript
- Express.js
- CORS

### Frontend
- React 18
- React Router 6
- Axios
- CSS3

## 📝 Tính năng

✅ Đăng nhập/Đăng xuất
✅ Dashboard với thống kê
✅ Quản lý Nông dân
✅ Quản lý Trang trại
✅ Quản lý Lô nông sản
✅ Công cụ tính toán (API demo)
✅ Responsive design

## 🛠️ Scripts

### Backend
- `npm run dev` - Chạy development server với ts-node
- `npm run build` - Build TypeScript sang JavaScript
- `npm start` - Chạy production server

### Frontend
- `npm start` - Chạy development server
- `npm run build` - Build production
- `npm test` - Chạy tests

## 📞 Liên hệ

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ.
