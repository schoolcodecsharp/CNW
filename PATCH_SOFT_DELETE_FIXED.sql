-- ============================================================================
-- PATCH: CẬP NHẬT STORED PROCEDURES CHO SOFT DELETE
-- Chạy file này SAU KHI đã chạy database_BTL.sql và sp_BTL.sql
-- ============================================================================

USE BTL_HDV1;
GO

PRINT '========================================';
PRINT 'PATCH: SOFT DELETE STORED PROCEDURES';
PRINT '========================================';
GO

-- ============================================================================
-- 1. DAI LY
-- ============================================================================

PRINT 'Cập nhật DaiLy procedures...';
GO

CREATE OR ALTER PROCEDURE sp_DaiLy_GetAll
AS
BEGIN
    SELECT 
        DL.MaDaiLy,
        DL.MaTaiKhoan,
        DL.TenDaiLy,
        DL.SoDienThoai,
        DL.Email,
        DL.DiaChi,
        DL.TrangThai,
        TK.TenDangNhap
    FROM DaiLy DL
    INNER JOIN TaiKhoan TK ON DL.MaTaiKhoan = TK.MaTaiKhoan
    WHERE ISNULL(DL.TrangThai, 'hoat_dong') != 'da_xoa'
    ORDER BY DL.MaDaiLy;
END;
GO

CREATE OR ALTER PROCEDURE sp_DaiLy_GetById
    @MaDaiLy INT
AS
BEGIN
    SELECT 
        DL.MaDaiLy,
        DL.MaTaiKhoan,
        DL.TenDaiLy,
        DL.SoDienThoai,
        DL.Email,
        DL.DiaChi,
        DL.TrangThai,
        TK.TenDangNhap
    FROM DaiLy DL
    INNER JOIN TaiKhoan TK ON DL.MaTaiKhoan = TK.MaTaiKhoan
    WHERE DL.MaDaiLy = @MaDaiLy
      AND DL.TrangThai != 'da_xoa';
END;
GO

CREATE OR ALTER PROCEDURE sp_DaiLy_Delete
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM DaiLy WHERE MaDaiLy = @MaDaiLy;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        -- Đánh dấu xóa kho
        UPDATE Kho 
        SET TrangThai = 'da_xoa' 
        WHERE MaDaiLy = @MaDaiLy;
        
        -- Đánh dấu xóa đại lý
        UPDATE DaiLy 
        SET TrangThai = 'da_xoa' 
        WHERE MaDaiLy = @MaDaiLy;
        
        -- Đánh dấu xóa tài khoản
        UPDATE TaiKhoan 
        SET TrangThai = 'da_xoa' 
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- 2. SIEU THI
-- ============================================================================

PRINT 'Cập nhật SieuThi procedures...';
GO

CREATE OR ALTER PROCEDURE sp_SieuThi_GetAll
AS
BEGIN
    SELECT 
        ST.MaSieuThi,
        ST.MaTaiKhoan,
        ST.TenSieuThi,
        ST.SoDienThoai,
        ST.Email,
        ST.DiaChi,
        ST.TrangThai,
        TK.TenDangNhap
    FROM SieuThi ST
    INNER JOIN TaiKhoan TK ON ST.MaTaiKhoan = TK.MaTaiKhoan
    WHERE ISNULL(ST.TrangThai, 'hoat_dong') != 'da_xoa'
    ORDER BY ST.MaSieuThi;
END;
GO

CREATE OR ALTER PROCEDURE sp_SieuThi_GetById
    @MaSieuThi INT
AS
BEGIN
    SELECT 
        ST.MaSieuThi,
        ST.MaTaiKhoan,
        ST.TenSieuThi,
        ST.SoDienThoai,
        ST.Email,
        ST.DiaChi,
        ST.TrangThai,
        TK.TenDangNhap
    FROM SieuThi ST
    INNER JOIN TaiKhoan TK ON ST.MaTaiKhoan = TK.MaTaiKhoan
    WHERE ST.MaSieuThi = @MaSieuThi
      AND ST.TrangThai != 'da_xoa';
END;
GO

CREATE OR ALTER PROCEDURE sp_SieuThi_Delete
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM SieuThi WHERE MaSieuThi = @MaSieuThi;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        -- Đánh dấu xóa kho
        UPDATE Kho 
        SET TrangThai = 'da_xoa' 
        WHERE MaSieuThi = @MaSieuThi;
        
        -- Đánh dấu xóa siêu thị
        UPDATE SieuThi 
        SET TrangThai = 'da_xoa' 
        WHERE MaSieuThi = @MaSieuThi;
        
        -- Đánh dấu xóa tài khoản
        UPDATE TaiKhoan 
        SET TrangThai = 'da_xoa' 
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- 3. TRANG TRAI
-- ============================================================================

PRINT 'Cập nhật TrangTrai procedures...';
GO

CREATE OR ALTER PROCEDURE sp_TrangTrai_GetAll
AS
BEGIN
    SELECT 
        TT.MaTrangTrai,
        TT.MaNongDan,
        TT.TenTrangTrai,
        TT.DiaChi,
        TT.SoChungNhan,
        TT.TrangThai,
        TT.NgayTao,
        ND.HoTen AS TenNongDan
    FROM TrangTrai TT
    INNER JOIN NongDan ND ON TT.MaNongDan = ND.MaNongDan
    WHERE TT.TrangThai != 'da_xoa'
    ORDER BY TT.MaTrangTrai;
END;
GO

CREATE OR ALTER PROCEDURE sp_TrangTrai_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SELECT 
        TT.MaTrangTrai,
        TT.MaNongDan,
        TT.TenTrangTrai,
        TT.DiaChi,
        TT.SoChungNhan,
        TT.TrangThai,
        TT.NgayTao,
        ND.HoTen AS TenNongDan
    FROM TrangTrai TT
    INNER JOIN NongDan ND ON TT.MaNongDan = ND.MaNongDan
    WHERE TT.MaNongDan = @MaNongDan
      AND TT.TrangThai != 'da_xoa'
    ORDER BY TT.MaTrangTrai;
END;
GO

CREATE OR ALTER PROCEDURE sp_TrangTrai_Delete
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE TrangTrai 
        SET TrangThai = 'da_xoa' 
        WHERE MaTrangTrai = @MaTrangTrai;
        
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- 4. SAN PHAM
-- ============================================================================

PRINT 'Cập nhật SanPham procedures...';
GO

CREATE OR ALTER PROCEDURE sp_SanPham_GetAll
AS
BEGIN
    SELECT 
        MaSanPham,
        TenSanPham,
        DonViTinh,
        MoTa,
        TrangThai,
        NgayTao
    FROM SanPham
    WHERE TrangThai != 'da_xoa'
    ORDER BY MaSanPham;
END;
GO

CREATE OR ALTER PROCEDURE sp_SanPham_GetById
    @MaSanPham INT
AS
BEGIN
    SELECT 
        MaSanPham,
        TenSanPham,
        DonViTinh,
        MoTa,
        TrangThai,
        NgayTao
    FROM SanPham
    WHERE MaSanPham = @MaSanPham
      AND TrangThai != 'da_xoa';
END;
GO

CREATE OR ALTER PROCEDURE sp_SanPham_Delete
    @MaSanPham INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE SanPham 
        SET TrangThai = 'da_xoa' 
        WHERE MaSanPham = @MaSanPham;
        
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- 5. LO NONG SAN
-- ============================================================================

PRINT 'Cập nhật LoNongSan procedures...';
GO

CREATE OR ALTER PROCEDURE sp_LoNongSan_GetAll
AS
BEGIN
    SELECT 
        LNS.MaLo,
        LNS.MaTrangTrai,
        LNS.MaSanPham,
        LNS.SoLuongBanDau,
        LNS.SoLuongHienTai,
        LNS.NgayThuHoach,
        LNS.HanSuDung,
        LNS.SoChungNhanLo,
        LNS.MaQR,
        LNS.TrangThai,
        LNS.NgayTao,
        SP.TenSanPham,
        TT.TenTrangTrai,
        TT.MaNongDan
    FROM LoNongSan LNS
    INNER JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    INNER JOIN TrangTrai TT ON LNS.MaTrangTrai = TT.MaTrangTrai
    WHERE LNS.TrangThai != 'da_xoa'
    ORDER BY LNS.MaLo DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_LoNongSan_GetByTrangTrai
    @MaTrangTrai INT
AS
BEGIN
    SELECT 
        LNS.MaLo,
        LNS.MaTrangTrai,
        LNS.MaSanPham,
        LNS.SoLuongBanDau,
        LNS.SoLuongHienTai,
        LNS.NgayThuHoach,
        LNS.HanSuDung,
        LNS.SoChungNhanLo,
        LNS.MaQR,
        LNS.TrangThai,
        LNS.NgayTao,
        SP.TenSanPham,
        TT.TenTrangTrai
    FROM LoNongSan LNS
    INNER JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    INNER JOIN TrangTrai TT ON LNS.MaTrangTrai = TT.MaTrangTrai
    WHERE LNS.MaTrangTrai = @MaTrangTrai
      AND LNS.TrangThai != 'da_xoa'
    ORDER BY LNS.MaLo DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_LoNongSan_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SELECT 
        LNS.MaLo,
        LNS.MaTrangTrai,
        LNS.MaSanPham,
        LNS.SoLuongBanDau,
        LNS.SoLuongHienTai,
        LNS.NgayThuHoach,
        LNS.HanSuDung,
        LNS.SoChungNhanLo,
        LNS.MaQR,
        LNS.TrangThai,
        LNS.NgayTao,
        SP.TenSanPham,
        TT.TenTrangTrai
    FROM LoNongSan LNS
    INNER JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    INNER JOIN TrangTrai TT ON LNS.MaTrangTrai = TT.MaTrangTrai
    WHERE TT.MaNongDan = @MaNongDan
      AND LNS.TrangThai != 'da_xoa'
    ORDER BY LNS.MaLo DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_LoNongSan_Delete
    @MaLo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE LoNongSan 
        SET TrangThai = 'da_xoa' 
        WHERE MaLo = @MaLo;
        
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- 6. KHO
-- ============================================================================

PRINT 'Cập nhật Kho procedures...';
GO

CREATE OR ALTER PROCEDURE sp_Kho_GetAll
AS
BEGIN
    SELECT 
        K.MaKho,
        K.LoaiKho,
        K.MaDaiLy,
        K.MaSieuThi,
        K.TenKho,
        K.DiaChi,
        K.TrangThai,
        K.NgayTao,
        DL.TenDaiLy,
        ST.TenSieuThi
    FROM Kho K
    LEFT JOIN DaiLy DL ON K.MaDaiLy = DL.MaDaiLy
    LEFT JOIN SieuThi ST ON K.MaSieuThi = ST.MaSieuThi
    WHERE K.TrangThai != 'da_xoa'
    ORDER BY K.MaKho;
END;
GO

CREATE OR ALTER PROCEDURE sp_Kho_GetByDaiLy
    @MaDaiLy INT
AS
BEGIN
    SELECT 
        K.MaKho,
        K.LoaiKho,
        K.MaDaiLy,
        K.MaSieuThi,
        K.TenKho,
        K.DiaChi,
        K.TrangThai,
        K.NgayTao,
        DL.TenDaiLy
    FROM Kho K
    INNER JOIN DaiLy DL ON K.MaDaiLy = DL.MaDaiLy
    WHERE K.MaDaiLy = @MaDaiLy
      AND K.TrangThai != 'da_xoa'
    ORDER BY K.MaKho;
END;
GO

CREATE OR ALTER PROCEDURE sp_Kho_GetBySieuThi
    @MaSieuThi INT
AS
BEGIN
    SELECT 
        K.MaKho,
        K.LoaiKho,
        K.MaDaiLy,
        K.MaSieuThi,
        K.TenKho,
        K.DiaChi,
        K.TrangThai,
        K.NgayTao,
        ST.TenSieuThi
    FROM Kho K
    INNER JOIN SieuThi ST ON K.MaSieuThi = ST.MaSieuThi
    WHERE K.MaSieuThi = @MaSieuThi
      AND K.TrangThai != 'da_xoa'
    ORDER BY K.MaKho;
END;
GO

CREATE OR ALTER PROCEDURE sp_Kho_Delete
    @MaKho INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Kho 
        SET TrangThai = 'da_xoa' 
        WHERE MaKho = @MaKho;
        
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- 7. KIEM DINH
-- ============================================================================

PRINT 'Cập nhật KiemDinh procedures...';
GO

CREATE OR ALTER PROCEDURE sp_KiemDinh_GetAll
AS
BEGIN
    SELECT 
        KD.MaKiemDinh,
        KD.MaLo,
        KD.NguoiKiemDinh,
        KD.MaDaiLy,
        KD.MaSieuThi,
        KD.NgayKiemDinh,
        KD.KetQua,
        KD.TrangThai,
        KD.BienBan,
        KD.GhiChu,
        LNS.SoChungNhanLo,
        SP.TenSanPham
    FROM KiemDinh KD
    JOIN LoNongSan LNS ON KD.MaLo = LNS.MaLo
    JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    WHERE KD.TrangThai != 'da_xoa'
    ORDER BY KD.MaKiemDinh DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_KiemDinh_GetByMaDaiLy
    @MaDaiLy INT
AS
BEGIN
    SELECT 
        KD.MaKiemDinh,
        KD.MaLo,
        KD.NguoiKiemDinh,
        KD.MaDaiLy,
        KD.MaSieuThi,
        KD.NgayKiemDinh,
        KD.KetQua,
        KD.TrangThai,
        KD.BienBan,
        KD.GhiChu,
        LNS.SoChungNhanLo,
        SP.TenSanPham
    FROM KiemDinh KD
    JOIN LoNongSan LNS ON KD.MaLo = LNS.MaLo
    JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    WHERE KD.MaDaiLy = @MaDaiLy
      AND KD.TrangThai != 'da_xoa'
    ORDER BY KD.MaKiemDinh DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_KiemDinh_Delete
    @MaKiemDinh INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE KiemDinh 
        SET TrangThai = 'da_xoa' 
        WHERE MaKiemDinh = @MaKiemDinh;
        
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- 8. ADMIN PROCEDURES (ĐẶC BIỆT - KHÔNG LỌC TrangThai)
-- ============================================================================

PRINT 'Cập nhật Admin procedures (không lọc TrangThai)...';
GO

CREATE OR ALTER PROCEDURE sp_Admin_GetAllDaiLy
AS
BEGIN
    SELECT 
        DL.MaDaiLy,
        DL.MaTaiKhoan,
        DL.TenDaiLy,
        DL.SoDienThoai,
        DL.Email,
        DL.DiaChi,
        DL.TrangThai,
        TK.TenDangNhap,
        TK.NgayTao
    FROM DaiLy DL
    INNER JOIN TaiKhoan TK ON DL.MaTaiKhoan = TK.MaTaiKhoan
    -- KHÔNG lọc TrangThai - Admin xem tất cả
    ORDER BY DL.MaDaiLy;
END;
GO

CREATE OR ALTER PROCEDURE sp_Admin_GetAllSieuThi
AS
BEGIN
    SELECT 
        ST.MaSieuThi,
        ST.MaTaiKhoan,
        ST.TenSieuThi,
        ST.SoDienThoai,
        ST.Email,
        ST.DiaChi,
        ST.TrangThai,
        TK.TenDangNhap,
        TK.NgayTao
    FROM SieuThi ST
    INNER JOIN TaiKhoan TK ON ST.MaTaiKhoan = TK.MaTaiKhoan
    -- KHÔNG lọc TrangThai - Admin xem tất cả
    ORDER BY ST.MaSieuThi;
END;
GO

CREATE OR ALTER PROCEDURE sp_Admin_DeleteDaiLy
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM DaiLy WHERE MaDaiLy = @MaDaiLy;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        -- Đánh dấu xóa kho
        UPDATE Kho 
        SET TrangThai = 'da_xoa' 
        WHERE MaDaiLy = @MaDaiLy;
        
        -- Đánh dấu xóa đại lý
        UPDATE DaiLy 
        SET TrangThai = 'da_xoa' 
        WHERE MaDaiLy = @MaDaiLy;
        
        -- Đánh dấu xóa tài khoản
        UPDATE TaiKhoan 
        SET TrangThai = 'da_xoa' 
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_Admin_DeleteSieuThi
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM SieuThi WHERE MaSieuThi = @MaSieuThi;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        -- Đánh dấu xóa kho
        UPDATE Kho 
        SET TrangThai = 'da_xoa' 
        WHERE MaSieuThi = @MaSieuThi;
        
        -- Đánh dấu xóa siêu thị
        UPDATE SieuThi 
        SET TrangThai = 'da_xoa' 
        WHERE MaSieuThi = @MaSieuThi;
        
        -- Đánh dấu xóa tài khoản
        UPDATE TaiKhoan 
        SET TrangThai = 'da_xoa' 
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
        THROW;
    END CATCH
END;
GO

PRINT '';
PRINT '========================================';
PRINT 'HOÀN THÀNH PATCH SOFT DELETE';
PRINT '========================================';
PRINT '';
PRINT 'ĐÃ CẬP NHẬT:';
PRINT '- DaiLy: GetAll, GetById, Delete';
PRINT '- SieuThi: GetAll, GetById, Delete';
PRINT '- TrangTrai: GetAll, GetByNongDan, Delete';
PRINT '- SanPham: GetAll, GetById, Delete';
PRINT '- LoNongSan: GetAll, GetByTrangTrai, GetByNongDan, Delete';
PRINT '- Kho: GetAll, GetByDaiLy, GetBySieuThi, Delete';
PRINT '- KiemDinh: GetAll, GetByMaDaiLy, Delete';
PRINT '- Admin: GetAllDaiLy, GetAllSieuThi, DeleteDaiLy, DeleteSieuThi';
PRINT '';
PRINT 'LƯU Ý:';
PRINT '- NongDan procedures đã được cập nhật trong sp_BTL.sql';
PRINT '- Admin procedures KHÔNG lọc TrangThai (xem tất cả)';
PRINT '- Tất cả Delete procedures đều cascade update';
PRINT '';
GO
