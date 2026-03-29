-- =====================================================
-- THÊM DỮ LIỆU MẪU ĐẦY ĐỦ
-- Để test giao diện và API
-- =====================================================

USE BTL_HDV1;
GO

PRINT '========================================';
PRINT 'THÊM DỮ LIỆU MẪU';
PRINT '========================================';
PRINT '';

-- =====================================================
-- BẢNG TRANG TRẠI
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TrangTrai')
BEGIN
    CREATE TABLE TrangTrai (
        MaTrangTrai INT PRIMARY KEY IDENTITY(1,1),
        MaNongDan INT NOT NULL,
        TenTrangTrai NVARCHAR(200) NOT NULL,
        DiaChi NVARCHAR(500),
        DienTich DECIMAL(10,2),
        NgayThanhLap DATE,
        FOREIGN KEY (MaNongDan) REFERENCES NongDan(MaNongDan)
    );
    PRINT 'Bảng TrangTrai đã được tạo';
END
GO

-- Thêm trang trại mẫu
IF NOT EXISTS (SELECT * FROM TrangTrai)
BEGIN
    INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, DienTich, NgayThanhLap)
    VALUES 
        (1, N'Trang trại rau sạch Đà Lạt', N'Xã Tân Lập, Huyện Đức Trọng, Lâm Đồng', 5.5, '2020-01-15'),
        (1, N'Vườn dâu tây Đà Lạt', N'Xã Đạ Ròn, Huyện Đơn Dương, Lâm Đồng', 3.2, '2021-03-20'),
        (2, N'Trang trại hoa hồng', N'Phường 3, TP. Đà Lạt, Lâm Đồng', 2.8, '2019-06-10'),
        (2, N'Vườn cà chua cherry', N'Xã Xuân Trường, Huyện Đà Lạt, Lâm Đồng', 4.0, '2020-09-05');
    PRINT 'Đã thêm 4 trang trại';
END
GO

-- =====================================================
-- BẢNG SẢN PHẨM
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SanPham')
BEGIN
    CREATE TABLE SanPham (
        MaSanPham INT PRIMARY KEY IDENTITY(1,1),
        TenSanPham NVARCHAR(200) NOT NULL,
        LoaiSanPham NVARCHAR(100),
        DonViTinh NVARCHAR(50),
        MoTa NVARCHAR(500)
    );
    PRINT 'Bảng SanPham đã được tạo';
END
GO

-- Thêm sản phẩm mẫu
IF NOT EXISTS (SELECT * FROM SanPham)
BEGIN
    INSERT INTO SanPham (TenSanPham, LoaiSanPham, DonViTinh, MoTa)
    VALUES 
        (N'Rau cải xanh', N'Rau ăn lá', N'kg', N'Rau cải xanh tươi, không thuốc trừ sâu'),
        (N'Cà chua cherry', N'Rau ăn quả', N'kg', N'Cà chua cherry ngọt, màu đỏ tươi'),
        (N'Dâu tây Đà Lạt', N'Trái cây', N'kg', N'Dâu tây tươi, ngọt tự nhiên'),
        (N'Hoa hồng', N'Hoa', N'bó', N'Hoa hồng tươi, nhiều màu sắc'),
        (N'Xà lách', N'Rau ăn lá', N'kg', N'Xà lách giòn, tươi mát'),
        (N'Cà rốt', N'Củ', N'kg', N'Cà rốt tươi, giàu vitamin A'),
        (N'Bông cải xanh', N'Rau ăn hoa', N'kg', N'Bông cải xanh tươi, giàu dinh dưỡng'),
        (N'Dưa leo', N'Rau ăn quả', N'kg', N'Dưa leo tươi, giòn ngọt');
    PRINT 'Đã thêm 8 sản phẩm';
END
GO

-- =====================================================
-- BẢNG LÔ NÔNG SẢN
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LoNongSan')
BEGIN
    CREATE TABLE LoNongSan (
        MaLo INT PRIMARY KEY IDENTITY(1,1),
        MaTrangTrai INT NOT NULL,
        MaSanPham INT NOT NULL,
        SoLuongBanDau DECIMAL(10,2),
        SoLuongHienTai DECIMAL(10,2),
        NgayTao DATE,
        NgayThuHoach DATE,
        TrangThai NVARCHAR(50),
        FOREIGN KEY (MaTrangTrai) REFERENCES TrangTrai(MaTrangTrai),
        FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
    );
    PRINT 'Bảng LoNongSan đã được tạo';
END
GO

-- Thêm lô nông sản mẫu
IF NOT EXISTS (SELECT * FROM LoNongSan)
BEGIN
    INSERT INTO LoNongSan (MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai, NgayTao, NgayThuHoach, TrangThai)
    VALUES 
        (1, 1, 500, 450, '2024-01-10', '2024-01-15', N'tai_trang_trai'),
        (1, 5, 300, 280, '2024-01-12', '2024-01-17', N'tai_trang_trai'),
        (2, 3, 200, 150, '2024-01-08', '2024-01-13', N'dang_van_chuyen'),
        (3, 4, 100, 80, '2024-01-05', '2024-01-10', N'da_giao'),
        (4, 2, 400, 400, '2024-01-15', '2024-01-20', N'tai_trang_trai'),
        (1, 6, 350, 320, '2024-01-11', '2024-01-16', N'tai_trang_trai'),
        (2, 3, 180, 100, '2024-01-09', '2024-01-14', N'dang_van_chuyen'),
        (4, 7, 250, 250, '2024-01-14', '2024-01-19', N'tai_trang_trai');
    PRINT 'Đã thêm 8 lô nông sản';
END
GO

-- =====================================================
-- BẢNG KHO (cho Đại Lý)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Kho')
BEGIN
    CREATE TABLE Kho (
        MaKho INT PRIMARY KEY IDENTITY(1,1),
        MaDaiLy INT NOT NULL,
        TenKho NVARCHAR(200),
        DiaChi NVARCHAR(500),
        DienTich DECIMAL(10,2),
        SucChua DECIMAL(10,2),
        FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy)
    );
    PRINT 'Bảng Kho đã được tạo';
END
GO

-- Thêm kho mẫu
IF NOT EXISTS (SELECT * FROM Kho)
BEGIN
    INSERT INTO Kho (MaDaiLy, TenKho, DiaChi, DienTich, SucChua)
    VALUES 
        (1, N'Kho lạnh số 1', N'123 Đường 3/2, TP. Đà Lạt', 200, 5000),
        (1, N'Kho thường số 2', N'125 Đường 3/2, TP. Đà Lạt', 150, 3000),
        (2, N'Kho trung tâm', N'456 Đường Trần Phú, TP. Đà Lạt', 300, 8000);
    PRINT 'Đã thêm 3 kho';
END
GO

-- =====================================================
-- BẢNG ĐƠN HÀNG ĐẠI LÝ
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DonHangDaiLy')
BEGIN
    CREATE TABLE DonHangDaiLy (
        MaDonHang INT PRIMARY KEY IDENTITY(1,1),
        MaDaiLy INT NOT NULL,
        MaNongDan INT NOT NULL,
        NgayDat DATE,
        NgayGiao DATE,
        TongGiaTri DECIMAL(15,2),
        TrangThai NVARCHAR(50),
        GhiChu NVARCHAR(500),
        FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy),
        FOREIGN KEY (MaNongDan) REFERENCES NongDan(MaNongDan)
    );
    PRINT 'Bảng DonHangDaiLy đã được tạo';
END
GO

-- Thêm đơn hàng đại lý mẫu
IF NOT EXISTS (SELECT * FROM DonHangDaiLy)
BEGIN
    INSERT INTO DonHangDaiLy (MaDaiLy, MaNongDan, NgayDat, NgayGiao, TongGiaTri, TrangThai, GhiChu)
    VALUES 
        (1, 1, '2024-01-10', '2024-01-15', 15000000, N'hoan_thanh', N'Giao hàng đúng hạn'),
        (1, 2, '2024-01-12', '2024-01-17', 8500000, N'dang_xu_ly', N'Đang chuẩn bị hàng'),
        (2, 1, '2024-01-11', '2024-01-16', 12000000, N'cho_xu_ly', N'Chờ xác nhận'),
        (1, 1, '2024-01-13', '2024-01-18', 9500000, N'cho_xu_ly', N'Đơn hàng mới'),
        (2, 2, '2024-01-09', '2024-01-14', 18000000, N'hoan_thanh', N'Đã giao thành công');
    PRINT 'Đã thêm 5 đơn hàng đại lý';
END
GO

-- =====================================================
-- BẢNG ĐƠN HÀNG SIÊU THỊ
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DonHangSieuThi')
BEGIN
    CREATE TABLE DonHangSieuThi (
        MaDonHang INT PRIMARY KEY IDENTITY(1,1),
        MaSieuThi INT NOT NULL,
        MaDaiLy INT NOT NULL,
        NgayDat DATE,
        NgayGiao DATE,
        TongGiaTri DECIMAL(15,2),
        TrangThai NVARCHAR(50),
        GhiChu NVARCHAR(500),
        FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi),
        FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy)
    );
    PRINT 'Bảng DonHangSieuThi đã được tạo';
END
GO

-- Thêm đơn hàng siêu thị mẫu
IF NOT EXISTS (SELECT * FROM DonHangSieuThi)
BEGIN
    INSERT INTO DonHangSieuThi (MaSieuThi, MaDaiLy, NgayDat, NgayGiao, TongGiaTri, TrangThai, GhiChu)
    VALUES 
        (1, 1, '2024-01-10', '2024-01-12', 25000000, N'hoan_thanh', N'Giao hàng đầy đủ'),
        (1, 2, '2024-01-12', '2024-01-14', 18000000, N'dang_xu_ly', N'Đang vận chuyển'),
        (2, 1, '2024-01-11', '2024-01-13', 22000000, N'cho_xu_ly', N'Chờ xác nhận'),
        (1, 1, '2024-01-13', '2024-01-15', 30000000, N'cho_xu_ly', N'Đơn hàng lớn'),
        (2, 2, '2024-01-09', '2024-01-11', 20000000, N'hoan_thanh', N'Hoàn thành tốt');
    PRINT 'Đã thêm 5 đơn hàng siêu thị';
END
GO

-- =====================================================
-- KIỂM TRA KẾT QUẢ
-- =====================================================
PRINT '';
PRINT '========================================';
PRINT 'TỔNG KẾT DỮ LIỆU';
PRINT '========================================';
PRINT '';

SELECT 'TaiKhoan' AS BangDuLieu, COUNT(*) AS SoLuong FROM TaiKhoan
UNION ALL
SELECT 'NongDan', COUNT(*) FROM NongDan
UNION ALL
SELECT 'DaiLy', COUNT(*) FROM DaiLy
UNION ALL
SELECT 'SieuThi', COUNT(*) FROM SieuThi
UNION ALL
SELECT 'TrangTrai', COUNT(*) FROM TrangTrai
UNION ALL
SELECT 'SanPham', COUNT(*) FROM SanPham
UNION ALL
SELECT 'LoNongSan', COUNT(*) FROM LoNongSan
UNION ALL
SELECT 'Kho', COUNT(*) FROM Kho
UNION ALL
SELECT 'DonHangDaiLy', COUNT(*) FROM DonHangDaiLy
UNION ALL
SELECT 'DonHangSieuThi', COUNT(*) FROM DonHangSieuThi;

PRINT '';
PRINT 'HOÀN TẤT THÊM DỮ LIỆU MẪU!';
PRINT '';
