# Cấu Hình API - Hệ Thống Quản Lý Chuỗi Cung Ứng Nông Sản

## Tổng Quan

Tất cả API requests từ Frontend đều đi qua **Gateway HTTPS** tại `https://localhost:7217`

Gateway sẽ tự động forward requests đến các services backend tương ứng.

## Kiến Trúc

```
Frontend (Port 3000)
    ↓
Gateway HTTPS (Port 7217)
    ↓
├── AuthService (HTTPS: 7183, HTTP: 5297)
├── AdminService (HTTPS: 7000, HTTP: 5000)
├── NongDanService (HTTPS: 7090, HTTP: 5251)
├── DaiLyService (HTTPS: 7002, HTTP: 5002)
└── SieuThiService (HTTPS: 7087, HTTP: 5291)
```

## Cấu Hình

### 1. Frontend (Vite Config)

File: `vite.config.ts`

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'https://localhost:7217',  // Gateway HTTPS
      changeOrigin: true,
      secure: false
    }
  }
}
```

### 2. API Configuration

File: `src/services/apiConfig.ts`

```typescript
const GATEWAY_URL = 'https://localhost:7217';

export const API_BASE_URLS = {
  auth: GATEWAY_URL,
  admin: GATEWAY_URL,
  nongdan: GATEWAY_URL,
  daily: GATEWAY_URL,
  sieuthi: GATEWAY_URL
};
```

### 3. Environment Variables

File: `.env.development`

```
VITE_GATEWAY_URL=https://localhost:7217
```

## Chạy Hệ Thống

### Tất Cả Services với HTTPS

```bash
# Chạy script tự động
START_ALL_HTTPS.bat
```

Hoặc chạy thủ công:

```bash
# 1. Gateway
cd Agri_Supply_Chain_API/Gateway
dotnet run --launch-profile https

# 2. AuthService
cd Agri_Supply_Chain_API/AuthService
dotnet run --launch-profile https

# 3. AdminService
cd Agri_Supply_Chain_API/AdminService
dotnet run --launch-profile https

# 4. NongDanService
cd Agri_Supply_Chain_API/NongDanService
dotnet run --launch-profile https

# 5. DaiLyService
cd Agri_Supply_Chain_API/DaiLyService
dotnet run --launch-profile https

# 6. SieuThiService
cd Agri_Supply_Chain_API/SieuThiService
dotnet run --launch-profile https

# 7. Frontend
cd Fontend
npm run dev
```

## Ports Summary

| Service | HTTPS Port | HTTP Port |
|---------|-----------|-----------|
| Gateway | 7217 | 5041 |
| AuthService | 7183 | 5297 |
| AdminService | 7000 | 5000 |
| NongDanService | 7090 | 5251 |
| DaiLyService | 7002 | 5002 |
| SieuThiService | 7087 | 5291 |
| Frontend | - | 3000 |

## Lưu Ý

1. **Tất cả services phải chạy với profile `https`** để đảm bảo đồng nhất
2. Frontend luôn gọi API qua Gateway HTTPS (port 7217)
3. Gateway sẽ forward requests đến các services backend
4. Không cần cấu hình CORS riêng cho từng service vì đã có ở Gateway

## Troubleshooting

### Lỗi Certificate

Nếu gặp lỗi SSL certificate, chạy:

```bash
dotnet dev-certs https --trust
```

### Kiểm Tra Services

```bash
# Gateway
curl -k https://localhost:7217/api/health

# AuthService
curl -k https://localhost:7183/api/Auth/health

# Các services khác tương tự
```
