-- =============================================
-- Stored Procedures cho SieuThiService - SQL Server
-- =============================================

-- 1. Kiểm tra siêu thị có tồn tại không
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CheckSieuThiExists]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CheckSieuThiExists]
GO

CREATE PROCEDURE [dbo].[sp_CheckSieuThiExists]
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(1) as ExistsCount
    FROM SieuThi 
    WHERE MaSieuThi = @MaSieuThi;
END
GO

-- 2. Lấy thông tin đơn hàng theo ID
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetDonHangById]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetDonHangById]
GO

CREATE PROCEDURE [dbo].[sp_GetDonHangById]
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        dh.MaDonHang,
        dh.LoaiDon,
        dh.NgayDat,
        dh.NgayGiao,
        dh.TrangThai,
        dh.TongSoLuong,
        dh.TongGiaTri,
        dh.GhiChu,
        dhst.MaSieuThi,
        dhst.MaDaiLy,
        st.TenSieuThi
    FROM DonHang dh
    INNER JOIN DonHangSieuThi dhst ON dh.MaDonHang = dhst.MaDonHang
    LEFT JOIN SieuThi st ON dhst.MaSieuThi = st.MaSieuThi
    WHERE dh.MaDonHang = @MaDonHang;
    
    -- Lấy chi tiết đơn hàng
    SELECT 
        ct.MaLo,
        ct.SoLuong,
        ct.DonGia,
        ct.ThanhTien
    FROM ChiTietDonHang ct
    WHERE ct.MaDonHang = @MaDonHang;
END
GO

-- 3. Lấy danh sách đơn hàng theo siêu thị
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetDonHangsBySieuThi]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetDonHangsBySieuThi]
GO

CREATE PROCEDURE [dbo].[sp_GetDonHangsBySieuThi]
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        dh.MaDonHang,
        dh.LoaiDon,
        dh.NgayDat,
        dh.NgayGiao,
        dh.TrangThai,
        dh.TongSoLuong,
        dh.TongGiaTri,
        dh.GhiChu,
        dhst.MaSieuThi,
        dhst.MaDaiLy,
        st.TenSieuThi
    FROM DonHang dh
    INNER JOIN DonHangSieuThi dhst ON dh.MaDonHang = dhst.MaDonHang
    LEFT JOIN SieuThi st ON dhst.MaSieuThi = st.MaSieuThi
    WHERE dhst.MaSieuThi = @MaSieuThi
    ORDER BY dh.NgayDat DESC;
END
GO

-- 4. Lấy chi tiết đơn hàng theo mã đơn hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetChiTietDonHangByMaDonHang]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetChiTietDonHangByMaDonHang]
GO

CREATE PROCEDURE [dbo].[sp_GetChiTietDonHangByMaDonHang]
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ct.MaLo,
        ct.SoLuong,
        ct.DonGia,
        ct.ThanhTien
    FROM ChiTietDonHang ct
    WHERE ct.MaDonHang = @MaDonHang;
END
GO

-- 5. Lấy danh sách kho theo siêu thị (thông tin cơ bản)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetDanhSachKhoBySieuThi]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetDanhSachKhoBySieuThi]
GO

CREATE PROCEDURE [dbo].[sp_GetDanhSachKhoBySieuThi]
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        k.MaKho,
        k.TenKho,
        k.LoaiKho,
        k.DiaChi,
        k.TrangThai,
        k.NgayTao,
        COUNT(tk.MaLo) as TongSoLoHang,
        ISNULL(SUM(tk.SoLuong), 0) as TongSoLuong
    FROM Kho k
    LEFT JOIN TonKho tk ON k.MaKho = tk.MaKho
    WHERE k.MaSieuThi = @MaSieuThi
    GROUP BY k.MaKho, k.TenKho, k.LoaiKho, k.DiaChi, k.TrangThai, k.NgayTao;
END
GO

-- 6. Lấy thông tin chi tiết kho hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetKhoHangById]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetKhoHangById]
GO

CREATE PROCEDURE [dbo].[sp_GetKhoHangById]
    @MaKho INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Thông tin kho
    SELECT 
        k.MaKho,
        k.TenKho,
        k.LoaiKho,
        k.DiaChi,
        k.TrangThai,
        k.NgayTao,
        k.MaSieuThi,
        st.TenSieuThi
    FROM Kho k
    LEFT JOIN SieuThi st ON k.MaSieuThi = st.MaSieuThi
    WHERE k.MaKho = @MaKho;
    
    -- Tồn kho
    SELECT 
        tk.MaLo,
        tk.SoLuong,
        tk.CapNhatCuoi,
        CASE WHEN tk.SoLuong > 0 THEN 'con_hang' ELSE 'het_hang' END as TrangThaiLo
    FROM TonKho tk
    WHERE tk.MaKho = @MaKho;
END
GO

-- 7. Kiểm tra tên kho đã tồn tại trong siêu thị
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CheckKhoNameExists]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CheckKhoNameExists]
GO

CREATE PROCEDURE [dbo].[sp_CheckKhoNameExists]
    @MaSieuThi INT,
    @TenKho NVARCHAR(255),
    @MaKho INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @MaKho IS NULL
    BEGIN
        SELECT COUNT(1) as ExistsCount
        FROM Kho 
        WHERE MaSieuThi = @MaSieuThi AND TenKho = @TenKho;
    END
    ELSE
    BEGIN
        SELECT COUNT(1) as ExistsCount
        FROM Kho 
        WHERE MaSieuThi = @MaSieuThi AND TenKho = @TenKho AND MaKho != @MaKho;
    END
END
GO

-- 8. Kiểm tra kho có tồn kho không
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CheckKhoHasTonKho]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CheckKhoHasTonKho]
GO

CREATE PROCEDURE [dbo].[sp_CheckKhoHasTonKho]
    @MaKho INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(1) as HasTonKho
    FROM TonKho 
    WHERE MaKho = @MaKho;
END
GO

-- 9. Lấy thông tin đơn hàng để kiểm tra trạng thái
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetDonHangForStatusCheck]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetDonHangForStatusCheck]
GO

CREATE PROCEDURE [dbo].[sp_GetDonHangForStatusCheck]
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        dh.MaDonHang,
        dh.TrangThai,
        dhst.MaSieuThi
    FROM DonHang dh
    INNER JOIN DonHangSieuThi dhst ON dh.MaDonHang = dhst.MaDonHang
    WHERE dh.MaDonHang = @MaDonHang;
END
GO

-- 10. Kiểm tra kho thuộc siêu thị và đang hoạt động
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CheckKhoValidForReceive]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CheckKhoValidForReceive]
GO

CREATE PROCEDURE [dbo].[sp_CheckKhoValidForReceive]
    @MaKho INT,
    @MaSieuThi INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(1) as IsValid
    FROM Kho 
    WHERE MaKho = @MaKho AND MaSieuThi = @MaSieuThi AND TrangThai = 'hoat_dong';
END
GO

-- 11. Lấy chi tiết đơn hàng để nhận hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetChiTietDonHangForReceive]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetChiTietDonHangForReceive]
GO

CREATE PROCEDURE [dbo].[sp_GetChiTietDonHangForReceive]
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ct.MaLo,
        ct.SoLuong
    FROM ChiTietDonHang ct
    WHERE ct.MaDonHang = @MaDonHang;
END
GO

-- 12. Kiểm tra tồn kho hiện tại
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetTonKhoByKhoAndLo]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_GetTonKhoByKhoAndLo]
GO

CREATE PROCEDURE [dbo].[sp_GetTonKhoByKhoAndLo]
    @MaKho INT,
    @MaLo INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        MaKho,
        MaLo,
        SoLuong
    FROM TonKho 
    WHERE MaKho = @MaKho AND MaLo = @MaLo;
END
GO

-- 13. Tính tổng số lượng và giá trị đơn hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CalculateDonHangTotals]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CalculateDonHangTotals]
GO

CREATE PROCEDURE [dbo].[sp_CalculateDonHangTotals]
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ISNULL(SUM(SoLuong), 0) as TongSoLuong,
        ISNULL(SUM(ThanhTien), 0) as TongGiaTri
    FROM ChiTietDonHang 
    WHERE MaDonHang = @MaDonHang;
END
GO

-- 14. Kiểm tra chi tiết đơn hàng tồn tại
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CheckChiTietDonHangExists]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CheckChiTietDonHangExists]
GO

CREATE PROCEDURE [dbo].[sp_CheckChiTietDonHangExists]
    @MaDonHang INT,
    @MaLo INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(1) as ExistsCount
    FROM ChiTietDonHang 
    WHERE MaDonHang = @MaDonHang AND MaLo = @MaLo;
END
GO

-- 15. Đếm số chi tiết đơn hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CountChiTietDonHang]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CountChiTietDonHang]
GO

CREATE PROCEDURE [dbo].[sp_CountChiTietDonHang]
    @MaDonHang INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(1) as SoChiTiet
    FROM ChiTietDonHang 
    WHERE MaDonHang = @MaDonHang;
END
GO

-- 16. Tính tổng số lượng và giá trị đơn hàng (loại trừ một lô)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CalculateDonHangTotalsExcludeLo]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_CalculateDonHangTotalsExcludeLo]
GO

CREATE PROCEDURE [dbo].[sp_CalculateDonHangTotalsExcludeLo]
    @MaDonHang INT,
    @MaLo INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ISNULL(SUM(SoLuong), 0) as TongSoLuong,
        ISNULL(SUM(ThanhTien), 0) as TongGiaTri
    FROM ChiTietDonHang 
    WHERE MaDonHang = @MaDonHang AND MaLo != @MaLo;
END
GO