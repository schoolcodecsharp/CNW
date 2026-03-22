-- Stored Procedures cho Admin Service

-- 1. Lấy tất cả tài khoản
CREATE OR ALTER PROCEDURE sp_GetAllTaiKhoan
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        tk.MaTaiKhoan,
        tk.TenDangNhap,
        tk.LoaiTaiKhoan,
        tk.TrangThai,
        tk.NgayTao,
        tk.LanDangNhapCuoi,
        -- Admin info
        a.MaAdmin,
        a.HoTen AS AdminHoTen,
        a.SoDienThoai AS AdminSoDienThoai,
        a.Email AS AdminEmail,
        -- NongDan info
        nd.MaNongDan,
        nd.HoTen AS NongDanHoTen,
        nd.SoDienThoai AS NongDanSoDienThoai,
        nd.Email AS NongDanEmail,
        nd.DiaChi AS NongDanDiaChi,
        -- SieuThi info
        st.MaSieuThi,
        st.TenSieuThi,
        st.SoDienThoai AS SieuThiSoDienThoai,
        st.Email AS SieuThiEmail,
        st.DiaChi AS SieuThiDiaChi,
        -- DaiLy info
        dl.MaDaiLy,
        dl.TenDaiLy,
        dl.SoDienThoai AS DaiLySoDienThoai,
        dl.Email AS DaiLyEmail,
        dl.DiaChi AS DaiLyDiaChi
    FROM TaiKhoan tk
    LEFT JOIN Admin a ON tk.MaTaiKhoan = a.MaTaiKhoan
    LEFT JOIN NongDan nd ON tk.MaTaiKhoan = nd.MaTaiKhoan
    LEFT JOIN SieuThi st ON tk.MaTaiKhoan = st.MaTaiKhoan
    LEFT JOIN DaiLy dl ON tk.MaTaiKhoan = dl.MaTaiKhoan
    ORDER BY tk.NgayTao DESC;
END
GO

-- 2. Lấy tài khoản theo ID
CREATE OR ALTER PROCEDURE sp_GetTaiKhoanById
    @MaTaiKhoan INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        tk.MaTaiKhoan,
        tk.TenDangNhap,
        tk.LoaiTaiKhoan,
        tk.TrangThai,
        tk.NgayTao,
        tk.LanDangNhapCuoi,
        -- Admin info
        a.MaAdmin,
        a.HoTen AS AdminHoTen,
        a.SoDienThoai AS AdminSoDienThoai,
        a.Email AS AdminEmail,
        -- NongDan info
        nd.MaNongDan,
        nd.HoTen AS NongDanHoTen,
        nd.SoDienThoai AS NongDanSoDienThoai,
        nd.Email AS NongDanEmail,
        nd.DiaChi AS NongDanDiaChi,
        -- SieuThi info
        st.MaSieuThi,
        st.TenSieuThi,
        st.SoDienThoai AS SieuThiSoDienThoai,
        st.Email AS SieuThiEmail,
        st.DiaChi AS SieuThiDiaChi,
        -- DaiLy info
        dl.MaDaiLy,
        dl.TenDaiLy,
        dl.SoDienThoai AS DaiLySoDienThoai,
        dl.Email AS DaiLyEmail,
        dl.DiaChi AS DaiLyDiaChi
    FROM TaiKhoan tk
    LEFT JOIN Admin a ON tk.MaTaiKhoan = a.MaTaiKhoan
    LEFT JOIN NongDan nd ON tk.MaTaiKhoan = nd.MaTaiKhoan
    LEFT JOIN SieuThi st ON tk.MaTaiKhoan = st.MaTaiKhoan
    LEFT JOIN DaiLy dl ON tk.MaTaiKhoan = dl.MaTaiKhoan
    WHERE tk.MaTaiKhoan = @MaTaiKhoan;
END
GO

-- 3. Cập nhật tài khoản
CREATE OR ALTER PROCEDURE sp_UpdateTaiKhoan
    @MaTaiKhoan INT,
    @MatKhau NVARCHAR(255) = NULL,
    @TrangThai NVARCHAR(20) = NULL,
    @HoTen NVARCHAR(100) = NULL,
    @SoDienThoai NVARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @DiaChi NVARCHAR(255) = NULL,
    @TenCuaHang NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @LoaiTaiKhoan NVARCHAR(20);
        
        -- Lấy loại tài khoản
        SELECT @LoaiTaiKhoan = LoaiTaiKhoan 
        FROM TaiKhoan 
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        IF @LoaiTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS Success, N'Tài khoản không tồn tại' AS Message;
            RETURN;
        END
        
        -- Cập nhật bảng TaiKhoan
        UPDATE TaiKhoan 
        SET 
            MatKhau = ISNULL(@MatKhau, MatKhau),
            TrangThai = ISNULL(@TrangThai, TrangThai)
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        -- Cập nhật thông tin chi tiết theo loại tài khoản
        IF @LoaiTaiKhoan = 'admin'
        BEGIN
            UPDATE Admin 
            SET 
                HoTen = ISNULL(@HoTen, HoTen),
                SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
                Email = ISNULL(@Email, Email)
            WHERE MaTaiKhoan = @MaTaiKhoan;
        END
        ELSE IF @LoaiTaiKhoan = 'nong_dan'
        BEGIN
            UPDATE NongDan 
            SET 
                HoTen = ISNULL(@HoTen, HoTen),
                SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
                Email = ISNULL(@Email, Email),
                DiaChi = ISNULL(@DiaChi, DiaChi)
            WHERE MaTaiKhoan = @MaTaiKhoan;
        END
        ELSE IF @LoaiTaiKhoan = 'sieu_thi'
        BEGIN
            UPDATE SieuThi 
            SET 
                TenSieuThi = ISNULL(@TenCuaHang, TenSieuThi),
                SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
                Email = ISNULL(@Email, Email),
                DiaChi = ISNULL(@DiaChi, DiaChi)
            WHERE MaTaiKhoan = @MaTaiKhoan;
        END
        ELSE IF @LoaiTaiKhoan = 'dai_ly'
        BEGIN
            UPDATE DaiLy 
            SET 
                TenDaiLy = ISNULL(@TenCuaHang, TenDaiLy),
                SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
                Email = ISNULL(@Email, Email),
                DiaChi = ISNULL(@DiaChi, DiaChi)
            WHERE MaTaiKhoan = @MaTaiKhoan;
        END
        
        COMMIT TRANSACTION;
        SELECT 1 AS Success, N'Cập nhật tài khoản thành công' AS Message;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS Success, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO

-- 4. Xóa tài khoản (hoặc ngừng hoạt động nếu có khóa phụ)
CREATE OR ALTER PROCEDURE sp_DeleteTaiKhoan
    @MaTaiKhoan INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @LoaiTaiKhoan NVARCHAR(20);
        DECLARE @HasForeignKey BIT = 0;
        
        -- Lấy loại tài khoản
        SELECT @LoaiTaiKhoan = LoaiTaiKhoan 
        FROM TaiKhoan 
        WHERE MaTaiKhoan = @MaTaiKhoan;
        
        IF @LoaiTaiKhoan IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS Success, N'Tài khoản không tồn tại' AS Message;
            RETURN;
        END
        
        -- Kiểm tra khóa phụ bằng cách thử xóa và bắt lỗi
        BEGIN TRY
            -- Thử xóa thông tin chi tiết trước để kiểm tra ràng buộc
            IF @LoaiTaiKhoan = 'admin'
            BEGIN
                DELETE FROM Admin WHERE MaTaiKhoan = @MaTaiKhoan;
            END
            ELSE IF @LoaiTaiKhoan = 'nong_dan'
            BEGIN
                DELETE FROM NongDan WHERE MaTaiKhoan = @MaTaiKhoan;
            END
            ELSE IF @LoaiTaiKhoan = 'sieu_thi'
            BEGIN
                DELETE FROM SieuThi WHERE MaTaiKhoan = @MaTaiKhoan;
            END
            ELSE IF @LoaiTaiKhoan = 'dai_ly'
            BEGIN
                DELETE FROM DaiLy WHERE MaTaiKhoan = @MaTaiKhoan;
            END
            
            -- Nếu xóa thông tin chi tiết thành công, tiếp tục xóa tài khoản chính
            DELETE FROM TaiKhoan WHERE MaTaiKhoan = @MaTaiKhoan;
            
            COMMIT TRANSACTION;
            SELECT 1 AS Success, N'Xóa tài khoản thành công' AS Message;
            
        END TRY
        BEGIN CATCH
            -- Nếu có lỗi foreign key, chỉ cập nhật trạng thái
            ROLLBACK TRANSACTION;
            
            BEGIN TRANSACTION;
            UPDATE TaiKhoan 
            SET TrangThai = 'ngung_hoat_dong'
            WHERE MaTaiKhoan = @MaTaiKhoan;
            
            COMMIT TRANSACTION;
            SELECT 1 AS Success, N'Tài khoản đã được ngừng hoạt động do có dữ liệu liên quan' AS Message;
        END CATCH
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS Success, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO