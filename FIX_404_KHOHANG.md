# ✅ FIX 404 - API KhoHang

## 🐛 Vấn đề

```
GET https://localhost:7087/api/KhoHang/26 404 (Not Found)
```

Frontend gọi API qua Gateway nhưng Gateway không có route cho `/api/KhoHang`.

## ✅ Đã sửa

### 1. Thêm route vào Gateway

**File:** `Gateway/ocelot.json`

```json
{
  "UpstreamPathTemplate": "/api/KhoHang/{everything}",
  "UpstreamHttpMethod": [ "GET", "POST", "PUT", "DELETE" ],
  "DownstreamPathTemplate": "/api/KhoHang/{everything}",
  "DownstreamScheme": "https",
  "DownstreamHostAndPorts": [
    {
      "Host": "localhost",
      "Port": 7087
    }
  ]
}
```

### 2. Sửa Repository để đọc đúng 2 result sets

**File:** `SieuThiService/Data/SieuThiRepository.cs`

**Vấn đề cũ:**
- `SqlQueryRaw` chỉ đọc được result set đầu tiên
- Stored procedure trả về 2 result sets (Kho info + TonKho list)
- Nên TonKho list không được đọc

**Giải pháp:**
- Dùng `SqlDataReader` với `NextResult()` để đọc cả 2 result sets
- Result set 1: Thông tin kho
- Result set 2: Danh sách tồn kho

```csharp
using (var reader = command.ExecuteReader())
{
    // Read first result set (Kho info)
    if (reader.Read()) { ... }
    
    // Move to second result set (TonKho)
    if (reader.NextResult())
    {
        while (reader.Read()) { ... }
    }
}
```

---

## 🚀 BẠN PHẢI LÀM NGAY

### Bước 1: RESTART GATEWAY ⚠️

**QUAN TRỌNG:** `ocelot.json` đã thay đổi, PHẢI restart Gateway!

```
Visual Studio:
1. Stop Gateway
2. Start lại Gateway (F5)
```

### Bước 2: RESTART SieuThiService ⚠️

Repository code đã thay đổi, PHẢI restart!

```
Visual Studio:
1. Stop SieuThiService
2. Start lại (F5)
```

### Bước 3: TEST

```
1. Đăng nhập siêu thị: st1 / 123456
2. Vào "Quản lý kho"
3. Click "▶ Xem tồn kho"
4. Mở F12 → Tab Network → Xem request
5. Status phải là 200 OK (không còn 404)
6. Response phải có tonKhos array
```

---

## 📊 Kết quả mong đợi

### Network Tab (F12):
```
Request URL: https://localhost:7217/api/KhoHang/26
Status: 200 OK
Response:
{
  "maKho": 26,
  "tenKho": "Kho CocoMart 1",
  "tonKhos": [
    {
      "maLo": 123,
      "soLuong": 50,
      "tenSanPham": "Cà chua Đà Lạt",
      "donViTinh": "kg"
    }
  ]
}
```

### Giao diện:
```
Kho CocoMart 1
▼ Ẩn tồn kho

📦 Tồn kho
┌─────────┬──────────────────┬──────────┬────────┐
│ Mã lô   │ Sản phẩm         │ Số lượng │ Đơn vị │
├─────────┼──────────────────┼──────────┼────────┤
│ #123    │ Cà chua Đà Lạt   │ 50       │ kg     │
└─────────┴──────────────────┴──────────┴────────┘
```

---

## 🔍 Giải thích kỹ thuật

### Tại sao 404?

1. Frontend gọi: `https://localhost:7217/api/KhoHang/26` (qua Gateway)
2. Gateway không có route `/api/KhoHang` → 404
3. Request không đến được SieuThiService

### Tại sao phải dùng SqlDataReader?

Stored procedure `sp_GetKhoHangById` trả về 2 result sets:

```sql
-- Result set 1: Thông tin kho
SELECT MaKho, TenKho, ... FROM Kho WHERE MaKho = @MaKho;

-- Result set 2: Tồn kho
SELECT MaKho, MaLo, SoLuong, TenSanPham, ... 
FROM TonKho TK
INNER JOIN LoNongSan L ON TK.MaLo = L.MaLo
INNER JOIN SanPham SP ON L.MaSanPham = SP.MaSanPham
WHERE TK.MaKho = @MaKho AND TK.SoLuong > 0;
```

`SqlQueryRaw` chỉ đọc result set đầu tiên → Mất data tồn kho!

`SqlDataReader` với `NextResult()` → Đọc được cả 2 result sets!

---

## ⚠️ LƯU Ý

### PHẢI restart cả 2 services:

1. **Gateway** - Route mới
2. **SieuThiService** - Repository code mới

### Nếu vẫn 404:

1. Kiểm tra Gateway đã chạy chưa (port 7217)
2. Kiểm tra SieuThiService đã chạy chưa (port 7087)
3. Xem log trong Visual Studio Output window

### Nếu 200 OK nhưng không có data:

1. Kiểm tra database có tồn kho không (chạy `CHECK_TON_KHO.sql`)
2. Xem Console log trong F12
3. Xem Response trong Network tab

---

## 🎉 Sau khi làm xong

Tất cả sẽ hoạt động:
- ✅ API trả về 200 OK
- ✅ Response có đầy đủ data
- ✅ Giao diện hiển thị danh sách lô hàng
- ✅ Tên sản phẩm, số lượng, đơn vị đều đúng

**RESTART GATEWAY VÀ SIEUTHI SERVICE NGAY!** 🚀
