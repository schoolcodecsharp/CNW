# ✅ FIX CUỐI CÙNG - HIỂN THỊ TỒN KHO

## 🐛 Vấn đề

Có dữ liệu trong database nhưng không hiển thị trên giao diện.

## 🔍 Nguyên nhân

1. **DTO thiếu field**: `TonKhoDetail` không có `TenSanPham`, `DonViTinh`, etc.
2. **Frontend sai tên field**: Tìm `response.data.tonKho` nhưng backend trả về `tonKhos`
3. **Thiếu `maKho`**: Frontend cần `maKho` để filter inventory

## ✅ Đã sửa

### 1. Backend - DTO (SieuThiService)

**File:** `SieuThiService/Models/DTOs/StoredProcedureDTOs.cs`

**Trước:**
```csharp
public class TonKhoDetail
{
    public int MaLo { get; set; }
    public decimal SoLuong { get; set; }
    public DateTime CapNhatCuoi { get; set; }
    public string? TrangThaiLo { get; set; }
}
```

**Sau:**
```csharp
public class TonKhoDetail
{
    public int MaKho { get; set; }
    public int MaLo { get; set; }
    public decimal SoLuong { get; set; }
    public DateTime CapNhatCuoi { get; set; }
    public string? TenSanPham { get; set; }      // ← THÊM
    public string? DonViTinh { get; set; }       // ← THÊM
    public DateTime? NgaySanXuat { get; set; }   // ← THÊM
    public DateTime? HanSuDung { get; set; }     // ← THÊM
    public string? TrangThaiLo { get; set; }
}
```

### 2. Backend - Repository

**File:** `SieuThiService/Data/SieuThiRepository.cs`

**Trước:**
```csharp
TenSanPham = $"Sản phẩm lô {tk.MaLo}", // Tạm thời
DonViTinh = "kg", // Tạm thời
```

**Sau:**
```csharp
TenSanPham = tk.TenSanPham ?? $"Sản phẩm lô {tk.MaLo}",
DonViTinh = tk.DonViTinh ?? "kg",
```

### 3. Frontend

**File:** `Fontend/src/pages/sieuthi/WarehouseManagement.tsx`

**Trước:**
```typescript
if (response.data && response.data.tonKho) {  // ← SAI TÊN!
  return [...filtered, ...response.data.tonKho];
}
```

**Sau:**
```typescript
if (response.data && response.data.tonKhos) {  // ← ĐÚNG!
  const newInventory = response.data.tonKhos.map((item: any) => ({
    ...item,
    maKho: maKho  // ← THÊM maKho
  }));
  return [...filtered, ...newInventory];
}
```

---

## 🚀 BẠN PHẢI LÀM NGAY

### Bước 1: RESTART BACKEND ⚠️

**QUAN TRỌNG:** DTO đã thay đổi, PHẢI restart SieuThiService!

```
Visual Studio:
1. Stop SieuThiService (hoặc Stop All)
2. Start lại (F5)
```

### Bước 2: RELOAD FRONTEND

```
1. Mở http://localhost:5173
2. Nhấn Ctrl + Shift + R (Hard reload)
3. Hoặc F12 → Right-click Refresh → Empty Cache and Hard Reload
```

### Bước 3: TEST

```
1. Đăng nhập siêu thị: st1 / 123456
2. Vào "Quản lý kho"
3. Click "▶ Xem tồn kho"
4. Mở F12 → Tab Console → Xem log "Warehouse inventory response"
5. Sẽ thấy danh sách lô hàng!
```

---

## 📊 Kết quả mong đợi

### Console log (F12):
```javascript
Warehouse inventory response: {
  maKho: 26,
  tenKho: "Kho CocoMart 1",
  tonKhos: [
    {
      maLo: 123,
      soLuong: 50,
      tenSanPham: "Cà chua Đà Lạt",
      donViTinh: "kg",
      capNhatCuoi: "2026-05-12T10:30:00"
    }
  ]
}
```

### Giao diện:
```
Kho CocoMart 1
▼ Ẩn tồn kho

📦 Tồn kho
┌─────────┬──────────────────┬──────────┬────────┬─────────────────┐
│ Mã lô   │ Sản phẩm         │ Số lượng │ Đơn vị │ Cập nhật cuối   │
├─────────┼──────────────────┼──────────┼────────┼─────────────────┤
│ #123    │ Cà chua Đà Lạt   │ 50       │ kg     │ 12/5/2026 10:30 │
│ #124    │ Dưa leo          │ 30       │ kg     │ 12/5/2026 09:15 │
└─────────┴──────────────────┴──────────┴────────┴─────────────────┘
```

---

## 🔍 Debug nếu vẫn không hiện

### 1. Kiểm tra API response

Mở F12 → Tab Network → Click "▶ Xem tồn kho" → Xem request:

```
Request URL: https://localhost:7087/api/KhoHang/26
Status: 200 OK
Response: {
  "maKho": 26,
  "tenKho": "Kho CocoMart 1",
  "tonKhos": [...]  ← PHẢI CÓ ARRAY NÀY!
}
```

### 2. Kiểm tra Console log

```javascript
// Phải thấy log này:
Warehouse inventory response: { maKho: 26, tonKhos: [...] }
```

### 3. Kiểm tra database

Chạy SQL:
```sql
EXEC sp_GetKhoHangById @MaKho = 26;
```

Phải trả về 2 result sets:
- Result set 1: Thông tin kho
- Result set 2: Danh sách tồn kho (có TenSanPham, DonViTinh)

---

## ⚠️ LƯU Ý

### Tại sao phải restart backend?

- DTO đã thay đổi → Code C# đã thay đổi
- Nếu không restart → Vẫn chạy code cũ → Vẫn lỗi!

### Tại sao phải reload frontend?

- Component đã thay đổi
- Browser cache có thể giữ code cũ
- Hard reload để tải code mới

---

## 🎉 Sau khi làm xong

Tất cả tồn kho sẽ hiển thị đúng:
- ✅ Tên sản phẩm từ database
- ✅ Đơn vị tính từ database
- ✅ Số lượng tồn kho thực tế
- ✅ Thời gian cập nhật cuối

**RESTART BACKEND VÀ TEST NGAY!** 🚀
