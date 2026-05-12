# 📦 HƯỚNG DẪN XEM TỒN KHO THEO KHO

## ✅ Đã hoàn thành

Đã fix để khi click vào kho, chỉ hiển thị **những lô nông sản đang có trong kho đó** (số lượng > 0).

### Thay đổi:

#### 1. **Stored Procedure mới: `sp_GetKhoHangById`**

File: `sp_BTL.sql`

```sql
CREATE OR ALTER PROCEDURE sp_GetKhoHangById
    @MaKho INT
AS
BEGIN
    -- Trả về thông tin kho
    SELECT K.MaKho, K.TenKho, K.DiaChi, ...
    FROM Kho K
    WHERE K.MaKho = @MaKho;
    
    -- Trả về tồn kho (CHỈ LÔ CÓ SỐ LƯỢNG > 0)
    SELECT TK.MaKho, TK.MaLo, TK.SoLuong, L.TenSanPham, ...
    FROM TonKho TK
    INNER JOIN LoNongSan L ON TK.MaLo = L.MaLo
    WHERE TK.MaKho = @MaKho 
      AND TK.SoLuong > 0  -- ← QUAN TRỌNG!
    ORDER BY TK.CapNhatCuoi DESC;
END;
```

**Điểm quan trọng:** `WHERE TK.SoLuong > 0` → Chỉ lấy lô còn hàng!

#### 2. **Frontend: Load tồn kho khi click**

File: `Fontend/src/pages/sieuthi/WarehouseManagement.tsx`

**Trước:**
```typescript
const toggleWarehouse = (maKho: number) => {
  // Chỉ toggle expand/collapse
  setExpandedWarehouses(newExpanded);
};
```

**Sau:**
```typescript
const toggleWarehouse = async (maKho: number) => {
  if (!newExpanded.has(maKho)) {
    // Khi mở rộng → Load tồn kho từ API
    await loadWarehouseInventory(maKho);
  }
  setExpandedWarehouses(newExpanded);
};

const loadWarehouseInventory = async (maKho: number) => {
  const response = await axios.get(`https://localhost:7087/api/KhoHang/${maKho}`);
  // Cập nhật allInventory với dữ liệu từ API
  setAllInventory(prev => [...filtered, ...response.data.tonKho]);
};
```

#### 3. **UI: Hiển thị "Kho trống" nếu không có hàng**

```typescript
{isExpanded && (
  <div className="inventory-details">
    {inventory.length === 0 ? (
      <p>Kho này chưa có hàng</p>
    ) : (
      <table>...</table>
    )}
  </div>
)}
```

---

## 🚀 BẠN PHẢI LÀM

### Bước 1: Chạy stored procedure mới

```sql
-- Mở SQL Server Management Studio
-- Chọn database BTL_HDV1
-- Chạy file sp_BTL.sql (hoặc chỉ phần sp_GetKhoHangById ở cuối file)
```

### Bước 2: Restart backend (nếu cần)

Nếu backend đang chạy, không cần restart vì chỉ thay đổi stored procedure.

### Bước 3: Reload frontend

```
1. Mở http://localhost:5173
2. Đăng nhập siêu thị: st1 / 123456
3. Vào "Quản lý kho"
4. Click "▶ Xem tồn kho" trên một kho
```

---

## 📊 Kết quả

### ✅ Trước khi có hàng:
```
Kho CocoMart 1
▶ Xem tồn kho
  → Click → "Kho này chưa có hàng"
```

### ✅ Sau khi có hàng (đã kiểm định đạt):
```
Kho CocoMart 1
▶ Xem tồn kho
  → Click → Hiển thị bảng:
  
  Mã lô | Sản phẩm      | Số lượng | Đơn vị | Cập nhật cuối
  #123  | Cà chua Đà Lạt| 50       | kg     | 12/5/2026 10:30
  #124  | Dưa leo       | 30       | kg     | 12/5/2026 09:15
```

---

## 🔍 Cách hoạt động

### Flow:

1. **User click "▶ Xem tồn kho"** trên một kho
2. **Frontend gọi API:** `GET /api/KhoHang/{maKho}`
3. **Backend gọi stored procedure:** `sp_GetKhoHangById`
4. **SQL Server trả về:**
   - Thông tin kho
   - Danh sách lô **CHỈ CÓ SoLuong > 0**
5. **Frontend hiển thị:**
   - Nếu có lô → Hiển thị bảng
   - Nếu không có lô → "Kho này chưa có hàng"

### Tại sao chỉ hiển thị lô có số lượng > 0?

- ✅ Kho trống → Không hiển thị lô đã hết hàng
- ✅ Kho có hàng → Chỉ hiển thị lô còn hàng
- ✅ Dễ quản lý, không bị rối với lô đã hết

---

## 📝 API Endpoint

### GET `/api/KhoHang/{maKho}`

**Request:**
```
GET https://localhost:7087/api/KhoHang/26
```

**Response:**
```json
{
  "kho": {
    "maKho": 26,
    "tenKho": "Kho CocoMart 1",
    "diaChi": "160A Nguyễn Văn Cừ, Quận 1, TP.HCM",
    "trangThai": "hoat_dong"
  },
  "tonKho": [
    {
      "maKho": 26,
      "maLo": 123,
      "soLuong": 50,
      "tenSanPham": "Cà chua Đà Lạt",
      "donViTinh": "kg",
      "capNhatCuoi": "2026-05-12T10:30:00"
    },
    {
      "maKho": 26,
      "maLo": 124,
      "soLuong": 30,
      "tenSanPham": "Dưa leo",
      "donViTinh": "kg",
      "capNhatCuoi": "2026-05-12T09:15:00"
    }
  ]
}
```

---

## ⚠️ LƯU Ý

### Khi nào kho có hàng?

Kho siêu thị chỉ có hàng khi:
1. ✅ Siêu thị đặt hàng từ đại lý
2. ✅ Đại lý xác nhận đơn hàng
3. ✅ Siêu thị kiểm định → **Kết quả: ĐẠT**
4. ✅ Hàng được nhập vào kho siêu thị

Nếu kiểm định **KHÔNG ĐẠT** → Hàng bị hoàn trả → Không nhập kho!

---

## 🎉 Hoàn thành

Bây giờ khi click vào kho, bạn sẽ thấy:
- ✅ Chỉ những lô đang có trong kho
- ✅ Số lượng tồn kho thực tế
- ✅ Thông tin sản phẩm đầy đủ
- ✅ Thời gian cập nhật cuối

**Chạy stored procedure và test ngay!** 🚀
