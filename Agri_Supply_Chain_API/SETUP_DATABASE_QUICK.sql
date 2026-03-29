-- =====================================================
-- SCRIPT SETUP NHANH DATABASE
-- Tạo database, tables và dữ liệu mẫu
-- =====================================================

USE master;
GO

-- Tạo database nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'BTL_HDV1')
BEGIN
    CREATE DATABASE BTL_HDV1;
    PRINT 'Database BTL_HDV1 đã được tạo';
END
ELSE
BEGIN
    PRINT 'Database BTL_HDV1 đã tồn tại';
END
GO

USE BTL_HDV1;
GO

-- =====================================================
-- TẠO BẢNG TaiKhoan
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaiKhoan')
BEGIN
    CREATE TABLE TaiKhoan (
        MaTaiKhoan INT PRIMARY KEY IDENTITY(1,1),
        TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
        MatKhau NVARCHAR(255) NOT NULL,
        LoaiTaiKhoan NVARCHAR(20) NOT NULL CHECK (LoaiTaiKhoan IN ('admin', 'nong_dan', 'dai_ly', 'sieu_thi')),
        TrangThai NVARCHAR(20) DEFAULT 'hoat_dong' CHECK (TrangThai IN ('hoat_dong', 'ngung_hoat_dong')),
        NgayTao DATETIME DEFAULT GETDATE(),
        LanDangNhapCuoi DATETIME NULL
    );
    PRINT 'Bảng TaiKhoan đã được tạo';
END
ELSE
BEGIN
    PRINT 'Bảng TaiKhoan đã tồn tại';
END
GO

-- =====================================================
-- TẠO BẢNG Admin
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Admin')
BEGIN
    CREATE TABLE Admin (
        MaAdmin INT PRIMARY KEY IDENTITY(1,1),
        MaTaiKhoan INT UNIQUE NOT NULL,
        HoTen NVARCHAR(100) NOT NULL,
        SoDienThoai NVARCHAR(15),
        Email NVARCHAR(100),
        FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
    );
    PRINT 'Bảng Admin đã được tạo';
END
GO

-- =====================================================
-- TẠO BẢNG NongDan
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'NongDan')
BEGIN
    CREATE TABLE NongDan (
        MaNongDan INT PRIMARY KEY IDENTITY(1,1),
        MaTaiKhoan INT UNIQUE NOT NULL,
        HoTen NVARCHAR(100) NOT NULL,
        SoDienThoai NVARCHAR(15),
        DiaChi NVARCHAR(255),
        CCCD NVARCHAR(20),
        FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
    );
    PRINT 'Bảng NongDan đã được tạo';
END
GO

-- =====================================================
-- TẠO BẢNG DaiLy
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DaiLy')
BEGIN
    CREATE TABLE DaiLy (
        MaDaiLy INT PRIMARY KEY IDENTITY(1,1),
        MaTaiKhoan INT UNIQUE NOT NULL,
        TenDaiLy NVARCHAR(100) NOT NULL,
        DiaChi NVARCHAR(255),
        SoDienThoai NVARCHAR(15),
        Email NVARCHAR(100),
        FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
    );
    PRINT 'Bảng DaiLy đã được tạo';
END
GO

-- =====================================================
-- TẠO BẢNG SieuThi
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SieuThi')
BEGIN
    CREATE TABLE SieuThi (
        MaSieuThi INT PRIMARY KEY IDENTITY(1,1),
        MaTaiKhoan INT UNIQUE NOT NULL,
        TenSieuThi NVARCHAR(100) NOT NULL,
        DiaChi NVARCHAR(255),
        SoDienThoai NVARCHAR(15),
        Email NVARCHAR(100),
        FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
    );
    PRINT 'Bảng SieuThi đã được tạo';
END
GO

-- =====================================================
-- THÊM DỮ LIỆU MẪU
-- =====================================================

-- Xóa dữ liệu cũ nếu có
DELETE FROM Admin;
DELETE FROM NongDan;
DELETE FROM DaiLy;
DELETE FROM SieuThi;
DELETE FROM TaiKhoan;
GO

-- Reset Identity
DBCC CHECKIDENT ('TaiKhoan', RESEED, 0);
DBCC CHECKIDENT ('Admin', RESEED, 0);
DBCC CHECKIDENT ('NongDan', RESEED, 0);
DBCC CHECKIDENT ('DaiLy', RESEED, 0);
DBCC CHECKIDENT ('SieuThi', RESEED, 0);
GO

-- Thêm tài khoản (với underscore để khớp với frontend)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
VALUES 
    ('admin', 'admin123', 'admin', 'hoat_dong'),
    ('nongdan1', '123456', 'nong_dan', 'hoat_dong'),
    ('nongdan2', '123456', 'nong_dan', 'hoat_dong'),
    ('daily1', '123456', 'dai_ly', 'hoat_dong'),
    ('daily2', '123456', 'dai_ly', 'hoat_dong'),
    ('sieuthi1', '123456', 'sieu_thi', 'hoat_dong'),
    ('sieuthi2', '123456', 'sieu_thi', 'hoat_dong');
GO

-- Thêm Admin
INSERT INTO Admin (MaTaiKhoan, HoTen, SoDienThoai, Email)
VALUES 
    (1, N'Nguyễn Văn Admin', '0901234567', 'admin@agrisupply.vn');
GO

-- Thêm Nông Dân
INSERT INTO NongDan (MaTaiKhoan, HoTen, SoDienThoai, DiaChi, CCCD)
VALUES 
    (2, N'Trần Văn Nông', '0912345678', N'Xã Tân Lập, Huyện Đức Trọng, Lâm Đồng', '079123456789'),
    (3, N'Lê Thị Hoa', '0923456789', N'Xã Đạ Ròn, Huyện Đơn Dương, Lâm Đồng', '079234567890');
GO

-- Thêm Đại Lý
INSERT INTO DaiLy (MaTaiKhoan, TenDaiLy, DiaChi, SoDienThoai, Email)
VALUES 
    (4, N'Đại Lý Nông Sản Xanh', N'123 Đường 3/2, TP. Đà Lạt, Lâm Đồng', '0934567890', 'daily1@agrisupply.vn'),
    (5, N'Đại Lý Thực Phẩm Sạch', N'456 Đường Trần Phú, TP. Đà Lạt, Lâm Đồng', '0945678901', 'daily2@agrisupply.vn');
GO

-- Thêm Siêu Thị
INSERT INTO SieuThi (MaTaiKhoan, TenSieuThi, DiaChi, SoDienThoai, Email)
VALUES 
    (6, N'Siêu Thị Co.opMart Đà Lạt', N'789 Đường Yersin, TP. Đà Lạt, Lâm Đồng', '0956789012', 'coopmart@agrisupply.vn'),
    (7, N'Siêu Thị BigC Đà Lạt', N'321 Đường Phù Đổng Thiên Vương, TP. Đà Lạt', '0967890123', 'bigc@agrisupply.vn');
GO

-- =====================================================
-- TẠO STORED PROCEDURE LOGIN
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_Login')
    DROP PROCEDURE sp_Login;
GO

CREATE PROCEDURE sp_Login
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @MaTaiKhoan INT;
    DECLARE @LoaiTaiKhoan NVARCHAR(20);
    DECLARE @TrangThai NVARCHAR(20);
    DECLARE @StoredPassword NVARCHAR(255);
    
    -- Lấy thông tin tài khoản
    SELECT 
        @MaTaiKhoan = MaTaiKhoan,
        @LoaiTaiKhoan = LoaiTaiKhoan,
        @TrangThai = TrangThai,
        @StoredPassword = MatKhau
    FROM TaiKhoan
    WHERE TenDangNhap = @TenDangNhap;
    
    -- Debug: In ra thông tin
    PRINT 'TenDangNhap: ' + ISNULL(@TenDangNhap, 'NULL');
    PRINT 'MaTaiKhoan: ' + ISNULL(CAST(@MaTaiKhoan AS NVARCHAR), 'NULL');
    PRINT 'LoaiTaiKhoan: ' + ISNULL(@LoaiTaiKhoan, 'NULL');
    PRINT 'TrangThai: ' + ISNULL(@TrangThai, 'NULL');
    
    -- Kiểm tra tài khoản có tồn tại không
    IF @MaTaiKhoan IS NULL
    BEGIN
        SELECT 0 AS Success, NULL AS LoaiTaiKhoan, NULL AS MaTaiKhoan, N'Tài khoản không tồn tại' AS Message;
        RETURN;
    END
    
    -- Kiểm tra trạng thái tài khoản
    IF @TrangThai = 'ngung_hoat_dong'
    BEGIN
        SELECT 0 AS Success, NULL AS LoaiTaiKhoan, NULL AS MaTaiKhoan, N'Tài khoản đã bị ngừng hoạt động' AS Message;
        RETURN;
    END
    
    -- Kiểm tra mật khẩu
    IF @StoredPassword = @MatKhau
    BEGIN
        -- Cập nhật lần đăng nhập cuối
        UPDATE TaiKhoan 
        SET LanDangNhapCuoi = GETDATE()
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        SELECT 1 AS Success, @LoaiTaiKhoan AS LoaiTaiKhoan, @MaTaiKhoan AS MaTaiKhoan, N'Đăng nhập thành công' AS Message;
    END
    ELSE
    BEGIN
        SELECT 0 AS Success, NULL AS LoaiTaiKhoan, NULL AS MaTaiKhoan, N'Mật khẩu không đúng' AS Message;
    END
END
GO

-- =====================================================
-- KIỂM TRA KẾT QUẢ
-- =====================================================
PRINT '';
PRINT '========================================';
PRINT 'SETUP HOÀN TẤT!';
PRINT '========================================';
PRINT '';

-- Hiển thị tài khoản
PRINT 'DANH SÁCH TÀI KHOẢN:';
SELECT 
    MaTaiKhoan,
    TenDangNhap,
    MatKhau,
    LoaiTaiKhoan,
    TrangThai,
    NgayTao
FROM TaiKhoan
ORDER BY MaTaiKhoan;

PRINT '';
PRINT 'TÀI KHOẢN DEMO:';
PRINT '- Admin: admin / admin123';
PRINT '- Nông dân: nongdan1 / 123456';
PRINT '- Đại lý: daily1 / 123456';
PRINT '- Siêu thị: sieuthi1 / 123456';
PRINT '';
PRINT 'TEST LOGIN:';
PRINT 'EXEC sp_Login @TenDangNhap = ''admin'', @MatKhau = ''admin123'';';
PRINT '';

-- Test login
EXEC sp_Login @TenDangNhap = 'admin', @MatKhau = 'admin123';
GO
