-- ============================================================================
-- FIX: SỬA TẤT CẢ STORED PROCEDURES UPDATE & DELETE
-- Lỗi: "Unable to cast object of type 'System.String' to type 'System.Int32'"
-- Nguyên nhân: SP trả về 'SUCCESS'/'ERROR' (NVARCHAR) nhưng C# đọc GetInt32()
-- Giải pháp: Sửa SP trả về @@ROWCOUNT (INT) hoặc 1/0 AS RowsAffected
-- ============================================================================

USE BTL_HDV1;
GO

PRINT '========================================'
PRINT 'BẮT ĐẦU SỬA LỖI THÔNG BÁO UPDATE/DELETE'
PRINT '========================================'
GO

-- ============================================================================
-- 1. sp_NongDan_Update - C# dùng reader.GetInt32(0)
-- ============================================================================
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
    SET 
        HoTen = ISNULL(@HoTen, HoTen),
        SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
        Email = ISNULL(@Email, Email),
        DiaChi = ISNULL(@DiaChi, DiaChi)
    WHERE MaNongDan = @MaNongDan;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_NongDan_Update'
GO

-- ============================================================================
-- 2. sp_NongDan_Delete - C# dùng reader.GetInt32(0)
-- ============================================================================
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
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        UPDATE TrangTrai SET TrangThai = 'da_xoa' WHERE MaNongDan = @MaNongDan;
        UPDATE NongDan SET TrangThai = 'da_xoa' WHERE MaNongDan = @MaNongDan;
        UPDATE TaiKhoan SET TrangThai = 'da_xoa' WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END;
GO
PRINT '✓ sp_NongDan_Delete'
GO

-- ============================================================================
-- 3. sp_DaiLy_Update - C# dùng ExecuteNonQuery() > 0
-- Cần SET NOCOUNT OFF để ExecuteNonQuery trả về row count
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_DaiLy_Update
    @MaDaiLy INT,
    @TenDaiLy NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT OFF;
    UPDATE DaiLy
    SET 
        TenDaiLy = ISNULL(@TenDaiLy, TenDaiLy),
        SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
        Email = ISNULL(@Email, Email),
        DiaChi = ISNULL(@DiaChi, DiaChi)
    WHERE MaDaiLy = @MaDaiLy;
END;
GO
PRINT '✓ sp_DaiLy_Update'
GO

-- ============================================================================
-- 4. sp_DaiLy_Delete - C# dùng reader["RowsAffected"] cast INT
-- ============================================================================
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
        
        UPDATE Kho SET TrangThai = 'da_xoa' WHERE MaDaiLy = @MaDaiLy;
        UPDATE DaiLy SET TrangThai = 'da_xoa' WHERE MaDaiLy = @MaDaiLy;
        UPDATE TaiKhoan SET TrangThai = 'da_xoa' WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END;
GO
PRINT '✓ sp_DaiLy_Delete'
GO

-- ============================================================================
-- 5. sp_SieuThi_Update - C# dùng ExecuteNonQuery (trong SieuThiService)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_SieuThi_Update
    @MaSieuThi INT,
    @TenSieuThi NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT OFF;
    UPDATE SieuThi
    SET 
        TenSieuThi = ISNULL(@TenSieuThi, TenSieuThi),
        SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
        Email = ISNULL(@Email, Email),
        DiaChi = ISNULL(@DiaChi, DiaChi)
    WHERE MaSieuThi = @MaSieuThi;
END;
GO
PRINT '✓ sp_SieuThi_Update'
GO

-- ============================================================================
-- 6. sp_SieuThi_Delete - C# dùng reader, cần RowsAffected INT
-- ============================================================================
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
        
        UPDATE Kho SET TrangThai = 'da_xoa' WHERE MaSieuThi = @MaSieuThi;
        UPDATE SieuThi SET TrangThai = 'da_xoa' WHERE MaSieuThi = @MaSieuThi;
        UPDATE TaiKhoan SET TrangThai = 'da_xoa' WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END;
GO
PRINT '✓ sp_SieuThi_Delete'
GO

-- ============================================================================
-- 7. sp_TrangTrai_Update - C# dùng reader.GetInt32(0)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_TrangTrai_Update
    @MaTrangTrai INT,
    @TenTrangTrai NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL,
    @SoChungNhan NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE TrangTrai
    SET 
        TenTrangTrai = ISNULL(@TenTrangTrai, TenTrangTrai),
        DiaChi = ISNULL(@DiaChi, DiaChi),
        SoChungNhan = ISNULL(@SoChungNhan, SoChungNhan)
    WHERE MaTrangTrai = @MaTrangTrai;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_TrangTrai_Update'
GO

-- ============================================================================
-- 8. sp_TrangTrai_Delete - C# dùng reader.GetInt32(0)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_TrangTrai_Delete
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE TrangTrai SET TrangThai = 'da_xoa' WHERE MaTrangTrai = @MaTrangTrai;
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_TrangTrai_Delete'
GO

-- ============================================================================
-- 9. sp_SanPham_Update - C# dùng reader.GetInt32(0)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_SanPham_Update
    @MaSanPham INT,
    @TenSanPham NVARCHAR(100) = NULL,
    @DonViTinh NVARCHAR(20) = NULL,
    @MoTa NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE SanPham
    SET 
        TenSanPham = ISNULL(@TenSanPham, TenSanPham),
        DonViTinh = ISNULL(@DonViTinh, DonViTinh),
        MoTa = ISNULL(@MoTa, MoTa)
    WHERE MaSanPham = @MaSanPham;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_SanPham_Update'
GO

-- ============================================================================
-- 10. sp_SanPham_Delete - C# dùng reader.GetInt32(0)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_SanPham_Delete
    @MaSanPham INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE SanPham SET TrangThai = 'da_xoa' WHERE MaSanPham = @MaSanPham;
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_SanPham_Delete'
GO

-- ============================================================================
-- 11. sp_LoNongSan_Update - C# dùng reader.GetInt32(0)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_LoNongSan_Update
    @MaLo INT,
    @SoLuongHienTai DECIMAL(18,2) = NULL,
    @NgayThuHoach DATE = NULL,
    @HanSuDung DATE = NULL,
    @SoChungNhanLo NVARCHAR(50) = NULL,
    @TrangThai NVARCHAR(30) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE LoNongSan
    SET 
        SoLuongHienTai = ISNULL(@SoLuongHienTai, SoLuongHienTai),
        NgayThuHoach = ISNULL(@NgayThuHoach, NgayThuHoach),
        HanSuDung = ISNULL(@HanSuDung, HanSuDung),
        SoChungNhanLo = ISNULL(@SoChungNhanLo, SoChungNhanLo),
        TrangThai = ISNULL(@TrangThai, TrangThai)
    WHERE MaLo = @MaLo;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_LoNongSan_Update'
GO

-- ============================================================================
-- 12. sp_LoNongSan_Delete - C# dùng reader.GetInt32(0)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_LoNongSan_Delete
    @MaLo INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE LoNongSan SET TrangThai = 'da_xoa' WHERE MaLo = @MaLo;
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_LoNongSan_Delete'
GO

-- ============================================================================
-- 13. sp_Kho_Update - C# dùng ExecuteNonQuery() > 0
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Kho_Update
    @MaKho INT,
    @TenKho NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @TrangThai NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT OFF;
    UPDATE Kho
    SET 
        TenKho = @TenKho,
        DiaChi = @DiaChi,
        TrangThai = @TrangThai
    WHERE MaKho = @MaKho;
END;
GO
PRINT '✓ sp_Kho_Update'
GO

-- ============================================================================
-- 14. sp_Kho_Delete - C# dùng ExecuteNonQuery() > 0
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Kho_Delete
    @MaKho INT
AS
BEGIN
    SET NOCOUNT OFF;
    UPDATE Kho SET TrangThai = 'da_xoa' WHERE MaKho = @MaKho;
END;
GO
PRINT '✓ sp_Kho_Delete'
GO

-- ============================================================================
-- 15. sp_KiemDinh_Update - C# có thể dùng reader
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_KiemDinh_Update
    @MaKiemDinh INT,
    @KetQua NVARCHAR(20) = NULL,
    @TrangThai NVARCHAR(20) = NULL,
    @BienBan NVARCHAR(MAX) = NULL,
    @ChuKySo NVARCHAR(255) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE KiemDinh
    SET 
        KetQua = ISNULL(@KetQua, KetQua),
        TrangThai = ISNULL(@TrangThai, TrangThai),
        BienBan = ISNULL(@BienBan, BienBan),
        ChuKySo = ISNULL(@ChuKySo, ChuKySo),
        GhiChu = ISNULL(@GhiChu, GhiChu)
    WHERE MaKiemDinh = @MaKiemDinh;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_KiemDinh_Update'
GO

-- ============================================================================
-- 16. sp_KiemDinh_Delete
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_KiemDinh_Delete
    @MaKiemDinh INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE KiemDinh SET TrangThai = 'da_xoa' WHERE MaKiemDinh = @MaKiemDinh;
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_KiemDinh_Delete'
GO

-- ============================================================================
-- 17. sp_DonHang_Update
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_DonHang_Update
    @MaDonHang INT,
    @TrangThai NVARCHAR(30) = NULL,
    @NgayGiao DATETIME2 = NULL,
    @TongSoLuong DECIMAL(18,2) = NULL,
    @TongGiaTri DECIMAL(18,2) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE DonHang
    SET 
        TrangThai = ISNULL(@TrangThai, TrangThai),
        NgayGiao = ISNULL(@NgayGiao, NgayGiao),
        TongSoLuong = ISNULL(@TongSoLuong, TongSoLuong),
        TongGiaTri = ISNULL(@TongGiaTri, TongGiaTri),
        GhiChu = ISNULL(@GhiChu, GhiChu)
    WHERE MaDonHang = @MaDonHang;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_DonHang_Update'
GO

-- ============================================================================
-- 18. sp_DonHang_Delete
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_DonHang_Delete
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM DonHang WHERE MaDonHang = @MaDonHang;
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_DonHang_Delete'
GO

-- ============================================================================
-- 19. sp_Admin_UpdateDaiLy - C# dùng reader.GetInt32("RowsAffected")
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Admin_UpdateDaiLy
    @MaDaiLy INT,
    @TenDaiLy NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE DaiLy
    SET 
        TenDaiLy = ISNULL(@TenDaiLy, TenDaiLy),
        DiaChi = ISNULL(@DiaChi, DiaChi),
        SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
        Email = ISNULL(@Email, Email)
    WHERE MaDaiLy = @MaDaiLy;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_Admin_UpdateDaiLy'
GO

-- ============================================================================
-- 20. sp_Admin_DeleteDaiLy - C# dùng reader.GetInt32("RowsAffected")
-- ============================================================================
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
        
        UPDATE Kho SET TrangThai = 'da_xoa' WHERE MaDaiLy = @MaDaiLy;
        UPDATE DaiLy SET TrangThai = 'da_xoa' WHERE MaDaiLy = @MaDaiLy;
        UPDATE TaiKhoan SET TrangThai = 'da_xoa' WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END;
GO
PRINT '✓ sp_Admin_DeleteDaiLy'
GO

-- ============================================================================
-- 21. sp_Admin_UpdateSieuThi - C# dùng reader.GetInt32("RowsAffected")
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Admin_UpdateSieuThi
    @MaSieuThi INT,
    @TenSieuThi NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE SieuThi
    SET 
        TenSieuThi = ISNULL(@TenSieuThi, TenSieuThi),
        DiaChi = ISNULL(@DiaChi, DiaChi),
        SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
        Email = ISNULL(@Email, Email)
    WHERE MaSieuThi = @MaSieuThi;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
PRINT '✓ sp_Admin_UpdateSieuThi'
GO

-- ============================================================================
-- 22. sp_Admin_DeleteSieuThi - C# dùng reader.GetInt32("RowsAffected")
-- ============================================================================
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
        
        UPDATE Kho SET TrangThai = 'da_xoa' WHERE MaSieuThi = @MaSieuThi;
        UPDATE SieuThi SET TrangThai = 'da_xoa' WHERE MaSieuThi = @MaSieuThi;
        UPDATE TaiKhoan SET TrangThai = 'da_xoa' WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END;
GO
PRINT '✓ sp_Admin_DeleteSieuThi'
GO

-- ============================================================================
-- 23. sp_Admin_DeleteNongDan
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Admin_DeleteNongDan
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
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        UPDATE TrangTrai SET TrangThai = 'da_xoa' WHERE MaNongDan = @MaNongDan;
        UPDATE NongDan SET TrangThai = 'da_xoa' WHERE MaNongDan = @MaNongDan;
        UPDATE TaiKhoan SET TrangThai = 'da_xoa' WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END;
GO
PRINT '✓ sp_Admin_DeleteNongDan'
GO

PRINT ''
PRINT '========================================'
PRINT 'HOÀN THÀNH SỬA LỖI!'
PRINT '========================================'
PRINT ''
PRINT 'Đã sửa 23 stored procedures:'
PRINT '- Tất cả UPDATE/DELETE procedures giờ trả về INT (@@ROWCOUNT)'
PRINT '- Thay thế SELECT ''SUCCESS'' AS Status (NVARCHAR) bằng SELECT @@ROWCOUNT AS RowsAffected (INT)'
PRINT '- Không còn lỗi: Unable to cast System.String to System.Int32'
PRINT ''
GO
