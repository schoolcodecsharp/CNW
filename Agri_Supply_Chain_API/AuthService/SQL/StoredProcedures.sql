-- Stored Procedures cho Auth Service

-- 1. Đăng nhập
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
