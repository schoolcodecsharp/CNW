-- ============================================================================
-- SCRIPT KIỂM TRA TỒN KHO
-- ============================================================================

-- 1. Kiểm tra stored procedure đã tồn tại chưa
PRINT '========================================';
PRINT '1. KIỂM TRA STORED PROCEDURE';
PRINT '========================================';
SELECT 
    name AS [Stored Procedure Name],
    create_date AS [Created Date],
    modify_date AS [Modified Date]
FROM sys.procedures
WHERE name = 'sp_GetKhoHangById';
GO

-- 2. Kiểm tra kho của siêu thị
PRINT '';
PRINT '========================================';
PRINT '2. DANH SÁCH KHO CỦA SIÊU THỊ';
PRINT '========================================';
SELECT 
    K.MaKho,
    K.TenKho,
    K.DiaChi,
    K.MaSieuThi,
    ST.TenSieuThi,
    K.TrangThai
FROM Kho K
LEFT JOIN SieuThi ST ON K.MaSieuThi = ST.MaSieuThi
WHERE K.LoaiKho = 'sieuthi'
ORDER BY K.MaKho;
GO

-- 3. Kiểm tra tồn kho trong bảng TonKho
PRINT '';
PRINT '========================================';
PRINT '3. TỒN KHO TRONG BẢNG TONKHO';
PRINT '========================================';
SELECT 
    TK.MaKho,
    K.TenKho,
    TK.MaLo,
    SP.TenSanPham,
    TK.SoLuong,
    TK.CapNhatCuoi,
    L.TrangThai AS TrangThaiLo
FROM TonKho TK
INNER JOIN Kho K ON TK.MaKho = K.MaKho
INNER JOIN LoNongSan L ON TK.MaLo = L.MaLo
INNER JOIN SanPham SP ON L.MaSanPham = SP.MaSanPham
WHERE K.LoaiKho = 'sieuthi'
ORDER BY TK.MaKho, TK.CapNhatCuoi DESC;
GO

-- 4. Kiểm tra đơn hàng đã kiểm định đạt
PRINT '';
PRINT '========================================';
PRINT '4. ĐỚN HÀNG ĐÃ KIỂM ĐỊNH ĐẠT';
PRINT '========================================';
SELECT 
    DH.MaDonHang,
    DHST.MaDaiLy,
    DHST.MaSieuThi,
    ST.TenSieuThi,
    DH.TrangThai,
    DH.NgayDat,
    KDST.KetQua,
    KDST.MaKho AS KhoNhapHang,
    K.TenKho
FROM DonHang DH
INNER JOIN DonHangSieuThi DHST ON DH.MaDonHang = DHST.MaDonHang
INNER JOIN SieuThi ST ON DHST.MaSieuThi = ST.MaSieuThi
LEFT JOIN KiemDinhDonHangSieuThi KDST ON DH.MaDonHang = KDST.MaDonHang
LEFT JOIN Kho K ON KDST.MaKho = K.MaKho
WHERE DH.TrangThai = 'da_nhan'
ORDER BY DH.NgayDat DESC;
GO

-- 5. Test stored procedure với một kho cụ thể
PRINT '';
PRINT '========================================';
PRINT '5. TEST STORED PROCEDURE';
PRINT '========================================';
PRINT 'Chọn kho đầu tiên của siêu thị để test...';

DECLARE @MaKhoTest INT;
SELECT TOP 1 @MaKhoTest = MaKho FROM Kho WHERE LoaiKho = 'sieuthi';

IF @MaKhoTest IS NOT NULL
BEGIN
    PRINT 'Testing với MaKho = ' + CAST(@MaKhoTest AS NVARCHAR(10));
    EXEC sp_GetKhoHangById @MaKho = @MaKhoTest;
END
ELSE
BEGIN
    PRINT 'Không tìm thấy kho nào của siêu thị!';
END
GO

-- 6. Kiểm tra chi tiết đơn hàng đã nhập kho
PRINT '';
PRINT '========================================';
PRINT '6. CHI TIẾT ĐƠN HÀNG ĐÃ NHẬP KHO';
PRINT '========================================';
SELECT 
    CTDH.MaDonHang,
    DH.TrangThai AS TrangThaiDonHang,
    CTDH.MaLo,
    SP.TenSanPham,
    CTDH.SoLuong AS SoLuongDatHang,
    KDST.MaKho AS KhoNhapHang,
    K.TenKho,
    TK.SoLuong AS SoLuongTonKho
FROM ChiTietDonHang CTDH
INNER JOIN DonHang DH ON CTDH.MaDonHang = DH.MaDonHang
INNER JOIN LoNongSan L ON CTDH.MaLo = L.MaLo
INNER JOIN SanPham SP ON L.MaSanPham = SP.MaSanPham
LEFT JOIN KiemDinhDonHangSieuThi KDST ON DH.MaDonHang = KDST.MaDonHang
LEFT JOIN Kho K ON KDST.MaKho = K.MaKho
LEFT JOIN TonKho TK ON KDST.MaKho = TK.MaKho AND CTDH.MaLo = TK.MaLo
WHERE DH.TrangThai = 'da_nhan'
ORDER BY CTDH.MaDonHang;
GO

PRINT '';
PRINT '========================================';
PRINT 'HOÀN TẤT KIỂM TRA';
PRINT '========================================';
