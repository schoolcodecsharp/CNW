-- ============================================================================
-- KIỂM TRA CẤU TRÚC BẢNG
-- ============================================================================

-- 1. Cấu trúc bảng LoNongSan
PRINT '========================================';
PRINT '1. CẤU TRÚC BẢNG LoNongSan';
PRINT '========================================';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'LoNongSan'
ORDER BY ORDINAL_POSITION;
GO

-- 2. Cấu trúc bảng DonHangSieuThi
PRINT '';
PRINT '========================================';
PRINT '2. CẤU TRÚC BẢNG DonHangSieuThi';
PRINT '========================================';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'DonHangSieuThi'
ORDER BY ORDINAL_POSITION;
GO

-- 3. Cấu trúc bảng DonHang
PRINT '';
PRINT '========================================';
PRINT '3. CẤU TRÚC BẢNG DonHang';
PRINT '========================================';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'DonHang'
ORDER BY ORDINAL_POSITION;
GO

-- 4. Cấu trúc bảng TonKho
PRINT '';
PRINT '========================================';
PRINT '4. CẤU TRÚC BẢNG TonKho';
PRINT '========================================';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'TonKho'
ORDER BY ORDINAL_POSITION;
GO

-- 5. Kiểm tra dữ liệu mẫu từ LoNongSan
PRINT '';
PRINT '========================================';
PRINT '5. DỮ LIỆU MẪU TỪ LoNongSan';
PRINT '========================================';
SELECT TOP 3 * FROM LoNongSan;
GO

-- 6. Kiểm tra dữ liệu mẫu từ DonHangSieuThi
PRINT '';
PRINT '========================================';
PRINT '6. DỮ LIỆU MẪU TỪ DonHangSieuThi';
PRINT '========================================';
SELECT TOP 3 * FROM DonHangSieuThi;
GO

-- 7. Kiểm tra dữ liệu mẫu từ DonHang
PRINT '';
PRINT '========================================';
PRINT '7. DỮ LIỆU MẪU TỪ DonHang';
PRINT '========================================';
SELECT TOP 3 * FROM DonHang;
GO

-- 8. Kiểm tra TonKho
PRINT '';
PRINT '========================================';
PRINT '8. DỮ LIỆU TỪ TonKho';
PRINT '========================================';
SELECT * FROM TonKho;
GO
