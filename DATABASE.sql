/*
  DATABASE: QL_NongSan
  QUAN LY NONG SAN & CHUOI CUNG CAP
  Từ trang trại -> đại lý -> siêu thị
*/



CREATE DATABASE QL_NongSan;
GO
USE QL_NongSan;
GO


-- 1. ADMIN
CREATE TABLE Admin (
    MaAdmin INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
    MatKhauHash NVARCHAR(255) NOT NULL,
    HoTen NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    TrangThai NVARCHAR(20) DEFAULT N'hoat_dong',
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);

-- 2. NONG DAN
CREATE TABLE NongDan (
    MaNongDan INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
    MatKhauHash NVARCHAR(255) NOT NULL,
    HoTen NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    TrangThai NVARCHAR(20) DEFAULT N'hoat_dong',
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);

-- 3. DAI LY
CREATE TABLE DaiLy (
    MaDaiLy INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
    MatKhauHash NVARCHAR(255) NOT NULL,
    TenDaiLy NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    DiaChi NVARCHAR(255),
    TrangThai NVARCHAR(20) DEFAULT N'hoat_dong',
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);

-- 4. SIEU THI
CREATE TABLE SieuThi (
    MaSieuThi INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
    MatKhauHash NVARCHAR(255) NOT NULL,
    TenSieuThi NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    DiaChi NVARCHAR(255),
    TrangThai NVARCHAR(20) DEFAULT N'hoat_dong',
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);

-- 5. TRANG TRAI
CREATE TABLE TrangTrai (
    MaTrangTrai INT IDENTITY(1,1) PRIMARY KEY,
    MaNongDan INT NOT NULL,
    TenTrangTrai NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255),
    SoChungNhan NVARCHAR(50),
    NgayTao DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (MaNongDan) REFERENCES NongDan(MaNongDan)
);

-- 6. SAN PHAM
CREATE TABLE SanPham (
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
    TenSanPham NVARCHAR(100) NOT NULL,
    DonViTinh NVARCHAR(20) NOT NULL,
    MoTa NVARCHAR(255),
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);

-- 7. LO NONG SAN
CREATE TABLE LoNongSan (
    MaLo INT IDENTITY(1,1) PRIMARY KEY,
    MaTrangTrai INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuongBanDau DECIMAL(18,2) NOT NULL,
    SoLuongHienTai DECIMAL(18,2) NOT NULL,
    NgayThuHoach DATE,
    HanSuDung DATE,
    SoChungNhanLo NVARCHAR(50),
    MaQR NVARCHAR(255),
    TrangThai NVARCHAR(30) DEFAULT N'tai_trang_trai',
    NgayTao DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (MaTrangTrai) REFERENCES TrangTrai(MaTrangTrai),
    FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);

-- 8. KHO
CREATE TABLE Kho (
    MaKho INT IDENTITY(1,1) PRIMARY KEY,
    LoaiKho NVARCHAR(20) NOT NULL,  -- trung_gian / sieu_thi
    MaDaiLy INT NULL,
    MaSieuThi INT NULL,
    TenKho NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255),
    NgayTao DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy),
    FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi)
);

-- 9. TON KHO
CREATE TABLE TonKho (
    MaKho INT NOT NULL,
    MaLo INT NOT NULL,
    SoLuong DECIMAL(18,2) NOT NULL,
    CapNhatCuoi DATETIME2 DEFAULT SYSDATETIME(),
    PRIMARY KEY (MaKho, MaLo),
    FOREIGN KEY (MaKho) REFERENCES Kho(MaKho),
    FOREIGN KEY (MaLo) REFERENCES LoNongSan(MaLo)
);

-- 10. DON HANG
CREATE TABLE DonHang (
    MaDonHang INT IDENTITY(1,1) PRIMARY KEY,
    LoaiDon NVARCHAR(30) NOT NULL,   -- nongdan_to_daily / daily_to_sieuthi
    MaNongDan INT NULL,
    MaDaiLy INT NULL,
    MaSieuThi INT NULL,
    NgayDat DATETIME2 DEFAULT SYSDATETIME(),
    NgayGiao DATETIME2 NULL,
    TrangThai NVARCHAR(30) DEFAULT N'cho_xu_ly',
    TongSoLuong DECIMAL(18,2) NULL,
    TongGiaTri DECIMAL(18,2) NULL,
    FOREIGN KEY (MaNongDan) REFERENCES NongDan(MaNongDan),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy),
    FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi)
);

-- 11. CHI TIET DON HANG
CREATE TABLE ChiTietDonHang (
    MaDonHang INT NOT NULL,
    MaLo INT NOT NULL,
    SoLuong DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (MaDonHang, MaLo),
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaLo) REFERENCES LoNongSan(MaLo)
);

-- 12. DON VI VAN CHUYEN
CREATE TABLE DonViVanChuyen (
    MaDonViVanChuyen INT IDENTITY(1,1) PRIMARY KEY,
    TenDonVi NVARCHAR(100) NOT NULL,
    SoDienThoai NVARCHAR(20),
    GhiChu NVARCHAR(255),
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);

-- 13. PHIEU VAN CHUYEN
CREATE TABLE PhieuVanChuyen (
    MaPhieuVC INT IDENTITY(1,1) PRIMARY KEY,
    MaLo INT NOT NULL,
    MaKhoXuat INT NULL,
    MaKhoNhap INT NULL,
    MaDonViVanChuyen INT NULL,
    NgayXuat DATETIME2 DEFAULT SYSDATETIME(),
    NgayDen DATETIME2 NULL,
    TrangThai NVARCHAR(30) DEFAULT N'dang_van_chuyen',
    FOREIGN KEY (MaLo) REFERENCES LoNongSan(MaLo),
    FOREIGN KEY (MaKhoXuat) REFERENCES Kho(MaKho),
    FOREIGN KEY (MaKhoNhap) REFERENCES Kho(MaKho),
    FOREIGN KEY (MaDonViVanChuyen) REFERENCES DonViVanChuyen(MaDonViVanChuyen)
);

-- 14. KIEM DINH
CREATE TABLE KiemDinh (
    MaKiemDinh INT IDENTITY(1,1) PRIMARY KEY,
    MaLo INT NOT NULL,
    MaDaiLy INT NULL,
    MaSieuThi INT NULL,
    NgayKiemDinh DATETIME2 DEFAULT SYSDATETIME(),
    KetQua NVARCHAR(20) NOT NULL,     -- Dat / KhongDat / A/B/C
    BienBan NVARCHAR(MAX) NULL,
    ChuKySo NVARCHAR(255) NULL,
    GhiChu NVARCHAR(255),
    FOREIGN KEY (MaLo) REFERENCES LoNongSan(MaLo),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy),
    FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi)
);


INSERT INTO Admin (TenDangNhap, MatKhauHash, HoTen, SoDienThoai, Email)
VALUES 
('admin1', 'hash1', N'Nguyễn Văn A', '0901000001', 'a1@gmail.com'),
('admin2', 'hash2', N'Trần Văn B', '0901000002', 'a2@gmail.com'),
('admin3', 'hash3', N'Lê Văn C', '0901000003', 'a3@gmail.com'),
('admin4', 'hash4', N'Phạm Văn D', '0901000004', 'a4@gmail.com'),
('admin5', 'hash5', N'Hồ Văn E', '0901000005', 'a5@gmail.com');


INSERT INTO NongDan (TenDangNhap, MatKhauHash, HoTen, SoDienThoai, Email)
VALUES
('nd1', 'hash1', N'Nguyễn Nông 1', '0902000001', 'nd1@gmail.com'),
('nd2', 'hash2', N'Trần Nông 2', '0902000002', 'nd2@gmail.com'),
('nd3', 'hash3', N'Lê Nông 3', '0902000003', 'nd3@gmail.com'),
('nd4', 'hash4', N'Phạm Nông 4', '0902000004', 'nd4@gmail.com'),
('nd5', 'hash5', N'Hồ Nông 5', '0902000005', 'nd5@gmail.com');


INSERT INTO DaiLy (TenDangNhap, MatKhauHash, TenDaiLy, SoDienThoai, Email, DiaChi)
VALUES
('dl1', 'hash1', N'Đại Lý 1', '0903000001', 'dl1@gmail.com', N'Hà Nội'),
('dl2', 'hash2', N'Đại Lý 2', '0903000002', 'dl2@gmail.com', N'Hải Phòng'),
('dl3', 'hash3', N'Đại Lý 3', '0903000003', 'dl3@gmail.com', N'Đà Nẵng'),
('dl4', 'hash4', N'Đại Lý 4', '0903000004', 'dl4@gmail.com', N'Hồ Chí Minh'),
('dl5', 'hash5', N'Đại Lý 5', '0903000005', 'dl5@gmail.com', N'Cần Thơ');


INSERT INTO SieuThi (TenDangNhap, MatKhauHash, TenSieuThi, SoDienThoai, Email, DiaChi)
VALUES
('st1', 'hash1', N'Siêu Thị 1', '0904000001', 'st1@gmail.com', N'Hà Nội'),
('st2', 'hash2', N'Siêu Thị 2', '0904000002', 'st2@gmail.com', N'Hải Phòng'),
('st3', 'hash3', N'Siêu Thị 3', '0904000003', 'st3@gmail.com', N'Đà Nẵng'),
('st4', 'hash4', N'Siêu Thị 4', '0904000004', 'st4@gmail.com', N'Hồ Chí Minh'),
('st5', 'hash5', N'Siêu Thị 5', '0904000005', 'st5@gmail.com', N'Cần Thơ');


INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, SoChungNhan)
VALUES
(1, N'Trang trại A', N'Hà Nội', 'CERT-A'),
(2, N'Trang trại B', N'Hải Phòng', 'CERT-B'),
(3, N'Trang trại C', N'Đà Nẵng', 'CERT-C'),
(4, N'Trang trại D', N'HCM', 'CERT-D'),
(5, N'Trang trại E', N'Cần Thơ', 'CERT-E');


INSERT INTO SanPham (TenSanPham, DonViTinh, MoTa)
VALUES
(N'Rau cải', N'kg', N'Rau cải xanh'),
(N'Cà chua', N'kg', N'Cà chua sạch'),
(N'Khoai tây', N'kg', N'Khoai tây Đà Lạt'),
(N'Hành lá', N'kg', N'Hành tươi'),
(N'Dưa chuột', N'kg', N'Dưa sạch');


INSERT INTO LoNongSan (MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai, NgayThuHoach, HanSuDung, SoChungNhanLo, MaQR)
VALUES
(1, 1, 100, 100, '2025-01-01', '2025-02-01', 'L001', 'QR001'),
(2, 2, 200, 200, '2025-01-05', '2025-02-10', 'L002', 'QR002'),
(3, 3, 150, 150, '2025-01-10', '2025-02-15', 'L003', 'QR003'),
(4, 4, 180, 180, '2025-01-12', '2025-02-20', 'L004', 'QR004'),
(5, 5, 220, 220, '2025-01-15', '2025-02-25', 'L005', 'QR005');


INSERT INTO Kho (LoaiKho, MaDaiLy, MaSieuThi, TenKho, DiaChi)
VALUES
(N'trung_gian', 1, NULL, N'Kho DL1', N'Hà Nội'),
(N'trung_gian', 2, NULL, N'Kho DL2', N'Hải Phòng'),
(N'sieu_thi', NULL, 1, N'Kho ST1', N'Hà Nội'),
(N'sieu_thi', NULL, 2, N'Kho ST2', N'Hải Phòng'),
(N'sieu_thi', NULL, 3, N'Kho ST3', N'Đà Nẵng');


INSERT INTO TonKho (MaKho, MaLo, SoLuong)
VALUES
(1, 1, 50),
(2, 2, 80),
(3, 3, 100),
(4, 4, 120),
(5, 5, 150);

INSERT INTO DonHang (LoaiDon, MaNongDan, MaDaiLy, MaSieuThi, TongSoLuong, TongGiaTri)
VALUES
(N'nongdan_to_daily', 1, 1, NULL, 50, 500000),
(N'nongdan_to_daily', 2, 2, NULL, 80, 800000),
(N'daily_to_sieuthi', NULL, 1, 1, 100, 1200000),
(N'daily_to_sieuthi', NULL, 2, 2, 120, 1400000),
(N'daily_to_sieuthi', NULL, 3, 3, 150, 1800000);

INSERT INTO ChiTietDonHang (MaDonHang, MaLo, SoLuong)
VALUES
(1, 1, 20),
(2, 2, 40),
(3, 3, 30),
(4, 4, 50),
(5, 5, 60);


INSERT INTO DonViVanChuyen (TenDonVi, SoDienThoai, GhiChu)
VALUES
(N'VC Express', '0905000001', N'Nhanh'),
(N'GHN', '0905000002', N'Tiết kiệm'),
(N'ViettelPost', '0905000003', N'Uy tín'),
(N'J&T', '0905000004', N'Giao sớm'),
(N'BEST', '0905000005', N'Quốc tế');


INSERT INTO PhieuVanChuyen (MaLo, MaKhoXuat, MaKhoNhap, MaDonViVanChuyen)
VALUES
(1, 1, 3, 1),
(2, 2, 4, 2),
(3, 3, 5, 3),
(4, 4, 1, 4),
(5, 5, 2, 5);


INSERT INTO KiemDinh (MaLo, MaDaiLy, MaSieuThi, KetQua, GhiChu)
VALUES
(1, 1, NULL, N'Dat', N'Đạt tiêu chuẩn'),
(2, 2, NULL, N'KhongDat', N'Lỗi sâu bệnh'),
(3, NULL, 1, N'Dat', N'Hàng tươi'),
(4, NULL, 2, N'Dat', N'Chất lượng tốt'),
(5, NULL, 3, N'B', N'Loại B');
