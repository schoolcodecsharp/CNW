
/*===========================================================
  STORED PROCEDURES: ADMIN
===========================================================*/

-- SP_Admin_LayTatCa: Lấy tất cả Admin
CREATE OR ALTER PROCEDURE SP_Admin_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT MaAdmin, TenDangNhap, HoTen, SoDienThoai, Email, TrangThai, NgayTao
        FROM Admin
        ORDER BY NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Admin', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Admin_LayTheoID: Lấy Admin theo ID
CREATE OR ALTER PROCEDURE SP_Admin_LayTheoID
    @MaAdmin INT
AS
BEGIN
    BEGIN TRY
        SELECT MaAdmin, TenDangNhap, HoTen, SoDienThoai, Email, TrangThai, NgayTao
        FROM Admin
        WHERE MaAdmin = @MaAdmin;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Admin theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Admin_DangNhap: Kiểm tra đăng nhập Admin
CREATE OR ALTER PROCEDURE SP_Admin_DangNhap
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        SELECT MaAdmin, TenDangNhap, HoTen, Email, TrangThai
        FROM Admin
        WHERE TenDangNhap = @TenDangNhap AND MatKhauHash = @MatKhauHash AND TrangThai = N'hoat_dong';
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xác thực đăng nhập Admin', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Admin_Them: Thêm Admin mới
CREATE OR ALTER PROCEDURE SP_Admin_Them
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255),
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        INSERT INTO Admin (TenDangNhap, MatKhauHash, HoTen, SoDienThoai, Email)
        VALUES (@TenDangNhap, @MatKhauHash, @HoTen, @SoDienThoai, @Email);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Admin mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Admin_CapNhat: Cập nhật Admin
CREATE OR ALTER PROCEDURE SP_Admin_CapNhat
    @MaAdmin INT,
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @TrangThai NVARCHAR(20)
AS
BEGIN
    BEGIN TRY
        UPDATE Admin
        SET HoTen = @HoTen, SoDienThoai = @SoDienThoai, Email = @Email, TrangThai = @TrangThai
        WHERE MaAdmin = @MaAdmin;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Admin', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Admin_Xoa: Xóa Admin
CREATE OR ALTER PROCEDURE SP_Admin_Xoa
    @MaAdmin INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM Admin WHERE MaAdmin = @MaAdmin;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Admin', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Admin_TimKiem: Tìm kiếm Admin theo tên
CREATE OR ALTER PROCEDURE SP_Admin_TimKiem
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT MaAdmin, TenDangNhap, HoTen, SoDienThoai, Email, TrangThai, NgayTao
        FROM Admin
        WHERE HoTen LIKE N'%' + @TuKhoa + N'%' OR TenDangNhap LIKE N'%' + @TuKhoa + N'%'
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi tìm kiếm Admin', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: NONG DAN
===========================================================*/

-- SP_NongDan_LayTatCa: Lấy tất cả Nông Dân
CREATE OR ALTER PROCEDURE SP_NongDan_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT MaNongDan, TenDangNhap, HoTen, SoDienThoai, Email, TrangThai, NgayTao
        FROM NongDan
        ORDER BY NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Nông Dân', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_NongDan_LayTheoID: Lấy Nông Dân theo ID
CREATE OR ALTER PROCEDURE SP_NongDan_LayTheoID
    @MaNongDan INT
AS
BEGIN
    BEGIN TRY
        SELECT MaNongDan, TenDangNhap, HoTen, SoDienThoai, Email, TrangThai, NgayTao
        FROM NongDan
        WHERE MaNongDan = @MaNongDan;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Nông Dân theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_NongDan_DangNhap: Kiểm tra đăng nhập Nông Dân
CREATE OR ALTER PROCEDURE SP_NongDan_DangNhap
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        SELECT MaNongDan, TenDangNhap, HoTen, Email, TrangThai
        FROM NongDan
        WHERE TenDangNhap = @TenDangNhap AND MatKhauHash = @MatKhauHash AND TrangThai = N'hoat_dong';
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xác thực đăng nhập Nông Dân', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_NongDan_Them: Thêm Nông Dân mới
CREATE OR ALTER PROCEDURE SP_NongDan_Them
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255),
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        INSERT INTO NongDan (TenDangNhap, MatKhauHash, HoTen, SoDienThoai, Email)
        VALUES (@TenDangNhap, @MatKhauHash, @HoTen, @SoDienThoai, @Email);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Nông Dân mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_NongDan_CapNhat: Cập nhật Nông Dân
CREATE OR ALTER PROCEDURE SP_NongDan_CapNhat
    @MaNongDan INT,
    @HoTen NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @TrangThai NVARCHAR(20)
AS
BEGIN
    BEGIN TRY
        UPDATE NongDan
        SET HoTen = @HoTen, SoDienThoai = @SoDienThoai, Email = @Email, TrangThai = @TrangThai
        WHERE MaNongDan = @MaNongDan;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Nông Dân', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_NongDan_Xoa: Xóa Nông Dân
CREATE OR ALTER PROCEDURE SP_NongDan_Xoa
    @MaNongDan INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM NongDan WHERE MaNongDan = @MaNongDan;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Nông Dân', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_NongDan_TimKiem: Tìm kiếm Nông Dân theo tên
CREATE OR ALTER PROCEDURE SP_NongDan_TimKiem
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT MaNongDan, TenDangNhap, HoTen, SoDienThoai, Email, TrangThai, NgayTao
        FROM NongDan
        WHERE HoTen LIKE N'%' + @TuKhoa + N'%' OR TenDangNhap LIKE N'%' + @TuKhoa + N'%'
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi tìm kiếm Nông Dân', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: DAI LY
===========================================================*/

-- SP_DaiLy_LayTatCa: Lấy tất cả Đại Lý
CREATE OR ALTER PROCEDURE SP_DaiLy_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT MaDaiLy, TenDangNhap, TenDaiLy, SoDienThoai, Email, DiaChi, TrangThai, NgayTao
        FROM DaiLy
        ORDER BY NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Đại Lý', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DaiLy_LayTheoID: Lấy Đại Lý theo ID
CREATE OR ALTER PROCEDURE SP_DaiLy_LayTheoID
    @MaDaiLy INT
AS
BEGIN
    BEGIN TRY
        SELECT MaDaiLy, TenDangNhap, TenDaiLy, SoDienThoai, Email, DiaChi, TrangThai, NgayTao
        FROM DaiLy
        WHERE MaDaiLy = @MaDaiLy;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Đại Lý theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DaiLy_DangNhap: Kiểm tra đăng nhập Đại Lý
CREATE OR ALTER PROCEDURE SP_DaiLy_DangNhap
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        SELECT MaDaiLy, TenDangNhap, TenDaiLy, Email, TrangThai
        FROM DaiLy
        WHERE TenDangNhap = @TenDangNhap AND MatKhauHash = @MatKhauHash AND TrangThai = N'hoat_dong';
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xác thực đăng nhập Đại Lý', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DaiLy_Them: Thêm Đại Lý mới
CREATE OR ALTER PROCEDURE SP_DaiLy_Them
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255),
    @TenDaiLy NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        INSERT INTO DaiLy (TenDangNhap, MatKhauHash, TenDaiLy, SoDienThoai, Email, DiaChi)
        VALUES (@TenDangNhap, @MatKhauHash, @TenDaiLy, @SoDienThoai, @Email, @DiaChi);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Đại Lý mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DaiLy_CapNhat: Cập nhật Đại Lý
CREATE OR ALTER PROCEDURE SP_DaiLy_CapNhat
    @MaDaiLy INT,
    @TenDaiLy NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @TrangThai NVARCHAR(20)
AS
BEGIN
    BEGIN TRY
        UPDATE DaiLy
        SET TenDaiLy = @TenDaiLy, SoDienThoai = @SoDienThoai, Email = @Email, DiaChi = @DiaChi, TrangThai = @TrangThai
        WHERE MaDaiLy = @MaDaiLy;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Đại Lý', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DaiLy_Xoa: Xóa Đại Lý
CREATE OR ALTER PROCEDURE SP_DaiLy_Xoa
    @MaDaiLy INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM DaiLy WHERE MaDaiLy = @MaDaiLy;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Đại Lý', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DaiLy_TimKiem: Tìm kiếm Đại Lý theo tên
CREATE OR ALTER PROCEDURE SP_DaiLy_TimKiem
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT MaDaiLy, TenDangNhap, TenDaiLy, SoDienThoai, Email, DiaChi, TrangThai, NgayTao
        FROM DaiLy
        WHERE TenDaiLy LIKE N'%' + @TuKhoa + N'%' OR TenDangNhap LIKE N'%' + @TuKhoa + N'%'
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi tìm kiếm Đại Lý', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: SIEU THI
===========================================================*/

-- SP_SieuThi_LayTatCa: Lấy tất cả Siêu Thị
CREATE OR ALTER PROCEDURE SP_SieuThi_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT MaSieuThi, TenDangNhap, TenSieuThi, SoDienThoai, Email, DiaChi, TrangThai, NgayTao
        FROM SieuThi
        ORDER BY NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Siêu Thị', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SieuThi_LayTheoID: Lấy Siêu Thị theo ID
CREATE OR ALTER PROCEDURE SP_SieuThi_LayTheoID
    @MaSieuThi INT
AS
BEGIN
    BEGIN TRY
        SELECT MaSieuThi, TenDangNhap, TenSieuThi, SoDienThoai, Email, DiaChi, TrangThai, NgayTao
        FROM SieuThi
        WHERE MaSieuThi = @MaSieuThi;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Siêu Thị theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SieuThi_DangNhap: Kiểm tra đăng nhập Siêu Thị
CREATE OR ALTER PROCEDURE SP_SieuThi_DangNhap
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        SELECT MaSieuThi, TenDangNhap, TenSieuThi, Email, TrangThai
        FROM SieuThi
        WHERE TenDangNhap = @TenDangNhap AND MatKhauHash = @MatKhauHash AND TrangThai = N'hoat_dong';
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xác thực đăng nhập Siêu Thị', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SieuThi_Them: Thêm Siêu Thị mới
CREATE OR ALTER PROCEDURE SP_SieuThi_Them
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255),
    @TenSieuThi NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        INSERT INTO SieuThi (TenDangNhap, MatKhauHash, TenSieuThi, SoDienThoai, Email, DiaChi)
        VALUES (@TenDangNhap, @MatKhauHash, @TenSieuThi, @SoDienThoai, @Email, @DiaChi);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Siêu Thị mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SieuThi_CapNhat: Cập nhật Siêu Thị
CREATE OR ALTER PROCEDURE SP_SieuThi_CapNhat
    @MaSieuThi INT,
    @TenSieuThi NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @Email NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @TrangThai NVARCHAR(20)
AS
BEGIN
    BEGIN TRY
        UPDATE SieuThi
        SET TenSieuThi = @TenSieuThi, SoDienThoai = @SoDienThoai, Email = @Email, DiaChi = @DiaChi, TrangThai = @TrangThai
        WHERE MaSieuThi = @MaSieuThi;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Siêu Thị', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SieuThi_Xoa: Xóa Siêu Thị
CREATE OR ALTER PROCEDURE SP_SieuThi_Xoa
    @MaSieuThi INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM SieuThi WHERE MaSieuThi = @MaSieuThi;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Siêu Thị', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SieuThi_TimKiem: Tìm kiếm Siêu Thị theo tên
CREATE OR ALTER PROCEDURE SP_SieuThi_TimKiem
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT MaSieuThi, TenDangNhap, TenSieuThi, SoDienThoai, Email, DiaChi, TrangThai, NgayTao
        FROM SieuThi
        WHERE TenSieuThi LIKE N'%' + @TuKhoa + N'%' OR TenDangNhap LIKE N'%' + @TuKhoa + N'%'
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi tìm kiếm Siêu Thị', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: TRANG TRAI
===========================================================*/

-- SP_TrangTrai_LayTatCa: Lấy tất cả Trang Trại
CREATE OR ALTER PROCEDURE SP_TrangTrai_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT tt.MaTrangTrai, tt.MaNongDan, tt.TenTrangTrai, tt.DiaChi, tt.SoChungNhan, tt.NgayTao, nd.HoTen
        FROM TrangTrai tt
        LEFT JOIN NongDan nd ON tt.MaNongDan = nd.MaNongDan
        ORDER BY tt.NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Trang Trại', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TrangTrai_LayTheoID: Lấy Trang Trại theo ID
CREATE OR ALTER PROCEDURE SP_TrangTrai_LayTheoID
    @MaTrangTrai INT
AS
BEGIN
    BEGIN TRY
        SELECT tt.MaTrangTrai, tt.MaNongDan, tt.TenTrangTrai, tt.DiaChi, tt.SoChungNhan, tt.NgayTao, nd.HoTen
        FROM TrangTrai tt
        LEFT JOIN NongDan nd ON tt.MaNongDan = nd.MaNongDan
        WHERE tt.MaTrangTrai = @MaTrangTrai;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Trang Trại theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TrangTrai_LayTheoNongDan: Lấy Trang Trại theo Nông Dân
CREATE OR ALTER PROCEDURE SP_TrangTrai_LayTheoNongDan
    @MaNongDan INT
AS
BEGIN
    BEGIN TRY
        SELECT MaTrangTrai, MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, NgayTao
        FROM TrangTrai
        WHERE MaNongDan = @MaNongDan
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Trang Trại theo Nông Dân', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TrangTrai_Them: Thêm Trang Trại mới
CREATE OR ALTER PROCEDURE SP_TrangTrai_Them
    @MaNongDan INT,
    @TenTrangTrai NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @SoChungNhan NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, SoChungNhan)
        VALUES (@MaNongDan, @TenTrangTrai, @DiaChi, @SoChungNhan);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Trang Trại mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TrangTrai_CapNhat: Cập nhật Trang Trại
CREATE OR ALTER PROCEDURE SP_TrangTrai_CapNhat
    @MaTrangTrai INT,
    @TenTrangTrai NVARCHAR(100),
    @DiaChi NVARCHAR(255),
    @SoChungNhan NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        UPDATE TrangTrai
        SET TenTrangTrai = @TenTrangTrai, DiaChi = @DiaChi, SoChungNhan = @SoChungNhan
        WHERE MaTrangTrai = @MaTrangTrai;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Trang Trại', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TrangTrai_Xoa: Xóa Trang Trại
CREATE OR ALTER PROCEDURE SP_TrangTrai_Xoa
    @MaTrangTrai INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM TrangTrai WHERE MaTrangTrai = @MaTrangTrai;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Trang Trại', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TrangTrai_TimKiem: Tìm kiếm Trang Trại theo tên
CREATE OR ALTER PROCEDURE SP_TrangTrai_TimKiem
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT MaTrangTrai, MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, NgayTao
        FROM TrangTrai
        WHERE TenTrangTrai LIKE N'%' + @TuKhoa + N'%'
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi tìm kiếm Trang Trại', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: SAN PHAM
===========================================================*/

-- SP_SanPham_LayTatCa: Lấy tất cả Sản Phẩm
CREATE OR ALTER PROCEDURE SP_SanPham_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT MaSanPham, TenSanPham, DonViTinh, MoTa, NgayTao
        FROM SanPham
        ORDER BY NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Sản Phẩm', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SanPham_LayTheoID: Lấy Sản Phẩm theo ID
CREATE OR ALTER PROCEDURE SP_SanPham_LayTheoID
    @MaSanPham INT
AS
BEGIN
    BEGIN TRY
        SELECT MaSanPham, TenSanPham, DonViTinh, MoTa, NgayTao
        FROM SanPham
        WHERE MaSanPham = @MaSanPham;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Sản Phẩm theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SanPham_Them: Thêm Sản Phẩm mới
CREATE OR ALTER PROCEDURE SP_SanPham_Them
    @TenSanPham NVARCHAR(100),
    @DonViTinh NVARCHAR(20),
    @MoTa NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        INSERT INTO SanPham (TenSanPham, DonViTinh, MoTa)
        VALUES (@TenSanPham, @DonViTinh, @MoTa);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Sản Phẩm mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SanPham_CapNhat: Cập nhật Sản Phẩm
CREATE OR ALTER PROCEDURE SP_SanPham_CapNhat
    @MaSanPham INT,
    @TenSanPham NVARCHAR(100),
    @DonViTinh NVARCHAR(20),
    @MoTa NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        UPDATE SanPham
        SET TenSanPham = @TenSanPham, DonViTinh = @DonViTinh, MoTa = @MoTa
        WHERE MaSanPham = @MaSanPham;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Sản Phẩm', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SanPham_Xoa: Xóa Sản Phẩm
CREATE OR ALTER PROCEDURE SP_SanPham_Xoa
    @MaSanPham INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM SanPham WHERE MaSanPham = @MaSanPham;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Sản Phẩm', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_SanPham_TimKiem: Tìm kiếm Sản Phẩm theo tên
CREATE OR ALTER PROCEDURE SP_SanPham_TimKiem
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT MaSanPham, TenSanPham, DonViTinh, MoTa, NgayTao
        FROM SanPham
        WHERE TenSanPham LIKE N'%' + @TuKhoa + N'%'
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi tìm kiếm Sản Phẩm', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: LO NONG SAN (QUAN TRONG NHAT)
===========================================================*/

-- SP_LoNongSan_LayTatCa: Lấy tất cả Lô Nông Sản
CREATE OR ALTER PROCEDURE SP_LoNongSan_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai, 
               l.NgayThuHoach, l.HanSuDung, l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
               tt.TenTrangTrai, sp.TenSanPham
        FROM LoNongSan l
        LEFT JOIN TrangTrai tt ON l.MaTrangTrai = tt.MaTrangTrai
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        ORDER BY l.NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Lô Nông Sản', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_LayTheoID: Lấy Lô Nông Sản theo ID
CREATE OR ALTER PROCEDURE SP_LoNongSan_LayTheoID
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai, 
               l.NgayThuHoach, l.HanSuDung, l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
               tt.TenTrangTrai, sp.TenSanPham
        FROM LoNongSan l
        LEFT JOIN TrangTrai tt ON l.MaTrangTrai = tt.MaTrangTrai
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        WHERE l.MaLo = @MaLo;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Lô Nông Sản theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_LayTheoQR: Lấy Lô Nông Sản theo mã QR (Truy xuất)
CREATE OR ALTER PROCEDURE SP_LoNongSan_LayTheoQR
    @MaQR NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai, 
               l.NgayThuHoach, l.HanSuDung, l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
               tt.TenTrangTrai, sp.TenSanPham
        FROM LoNongSan l
        LEFT JOIN TrangTrai tt ON l.MaTrangTrai = tt.MaTrangTrai
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        WHERE l.MaQR = @MaQR;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Lô Nông Sản theo QR', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_LayTheoTrangTrai: Lấy Lô Nông Sản theo Trang Trại
CREATE OR ALTER PROCEDURE SP_LoNongSan_LayTheoTrangTrai
    @MaTrangTrai INT
AS
BEGIN
    BEGIN TRY
        SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai, 
               l.NgayThuHoach, l.HanSuDung, l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
               sp.TenSanPham
        FROM LoNongSan l
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        WHERE l.MaTrangTrai = @MaTrangTrai
        ORDER BY l.NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Lô Nông Sản theo Trang Trại', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_Them: Thêm Lô Nông Sản mới
CREATE OR ALTER PROCEDURE SP_LoNongSan_Them
    @MaTrangTrai INT,
    @MaSanPham INT,
    @SoLuongBanDau DECIMAL(18,2),
    @NgayThuHoach DATE,
    @HanSuDung DATE,
    @SoChungNhanLo NVARCHAR(50),
    @MaQR NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        INSERT INTO LoNongSan (MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai, NgayThuHoach, HanSuDung, SoChungNhanLo, MaQR)
        VALUES (@MaTrangTrai, @MaSanPham, @SoLuongBanDau, @SoLuongBanDau, @NgayThuHoach, @HanSuDung, @SoChungNhanLo, @MaQR);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Lô Nông Sản mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_CapNhat: Cập nhật Lô Nông Sản
CREATE OR ALTER PROCEDURE SP_LoNongSan_CapNhat
    @MaLo INT,
    @SoLuongHienTai DECIMAL(18,2),
    @TrangThai NVARCHAR(30)
AS
BEGIN
    BEGIN TRY
        UPDATE LoNongSan
        SET SoLuongHienTai = @SoLuongHienTai, TrangThai = @TrangThai
        WHERE MaLo = @MaLo;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Lô Nông Sản', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_Xoa: Xóa Lô Nông Sản
CREATE OR ALTER PROCEDURE SP_LoNongSan_Xoa
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM LoNongSan WHERE MaLo = @MaLo;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Lô Nông Sản', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_CheckQuaHan: Kiểm tra Lô quá hạn
CREATE OR ALTER PROCEDURE SP_LoNongSan_CheckQuaHan
AS
BEGIN
    BEGIN TRY
        SELECT MaLo, MaTrangTrai, MaSanPham, SoLuongHienTai, HanSuDung, TrangThai
        FROM LoNongSan
        WHERE HanSuDung < CAST(GETDATE() AS DATE) AND TrangThai <> N'da_xa_hanh'
        ORDER BY HanSuDung ASC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi kiểm tra Lô quá hạn', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_CanhBaoSapHan: Cảnh báo Lô sắp hết hạn (7 ngày)
CREATE OR ALTER PROCEDURE SP_LoNongSan_CanhBaoSapHan
    @SoNgay INT = 7
AS
BEGIN
    BEGIN TRY
        SELECT MaLo, MaTrangTrai, MaSanPham, SoLuongHienTai, HanSuDung, TrangThai,
               DATEDIFF(DAY, CAST(GETDATE() AS DATE), HanSuDung) AS SoNgayConLai
        FROM LoNongSan
        WHERE HanSuDung BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, @SoNgay, CAST(GETDATE() AS DATE))
              AND TrangThai <> N'da_xa_hanh'
        ORDER BY HanSuDung ASC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cảnh báo Lô sắp hết hạn', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_LoNongSan_TimKiem: Tìm kiếm Lô Nông Sản
CREATE OR ALTER PROCEDURE SP_LoNongSan_TimKiem
    @TuKhoa NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        SELECT l.MaLo, l.MaTrangTrai, l.MaSanPham, l.SoLuongBanDau, l.SoLuongHienTai, 
               l.NgayThuHoach, l.HanSuDung, l.SoChungNhanLo, l.MaQR, l.TrangThai, l.NgayTao,
               tt.TenTrangTrai, sp.TenSanPham
        FROM LoNongSan l
        LEFT JOIN TrangTrai tt ON l.MaTrangTrai = tt.MaTrangTrai
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        WHERE l.MaQR LIKE N'%' + @TuKhoa + N'%' 
           OR sp.TenSanPham LIKE N'%' + @TuKhoa + N'%'
           OR tt.TenTrangTrai LIKE N'%' + @TuKhoa + N'%'
        ORDER BY l.NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi tìm kiếm Lô Nông Sản', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: KHO
===========================================================*/

-- SP_Kho_LayTatCa: Lấy tất cả Kho
CREATE OR ALTER PROCEDURE SP_Kho_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT k.MaKho, k.LoaiKho, k.MaDaiLy, k.MaSieuThi, k.TenKho, k.DiaChi, k.NgayTao,
               COALESCE(dl.TenDaiLy, st.TenSieuThi, N'N/A') AS TenChuKho
        FROM Kho k
        LEFT JOIN DaiLy dl ON k.MaDaiLy = dl.MaDaiLy
        LEFT JOIN SieuThi st ON k.MaSieuThi = st.MaSieuThi
        ORDER BY k.NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Kho', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Kho_LayTheoID: Lấy Kho theo ID
CREATE OR ALTER PROCEDURE SP_Kho_LayTheoID
    @MaKho INT
AS
BEGIN
    BEGIN TRY
        SELECT k.MaKho, k.LoaiKho, k.MaDaiLy, k.MaSieuThi, k.TenKho, k.DiaChi, k.NgayTao
        FROM Kho k
        WHERE k.MaKho = @MaKho;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Kho theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Kho_LayTheoDaiLy: Lấy Kho theo Đại Lý
CREATE OR ALTER PROCEDURE SP_Kho_LayTheoDaiLy
    @MaDaiLy INT
AS
BEGIN
    BEGIN TRY
        SELECT MaKho, LoaiKho, TenKho, DiaChi, NgayTao
        FROM Kho
        WHERE MaDaiLy = @MaDaiLy
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Kho theo Đại Lý', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Kho_LayTheoSieuThi: Lấy Kho theo Siêu Thị
CREATE OR ALTER PROCEDURE SP_Kho_LayTheoSieuThi
    @MaSieuThi INT
AS
BEGIN
    BEGIN TRY
        SELECT MaKho, LoaiKho, TenKho, DiaChi, NgayTao
        FROM Kho
        WHERE MaSieuThi = @MaSieuThi
        ORDER BY NgayTao DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Kho theo Siêu Thị', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Kho_Them: Thêm Kho mới
CREATE OR ALTER PROCEDURE SP_Kho_Them
    @LoaiKho NVARCHAR(20),
    @MaDaiLy INT = NULL,
    @MaSieuThi INT = NULL,
    @TenKho NVARCHAR(100),
    @DiaChi NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        INSERT INTO Kho (LoaiKho, MaDaiLy, MaSieuThi, TenKho, DiaChi)
        VALUES (@LoaiKho, @MaDaiLy, @MaSieuThi, @TenKho, @DiaChi);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Kho mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Kho_CapNhat: Cập nhật Kho
CREATE OR ALTER PROCEDURE SP_Kho_CapNhat
    @MaKho INT,
    @TenKho NVARCHAR(100),
    @DiaChi NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        UPDATE Kho
        SET TenKho = @TenKho, DiaChi = @DiaChi
        WHERE MaKho = @MaKho;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Kho', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_Kho_Xoa: Xóa Kho
CREATE OR ALTER PROCEDURE SP_Kho_Xoa
    @MaKho INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM Kho WHERE MaKho = @MaKho;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Kho', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: TON KHO
===========================================================*/

-- SP_TonKho_LayTatCa: Lấy tất cả Tồn Kho
CREATE OR ALTER PROCEDURE SP_TonKho_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT tk.MaKho, tk.MaLo, tk.SoLuong, tk.CapNhatCuoi,
               k.TenKho, l.MaQR, sp.TenSanPham
        FROM TonKho tk
        LEFT JOIN Kho k ON tk.MaKho = k.MaKho
        LEFT JOIN LoNongSan l ON tk.MaLo = l.MaLo
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        ORDER BY tk.CapNhatCuoi DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Tồn Kho', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TonKho_LayTheoKho: Lấy Tồn Kho theo Kho
CREATE OR ALTER PROCEDURE SP_TonKho_LayTheoKho
    @MaKho INT
AS
BEGIN
    BEGIN TRY
        SELECT tk.MaKho, tk.MaLo, tk.SoLuong, tk.CapNhatCuoi,
               l.MaQR, sp.TenSanPham, l.HanSuDung
        FROM TonKho tk
        LEFT JOIN LoNongSan l ON tk.MaLo = l.MaLo
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        WHERE tk.MaKho = @MaKho
        ORDER BY tk.CapNhatCuoi DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Tồn Kho theo Kho', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TonKho_LayTheoLo: Lấy Tồn Kho theo Lô
CREATE OR ALTER PROCEDURE SP_TonKho_LayTheoLo
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        SELECT tk.MaKho, tk.MaLo, tk.SoLuong, tk.CapNhatCuoi,
               k.TenKho, sp.TenSanPham
        FROM TonKho tk
        LEFT JOIN Kho k ON tk.MaKho = k.MaKho
        LEFT JOIN LoNongSan l ON tk.MaLo = l.MaLo
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        WHERE tk.MaLo = @MaLo
        ORDER BY tk.CapNhatCuoi DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Tồn Kho theo Lô', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TonKho_Them: Thêm Tồn Kho mới
CREATE OR ALTER PROCEDURE SP_TonKho_Them
    @MaKho INT,
    @MaLo INT,
    @SoLuong DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        INSERT INTO TonKho (MaKho, MaLo, SoLuong)
        VALUES (@MaKho, @MaLo, @SoLuong);
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Tồn Kho mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TonKho_CapNhat: Cập nhật Tồn Kho
CREATE OR ALTER PROCEDURE SP_TonKho_CapNhat
    @MaKho INT,
    @MaLo INT,
    @SoLuong DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        UPDATE TonKho
        SET SoLuong = @SoLuong
        WHERE MaKho = @MaKho AND MaLo = @MaLo;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Tồn Kho', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_TonKho_Xoa: Xóa Tồn Kho
CREATE OR ALTER PROCEDURE SP_TonKho_Xoa
    @MaKho INT,
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM TonKho WHERE MaKho = @MaKho AND MaLo = @MaLo;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Tồn Kho', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: DON HANG
===========================================================*/

-- SP_DonHang_LayTatCa: Lấy tất cả Đơn Hàng
CREATE OR ALTER PROCEDURE SP_DonHang_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT dh.MaDonHang, dh.LoaiDon, dh.MaNongDan, dh.MaDaiLy, dh.MaSieuThi,
               dh.NgayDat, dh.NgayGiao, dh.TrangThai, dh.TongSoLuong, dh.TongGiaTri,
               COALESCE(nd.HoTen, dl.TenDaiLy, st.TenSieuThi, N'N/A') AS TenKhachHang
        FROM DonHang dh
        LEFT JOIN NongDan nd ON dh.MaNongDan = nd.MaNongDan
        LEFT JOIN DaiLy dl ON dh.MaDaiLy = dl.MaDaiLy
        LEFT JOIN SieuThi st ON dh.MaSieuThi = st.MaSieuThi
        ORDER BY dh.NgayDat DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Đơn Hàng', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonHang_LayTheoID: Lấy Đơn Hàng theo ID
CREATE OR ALTER PROCEDURE SP_DonHang_LayTheoID
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        SELECT dh.MaDonHang, dh.LoaiDon, dh.MaNongDan, dh.MaDaiLy, dh.MaSieuThi,
               dh.NgayDat, dh.NgayGiao, dh.TrangThai, dh.TongSoLuong, dh.TongGiaTri
        FROM DonHang dh
        WHERE dh.MaDonHang = @MaDonHang;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Đơn Hàng theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonHang_LayTheoNongDan: Lấy Đơn Hàng theo Nông Dân
CREATE OR ALTER PROCEDURE SP_DonHang_LayTheoNongDan
    @MaNongDan INT
AS
BEGIN
    BEGIN TRY
        SELECT MaDonHang, LoaiDon, NgayDat, NgayGiao, TrangThai, TongSoLuong, TongGiaTri
        FROM DonHang
        WHERE MaNongDan = @MaNongDan
        ORDER BY NgayDat DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Đơn Hàng theo Nông Dân', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonHang_LayTheoTrangThai: Lấy Đơn Hàng theo Trạng Thái
CREATE OR ALTER PROCEDURE SP_DonHang_LayTheoTrangThai
    @TrangThai NVARCHAR(30)
AS
BEGIN
    BEGIN TRY
        SELECT dh.MaDonHang, dh.LoaiDon, dh.MaNongDan, dh.MaDaiLy, dh.MaSieuThi,
               dh.NgayDat, dh.NgayGiao, dh.TrangThai, dh.TongSoLuong, dh.TongGiaTri
        FROM DonHang dh
        WHERE dh.TrangThai = @TrangThai
        ORDER BY dh.NgayDat DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Đơn Hàng theo Trạng Thái', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonHang_Them: Thêm Đơn Hàng mới
CREATE OR ALTER PROCEDURE SP_DonHang_Them
    @LoaiDon NVARCHAR(30),
    @MaNongDan INT = NULL,
    @MaDaiLy INT = NULL,
    @MaSieuThi INT = NULL,
    @TongSoLuong DECIMAL(18,2) = NULL,
    @TongGiaTri DECIMAL(18,2) = NULL
AS
BEGIN
    BEGIN TRY
        INSERT INTO DonHang (LoaiDon, MaNongDan, MaDaiLy, MaSieuThi, TongSoLuong, TongGiaTri)
        VALUES (@LoaiDon, @MaNongDan, @MaDaiLy, @MaSieuThi, @TongSoLuong, @TongGiaTri);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Đơn Hàng mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonHang_CapNhat: Cập nhật Đơn Hàng
CREATE OR ALTER PROCEDURE SP_DonHang_CapNhat
    @MaDonHang INT,
    @NgayGiao DATETIME2 = NULL,
    @TrangThai NVARCHAR(30) = NULL,
    @TongSoLuong DECIMAL(18,2) = NULL,
    @TongGiaTri DECIMAL(18,2) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE DonHang
        SET NgayGiao = CASE WHEN @NgayGiao IS NOT NULL THEN @NgayGiao ELSE NgayGiao END,
            TrangThai = CASE WHEN @TrangThai IS NOT NULL THEN @TrangThai ELSE TrangThai END,
            TongSoLuong = CASE WHEN @TongSoLuong IS NOT NULL THEN @TongSoLuong ELSE TongSoLuong END,
            TongGiaTri = CASE WHEN @TongGiaTri IS NOT NULL THEN @TongGiaTri ELSE TongGiaTri END
        WHERE MaDonHang = @MaDonHang;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Đơn Hàng', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonHang_Xoa: Xóa Đơn Hàng
CREATE OR ALTER PROCEDURE SP_DonHang_Xoa
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM DonHang WHERE MaDonHang = @MaDonHang;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Đơn Hàng', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: CHI TIET DON HANG
===========================================================*/

-- SP_ChiTietDonHang_LayTheoMaDonHang: Lấy Chi Tiết Đơn Hàng
CREATE OR ALTER PROCEDURE SP_ChiTietDonHang_LayTheoMaDonHang
    @MaDonHang INT
AS
BEGIN
    BEGIN TRY
        SELECT ctdh.MaDonHang, ctdh.MaLo, ctdh.SoLuong,
               l.MaQR, sp.TenSanPham, l.HanSuDung
        FROM ChiTietDonHang ctdh
        LEFT JOIN LoNongSan l ON ctdh.MaLo = l.MaLo
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        WHERE ctdh.MaDonHang = @MaDonHang;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Chi Tiết Đơn Hàng', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_ChiTietDonHang_Them: Thêm Chi Tiết Đơn Hàng
CREATE OR ALTER PROCEDURE SP_ChiTietDonHang_Them
    @MaDonHang INT,
    @MaLo INT,
    @SoLuong DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        INSERT INTO ChiTietDonHang (MaDonHang, MaLo, SoLuong)
        VALUES (@MaDonHang, @MaLo, @SoLuong);
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Chi Tiết Đơn Hàng', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_ChiTietDonHang_Xoa: Xóa Chi Tiết Đơn Hàng
CREATE OR ALTER PROCEDURE SP_ChiTietDonHang_Xoa
    @MaDonHang INT,
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM ChiTietDonHang WHERE MaDonHang = @MaDonHang AND MaLo = @MaLo;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Chi Tiết Đơn Hàng', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: DON VI VAN CHUYEN
===========================================================*/

-- SP_DonViVanChuyen_LayTatCa: Lấy tất cả Đơn Vị Vận Chuyển
CREATE OR ALTER PROCEDURE SP_DonViVanChuyen_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT MaDonViVanChuyen, TenDonVi, SoDienThoai, GhiChu, NgayTao
        FROM DonViVanChuyen
        ORDER BY NgayTao DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Đơn Vị Vận Chuyển', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonViVanChuyen_LayTheoID: Lấy Đơn Vị Vận Chuyển theo ID
CREATE OR ALTER PROCEDURE SP_DonViVanChuyen_LayTheoID
    @MaDonViVanChuyen INT
AS
BEGIN
    BEGIN TRY
        SELECT MaDonViVanChuyen, TenDonVi, SoDienThoai, GhiChu, NgayTao
        FROM DonViVanChuyen
        WHERE MaDonViVanChuyen = @MaDonViVanChuyen;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Đơn Vị Vận Chuyển theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonViVanChuyen_Them: Thêm Đơn Vị Vận Chuyển mới
CREATE OR ALTER PROCEDURE SP_DonViVanChuyen_Them
    @TenDonVi NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @GhiChu NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        INSERT INTO DonViVanChuyen (TenDonVi, SoDienThoai, GhiChu)
        VALUES (@TenDonVi, @SoDienThoai, @GhiChu);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Đơn Vị Vận Chuyển mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonViVanChuyen_CapNhat: Cập nhật Đơn Vị Vận Chuyển
CREATE OR ALTER PROCEDURE SP_DonViVanChuyen_CapNhat
    @MaDonViVanChuyen INT,
    @TenDonVi NVARCHAR(100),
    @SoDienThoai NVARCHAR(20),
    @GhiChu NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        UPDATE DonViVanChuyen
        SET TenDonVi = @TenDonVi, SoDienThoai = @SoDienThoai, GhiChu = @GhiChu
        WHERE MaDonViVanChuyen = @MaDonViVanChuyen;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Đơn Vị Vận Chuyển', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_DonViVanChuyen_Xoa: Xóa Đơn Vị Vận Chuyển
CREATE OR ALTER PROCEDURE SP_DonViVanChuyen_Xoa
    @MaDonViVanChuyen INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM DonViVanChuyen WHERE MaDonViVanChuyen = @MaDonViVanChuyen;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Đơn Vị Vận Chuyển', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: PHIEU VAN CHUYEN
===========================================================*/

-- SP_PhieuVanChuyen_LayTatCa: Lấy tất cả Phiếu Vận Chuyển
CREATE OR ALTER PROCEDURE SP_PhieuVanChuyen_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT pvc.MaPhieuVC, pvc.MaLo, pvc.MaKhoXuat, pvc.MaKhoNhap, pvc.MaDonViVanChuyen,
               pvc.NgayXuat, pvc.NgayDen, pvc.TrangThai,
               l.MaQR, sp.TenSanPham, kx.TenKho AS TenKhoXuat, kn.TenKho AS TenKhoNhap,
               dvc.TenDonVi
        FROM PhieuVanChuyen pvc
        LEFT JOIN LoNongSan l ON pvc.MaLo = l.MaLo
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        LEFT JOIN Kho kx ON pvc.MaKhoXuat = kx.MaKho
        LEFT JOIN Kho kn ON pvc.MaKhoNhap = kn.MaKho
        LEFT JOIN DonViVanChuyen dvc ON pvc.MaDonViVanChuyen = dvc.MaDonViVanChuyen
        ORDER BY pvc.NgayXuat DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Phiếu Vận Chuyển', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_PhieuVanChuyen_LayTheoID: Lấy Phiếu Vận Chuyển theo ID
CREATE OR ALTER PROCEDURE SP_PhieuVanChuyen_LayTheoID
    @MaPhieuVC INT
AS
BEGIN
    BEGIN TRY
        SELECT pvc.MaPhieuVC, pvc.MaLo, pvc.MaKhoXuat, pvc.MaKhoNhap, pvc.MaDonViVanChuyen,
               pvc.NgayXuat, pvc.NgayDen, pvc.TrangThai
        FROM PhieuVanChuyen pvc
        WHERE pvc.MaPhieuVC = @MaPhieuVC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Phiếu Vận Chuyển theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_PhieuVanChuyen_LayTheoTrangThai: Lấy Phiếu Vận Chuyển theo Trạng Thái
CREATE OR ALTER PROCEDURE SP_PhieuVanChuyen_LayTheoTrangThai
    @TrangThai NVARCHAR(30)
AS
BEGIN
    BEGIN TRY
        SELECT pvc.MaPhieuVC, pvc.MaLo, pvc.MaKhoXuat, pvc.MaKhoNhap, pvc.MaDonViVanChuyen,
               pvc.NgayXuat, pvc.NgayDen, pvc.TrangThai
        FROM PhieuVanChuyen pvc
        WHERE pvc.TrangThai = @TrangThai
        ORDER BY pvc.NgayXuat DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Phiếu Vận Chuyển theo Trạng Thái', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_PhieuVanChuyen_Them: Thêm Phiếu Vận Chuyển mới
CREATE OR ALTER PROCEDURE SP_PhieuVanChuyen_Them
    @MaLo INT,
    @MaKhoXuat INT = NULL,
    @MaKhoNhap INT = NULL,
    @MaDonViVanChuyen INT = NULL
AS
BEGIN
    BEGIN TRY
        INSERT INTO PhieuVanChuyen (MaLo, MaKhoXuat, MaKhoNhap, MaDonViVanChuyen)
        VALUES (@MaLo, @MaKhoXuat, @MaKhoNhap, @MaDonViVanChuyen);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Phiếu Vận Chuyển mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_PhieuVanChuyen_CapNhat: Cập nhật Phiếu Vận Chuyển
CREATE OR ALTER PROCEDURE SP_PhieuVanChuyen_CapNhat
    @MaPhieuVC INT,
    @NgayDen DATETIME2 = NULL,
    @TrangThai NVARCHAR(30) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE PhieuVanChuyen
        SET NgayDen = CASE WHEN @NgayDen IS NOT NULL THEN @NgayDen ELSE NgayDen END,
            TrangThai = CASE WHEN @TrangThai IS NOT NULL THEN @TrangThai ELSE TrangThai END
        WHERE MaPhieuVC = @MaPhieuVC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Phiếu Vận Chuyển', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_PhieuVanChuyen_Xoa: Xóa Phiếu Vận Chuyển
CREATE OR ALTER PROCEDURE SP_PhieuVanChuyen_Xoa
    @MaPhieuVC INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM PhieuVanChuyen WHERE MaPhieuVC = @MaPhieuVC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Phiếu Vận Chuyển', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

/*===========================================================
  STORED PROCEDURES: KIEM DINH
===========================================================*/

-- SP_KiemDinh_LayTatCa: Lấy tất cả Kiểm Định
CREATE OR ALTER PROCEDURE SP_KiemDinh_LayTatCa
AS
BEGIN
    BEGIN TRY
        SELECT kd.MaKiemDinh, kd.MaLo, kd.MaDaiLy, kd.MaSieuThi,
               kd.NgayKiemDinh, kd.KetQua, kd.BienBan, kd.ChuKySo, kd.GhiChu,
               l.MaQR, sp.TenSanPham
        FROM KiemDinh kd
        LEFT JOIN LoNongSan l ON kd.MaLo = l.MaLo
        LEFT JOIN SanPham sp ON l.MaSanPham = sp.MaSanPham
        ORDER BY kd.NgayKiemDinh DESC;
        RETURN 0;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy danh sách Kiểm Định', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_KiemDinh_LayTheoID: Lấy Kiểm Định theo ID
CREATE OR ALTER PROCEDURE SP_KiemDinh_LayTheoID
    @MaKiemDinh INT
AS
BEGIN
    BEGIN TRY
        SELECT kd.MaKiemDinh, kd.MaLo, kd.MaDaiLy, kd.MaSieuThi,
               kd.NgayKiemDinh, kd.KetQua, kd.BienBan, kd.ChuKySo, kd.GhiChu
        FROM KiemDinh kd
        WHERE kd.MaKiemDinh = @MaKiemDinh;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Kiểm Định theo ID', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_KiemDinh_LayTheoLo: Lấy Kiểm Định theo Lô
CREATE OR ALTER PROCEDURE SP_KiemDinh_LayTheoLo
    @MaLo INT
AS
BEGIN
    BEGIN TRY
        SELECT MaKiemDinh, MaLo, MaDaiLy, MaSieuThi,
               NgayKiemDinh, KetQua, BienBan, ChuKySo, GhiChu
        FROM KiemDinh
        WHERE MaLo = @MaLo
        ORDER BY NgayKiemDinh DESC;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi lấy Kiểm Định theo Lô', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_KiemDinh_Them: Thêm Kiểm Định mới
CREATE OR ALTER PROCEDURE SP_KiemDinh_Them
    @MaLo INT,
    @MaDaiLy INT = NULL,
    @MaSieuThi INT = NULL,
    @KetQua NVARCHAR(20),
    @BienBan NVARCHAR(MAX) = NULL,
    @ChuKySo NVARCHAR(255) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        INSERT INTO KiemDinh (MaLo, MaDaiLy, MaSieuThi, KetQua, BienBan, ChuKySo, GhiChu)
        VALUES (@MaLo, @MaDaiLy, @MaSieuThi, @KetQua, @BienBan, @ChuKySo, @GhiChu);
        RETURN SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi thêm Kiểm Định mới', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_KiemDinh_CapNhat: Cập nhật Kiểm Định
CREATE OR ALTER PROCEDURE SP_KiemDinh_CapNhat
    @MaKiemDinh INT,
    @KetQua NVARCHAR(20) = NULL,
    @BienBan NVARCHAR(MAX) = NULL,
    @ChuKySo NVARCHAR(255) = NULL,
    @GhiChu NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        UPDATE KiemDinh
        SET KetQua = CASE WHEN @KetQua IS NOT NULL THEN @KetQua ELSE KetQua END,
            BienBan = CASE WHEN @BienBan IS NOT NULL THEN @BienBan ELSE BienBan END,
            ChuKySo = CASE WHEN @ChuKySo IS NOT NULL THEN @ChuKySo ELSE ChuKySo END,
            GhiChu = CASE WHEN @GhiChu IS NOT NULL THEN @GhiChu ELSE GhiChu END
        WHERE MaKiemDinh = @MaKiemDinh;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi cập nhật Kiểm Định', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- SP_KiemDinh_Xoa: Xóa Kiểm Định
CREATE OR ALTER PROCEDURE SP_KiemDinh_Xoa
    @MaKiemDinh INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM KiemDinh WHERE MaKiemDinh = @MaKiemDinh;
        RETURN @@ROWCOUNT;
    END TRY
    BEGIN CATCH
        RAISERROR('Lỗi xóa Kiểm Định', 16, 1);
        RETURN -1;
    END CATCH
END;
GO

-- DATABASE COMPLETE
