-- ============================================================================
-- PATCH: THÊM TrangThai = 'hoat_dong' VÀO TẤT CẢ STORED PROCEDURES CREATE
-- Chạy file này SAU KHI đã chạy sp_BTL.sql và PATCH_SOFT_DELETE_FIXED.sql
-- ============================================================================

USE BTL_HDV1;
GO

PRINT '========================================';
PRINT 'PATCH: THÊM TrangThai VÀO CREATE PROCEDURES';
PRINT '========================================';
GO

-- ============================================================================
-- 1. sp_DaiLy_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_DaiLy_Create
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255),
    @TenDaiLy NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @MaDaiLy INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF EXISTS (SELECT 1 FROM TaiKhoan WHERE TenDangNhap = @TenDangNhap)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 'ERROR' AS Status, N'Tên đăng nhập đã tồn tại' AS Message;
            RETURN;
        END
        
        DECLARE @MaTaiKhoan INT;
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, 'daily', N'hoat_dong');
        
        SET @MaTaiKhoan = SCOPE_IDENTITY();
        
        INSERT INTO DaiLy (MaTaiKhoan, TenDaiLy, SoDienThoai, Email, DiaChi, TrangThai)
        VALUES (@MaTaiKhoan, @TenDaiLy, @SoDienThoai, @Email, @DiaChi, N'hoat_dong');
        
        SET @MaDaiLy = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        SELECT 'SUCCESS' AS Status, @MaDaiLy AS MaDaiLy;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- ============================================================================
-- 2. sp_SieuThi_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_SieuThi_Create
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255),
    @TenSieuThi NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @MaSieuThi INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF EXISTS (SELECT 1 FROM TaiKhoan WHERE TenDangNhap = @TenDangNhap)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 'ERROR' AS Status, N'Tên đăng nhập đã tồn tại' AS Message;
            RETURN;
        END
        
        DECLARE @MaTaiKhoan INT;
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, 'sieuthi', N'hoat_dong');
        
        SET @MaTaiKhoan = SCOPE_IDENTITY();
        
        INSERT INTO SieuThi (MaTaiKhoan, TenSieuThi, SoDienThoai, Email, DiaChi, TrangThai)
        VALUES (@MaTaiKhoan, @TenSieuThi, @SoDienThoai, @Email, @DiaChi, N'hoat_dong');
        
        SET @MaSieuThi = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        SELECT 'SUCCESS' AS Status, @MaSieuThi AS MaSieuThi;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- ============================================================================
-- 3. sp_Admin_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Admin_Create
    @MaTaiKhoan INT,
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Admin (MaTaiKhoan, HoTen, SoDienThoai, Email, TrangThai)
        VALUES (@MaTaiKhoan, @HoTen, @SoDienThoai, @Email, N'hoat_dong');
        
        SELECT 'SUCCESS' AS Status, SCOPE_IDENTITY() AS MaAdmin;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- ============================================================================
-- 4. sp_TrangTrai_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_TrangTrai_Create
    @MaNongDan INT,
    @TenTrangTrai NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @SoChungNhan NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, TrangThai)
        VALUES (@MaNongDan, @TenTrangTrai, @DiaChi, @SoChungNhan, N'hoat_dong');
        
        SELECT 'SUCCESS' AS Status, SCOPE_IDENTITY() AS MaTrangTrai;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- ============================================================================
-- 5. sp_SanPham_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_SanPham_Create
    @TenSanPham NVARCHAR(100),
    @DonViTinh NVARCHAR(20),
    @MoTa NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO SanPham (TenSanPham, DonViTinh, MoTa, TrangThai)
        VALUES (@TenSanPham, @DonViTinh, @MoTa, N'hoat_dong');
        
        SELECT 'SUCCESS' AS Status, SCOPE_IDENTITY() AS MaSanPham;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- ============================================================================
-- 6. sp_LoNongSan_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_LoNongSan_Create
    @MaTrangTrai INT,
    @MaSanPham INT,
    @SoLuongBanDau DECIMAL(18,2),
    @NgayThuHoach DATE = NULL,
    @HanSuDung DATE = NULL,
    @SoChungNhanLo NVARCHAR(50) = NULL,
    @MaQR NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO LoNongSan (
            MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai,
            NgayThuHoach, HanSuDung, SoChungNhanLo, MaQR, TrangThai
        )
        VALUES (
            @MaTrangTrai, @MaSanPham, @SoLuongBanDau, @SoLuongBanDau,
            @NgayThuHoach, @HanSuDung, @SoChungNhanLo, @MaQR, N'tai_trang_trai'
        );
        
        SELECT 'SUCCESS' AS Status, SCOPE_IDENTITY() AS MaLo;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- ============================================================================
-- 7. sp_Kho_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Kho_Create
    @LoaiKho NVARCHAR(20),
    @MaDaiLy INT = NULL,
    @MaSieuThi INT = NULL,
    @TenKho NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Kho (LoaiKho, MaDaiLy, MaSieuThi, TenKho, DiaChi, TrangThai)
        VALUES (@LoaiKho, @MaDaiLy, @MaSieuThi, @TenKho, @DiaChi, N'hoat_dong');
        
        SELECT 'SUCCESS' AS Status, SCOPE_IDENTITY() AS MaKho;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- ============================================================================
-- 8. sp_KiemDinh_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_KiemDinh_Create
    @MaLo INT,
    @NguoiKiemDinh NVARCHAR(100),
    @MaDaiLy INT = NULL,
    @MaSieuThi INT = NULL,
    @NgayKiemDinh DATETIME = NULL,
    @KetQua NVARCHAR(20),
    @BienBan NVARCHAR(MAX) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF @NgayKiemDinh IS NULL
            SET @NgayKiemDinh = GETDATE();
        
        -- Tạo phiếu kiểm định
        INSERT INTO KiemDinh (
            MaLo, NguoiKiemDinh, MaDaiLy, MaSieuThi,
            NgayKiemDinh, KetQua, BienBan, GhiChu, TrangThai
        )
        VALUES (
            @MaLo, @NguoiKiemDinh, @MaDaiLy, @MaSieuThi,
            @NgayKiemDinh, @KetQua, @BienBan, @GhiChu, N'hoan_thanh'
        );
        
        DECLARE @MaKiemDinh INT = SCOPE_IDENTITY();
        
        -- Cập nhật trạng thái lô
        IF @KetQua = 'dat'
        BEGIN
            UPDATE LoNongSan SET TrangThai = N'kiem_dinh_dat' WHERE MaLo = @MaLo;
        END
        ELSE
        BEGIN
            UPDATE LoNongSan SET TrangThai = N'tai_trang_trai' WHERE MaLo = @MaLo;
        END
        
        COMMIT TRANSACTION;
        SELECT 'SUCCESS' AS Status, @MaKiemDinh AS MaKiemDinh;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

PRINT '';
PRINT '========================================';
PRINT 'HOÀN THÀNH PATCH TrangThai CHO CREATE';
PRINT '========================================';
PRINT '';
PRINT 'ĐÃ CẬP NHẬT:';
PRINT '- sp_DaiLy_Create: Thêm TrangThai = hoat_dong';
PRINT '- sp_SieuThi_Create: Thêm TrangThai = hoat_dong';
PRINT '- sp_Admin_Create: Thêm TrangThai = hoat_dong';
PRINT '- sp_TrangTrai_Create: Thêm TrangThai = hoat_dong';
PRINT '- sp_SanPham_Create: Thêm TrangThai = hoat_dong';
PRINT '- sp_LoNongSan_Create: Thêm TrangThai = tai_trang_trai';
PRINT '- sp_Kho_Create: Thêm TrangThai = hoat_dong';
PRINT '- sp_KiemDinh_Create: Thêm TrangThai = hoan_thanh';
PRINT '';
PRINT 'LƯU Ý: sp_NongDan_Create đã được sửa trong sp_BTL.sql';
PRINT '';
GO
