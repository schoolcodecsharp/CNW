-- =============================================
-- STORED PROCEDURES CHO NONGDAN SERVICE
-- =============================================

-- =============================================
-- NONG DAN (Nông dân)
-- =============================================

-- Lấy tất cả nông dân
CREATE OR ALTER PROCEDURE sp_NongDan_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaNongDan, MaTaiKhoan, HoTen, SoDienThoai, Email, DiaChi 
    FROM NongDan 
    ORDER BY MaNongDan;
END
GO

-- Lấy nông dân theo ID
CREATE OR ALTER PROCEDURE sp_NongDan_GetById
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaNongDan, MaTaiKhoan, HoTen, SoDienThoai, Email, DiaChi 
    FROM NongDan 
    WHERE MaNongDan = @MaNongDan;
END
GO

-- Tạo nông dân mới (kèm tài khoản)
CREATE OR ALTER PROCEDURE sp_NongDan_Create
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255),
    @HoTen NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL,
    @MaNongDan INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Tạo tài khoản
        DECLARE @MaTaiKhoan INT;
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai, NgayTao)
        VALUES (@TenDangNhap, @MatKhau, N'nongdan', N'hoat_dong', GETDATE());
        SET @MaTaiKhoan = SCOPE_IDENTITY();
        
        -- Tạo nông dân
        INSERT INTO NongDan (MaTaiKhoan, HoTen, SoDienThoai, Email, DiaChi)
        VALUES (@MaTaiKhoan, @HoTen, @SoDienThoai, @Email, @DiaChi);
        SET @MaNongDan = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Cập nhật nông dân
CREATE OR ALTER PROCEDURE sp_NongDan_Update
    @MaNongDan INT,
    @HoTen NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE NongDan
    SET HoTen = @HoTen, 
        SoDienThoai = @SoDienThoai, 
        Email = @Email, 
        DiaChi = @DiaChi
    WHERE MaNongDan = @MaNongDan;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Xóa nông dân (kèm tài khoản)
CREATE OR ALTER PROCEDURE sp_NongDan_Delete
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM NongDan WHERE MaNongDan = @MaNongDan;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        DELETE FROM NongDan WHERE MaNongDan = @MaNongDan;
        DELETE FROM TaiKhoan WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- SAN PHAM (Sản phẩm)
-- =============================================

-- Lấy tất cả sản phẩm
CREATE OR ALTER PROCEDURE sp_SanPham_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaSanPham, TenSanPham, DonViTinh, MoTa, NgayTao 
    FROM SanPham 
    ORDER BY NgayTao DESC;
END
GO

-- Lấy sản phẩm theo ID
CREATE OR ALTER PROCEDURE sp_SanPham_GetById
    @MaSanPham INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaSanPham, TenSanPham, DonViTinh, MoTa, NgayTao 
    FROM SanPham 
    WHERE MaSanPham = @MaSanPham;
END
GO

-- Tạo sản phẩm mới
CREATE OR ALTER PROCEDURE sp_SanPham_Create
    @TenSanPham NVARCHAR(100),
    @DonViTinh NVARCHAR(20),
    @MoTa NVARCHAR(255) = NULL,
    @MaSanPham INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO SanPham (TenSanPham, DonViTinh, MoTa, NgayTao)
    VALUES (@TenSanPham, @DonViTinh, @MoTa, GETDATE());
    SET @MaSanPham = SCOPE_IDENTITY();
END
GO

-- Cập nhật sản phẩm
CREATE OR ALTER PROCEDURE sp_SanPham_Update
    @MaSanPham INT,
    @TenSanPham NVARCHAR(100),
    @DonViTinh NVARCHAR(20),
    @MoTa NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE SanPham
    SET TenSanPham = @TenSanPham, 
        DonViTinh = @DonViTinh, 
        MoTa = @MoTa
    WHERE MaSanPham = @MaSanPham;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Xóa sản phẩm
CREATE OR ALTER PROCEDURE sp_SanPham_Delete
    @MaSanPham INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM SanPham WHERE MaSanPham = @MaSanPham;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- =============================================
-- TRANG TRAI (Trang trại)
-- =============================================

-- Lấy tất cả trang trại
CREATE OR ALTER PROCEDURE sp_TrangTrai_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaTrangTrai, MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, NgayTao 
    FROM TrangTrai 
    ORDER BY NgayTao DESC;
END
GO

-- Lấy trang trại theo ID
CREATE OR ALTER PROCEDURE sp_TrangTrai_GetById
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaTrangTrai, MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, NgayTao 
    FROM TrangTrai 
    WHERE MaTrangTrai = @MaTrangTrai;
END
GO

-- Lấy trang trại theo mã nông dân
CREATE OR ALTER PROCEDURE sp_TrangTrai_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaTrangTrai, MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, NgayTao 
    FROM TrangTrai 
    WHERE MaNongDan = @MaNongDan
    ORDER BY NgayTao DESC;
END
GO

-- Tạo trang trại mới
CREATE OR ALTER PROCEDURE sp_TrangTrai_Create
    @MaNongDan INT,
    @TenTrangTrai NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @SoChungNhan NVARCHAR(50) = NULL,
    @MaTrangTrai INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, NgayTao)
    VALUES (@MaNongDan, @TenTrangTrai, @DiaChi, @SoChungNhan, GETDATE());
    SET @MaTrangTrai = SCOPE_IDENTITY();
END
GO

-- Cập nhật trang trại
CREATE OR ALTER PROCEDURE sp_TrangTrai_Update
    @MaTrangTrai INT,
    @TenTrangTrai NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @SoChungNhan NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE TrangTrai
    SET TenTrangTrai = @TenTrangTrai, 
        DiaChi = @DiaChi, 
        SoChungNhan = @SoChungNhan
    WHERE MaTrangTrai = @MaTrangTrai;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Xóa trang trại
CREATE OR ALTER PROCEDURE sp_TrangTrai_Delete
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM TrangTrai WHERE MaTrangTrai = @MaTrangTrai;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- =============================================
-- LO NONG SAN (Lô nông sản)
-- =============================================

-- Lấy tất cả lô nông sản
CREATE OR ALTER PROCEDURE sp_LoNongSan_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai,
           l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
           t.TenTrangTrai, s.TenSanPham
    FROM LoNongSan l
    INNER JOIN TrangTrai t ON l.MaTrangTrai = t.MaTrangTrai
    INNER JOIN SanPham s ON l.MaSanPham = s.MaSanPham
    ORDER BY l.NgayTao DESC;
END
GO

-- Lấy lô nông sản theo ID
CREATE OR ALTER PROCEDURE sp_LoNongSan_GetById
    @MaLo INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai,
           l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
           t.TenTrangTrai, s.TenSanPham
    FROM LoNongSan l
    INNER JOIN TrangTrai t ON l.MaTrangTrai = t.MaTrangTrai
    INNER JOIN SanPham s ON l.MaSanPham = s.MaSanPham
    WHERE l.MaLo = @MaLo;
END
GO

-- Lấy lô nông sản theo trang trại
CREATE OR ALTER PROCEDURE sp_LoNongSan_GetByTrangTrai
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai,
           l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
           t.TenTrangTrai, s.TenSanPham
    FROM LoNongSan l
    INNER JOIN TrangTrai t ON l.MaTrangTrai = t.MaTrangTrai
    INNER JOIN SanPham s ON l.MaSanPham = s.MaSanPham
    WHERE l.MaTrangTrai = @MaTrangTrai
    ORDER BY l.NgayTao DESC;
END
GO

-- Lấy lô nông sản theo nông dân
CREATE OR ALTER PROCEDURE sp_LoNongSan_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai,
           l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
           t.TenTrangTrai, s.TenSanPham
    FROM LoNongSan l
    INNER JOIN TrangTrai t ON l.MaTrangTrai = t.MaTrangTrai
    INNER JOIN SanPham s ON l.MaSanPham = s.MaSanPham
    WHERE t.MaNongDan = @MaNongDan
    ORDER BY l.NgayTao DESC;
END
GO

-- Tạo lô nông sản mới
CREATE OR ALTER PROCEDURE sp_LoNongSan_Create
    @MaTrangTrai INT,
    @MaSanPham INT,
    @SoLuongBanDau DECIMAL(18,2),
    @SoChungNhanLo NVARCHAR(50) = NULL,
    @MaLo INT OUTPUT,
    @MaQR NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET @MaQR = CONCAT('LO-', FORMAT(GETDATE(), 'yyyyMMddHHmmss'), '-', ABS(CHECKSUM(NEWID())) % 9000 + 1000);
    
    INSERT INTO LoNongSan (MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai, SoChungNhanLo, MaQR, TrangThai, NgayTao)
    VALUES (@MaTrangTrai, @MaSanPham, @SoLuongBanDau, @SoLuongBanDau, @SoChungNhanLo, @MaQR, N'tai_trang_trai', GETDATE());
    SET @MaLo = SCOPE_IDENTITY();
END
GO

-- Cập nhật lô nông sản
CREATE OR ALTER PROCEDURE sp_LoNongSan_Update
    @MaLo INT,
    @SoLuongHienTai DECIMAL(18,2) = NULL,
    @SoChungNhanLo NVARCHAR(50) = NULL,
    @TrangThai NVARCHAR(30) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE LoNongSan
    SET SoLuongHienTai = ISNULL(@SoLuongHienTai, SoLuongHienTai),
        SoChungNhanLo = ISNULL(@SoChungNhanLo, SoChungNhanLo),
        TrangThai = ISNULL(@TrangThai, TrangThai)
    WHERE MaLo = @MaLo;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Xóa lô nông sản
CREATE OR ALTER PROCEDURE sp_LoNongSan_Delete
    @MaLo INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM LoNongSan WHERE MaLo = @MaLo;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- =============================================
-- DON HANG DAI LY (Đơn hàng đại lý)
-- =============================================

-- Lấy tất cả đơn hàng đại lý
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT dd.MaDonHang, dd.MaDaiLy, dd.MaNongDan,
           d.LoaiDon, d.NgayDat, d.NgayGiao, d.TrangThai, 
           d.TongSoLuong, d.TongGiaTri, d.GhiChu,
           n.HoTen AS TenNongDan,
           dl.TenDaiLy
    FROM DonHangDaiLy dd
    INNER JOIN DonHang d ON dd.MaDonHang = d.MaDonHang
    LEFT JOIN NongDan n ON dd.MaNongDan = n.MaNongDan
    LEFT JOIN DaiLy dl ON dd.MaDaiLy = dl.MaDaiLy
    ORDER BY d.NgayDat DESC;
END
GO

-- Lấy đơn hàng theo ID
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetById
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT dd.MaDonHang, dd.MaDaiLy, dd.MaNongDan,
           d.LoaiDon, d.NgayDat, d.NgayGiao, d.TrangThai, 
           d.TongSoLuong, d.TongGiaTri, d.GhiChu,
           n.HoTen AS TenNongDan,
           dl.TenDaiLy
    FROM DonHangDaiLy dd
    INNER JOIN DonHang d ON dd.MaDonHang = d.MaDonHang
    LEFT JOIN NongDan n ON dd.MaNongDan = n.MaNongDan
    LEFT JOIN DaiLy dl ON dd.MaDaiLy = dl.MaDaiLy
    WHERE dd.MaDonHang = @MaDonHang;
END
GO

-- Lấy đơn hàng theo nông dân
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT dd.MaDonHang, dd.MaDaiLy, dd.MaNongDan,
           d.LoaiDon, d.NgayDat, d.NgayGiao, d.TrangThai, 
           d.TongSoLuong, d.TongGiaTri, d.GhiChu,
           n.HoTen AS TenNongDan,
           dl.TenDaiLy
    FROM DonHangDaiLy dd
    INNER JOIN DonHang d ON dd.MaDonHang = d.MaDonHang
    LEFT JOIN NongDan n ON dd.MaNongDan = n.MaNongDan
    LEFT JOIN DaiLy dl ON dd.MaDaiLy = dl.MaDaiLy
    WHERE dd.MaNongDan = @MaNongDan
    ORDER BY d.NgayDat DESC;
END
GO

-- Lấy đơn hàng theo đại lý
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetByDaiLy
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT dd.MaDonHang, dd.MaDaiLy, dd.MaNongDan,
           d.LoaiDon, d.NgayDat, d.NgayGiao, d.TrangThai, 
           d.TongSoLuong, d.TongGiaTri, d.GhiChu,
           n.HoTen AS TenNongDan,
           dl.TenDaiLy
    FROM DonHangDaiLy dd
    INNER JOIN DonHang d ON dd.MaDonHang = d.MaDonHang
    LEFT JOIN NongDan n ON dd.MaNongDan = n.MaNongDan
    LEFT JOIN DaiLy dl ON dd.MaDaiLy = dl.MaDaiLy
    WHERE dd.MaDaiLy = @MaDaiLy
    ORDER BY d.NgayDat DESC;
END
GO

-- Tạo đơn hàng đại lý mới
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_Create
    @MaDaiLy INT,
    @MaNongDan INT,
    @LoaiDon NVARCHAR(50) = N'dai_ly',
    @NgayGiao DATETIME = NULL,
    @TongSoLuong DECIMAL(18,2) = NULL,
    @TongGiaTri DECIMAL(18,2) = NULL,
    @GhiChu NVARCHAR(255) = NULL,
    @MaDonHang INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Tạo DonHang
        INSERT INTO DonHang (LoaiDon, NgayDat, NgayGiao, TrangThai, TongSoLuong, TongGiaTri, GhiChu)
        VALUES (@LoaiDon, GETDATE(), @NgayGiao, N'cho_xu_ly', @TongSoLuong, @TongGiaTri, @GhiChu);
        SET @MaDonHang = SCOPE_IDENTITY();
        
        -- Tạo DonHangDaiLy
        INSERT INTO DonHangDaiLy (MaDonHang, MaDaiLy, MaNongDan)
        VALUES (@MaDonHang, @MaDaiLy, @MaNongDan);
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Cập nhật trạng thái đơn hàng
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_UpdateTrangThai
    @MaDonHang INT,
    @TrangThai NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE DonHang SET TrangThai = @TrangThai WHERE MaDonHang = @MaDonHang;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Xóa đơn hàng đại lý
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_Delete
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DELETE FROM DonHangDaiLy WHERE MaDonHang = @MaDonHang;
        DELETE FROM DonHang WHERE MaDonHang = @MaDonHang;
        
        COMMIT TRANSACTION;
        SELECT @@ROWCOUNT AS RowsAffected;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
