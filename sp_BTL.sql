-- ============================================================================
-- STORED PROCEDURES FOR TAIKHOAN TABLE
-- ============================================================================



-- SP GET ALL
CREATE OR ALTER PROCEDURE sp_TaiKhoan_GetAll
AS
BEGIN
    SELECT 
        MaTaiKhoan,
        TenDangNhap,
        LoaiTaiKhoan,
        TrangThai,
        NgayTao,
        LanDangNhapCuoi
    FROM TaiKhoan
    ORDER BY MaTaiKhoan DESC;
END;
GO

-- SP GET BY ID
CREATE OR ALTER PROCEDURE sp_TaiKhoan_GetById
    @MaTaiKhoan INT
AS
BEGIN
    SELECT 
        MaTaiKhoan,
        TenDangNhap,
        LoaiTaiKhoan,
        TrangThai,
        NgayTao,
        LanDangNhapCuoi
    FROM TaiKhoan
    WHERE MaTaiKhoan = @MaTaiKhoan;
END;
GO

-- SP CREATE
CREATE OR ALTER PROCEDURE sp_TaiKhoan_Create
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255),
    @LoaiTaiKhoan NVARCHAR(20),
    @TrangThai NVARCHAR(20) = N'hoat_dong',
    @MaTaiKhoan INT OUTPUT
AS
BEGIN
    BEGIN TRY
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, @LoaiTaiKhoan, @TrangThai);
        
        SET @MaTaiKhoan = SCOPE_IDENTITY();
        
        SELECT 'SUCCESS' AS Status, @MaTaiKhoan AS MaTaiKhoan;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP UPDATE
CREATE OR ALTER PROCEDURE sp_TaiKhoan_Update
    @MaTaiKhoan INT,
    @MatKhau NVARCHAR(255) = NULL,
    @TrangThai NVARCHAR(20) = NULL,
    @LanDangNhapCuoi DATETIME2 = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE TaiKhoan
        SET 
            MatKhau = ISNULL(@MatKhau, MatKhau),
            TrangThai = ISNULL(@TrangThai, TrangThai),
            LanDangNhapCuoi = ISNULL(@LanDangNhapCuoi, LanDangNhapCuoi)
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        SELECT 'SUCCESS' AS Status, 'Cập nhật thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP DELETE
CREATE OR ALTER PROCEDURE sp_TaiKhoan_Delete
    @MaTaiKhoan INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM TaiKhoan WHERE MaTaiKhoan = @MaTaiKhoan;
        SELECT 'SUCCESS' AS Status, 'Xóa thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP SEARCH
CREATE OR ALTER PROCEDURE sp_TaiKhoan_Search
    @TenDangNhap NVARCHAR(50) = NULL,
    @LoaiTaiKhoan NVARCHAR(20) = NULL,
    @TrangThai NVARCHAR(20) = NULL
AS
BEGIN
    SELECT 
        MaTaiKhoan,
        TenDangNhap,
        LoaiTaiKhoan,
        TrangThai,
        NgayTao,
        LanDangNhapCuoi
    FROM TaiKhoan
    WHERE 
        (@TenDangNhap IS NULL OR TenDangNhap LIKE '%' + @TenDangNhap + '%')
        AND (@LoaiTaiKhoan IS NULL OR LoaiTaiKhoan = @LoaiTaiKhoan)
        AND (@TrangThai IS NULL OR TrangThai = @TrangThai)
    ORDER BY MaTaiKhoan DESC;
END;
GO





-- ============================================================================
-- STORED PROCEDURES FOR NONGDAN TABLE
-- ============================================================================


-- SP GET ALL
CREATE OR ALTER PROCEDURE sp_NongDan_GetAll
AS
BEGIN
    SELECT 
        ND.MaNongDan,
        ND.MaTaiKhoan,
        ND.HoTen,
        ND.SoDienThoai,
        ND.Email,
        ND.DiaChi,
        TK.TenDangNhap,
        TK.TrangThai
    FROM NongDan ND
    JOIN TaiKhoan TK ON ND.MaTaiKhoan = TK.MaTaiKhoan
    WHERE TK.TrangThai = N'hoat_dong'
    ORDER BY ND.MaNongDan DESC;
END;
GO

-- SP GET BY ID
CREATE OR ALTER PROCEDURE sp_NongDan_GetById
    @MaNongDan INT
AS
BEGIN
    SELECT 
        ND.MaNongDan,
        ND.MaTaiKhoan,
        ND.HoTen,
        ND.SoDienThoai,
        ND.Email,
        ND.DiaChi,
        TK.TenDangNhap,
        TK.TrangThai
    FROM NongDan ND
    JOIN TaiKhoan TK ON ND.MaTaiKhoan = TK.MaTaiKhoan
    WHERE ND.MaNongDan = @MaNongDan;
END;
GO

-- SP CREATE
CREATE OR ALTER PROCEDURE sp_NongDan_Create
    @TenDangNhap NVARCHAR(50),
    @MatKhau NVARCHAR(255),
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @MaNongDan INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Kiểm tra tên đăng nhập đã tồn tại chưa
        IF EXISTS (SELECT 1 FROM TaiKhoan WHERE TenDangNhap = @TenDangNhap)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 'ERROR' AS Status, N'Tên đăng nhập đã tồn tại' AS Message;
            RETURN;
        END
        
        -- Tạo tài khoản mới
        DECLARE @MaTaiKhoan INT;
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, 'nongdan', N'hoat_dong');
        
        SET @MaTaiKhoan = SCOPE_IDENTITY();
        
        -- Tạo nông dân
        INSERT INTO NongDan (MaTaiKhoan, HoTen, SoDienThoai, Email, DiaChi)
        VALUES (@MaTaiKhoan, @HoTen, @SoDienThoai, @Email, @DiaChi);
        
        SET @MaNongDan = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        SELECT 'SUCCESS' AS Status, @MaNongDan AS MaNongDan;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP UPDATE
CREATE OR ALTER PROCEDURE sp_NongDan_Update
    @MaNongDan INT,
    @HoTen NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE NongDan
        SET 
            HoTen = ISNULL(@HoTen, HoTen),
            SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
            Email = ISNULL(@Email, Email),
            DiaChi = ISNULL(@DiaChi, DiaChi)
        WHERE MaNongDan = @MaNongDan;
        
        SELECT 'SUCCESS' AS Status, 'Cập nhật thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP DELETE (Soft Delete)
CREATE OR ALTER PROCEDURE sp_NongDan_Delete
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy MaTaiKhoan
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM NongDan WHERE MaNongDan = @MaNongDan;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR(N'Không tìm thấy nông dân', 16, 1);
            RETURN;
        END
        
        -- Đánh dấu tài khoản là đã xóa (Soft Delete)
        UPDATE TaiKhoan 
        SET TrangThai = N'da_xoa'
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP SEARCH
CREATE OR ALTER PROCEDURE sp_NongDan_Search
    @HoTen NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    SELECT 
        ND.MaNongDan,
        ND.MaTaiKhoan,
        ND.HoTen,
        ND.SoDienThoai,
        ND.Email,
        ND.DiaChi,
        TK.TenDangNhap,
        TK.TrangThai
    FROM NongDan ND
    JOIN TaiKhoan TK ON ND.MaTaiKhoan = TK.MaTaiKhoan
    WHERE 
        (@HoTen IS NULL OR ND.HoTen LIKE '%' + @HoTen + '%')
        AND (@SoDienThoai IS NULL OR ND.SoDienThoai LIKE '%' + @SoDienThoai + '%')
        AND (@Email IS NULL OR ND.Email LIKE '%' + @Email + '%')
        AND (@DiaChi IS NULL OR ND.DiaChi LIKE '%' + @DiaChi + '%')
    ORDER BY ND.MaNongDan DESC;
END;
GO


-- ============================================================================
-- STORED PROCEDURES FOR DAILY TABLE
-- ============================================================================



-- SP GET ALL
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
        TK.TenDangNhap,
        TK.TrangThai
    FROM DaiLy DL
    JOIN TaiKhoan TK ON DL.MaTaiKhoan = TK.MaTaiKhoan
    WHERE TK.TrangThai = N'hoat_dong'
    ORDER BY DL.MaDaiLy DESC;
END;
GO

-- SP GET BY ID
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
        TK.TenDangNhap,
        TK.TrangThai
    FROM DaiLy DL
    JOIN TaiKhoan TK ON DL.MaTaiKhoan = TK.MaTaiKhoan
    WHERE DL.MaDaiLy = @MaDaiLy;
END;
GO

-- SP CREATE
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
        
        -- Kiểm tra tên đăng nhập đã tồn tại chưa
        IF EXISTS (SELECT 1 FROM TaiKhoan WHERE TenDangNhap = @TenDangNhap)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 'ERROR' AS Status, N'Tên đăng nhập đã tồn tại' AS Message;
            RETURN;
        END
        
        -- Tạo tài khoản mới
        DECLARE @MaTaiKhoan INT;
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, 'daily', N'hoat_dong');
        
        SET @MaTaiKhoan = SCOPE_IDENTITY();
        
        -- Tạo đại lý
        INSERT INTO DaiLy (MaTaiKhoan, TenDaiLy, SoDienThoai, Email, DiaChi)
        VALUES (@MaTaiKhoan, @TenDaiLy, @SoDienThoai, @Email, @DiaChi);
        
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

-- SP UPDATE
CREATE OR ALTER PROCEDURE sp_DaiLy_Update
    @MaDaiLy INT,
    @TenDaiLy NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE DaiLy
        SET 
            TenDaiLy = ISNULL(@TenDaiLy, TenDaiLy),
            SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
            Email = ISNULL(@Email, Email),
            DiaChi = ISNULL(@DiaChi, DiaChi)
        WHERE MaDaiLy = @MaDaiLy;
        
        SELECT 'SUCCESS' AS Status, 'Cập nhật thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP DELETE (Soft Delete)
CREATE OR ALTER PROCEDURE sp_DaiLy_Delete
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy MaTaiKhoan
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM DaiLy WHERE MaDaiLy = @MaDaiLy;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR(N'Không tìm thấy đại lý', 16, 1);
            RETURN;
        END
        
        -- Đánh dấu tài khoản là đã xóa (Soft Delete)
        UPDATE TaiKhoan 
        SET TrangThai = N'da_xoa'
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP SEARCH
CREATE OR ALTER PROCEDURE sp_DaiLy_Search
    @TenDaiLy NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL
AS
BEGIN
    SELECT 
        DL.MaDaiLy,
        DL.MaTaiKhoan,
        DL.TenDaiLy,
        DL.SoDienThoai,
        DL.Email,
        DL.DiaChi,
        TK.TenDangNhap,
        TK.TrangThai
    FROM DaiLy DL
    JOIN TaiKhoan TK ON DL.MaTaiKhoan = TK.MaTaiKhoan
    WHERE 
        (@TenDaiLy IS NULL OR DL.TenDaiLy LIKE '%' + @TenDaiLy + '%')
        AND (@SoDienThoai IS NULL OR DL.SoDienThoai LIKE '%' + @SoDienThoai + '%')
        AND (@Email IS NULL OR DL.Email LIKE '%' + @Email + '%')
        AND (@DiaChi IS NULL OR DL.DiaChi LIKE '%' + @DiaChi + '%')
    ORDER BY DL.MaDaiLy DESC;
END;
GO

-- ============================================================================
-- STORED PROCEDURES FOR SANPHAM TABLE
-- ============================================================================


-- SP GET ALL
CREATE OR ALTER PROCEDURE sp_SanPham_GetAll
AS
BEGIN
    SELECT 
        MaSanPham,
        TenSanPham,
        DonViTinh,
        MoTa,
        NgayTao
    FROM SanPham
    ORDER BY MaSanPham DESC;
END;
GO

-- SP GET BY ID
CREATE OR ALTER PROCEDURE sp_SanPham_GetById
    @MaSanPham INT
AS
BEGIN
    SELECT 
        MaSanPham,
        TenSanPham,
        DonViTinh,
        MoTa,
        NgayTao
    FROM SanPham
    WHERE MaSanPham = @MaSanPham;
END;
GO

-- SP CREATE
CREATE OR ALTER PROCEDURE sp_SanPham_Create
    @TenSanPham NVARCHAR(100),
    @DonViTinh NVARCHAR(20),
    @MoTa NVARCHAR(255) = NULL,
    @MaSanPham INT OUTPUT
AS
BEGIN
    BEGIN TRY
        INSERT INTO SanPham (TenSanPham, DonViTinh, MoTa)
        VALUES (@TenSanPham, @DonViTinh, @MoTa);
        
        SET @MaSanPham = SCOPE_IDENTITY();
        SELECT 'SUCCESS' AS Status, @MaSanPham AS MaSanPham;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP UPDATE
CREATE OR ALTER PROCEDURE sp_SanPham_Update
    @MaSanPham INT,
    @TenSanPham NVARCHAR(100) = NULL,
    @DonViTinh NVARCHAR(20) = NULL,
    @MoTa NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE SanPham
        SET 
            TenSanPham = ISNULL(@TenSanPham, TenSanPham),
            DonViTinh = ISNULL(@DonViTinh, DonViTinh),
            MoTa = ISNULL(@MoTa, MoTa)
        WHERE MaSanPham = @MaSanPham;
        
        SELECT 'SUCCESS' AS Status, 'Cập nhật thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP DELETE
CREATE OR ALTER PROCEDURE sp_SanPham_Delete
    @MaSanPham INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM SanPham WHERE MaSanPham = @MaSanPham;
        SELECT 'SUCCESS' AS Status, 'Xóa thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP SEARCH
CREATE OR ALTER PROCEDURE sp_SanPham_Search
    @TenSanPham NVARCHAR(100) = NULL,
    @DonViTinh NVARCHAR(20) = NULL
AS
BEGIN
    SELECT 
        MaSanPham,
        TenSanPham,
        DonViTinh,
        MoTa,
        NgayTao
    FROM SanPham
    WHERE 
        (@TenSanPham IS NULL OR TenSanPham LIKE '%' + @TenSanPham + '%')
        AND (@DonViTinh IS NULL OR DonViTinh = @DonViTinh)
    ORDER BY MaSanPham DESC;
END;
GO

-- ============================================================================
-- STORED PROCEDURES FOR LONONGSAN TABLE
-- ============================================================================



-- SP GET ALL
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
        TT.TenTrangTrai,
        SP.TenSanPham,
        SP.DonViTinh
    FROM LoNongSan LNS
    JOIN TrangTrai TT ON LNS.MaTrangTrai = TT.MaTrangTrai
    JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    ORDER BY LNS.MaLo DESC;
END;
GO

-- SP GET BY ID
CREATE OR ALTER PROCEDURE sp_LoNongSan_GetById
    @MaLo INT
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
        TT.TenTrangTrai,
        SP.TenSanPham,
        SP.DonViTinh
    FROM LoNongSan LNS
    JOIN TrangTrai TT ON LNS.MaTrangTrai = TT.MaTrangTrai
    JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    WHERE LNS.MaLo = @MaLo;
END;
GO

-- SP CREATE
CREATE OR ALTER PROCEDURE sp_LoNongSan_Create
    @MaTrangTrai INT,
    @MaSanPham INT,
    @SoLuongBanDau DECIMAL(18,2),
    @NgayThuHoach DATE = NULL,
    @HanSuDung DATE = NULL,
    @SoChungNhanLo NVARCHAR(50) = NULL,
    @MaQR NVARCHAR(255) OUTPUT,
    @MaLo INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Tạo mã QR tự động
        SET @MaQR = 'QR-' + CAST(NEWID() AS NVARCHAR(50));
        
        INSERT INTO LoNongSan (MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai, NgayThuHoach, HanSuDung, SoChungNhanLo, MaQR, TrangThai, NgayTao)
        VALUES (@MaTrangTrai, @MaSanPham, @SoLuongBanDau, @SoLuongBanDau, @NgayThuHoach, @HanSuDung, @SoChungNhanLo, @MaQR, N'tai_trang_trai', GETDATE());
        
        SET @MaLo = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- SP UPDATE
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
    BEGIN TRY
        UPDATE LoNongSan
        SET 
            SoLuongHienTai = ISNULL(@SoLuongHienTai, SoLuongHienTai),
            NgayThuHoach = ISNULL(@NgayThuHoach, NgayThuHoach),
            HanSuDung = ISNULL(@HanSuDung, HanSuDung),
            SoChungNhanLo = ISNULL(@SoChungNhanLo, SoChungNhanLo),
            TrangThai = ISNULL(@TrangThai, TrangThai)
        WHERE MaLo = @MaLo;
        
        SELECT @@ROWCOUNT AS RowsAffected;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- SP DELETE
CREATE OR ALTER PROCEDURE sp_LoNongSan_Delete
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM LoNongSan WHERE MaLo = @MaLo;
        SELECT 'SUCCESS' AS Status, 'Xóa thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP SEARCH
CREATE OR ALTER PROCEDURE sp_LoNongSan_Search
    @MaTrangTrai INT = NULL,
    @MaSanPham INT = NULL,
    @TrangThai NVARCHAR(30) = NULL,
    @MaQR NVARCHAR(255) = NULL
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
        TT.TenTrangTrai,
        SP.TenSanPham,
        SP.DonViTinh
    FROM LoNongSan LNS
    JOIN TrangTrai TT ON LNS.MaTrangTrai = TT.MaTrangTrai
    JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    WHERE 
        (@MaTrangTrai IS NULL OR LNS.MaTrangTrai = @MaTrangTrai)
        AND (@MaSanPham IS NULL OR LNS.MaSanPham = @MaSanPham)
        AND (@TrangThai IS NULL OR LNS.TrangThai = @TrangThai)
        AND (@MaQR IS NULL OR LNS.MaQR LIKE '%' + @MaQR + '%')
    ORDER BY LNS.MaLo DESC;
END;
GO

-- SP GET BY NONG DAN
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
        TT.TenTrangTrai,
        SP.TenSanPham,
        SP.DonViTinh
    FROM LoNongSan LNS
    JOIN TrangTrai TT ON LNS.MaTrangTrai = TT.MaTrangTrai
    JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    JOIN NongDan ND ON TT.MaNongDan = ND.MaNongDan
    WHERE ND.MaNongDan = @MaNongDan
    ORDER BY LNS.MaLo DESC;
END;
GO

-- ============================================================================
-- STORED PROCEDURES FOR DONHANG TABLE
-- ============================================================================



-- SP GET ALL
CREATE OR ALTER PROCEDURE sp_DonHang_GetAll
AS
BEGIN
    SELECT 
        MaDonHang,
        LoaiDon,
        NgayDat,
        NgayGiao,
        TrangThai,
        TongSoLuong,
        TongGiaTri,
        GhiChu
    FROM DonHang
    ORDER BY MaDonHang DESC;
END;
GO

-- SP GET BY ID
CREATE OR ALTER PROCEDURE sp_DonHang_GetById
    @MaDonHang INT
AS
BEGIN
    SELECT 
        MaDonHang,
        LoaiDon,
        NgayDat,
        NgayGiao,
        TrangThai,
        TongSoLuong,
        TongGiaTri,
        GhiChu
    FROM DonHang
    WHERE MaDonHang = @MaDonHang;
END;
GO

-- SP CREATE
CREATE OR ALTER PROCEDURE sp_DonHang_Create
    @LoaiDon NVARCHAR(30),
    @GhiChu NVARCHAR(255) = NULL,
    @MaDonHang INT OUTPUT
AS
BEGIN
    BEGIN TRY
        INSERT INTO DonHang (LoaiDon, TrangThai, GhiChu)
        VALUES (@LoaiDon, N'chua_nhan', @GhiChu);
        
        SET @MaDonHang = SCOPE_IDENTITY();
        SELECT 'SUCCESS' AS Status, @MaDonHang AS MaDonHang;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP UPDATE
CREATE OR ALTER PROCEDURE sp_DonHang_Update
    @MaDonHang INT,
    @TrangThai NVARCHAR(30) = NULL,
    @NgayGiao DATETIME2 = NULL,
    @TongSoLuong DECIMAL(18,2) = NULL,
    @TongGiaTri DECIMAL(18,2) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE DonHang
        SET 
            TrangThai = ISNULL(@TrangThai, TrangThai),
            NgayGiao = ISNULL(@NgayGiao, NgayGiao),
            TongSoLuong = ISNULL(@TongSoLuong, TongSoLuong),
            TongGiaTri = ISNULL(@TongGiaTri, TongGiaTri),
            GhiChu = ISNULL(@GhiChu, GhiChu)
        WHERE MaDonHang = @MaDonHang;
        
        SELECT 'SUCCESS' AS Status, 'Cập nhật thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP DELETE
CREATE OR ALTER PROCEDURE sp_DonHang_Delete
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM DonHang WHERE MaDonHang = @MaDonHang;
        SELECT 'SUCCESS' AS Status, 'Xóa thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP SEARCH
CREATE OR ALTER PROCEDURE sp_DonHang_Search
    @LoaiDon NVARCHAR(30) = NULL,
    @TrangThai NVARCHAR(30) = NULL,
    @TuNgay DATETIME2 = NULL,
    @DenNgay DATETIME2 = NULL
AS
BEGIN
    SELECT 
        MaDonHang,
        LoaiDon,
        NgayDat,
        NgayGiao,
        TrangThai,
        TongSoLuong,
        TongGiaTri,
        GhiChu
    FROM DonHang
    WHERE 
        (@LoaiDon IS NULL OR LoaiDon = @LoaiDon)
        AND (@TrangThai IS NULL OR TrangThai = @TrangThai)
        AND (@TuNgay IS NULL OR NgayDat >= @TuNgay)
        AND (@DenNgay IS NULL OR NgayDat <= @DenNgay)
    ORDER BY MaDonHang DESC;
END;
GO

-- ============================================================================
-- STORED PROCEDURES FOR KIEMDINH TABLE
-- ============================================================================



-- SP GET ALL
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
    ORDER BY KD.MaKiemDinh DESC;
END;
GO

-- SP GET BY ID
CREATE OR ALTER PROCEDURE sp_KiemDinh_GetById
    @MaKiemDinh INT
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
    WHERE KD.MaKiemDinh = @MaKiemDinh;
END;
GO

-- SP CREATE
CREATE OR ALTER PROCEDURE sp_KiemDinh_Create
    @MaLo INT,
    @NguoiKiemDinh NVARCHAR(100),
    @MaDaiLy INT = NULL,
    @MaSieuThi INT = NULL,
    @KetQua NVARCHAR(20),
    @BienBan NVARCHAR(MAX) = NULL,
    @GhiChu NVARCHAR(255) = NULL,
    @MaKiemDinh INT OUTPUT
AS
BEGIN
    BEGIN TRY
        INSERT INTO KiemDinh (MaLo, NguoiKiemDinh, MaDaiLy, MaSieuThi, KetQua, BienBan, GhiChu)
        VALUES (@MaLo, @NguoiKiemDinh, @MaDaiLy, @MaSieuThi, @KetQua, @BienBan, @GhiChu);
        
        SET @MaKiemDinh = SCOPE_IDENTITY();
        SELECT 'SUCCESS' AS Status, @MaKiemDinh AS MaKiemDinh;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP UPDATE
CREATE OR ALTER PROCEDURE sp_KiemDinh_Update
    @MaKiemDinh INT,
    @KetQua NVARCHAR(20) = NULL,
    @TrangThai NVARCHAR(20) = NULL,
    @BienBan NVARCHAR(MAX) = NULL,
    @ChuKySo NVARCHAR(255) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE KiemDinh
        SET 
            KetQua = ISNULL(@KetQua, KetQua),
            TrangThai = ISNULL(@TrangThai, TrangThai),
            BienBan = ISNULL(@BienBan, BienBan),
            ChuKySo = ISNULL(@ChuKySo, ChuKySo),
            GhiChu = ISNULL(@GhiChu, GhiChu)
        WHERE MaKiemDinh = @MaKiemDinh;
        
        SELECT 'SUCCESS' AS Status, 'Cập nhật thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP DELETE
CREATE OR ALTER PROCEDURE sp_KiemDinh_Delete
    @MaKiemDinh INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM KiemDinh WHERE MaKiemDinh = @MaKiemDinh;
        SELECT 'SUCCESS' AS Status, 'Xóa thành công' AS Message;
    END TRY
    BEGIN CATCH
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- SP SEARCH
CREATE OR ALTER PROCEDURE sp_KiemDinh_Search
    @MaLo INT = NULL,
    @KetQua NVARCHAR(20) = NULL,
    @TrangThai NVARCHAR(20) = NULL,
    @NguoiKiemDinh NVARCHAR(100) = NULL
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
    WHERE 
        (@MaLo IS NULL OR KD.MaLo = @MaLo)
        AND (@KetQua IS NULL OR KD.KetQua = @KetQua)
        AND (@TrangThai IS NULL OR KD.TrangThai = @TrangThai)
        AND (@NguoiKiemDinh IS NULL OR KD.NguoiKiemDinh LIKE '%' + @NguoiKiemDinh + '%')
    ORDER BY KD.MaKiemDinh DESC;
END;
GO





-- =====================================================
-- STORED PROCEDURES FOR ADMIN TABLE
-- =====================================================

-- GetAll: Lấy tất cả admin
CREATE OR ALTER PROCEDURE sp_Admin_GetAll
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaAdmin,
            MaTaiKhoan,
            HoTen,
            SoDienThoai,
            Email
        FROM Admin
        ORDER BY MaAdmin
        
        SELECT 'Success' AS Status, 'Lấy danh sách admin thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy admin theo MaAdmin
CREATE OR ALTER PROCEDURE sp_Admin_GetById
    @MaAdmin INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaAdmin,
            MaTaiKhoan,
            HoTen,
            SoDienThoai,
            Email
        FROM Admin
        WHERE MaAdmin = @MaAdmin
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy admin' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Lấy thông tin admin thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới admin
CREATE OR ALTER PROCEDURE sp_Admin_Create
    @MaTaiKhoan INT,
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        INSERT INTO Admin (MaTaiKhoan, HoTen, SoDienThoai, Email)
        VALUES (@MaTaiKhoan, @HoTen, @SoDienThoai, @Email)
        
        SELECT 'Success' AS Status, 'Tạo admin thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Update: Cập nhật admin
CREATE OR ALTER PROCEDURE sp_Admin_Update
    @MaAdmin INT,
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        UPDATE Admin
        SET 
            HoTen = @HoTen,
            SoDienThoai = @SoDienThoai,
            Email = @Email
        WHERE MaAdmin = @MaAdmin
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy admin' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật admin thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa admin
CREATE OR ALTER PROCEDURE sp_Admin_Delete
    @MaAdmin INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM Admin
        WHERE MaAdmin = @MaAdmin
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy admin' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Xóa admin thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm admin theo tên hoặc email
CREATE OR ALTER PROCEDURE sp_Admin_Search
    @SearchText NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaAdmin,
            MaTaiKhoan,
            HoTen,
            SoDienThoai,
            Email
        FROM Admin
        WHERE HoTen LIKE N'%' + @SearchText + '%'
            OR Email LIKE N'%' + @SearchText + '%'
            OR SoDienThoai LIKE N'%' + @SearchText + '%'
        ORDER BY HoTen
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO



-- =====================================================
-- STORED PROCEDURES FOR SIEUTHI TABLE
-- =====================================================

-- GetAll: Lấy tất cả siêu thị
CREATE OR ALTER PROCEDURE sp_SieuThi_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            ST.MaSieuThi,
            ST.MaTaiKhoan,
            ST.TenSieuThi,
            ST.SoDienThoai,
            ST.Email,
            ST.DiaChi,
            TK.TenDangNhap,
            TK.TrangThai
        FROM SieuThi ST
        JOIN TaiKhoan TK ON ST.MaTaiKhoan = TK.MaTaiKhoan
        WHERE TK.TrangThai = N'hoat_dong'
        ORDER BY ST.TenSieuThi
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy siêu thị theo MaSieuThi
CREATE OR ALTER PROCEDURE sp_SieuThi_GetById
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            MaSieuThi,
            MaTaiKhoan,
            TenSieuThi,
            SoDienThoai,
            Email,
            DiaChi
        FROM SieuThi
        WHERE MaSieuThi = @MaSieuThi
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy siêu thị' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới siêu thị
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
        
        -- Kiểm tra tên đăng nhập đã tồn tại chưa
        IF EXISTS (SELECT 1 FROM TaiKhoan WHERE TenDangNhap = @TenDangNhap)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 'ERROR' AS Status, N'Tên đăng nhập đã tồn tại' AS Message;
            RETURN;
        END
        
        -- Tạo tài khoản mới
        DECLARE @MaTaiKhoan INT;
        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
        VALUES (@TenDangNhap, @MatKhau, 'sieuthi', N'hoat_dong');
        
        SET @MaTaiKhoan = SCOPE_IDENTITY();
        
        -- Tạo siêu thị
        INSERT INTO SieuThi (MaTaiKhoan, TenSieuThi, SoDienThoai, Email, DiaChi)
        VALUES (@MaTaiKhoan, @TenSieuThi, @SoDienThoai, @Email, @DiaChi);
        
        SET @MaSieuThi = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        SELECT 'SUCCESS' AS Status, @MaSieuThi AS MaSieuThi;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO

-- Update: Cập nhật siêu thị
CREATE OR ALTER PROCEDURE sp_SieuThi_Update
    @MaSieuThi INT,
    @TenSieuThi NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        UPDATE SieuThi
        SET 
            TenSieuThi = @TenSieuThi,
            SoDienThoai = @SoDienThoai,
            Email = @Email,
            DiaChi = @DiaChi
        WHERE MaSieuThi = @MaSieuThi
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy siêu thị' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật siêu thị thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa siêu thị
CREATE OR ALTER PROCEDURE sp_SieuThi_Delete
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy MaTaiKhoan
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM SieuThi WHERE MaSieuThi = @MaSieuThi;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR(N'Không tìm thấy siêu thị', 16, 1);
            RETURN;
        END
        
        -- Đánh dấu tài khoản là đã xóa (Soft Delete)
        UPDATE TaiKhoan 
        SET TrangThai = N'da_xoa'
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Search: Tìm kiếm siêu thị theo tên, email, hoặc địa chỉ
CREATE OR ALTER PROCEDURE sp_SieuThi_Search
    @SearchText NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaSieuThi,
            MaTaiKhoan,
            TenSieuThi,
            SoDienThoai,
            Email,
            DiaChi
        FROM SieuThi
        WHERE TenSieuThi LIKE N'%' + @SearchText + '%'
            OR Email LIKE N'%' + @SearchText + '%'
            OR DiaChi LIKE N'%' + @SearchText + '%'
        ORDER BY TenSieuThi
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO



-- =====================================================
-- STORED PROCEDURES FOR TRANGTRAI TABLE
-- =====================================================

-- GetAll: Lấy tất cả trang trại
CREATE OR ALTER PROCEDURE sp_TrangTrai_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            t.MaTrangTrai,
            t.MaNongDan,
            t.TenTrangTrai,
            t.DiaChi,
            t.SoChungNhan,
            t.NgayTao,
            n.HoTen AS TenNongDan
        FROM TrangTrai t
        LEFT JOIN NongDan n ON t.MaNongDan = n.MaNongDan
        ORDER BY t.TenTrangTrai
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy trang trại theo MaTrangTrai
CREATE OR ALTER PROCEDURE sp_TrangTrai_GetById
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            t.MaTrangTrai,
            t.MaNongDan,
            t.TenTrangTrai,
            t.DiaChi,
            t.SoChungNhan,
            t.NgayTao,
            n.HoTen AS TenNongDan
        FROM TrangTrai t
        LEFT JOIN NongDan n ON t.MaNongDan = n.MaNongDan
        WHERE t.MaTrangTrai = @MaTrangTrai
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy trang trại' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetByNongDan: Lấy trang trại theo MaNongDan
CREATE OR ALTER PROCEDURE sp_TrangTrai_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            t.MaTrangTrai,
            t.MaNongDan,
            t.TenTrangTrai,
            t.DiaChi,
            t.SoChungNhan,
            t.NgayTao,
            n.HoTen AS TenNongDan
        FROM TrangTrai t
        LEFT JOIN NongDan n ON t.MaNongDan = n.MaNongDan
        WHERE t.MaNongDan = @MaNongDan
        ORDER BY t.TenTrangTrai
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới trang trại
CREATE OR ALTER PROCEDURE sp_TrangTrai_Create
    @MaNongDan INT,
    @TenTrangTrai NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @SoChungNhan NVARCHAR(50),
    @MaTrangTrai INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, SoChungNhan)
        VALUES (@MaNongDan, @TenTrangTrai, @DiaChi, @SoChungNhan)
        
        SET @MaTrangTrai = SCOPE_IDENTITY()
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Update: Cập nhật trang trại
CREATE OR ALTER PROCEDURE sp_TrangTrai_Update
    @MaTrangTrai INT,
    @TenTrangTrai NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @SoChungNhan NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE TrangTrai
        SET 
            TenTrangTrai = @TenTrangTrai,
            DiaChi = @DiaChi,
            SoChungNhan = @SoChungNhan
        WHERE MaTrangTrai = @MaTrangTrai
        
        SELECT @@ROWCOUNT AS RowsAffected
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa trang trại
CREATE OR ALTER PROCEDURE sp_TrangTrai_Delete
    @MaTrangTrai INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM TrangTrai
        WHERE MaTrangTrai = @MaTrangTrai
        
        SELECT @@ROWCOUNT AS RowsAffected
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm trang trại theo tên hoặc địa chỉ
CREATE OR ALTER PROCEDURE sp_TrangTrai_Search
    @SearchText NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            t.MaTrangTrai,
            t.MaNongDan,
            t.TenTrangTrai,
            t.DiaChi,
            t.SoChungNhan,
            t.NgayTao,
            n.HoTen AS TenNongDan
        FROM TrangTrai t
        LEFT JOIN NongDan n ON t.MaNongDan = n.MaNongDan
        WHERE t.TenTrangTrai LIKE N'%' + @SearchText + '%'
            OR t.DiaChi LIKE N'%' + @SearchText + '%'
        ORDER BY t.TenTrangTrai
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO



-- =====================================================
-- STORED PROCEDURES FOR KHO TABLE
-- =====================================================

-- GetAll: Lấy tất cả kho
CREATE OR ALTER PROCEDURE sp_Kho_GetAll
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaKho,
            LoaiKho,
            MaDaiLy,
            MaSieuThi,
            TenKho,
            DiaChi,
            TrangThai,
            NgayTao
        FROM Kho
        ORDER BY TenKho
        
        SELECT 'Success' AS Status, 'Lấy danh sách kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy kho theo MaKho
CREATE OR ALTER PROCEDURE sp_Kho_GetById
    @MaKho INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaKho,
            LoaiKho,
            MaDaiLy,
            MaSieuThi,
            TenKho,
            DiaChi,
            TrangThai,
            NgayTao
        FROM Kho
        WHERE MaKho = @MaKho
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy kho' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Lấy thông tin kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới kho
CREATE OR ALTER PROCEDURE sp_Kho_Create
    @LoaiKho NVARCHAR(20),
    @MaDaiLy INT = NULL,
    @MaSieuThi INT = NULL,
    @TenKho NVARCHAR(100),
    @DiaChi NVARCHAR(255) = NULL,
    @MaKho INT OUTPUT
AS
BEGIN
    BEGIN TRY
        INSERT INTO Kho (LoaiKho, MaDaiLy, MaSieuThi, TenKho, DiaChi)
        VALUES (@LoaiKho, @MaDaiLy, @MaSieuThi, @TenKho, @DiaChi)
        
        SET @MaKho = SCOPE_IDENTITY()
        
        SELECT 'Success' AS Status, 'Tạo kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Update: Cập nhật kho
CREATE OR ALTER PROCEDURE sp_Kho_Update
    @MaKho INT,
    @TenKho NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @TrangThai NVARCHAR(20)
AS
BEGIN
    BEGIN TRY
        UPDATE Kho
        SET 
            TenKho = @TenKho,
            DiaChi = @DiaChi,
            TrangThai = @TrangThai
        WHERE MaKho = @MaKho
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy kho' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa kho
CREATE OR ALTER PROCEDURE sp_Kho_Delete
    @MaKho INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM Kho
        WHERE MaKho = @MaKho
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy kho' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Xóa kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm kho theo loại hoặc tên
CREATE OR ALTER PROCEDURE sp_Kho_Search
    @SearchText NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaKho,
            LoaiKho,
            MaDaiLy,
            MaSieuThi,
            TenKho,
            DiaChi,
            TrangThai,
            NgayTao
        FROM Kho
        WHERE TenKho LIKE N'%' + @SearchText + '%'
            OR DiaChi LIKE N'%' + @SearchText + '%'
            OR LoaiKho LIKE N'%' + @SearchText + '%'
        ORDER BY TenKho
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO


-- =====================================================
-- STORED PROCEDURES FOR TONKHO TABLE
-- =====================================================

-- GetAll: Lấy tất cả tồn kho
CREATE OR ALTER PROCEDURE sp_TonKho_GetAll
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaKho,
            MaLo,
            SoLuong,
            CapNhatCuoi
        FROM TonKho
        ORDER BY MaKho, MaLo
        
        SELECT 'Success' AS Status, 'Lấy danh sách tồn kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy tồn kho theo MaKho và MaLo
CREATE OR ALTER PROCEDURE sp_TonKho_GetById
    @MaKho INT,
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaKho,
            MaLo,
            SoLuong,
            CapNhatCuoi
        FROM TonKho
        WHERE MaKho = @MaKho AND MaLo = @MaLo
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy bản ghi tồn kho' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Lấy thông tin tồn kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới tồn kho
CREATE OR ALTER PROCEDURE sp_TonKho_Create
    @MaKho INT,
    @MaLo INT,
    @SoLuong DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        INSERT INTO TonKho (MaKho, MaLo, SoLuong)
        VALUES (@MaKho, @MaLo, @SoLuong)
        
        SELECT 'Success' AS Status, 'Tạo tồn kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Update: Cập nhật tồn kho
CREATE OR ALTER PROCEDURE sp_TonKho_Update
    @MaKho INT,
    @MaLo INT,
    @SoLuong DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        UPDATE TonKho
        SET 
            SoLuong = @SoLuong,
            CapNhatCuoi = SYSDATETIME()
        WHERE MaKho = @MaKho AND MaLo = @MaLo
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy bản ghi tồn kho' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật tồn kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa tồn kho
CREATE OR ALTER PROCEDURE sp_TonKho_Delete
    @MaKho INT,
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM TonKho
        WHERE MaKho = @MaKho AND MaLo = @MaLo
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy bản ghi tồn kho' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Xóa tồn kho thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm tồn kho theo MaKho
CREATE OR ALTER PROCEDURE sp_TonKho_SearchByKho
    @MaKho INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaKho,
            MaLo,
            SoLuong,
            CapNhatCuoi
        FROM TonKho
        WHERE MaKho = @MaKho
        ORDER BY MaLo
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetByDaiLy: Lấy tồn kho theo MaDaiLy (join với Kho và LoNongSan)
CREATE OR ALTER PROCEDURE sp_TonKho_GetByDaiLy
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        TK.MaKho,
        TK.MaLo,
        TK.SoLuong,
        TK.CapNhatCuoi,
        K.TenKho,
        K.MaDaiLy,
        SP.TenSanPham,
        SP.DonViTinh
    FROM TonKho TK
    INNER JOIN Kho K ON TK.MaKho = K.MaKho
    INNER JOIN LoNongSan LNS ON TK.MaLo = LNS.MaLo
    INNER JOIN SanPham SP ON LNS.MaSanPham = SP.MaSanPham
    WHERE K.MaDaiLy = @MaDaiLy AND TK.SoLuong > 0
    ORDER BY TK.CapNhatCuoi DESC;
END;
GO


-- =====================================================
-- STORED PROCEDURES FOR DONHANGDAILY TABLE
-- =====================================================

-- GetAll: Lấy tất cả đơn hàng đại lý
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT
        dh.MaDonHang,
        dhdl.MaDaiLy,
        dhdl.MaNongDan,
        nd.HoTen AS TenNongDan,
        dl.TenDaiLy,
        dh.NgayDat,
        dh.NgayGiao,
        dh.TrangThai,
        dh.TongSoLuong,
        dh.TongGiaTri,
        dh.GhiChu
    FROM DonHang dh
    INNER JOIN DonHangDaiLy dhdl ON dh.MaDonHang = dhdl.MaDonHang
    LEFT JOIN NongDan nd ON dhdl.MaNongDan = nd.MaNongDan
    LEFT JOIN DaiLy dl ON dhdl.MaDaiLy = dl.MaDaiLy
    ORDER BY dh.MaDonHang DESC;
END
GO

-- GetById: Lấy đơn hàng đại lý theo MaDonHang
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetById
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT
        dh.MaDonHang,
        dhdl.MaDaiLy,
        dhdl.MaNongDan,
        nd.HoTen AS TenNongDan,
        dl.TenDaiLy,
        dh.NgayDat,
        dh.NgayGiao,
        dh.TrangThai,
        dh.TongSoLuong,
        dh.TongGiaTri,
        dh.GhiChu
    FROM DonHang dh
    INNER JOIN DonHangDaiLy dhdl ON dh.MaDonHang = dhdl.MaDonHang
    LEFT JOIN NongDan nd ON dhdl.MaNongDan = nd.MaNongDan
    LEFT JOIN DaiLy dl ON dhdl.MaDaiLy = dl.MaDaiLy
    WHERE dh.MaDonHang = @MaDonHang;
END
GO

-- Create: Thêm mới đơn hàng đại lý
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_Create
    @MaDaiLy INT,
    @MaNongDan INT,
    @TongSoLuong DECIMAL(18,2),
    @TongGiaTri DECIMAL(18,2),
    @GhiChu NVARCHAR(255) = NULL,
    @MaDonHang INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- 1. Tạo DonHang trước
        INSERT INTO DonHang (LoaiDon, NgayDat, TrangThai, TongSoLuong, TongGiaTri, GhiChu)
        VALUES (N'daily_to_nongdan', GETDATE(), N'chua_nhan', @TongSoLuong, @TongGiaTri, @GhiChu);
        
        SET @MaDonHang = SCOPE_IDENTITY();
        
        -- 2. Tạo DonHangDaiLy
        INSERT INTO DonHangDaiLy (MaDonHang, MaDaiLy, MaNongDan)
        VALUES (@MaDonHang, @MaDaiLy, @MaNongDan);
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- Update: Cập nhật đơn hàng đại lý
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_Update
    @MaDonHang INT,
    @MaDaiLy INT,
    @MaNongDan INT
AS
BEGIN
    BEGIN TRY
        UPDATE DonHangDaiLy
        SET 
            MaDaiLy = @MaDaiLy,
            MaNongDan = @MaNongDan
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng đại lý' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật đơn hàng đại lý thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa đơn hàng đại lý
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_Delete
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM DonHangDaiLy
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng đại lý' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Xóa đơn hàng đại lý thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm đơn hàng đại lý theo MaDaiLy hoặc MaNongDan
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_Search
    @SearchType NVARCHAR(10),
    @SearchId INT
AS
BEGIN
    BEGIN TRY
        IF @SearchType = 'daily'
            SELECT 
                MaDonHang,
                MaDaiLy,
                MaNongDan
            FROM DonHangDaiLy
            WHERE MaDaiLy = @SearchId
            ORDER BY MaDonHang DESC
        ELSE IF @SearchType = 'nongdan'
            SELECT 
                MaDonHang,
                MaDaiLy,
                MaNongDan
            FROM DonHangDaiLy
            WHERE MaNongDan = @SearchId
            ORDER BY MaDonHang DESC
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

--- GetByNongDan: Lấy đơn hàng đại lý theo MaNongDan
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetByNongDan
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        DH.MaDonHang,
        DH.LoaiDon,
        DH.NgayDat,
        DH.NgayGiao,
        DH.TongSoLuong,
        DH.TongGiaTri,
        DH.TrangThai,
        DH.GhiChu,
        DHDL.MaDaiLy,
        DHDL.MaNongDan,
        DL.TenDaiLy,
        ND.HoTen AS TenNongDan
    FROM DonHang DH
    INNER JOIN DonHangDaiLy DHDL ON DH.MaDonHang = DHDL.MaDonHang
    INNER JOIN DaiLy DL ON DHDL.MaDaiLy = DL.MaDaiLy
    INNER JOIN NongDan ND ON DHDL.MaNongDan = ND.MaNongDan
    WHERE DHDL.MaNongDan = @MaNongDan
    ORDER BY DH.NgayDat DESC;
END;
GO

--- GetByDaiLy: Lấy đơn hàng đại lý theo MaDaiLy
CREATE OR ALTER PROCEDURE sp_DonHangDaiLy_GetByDaiLy
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        DH.MaDonHang,
        DH.LoaiDon,
        DH.NgayDat,
        DH.NgayGiao,
        DH.TongSoLuong,
        DH.TongGiaTri,
        DH.TrangThai,
        DH.GhiChu,
        DHDL.MaDaiLy,
        DHDL.MaNongDan,
        DL.TenDaiLy,
        ND.HoTen AS TenNongDan
    FROM DonHang DH
    INNER JOIN DonHangDaiLy DHDL ON DH.MaDonHang = DHDL.MaDonHang
    INNER JOIN DaiLy DL ON DHDL.MaDaiLy = DL.MaDaiLy
    INNER JOIN NongDan ND ON DHDL.MaNongDan = ND.MaNongDan
    WHERE DHDL.MaDaiLy = @MaDaiLy
    ORDER BY DH.NgayDat DESC;
END;
GO


-- =====================================================
-- STORED PROCEDURES FOR DONHANGSIEUTHI TABLE
-- =====================================================

-- GetAll: Lấy tất cả đơn hàng siêu thị
CREATE OR ALTER PROCEDURE sp_DonHangSieuThi_GetAll
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            MaSieuThi,
            MaDaiLy
        FROM DonHangSieuThi
        ORDER BY MaDonHang DESC
        
        SELECT 'Success' AS Status, 'Lấy danh sách đơn hàng siêu thị thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy đơn hàng siêu thị theo MaDonHang
CREATE OR ALTER PROCEDURE sp_DonHangSieuThi_GetById
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            MaSieuThi,
            MaDaiLy
        FROM DonHangSieuThi
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng siêu thị' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Lấy thông tin đơn hàng siêu thị thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới đơn hàng siêu thị
CREATE OR ALTER PROCEDURE sp_DonHangSieuThi_Create
    @MaDonHang INT,
    @MaSieuThi INT,
    @MaDaiLy INT
AS
BEGIN
    BEGIN TRY
        INSERT INTO DonHangSieuThi (MaDonHang, MaSieuThi, MaDaiLy)
        VALUES (@MaDonHang, @MaSieuThi, @MaDaiLy)
        
        SELECT 'Success' AS Status, 'Tạo đơn hàng siêu thị thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Update: Cập nhật đơn hàng siêu thị
CREATE OR ALTER PROCEDURE sp_DonHangSieuThi_Update
    @MaDonHang INT,
    @MaSieuThi INT,
    @MaDaiLy INT
AS
BEGIN
    BEGIN TRY
        UPDATE DonHangSieuThi
        SET 
            MaSieuThi = @MaSieuThi,
            MaDaiLy = @MaDaiLy
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng siêu thị' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật đơn hàng siêu thị thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa đơn hàng siêu thị
CREATE OR ALTER PROCEDURE sp_DonHangSieuThi_Delete
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM DonHangSieuThi
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng siêu thị' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Xóa đơn hàng siêu thị thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm đơn hàng siêu thị theo MaSieuThi hoặc MaDaiLy
CREATE OR ALTER PROCEDURE sp_DonHangSieuThi_Search
    @SearchType NVARCHAR(10),
    @SearchId INT
AS
BEGIN
    BEGIN TRY
        IF @SearchType = 'sieuthi'
            SELECT 
                MaDonHang,
                MaSieuThi,
                MaDaiLy
            FROM DonHangSieuThi
            WHERE MaSieuThi = @SearchId
            ORDER BY MaDonHang DESC
        ELSE IF @SearchType = 'daily'
            SELECT 
                MaDonHang,
                MaSieuThi,
                MaDaiLy
            FROM DonHangSieuThi
            WHERE MaDaiLy = @SearchId
            ORDER BY MaDonHang DESC
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

--- GetByDaiLy: Lấy đơn hàng siêu thị theo MaDaiLy với đầy đủ thông tin
CREATE OR ALTER PROCEDURE sp_DonHangSieuThi_GetByDaiLy
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        DH.MaDonHang,
        DH.LoaiDon,
        DH.NgayDat,
        DH.NgayGiao,
        DH.TongSoLuong,
        DH.TongGiaTri,
        DH.TrangThai,
        DH.GhiChu,
        DHST.MaSieuThi,
        DHST.MaDaiLy,
        ST.TenSieuThi,
        DL.TenDaiLy
    FROM DonHang DH
    INNER JOIN DonHangSieuThi DHST ON DH.MaDonHang = DHST.MaDonHang
    INNER JOIN SieuThi ST ON DHST.MaSieuThi = ST.MaSieuThi
    INNER JOIN DaiLy DL ON DHST.MaDaiLy = DL.MaDaiLy
    WHERE DHST.MaDaiLy = @MaDaiLy
    ORDER BY DH.NgayDat DESC;
END;
GO

-- =====================================================
-- STORED PROCEDURES FOR CHITIETDONHANG TABLE
-- =====================================================

-- GetAll: Lấy tất cả chi tiết đơn hàng
CREATE OR ALTER PROCEDURE sp_ChiTietDonHang_GetAll
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            MaLo,
            SoLuong,
            DonGia,
            ThanhTien
        FROM ChiTietDonHang
        ORDER BY MaDonHang, MaLo
        
        SELECT 'Success' AS Status, 'Lấy danh sách chi tiết đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy chi tiết đơn hàng theo MaDonHang và MaLo
CREATE OR ALTER PROCEDURE sp_ChiTietDonHang_GetById
    @MaDonHang INT,
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            MaLo,
            SoLuong,
            DonGia,
            ThanhTien
        FROM ChiTietDonHang
        WHERE MaDonHang = @MaDonHang AND MaLo = @MaLo
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy chi tiết đơn hàng' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Lấy thông tin chi tiết đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới chi tiết đơn hàng
CREATE OR ALTER PROCEDURE sp_ChiTietDonHang_Create
    @MaDonHang INT,
    @MaLo INT,
    @SoLuong DECIMAL(18,2),
    @DonGia DECIMAL(18,2) = NULL,
    @ThanhTien DECIMAL(18,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Tính ThanhTien nếu chưa có
        IF @ThanhTien IS NULL AND @DonGia IS NOT NULL
            SET @ThanhTien = @SoLuong * @DonGia;
        
        -- Kiểm tra số lượng hiện tại trong lô
        DECLARE @SoLuongHienTai DECIMAL(18,2);
        SELECT @SoLuongHienTai = SoLuongHienTai 
        FROM LoNongSan 
        WHERE MaLo = @MaLo;
        
        IF @SoLuongHienTai IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR(N'Không tìm thấy lô nông sản', 16, 1);
            RETURN;
        END
        
        IF @SoLuongHienTai < @SoLuong
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR(N'Số lượng trong lô không đủ', 16, 1);
            RETURN;
        END
        
        -- Thêm chi tiết đơn hàng
        INSERT INTO ChiTietDonHang (MaDonHang, MaLo, SoLuong, DonGia, ThanhTien)
        VALUES (@MaDonHang, @MaLo, @SoLuong, @DonGia, @ThanhTien);
        
        -- Trừ số lượng trong lô
        UPDATE LoNongSan
        SET SoLuongHienTai = SoLuongHienTai - @SoLuong
        WHERE MaLo = @MaLo;
        
        -- Cập nhật trạng thái lô nếu hết hàng
        UPDATE LoNongSan
        SET TrangThai = N'da_ban_het'
        WHERE MaLo = @MaLo AND SoLuongHienTai <= 0;
        
        COMMIT TRANSACTION;
        SELECT 'Success' AS Status, N'Tạo chi tiết đơn hàng thành công' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO

-- Update: Cập nhật chi tiết đơn hàng
CREATE OR ALTER PROCEDURE sp_ChiTietDonHang_Update
    @MaDonHang INT,
    @MaLo INT,
    @SoLuong DECIMAL(18,2),
    @DonGia DECIMAL(18,2) = NULL,
    @ThanhTien DECIMAL(18,2) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE ChiTietDonHang
        SET 
            SoLuong = @SoLuong,
            DonGia = @DonGia,
            ThanhTien = @ThanhTien
        WHERE MaDonHang = @MaDonHang AND MaLo = @MaLo
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy chi tiết đơn hàng' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật chi tiết đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa chi tiết đơn hàng
CREATE OR ALTER PROCEDURE sp_ChiTietDonHang_Delete
    @MaDonHang INT,
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM ChiTietDonHang
        WHERE MaDonHang = @MaDonHang AND MaLo = @MaLo
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy chi tiết đơn hàng' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Xóa chi tiết đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm chi tiết đơn hàng theo MaDonHang
CREATE OR ALTER PROCEDURE sp_ChiTietDonHang_GetByDonHang
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            MaLo,
            SoLuong,
            DonGia,
            ThanhTien
        FROM ChiTietDonHang
        WHERE MaDonHang = @MaDonHang
        ORDER BY MaLo
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- =====================================================
-- STORED PROCEDURES FOR DONHANG TABLE
-- =====================================================

-- GetAll: Lấy tất cả đơn hàng
CREATE OR ALTER PROCEDURE sp_DonHang_GetAll
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            LoaiDon,
            NgayDat,
            NgayGiao,
            TrangThai,
            TongSoLuong,
            TongGiaTri,
            GhiChu
        FROM DonHang
        ORDER BY NgayDat DESC
        
        SELECT 'Success' AS Status, 'Lấy danh sách đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- GetById: Lấy đơn hàng theo MaDonHang
CREATE OR ALTER PROCEDURE sp_DonHang_GetById
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            LoaiDon,
            NgayDat,
            NgayGiao,
            TrangThai,
            TongSoLuong,
            TongGiaTri,
            GhiChu
        FROM DonHang
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Lấy thông tin đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Create: Thêm mới đơn hàng
CREATE OR ALTER PROCEDURE sp_DonHang_Create
    @LoaiDon NVARCHAR(30),
    @TongSoLuong DECIMAL(18,2) = NULL,
    @TongGiaTri DECIMAL(18,2) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        INSERT INTO DonHang (LoaiDon, TongSoLuong, TongGiaTri, GhiChu)
        VALUES (@LoaiDon, @TongSoLuong, @TongGiaTri, @GhiChu)
        
        SELECT 'Success' AS Status, 'Tạo đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Update: Cập nhật đơn hàng
CREATE OR ALTER PROCEDURE sp_DonHang_Update
    @MaDonHang INT,
    @TrangThai NVARCHAR(30),
    @NgayGiao DATETIME2 = NULL,
    @TongSoLuong DECIMAL(18,2) = NULL,
    @TongGiaTri DECIMAL(18,2) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE DonHang
        SET 
            TrangThai = @TrangThai,
            NgayGiao = @NgayGiao,
            TongSoLuong = @TongSoLuong,
            TongGiaTri = @TongGiaTri,
            GhiChu = @GhiChu
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Cập nhật đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Delete: Xóa đơn hàng
CREATE OR ALTER PROCEDURE sp_DonHang_Delete
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM DonHang
        WHERE MaDonHang = @MaDonHang
        
        IF @@ROWCOUNT = 0
            SELECT 'NotFound' AS Status, 'Không tìm thấy đơn hàng' AS Message
        ELSE
            SELECT 'Success' AS Status, 'Xóa đơn hàng thành công' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO

-- Search: Tìm kiếm đơn hàng theo trạng thái hoặc loại đơn
CREATE OR ALTER PROCEDURE sp_DonHang_Search
    @SearchText NVARCHAR(30)
AS
BEGIN
    BEGIN TRY
        SELECT 
            MaDonHang,
            LoaiDon,
            NgayDat,
            NgayGiao,
            TrangThai,
            TongSoLuong,
            TongGiaTri,
            GhiChu
        FROM DonHang
        WHERE TrangThai LIKE N'%' + @SearchText + '%'
            OR LoaiDon LIKE N'%' + @SearchText + '%'
        ORDER BY NgayDat DESC
        
        SELECT 'Success' AS Status, 'Tìm kiếm hoàn tất' AS Message
    END TRY
    BEGIN CATCH
        SELECT 'Error' AS Status, ERROR_MESSAGE() AS Message
    END CATCH
END
GO


-- =====================================================
-- STORED PROCEDURES FOR ADMIN USER MANAGEMENT (DELETE)
-- =====================================================

-- Admin DeleteNongDan: Xóa nông dân (Soft Delete)
CREATE OR ALTER PROCEDURE sp_Admin_DeleteNongDan
    @MaNongDan INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy MaTaiKhoan
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM NongDan WHERE MaNongDan = @MaNongDan;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        -- Đánh dấu tài khoản là đã xóa (Soft Delete)
        UPDATE TaiKhoan 
        SET TrangThai = N'da_xoa'
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END
GO

-- Admin DeleteDaiLy: Xóa đại lý (Soft Delete)
CREATE OR ALTER PROCEDURE sp_Admin_DeleteDaiLy
    @MaDaiLy INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy MaTaiKhoan
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM DaiLy WHERE MaDaiLy = @MaDaiLy;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        -- Đánh dấu tài khoản là đã xóa (Soft Delete)
        UPDATE TaiKhoan 
        SET TrangThai = N'da_xoa'
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END
GO

-- Admin DeleteSieuThi: Xóa siêu thị (Soft Delete)
CREATE OR ALTER PROCEDURE sp_Admin_DeleteSieuThi
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy MaTaiKhoan
        DECLARE @MaTaiKhoan INT;
        SELECT @MaTaiKhoan = MaTaiKhoan FROM SieuThi WHERE MaSieuThi = @MaSieuThi;
        
        IF @MaTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS RowsAffected;
            RETURN;
        END
        
        -- Đánh dấu tài khoản là đã xóa (Soft Delete)
        UPDATE TaiKhoan 
        SET TrangThai = N'da_xoa'
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        COMMIT TRANSACTION;
        SELECT 1 AS RowsAffected;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 0 AS RowsAffected;
    END CATCH
END
GO


-- =====================================================
-- STORED PROCEDURE FOR AUTHENTICATION
-- =====================================================

-- Login: Đăng nhập
CREATE OR ALTER PROCEDURE sp_Login
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
    
    -- Kiểm tra tài khoản có tồn tại không
    IF @MaTaiKhoan IS NULL
    BEGIN
        SELECT 0 AS Success, NULL AS LoaiTaiKhoan, NULL AS MaTaiKhoan, N'Tài khoản không tồn tại' AS Message;
        RETURN;
    END
    
    -- Kiểm tra trạng thái tài khoản (chỉ cho phép tài khoản hoạt động)
    IF @TrangThai != N'hoat_dong'
    BEGIN
        SELECT 0 AS Success, NULL AS LoaiTaiKhoan, NULL AS MaTaiKhoan, N'Tài khoản không thể đăng nhập. Vui lòng liên hệ quản trị viên.' AS Message;
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


