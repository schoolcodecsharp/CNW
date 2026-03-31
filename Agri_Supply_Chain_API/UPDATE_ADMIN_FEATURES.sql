-- =====================================================
-- CẬP NHẬT STORED PROCEDURE CHO ADMIN
-- Thêm tên nông dân vào kết quả truy vấn trang trại
-- =====================================================

USE BTL_HDV1;
GO

-- =====================================================
-- CẬP NHẬT sp_TrangTrai_GetAll - Thêm tên nông dân
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_TrangTrai_GetAll')
    DROP PROCEDURE sp_TrangTrai_GetAll;
GO

CREATE PROCEDURE sp_TrangTrai_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.MaTrangTrai,
        t.MaNongDan,
        n.HoTen AS TenNongDan,
        t.TenTrangTrai,
        t.DiaChi,
        t.SoChungNhan,
        t.NgayTao
    FROM TrangTrai t
    LEFT JOIN NongDan n ON t.MaNongDan = n.MaNongDan
    ORDER BY t.MaTrangTrai DESC;
END
GO

-- =====================================================
-- CẬP NHẬT sp_TrangTrai_GetById - Thêm tên nông dân
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_TrangTrai_GetById')
    DROP PROCEDURE sp_TrangTrai_GetById;
GO

CREATE PROCEDURE sp_TrangTrai_GetById
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.MaTrangTrai,
        t.MaNongDan,
        n.HoTen AS TenNongDan,
        t.TenTrangTrai,
        t.DiaChi,
        t.SoChungNhan,
        t.NgayTao
    FROM TrangTrai t
    LEFT JOIN NongDan n ON t.MaNongDan = n.MaNongDan
    WHERE t.MaTrangTrai = @MaTrangTrai;
END
GO

-- =====================================================
-- CẬP NHẬT sp_TrangTrai_GetByNongDan - Thêm tên nông dân
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_TrangTrai_GetByNongDan')
    DROP PROCEDURE sp_TrangTrai_GetByNongDan;
GO

CREATE PROCEDURE sp_TrangTrai_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.MaTrangTrai,
        t.MaNongDan,
        n.HoTen AS TenNongDan,
        t.TenTrangTrai,
        t.DiaChi,
        t.SoChungNhan,
        t.NgayTao
    FROM TrangTrai t
    LEFT JOIN NongDan n ON t.MaNongDan = n.MaNongDan
    WHERE t.MaNongDan = @MaNongDan
    ORDER BY t.MaTrangTrai DESC;
END
GO

-- =====================================================
-- TẠO STORED PROCEDURES CHO QUẢN LÝ ĐẠI LÝ
-- =====================================================

-- Lấy tất cả đại lý
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_GetAllDaiLy')
    DROP PROCEDURE sp_Admin_GetAllDaiLy;
GO

CREATE PROCEDURE sp_Admin_GetAllDaiLy
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        d.MaDaiLy,
        d.MaTaiKhoan,
        d.TenDaiLy,
        d.DiaChi,
        d.SoDienThoai,
        d.Email,
        t.TenDangNhap,
        t.TrangThai,
        t.NgayTao
    FROM DaiLy d
    INNER JOIN TaiKhoan t ON d.MaTaiKhoan = t.MaTaiKhoan
    ORDER BY d.MaDaiLy DESC;
END
GO

-- Lấy đại lý theo ID
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_GetDaiLyById')
    DROP PROCEDURE sp_Admin_GetDaiLyById;
GO

CREATE PROCEDURE sp_Admin_GetDaiLyById
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        d.MaDaiLy,
        d.MaTaiKhoan,
        d.TenDaiLy,
        d.DiaChi,
        d.SoDienThoai,
        d.Email,
        t.TenDangNhap,
        t.TrangThai,
        t.NgayTao
    FROM DaiLy d
    INNER JOIN TaiKhoan t ON d.MaTaiKhoan = t.MaTaiKhoan
    WHERE d.MaDaiLy = @MaDaiLy;
END
GO

-- Tạo đại lý mới
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_CreateDaiLy')
    DROP PROCEDURE sp_Admin_CreateDaiLy;
GO

CREATE PROCEDURE sp_Admin_CreateDaiLy
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255),
    @TenDaiLy NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @SoDienThoai NVARCHAR(15) = NULL,
    @Email NVARCHAR(100) = NULL,
    @MaDaiLy INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Tạo tài khoản
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, 'daily', 'hoat_dong');
        
        DECLARE @MaTaiKhoan INT = SCOPE_IDENTITY();
        
        -- Tạo đại lý
        INSERT INTO DaiLy (MaTaiKhoan, TenDaiLy, DiaChi, SoDienThoai, Email)
        VALUES (@MaTaiKhoan, @TenDaiLy, @DiaChi, @SoDienThoai, @Email);
        
        SET @MaDaiLy = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        SELECT 1 AS Success, @MaDaiLy AS MaDaiLy, N'Tạo đại lý thành công' AS Message;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS Success, NULL AS MaDaiLy, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO

-- Cập nhật đại lý
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_UpdateDaiLy')
    DROP PROCEDURE sp_Admin_UpdateDaiLy;
GO

CREATE PROCEDURE sp_Admin_UpdateDaiLy
    @MaDaiLy INT,
    @TenDaiLy NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @SoDienThoai NVARCHAR(15) = NULL,
    @Email NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE DaiLy
    SET TenDaiLy = @TenDaiLy,
        DiaChi = @DiaChi,
        SoDienThoai = @SoDienThoai,
        Email = @Email
    WHERE MaDaiLy = @MaDaiLy;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Xóa đại lý
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_DeleteDaiLy')
    DROP PROCEDURE sp_Admin_DeleteDaiLy;
GO

CREATE PROCEDURE sp_Admin_DeleteDaiLy
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM DaiLy WHERE MaDaiLy = @MaDaiLy;
        
        DELETE FROM DaiLy WHERE MaDaiLy = @MaDaiLy;
        DELETE FROM TaiKhoan WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT @@ROWCOUNT AS RowsAffected;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END
GO

-- =====================================================
-- TẠO STORED PROCEDURES CHO QUẢN LÝ SIÊU THỊ
-- =====================================================

-- Lấy tất cả siêu thị
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_GetAllSieuThi')
    DROP PROCEDURE sp_Admin_GetAllSieuThi;
GO

CREATE PROCEDURE sp_Admin_GetAllSieuThi
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        s.MaSieuThi,
        s.MaTaiKhoan,
        s.TenSieuThi,
        s.DiaChi,
        s.SoDienThoai,
        s.Email,
        t.TenDangNhap,
        t.TrangThai,
        t.NgayTao
    FROM SieuThi s
    INNER JOIN TaiKhoan t ON s.MaTaiKhoan = t.MaTaiKhoan
    ORDER BY s.MaSieuThi DESC;
END
GO

-- Lấy siêu thị theo ID
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_GetSieuThiById')
    DROP PROCEDURE sp_Admin_GetSieuThiById;
GO

CREATE PROCEDURE sp_Admin_GetSieuThiById
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        s.MaSieuThi,
        s.MaTaiKhoan,
        s.TenSieuThi,
        s.DiaChi,
        s.SoDienThoai,
        s.Email,
        t.TenDangNhap,
        t.TrangThai,
        t.NgayTao
    FROM SieuThi s
    INNER JOIN TaiKhoan t ON s.MaTaiKhoan = t.MaTaiKhoan
    WHERE s.MaSieuThi = @MaSieuThi;
END
GO

-- Tạo siêu thị mới
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_CreateSieuThi')
    DROP PROCEDURE sp_Admin_CreateSieuThi;
GO

CREATE PROCEDURE sp_Admin_CreateSieuThi
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255),
    @TenSieuThi NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @SoDienThoai NVARCHAR(15) = NULL,
    @Email NVARCHAR(100) = NULL,
    @MaSieuThi INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Tạo tài khoản
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, 'sieuthi', 'hoat_dong');
        
        DECLARE @MaTaiKhoan INT = SCOPE_IDENTITY();
        
        -- Tạo siêu thị
        INSERT INTO SieuThi (MaTaiKhoan, TenSieuThi, DiaChi, SoDienThoai, Email)
        VALUES (@MaTaiKhoan, @TenSieuThi, @DiaChi, @SoDienThoai, @Email);
        
        SET @MaSieuThi = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        SELECT 1 AS Success, @MaSieuThi AS MaSieuThi, N'Tạo siêu thị thành công' AS Message;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS Success, NULL AS MaSieuThi, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO

-- Cập nhật siêu thị
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_UpdateSieuThi')
    DROP PROCEDURE sp_Admin_UpdateSieuThi;
GO

CREATE PROCEDURE sp_Admin_UpdateSieuThi
    @MaSieuThi INT,
    @TenSieuThi NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @SoDienThoai NVARCHAR(15) = NULL,
    @Email NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE SieuThi
    SET TenSieuThi = @TenSieuThi,
        DiaChi = @DiaChi,
        SoDienThoai = @SoDienThoai,
        Email = @Email
    WHERE MaSieuThi = @MaSieuThi;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Xóa siêu thị
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Admin_DeleteSieuThi')
    DROP PROCEDURE sp_Admin_DeleteSieuThi;
GO

CREATE PROCEDURE sp_Admin_DeleteSieuThi
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM SieuThi WHERE MaSieuThi = @MaSieuThi;
        
        DELETE FROM SieuThi WHERE MaSieuThi = @MaSieuThi;
        DELETE FROM TaiKhoan WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT @@ROWCOUNT AS RowsAffected;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END
GO

PRINT '✅ Đã cập nhật tất cả stored procedures cho Admin';
PRINT '✅ Thêm TenNongDan vào kết quả truy vấn TrangTrai';
PRINT '✅ Thêm stored procedures quản lý Đại Lý';
PRINT '✅ Thêm stored procedures quản lý Siêu Thị';
GO
