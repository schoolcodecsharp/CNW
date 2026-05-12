# ✅ FIX: Đơn hàng siêu thị hoạt động giống đơn hàng nông dân

## 🐛 Vấn đề

Khi đại lý cố gắng **chấp nhận** hoặc **từ chối** đơn hàng từ siêu thị, nút không hoạt động vì:
1. ❌ API endpoints sai - gọi đến `sieuthi` service thay vì `daily` service
2. ❌ Payload thiếu `MaDaiLy` khi từ chối đơn
3. ❌ Không xử lý response message từ API

## 🔧 Giải pháp đã áp dụng

### 1. **Sửa API Endpoints** (`apiConfig.ts`)

**Trước:**
```typescript
chuaXacNhanDaiLy: (maDaiLy: number) => `${API_BASE_URLS.sieuthi}/api/don-hang-sieu-thi/...`
```

**Sau:**
```typescript
chuaXacNhanDaiLy: (maDaiLy: number) => `${API_BASE_URLS.daily}/api/don-hang-sieu-thi/...`
```

✅ Tất cả 5 endpoints của đại lý giờ đều gọi đến `DaiLyService` (port 7002)

### 2. **Sửa handleAcceptOrder** (`OrderManagement.tsx`)

**Trước:**
```typescript
await axios.put(
  `${API_ENDPOINTS.daily.base}/api/don-hang-sieu-thi-dai-ly/xac-nhan/${id}`,
  { MaDaiLy, MaKho }
);
```

**Sau:**
```typescript
const response = await axios.put(
  API_ENDPOINTS.donHangSieuThi.xacNhanDaiLy(selectedOrder.maDonHang),
  { MaDaiLy: maDaiLy, MaKho: parseInt(selectedWarehouse) }
);
alert('✅ ' + (response.data.message || 'Chấp nhận đơn hàng thành công!'));
```

✅ Sử dụng endpoint đúng từ `apiConfig`
✅ Hiển thị message từ API response

### 3. **Sửa handleRejectOrder** (`OrderManagement.tsx`)

**Trước:**
```typescript
await axios.put(API_ENDPOINTS.donHangSieuThi.delete(order.maDonHang));
```

**Sau:**
```typescript
const payload = { MaDaiLy: maDaiLy };
const response = await axios.put(
  API_ENDPOINTS.donHangSieuThi.huyDonDaiLy(order.maDonHang),
  payload
);
alert('✅ ' + (response.data.message || 'Từ chối đơn hàng thành công!'));
```

✅ Thêm `MaDaiLy` vào payload (required by stored procedure)
✅ Sử dụng endpoint `huyDonDaiLy` thay vì `delete`
✅ Hiển thị message từ API response

## 📋 Luồng hoạt động CHÍNH XÁC

### Đơn hàng Siêu thị → Đại lý

```
1. Siêu thị tạo đơn
   ↓
   Status: chua_nhan
   ↓
2. Đại lý xem đơn trong "Quản lý đơn hàng"
   ↓
   [✓ Chấp nhận] hoặc [✕ Từ chối]
   ↓
3a. Nếu CHẤP NHẬN:
    - Chọn kho
    - Gọi API: PUT /api/don-hang-sieu-thi/xac-nhan-dai-ly/{id}
    - Payload: { MaDaiLy, MaKho }
    - SP: sp_DaiLy_XacNhanDonHang_SieuThi
    - Hành động:
      * Kiểm tra tồn kho
      * TRỪ tồn kho
      * Chuyển status: cho_kiem_duyet
    ↓
    Status: cho_kiem_duyet (chờ siêu thị kiểm định)

3b. Nếu TỪ CHỐI:
    - Gọi API: PUT /api/don-hang-sieu-thi/huy-don-dai-ly/{id}
    - Payload: { MaDaiLy }
    - SP: sp_DaiLy_HuyDonHang_SieuThi
    - Hành động:
      * KHÔNG cộng lại tồn kho (vì chưa trừ)
      * Chuyển status: da_huy
    ↓
    Status: da_huy (đơn bị hủy)
```

## 🎯 API Endpoints đã sửa

| Endpoint | Method | URL | Payload |
|----------|--------|-----|---------|
| Lấy đơn chưa xác nhận | GET | `/api/don-hang-sieu-thi/chua-xac-nhan-dai-ly/{maDaiLy}` | - |
| **Xác nhận đơn** | **PUT** | `/api/don-hang-sieu-thi/xac-nhan-dai-ly/{id}` | `{ MaDaiLy, MaKho }` |
| **Từ chối đơn** | **PUT** | `/api/don-hang-sieu-thi/huy-don-dai-ly/{id}` | `{ MaDaiLy }` |
| Lấy đơn hoàn trả | GET | `/api/don-hang-sieu-thi/hoan-don-dai-ly/{maDaiLy}` | - |
| Xử lý hoàn đơn | PUT | `/api/don-hang-sieu-thi/xu-ly-hoan-don-dai-ly/{id}` | `{ MaDaiLy, MaKho }` |

**Tất cả đều gọi đến DaiLyService (port 7002)**

## 🔍 Stored Procedures liên quan

1. **sp_DaiLy_XacNhanDonHang_SieuThi**
   - Input: `@MaDonHang`, `@MaDaiLy`, `@MaKho`
   - Kiểm tra: Đơn hàng tồn tại, trạng thái = `chua_nhan`, tồn kho đủ
   - Hành động: TRỪ tồn kho, chuyển status → `cho_kiem_duyet`

2. **sp_DaiLy_HuyDonHang_SieuThi**
   - Input: `@MaDonHang`, `@MaDaiLy`
   - Kiểm tra: Đơn hàng tồn tại
   - Hành động: Chuyển status → `da_huy` (KHÔNG cộng lại tồn kho)

## ✅ Kết quả

Bây giờ đại lý có thể:
- ✅ **Chấp nhận** đơn hàng từ siêu thị (chọn kho, trừ tồn kho)
- ✅ **Từ chối** đơn hàng từ siêu thị (hủy đơn)
- ✅ Xem thông báo thành công/lỗi từ API
- ✅ Workflow hoạt động giống hệt đơn hàng nông dân

## 🧪 Cách test

1. **Đăng nhập siêu thị** (`st1`/`123456`)
   - Tạo đơn hàng mua từ đại lý
   - Đơn sẽ có status: `chua_nhan`

2. **Đăng nhập đại lý** (`dl1`/`123456`)
   - Vào **Quản lý đơn hàng**
   - Thấy đơn từ siêu thị với 2 nút: [✓ Chấp nhận] [✕ Từ chối]

3. **Test Chấp nhận:**
   - Click [✓ Chấp nhận]
   - Modal hiện ra, chọn kho
   - Click "Xác nhận chấp nhận"
   - ✅ Thông báo: "Đã xác nhận đơn hàng. Chuyển sang chờ siêu thị kiểm định."
   - ✅ Tồn kho bị trừ
   - ✅ Đơn chuyển sang `cho_kiem_duyet`

4. **Test Từ chối:**
   - Click [✕ Từ chối]
   - Confirm
   - ✅ Thông báo: "Đã hủy đơn hàng"
   - ✅ Đơn chuyển sang `da_huy`
   - ✅ Tồn kho KHÔNG thay đổi (vì chưa trừ)

## 📝 Files đã sửa

1. `Fontend/src/services/apiConfig.ts` - Sửa base URL từ `sieuthi` → `daily`
2. `Fontend/src/pages/daily/OrderManagement.tsx` - Sửa 2 functions: `handleAcceptOrder`, `handleRejectOrder`

## 🚀 Đã commit và push

```bash
git commit -m "fix(frontend): correct API endpoints for supermarket order management"
git push origin main
```

**Refresh trang web và test ngay!** 🎉
