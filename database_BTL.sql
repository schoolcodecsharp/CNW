Create database BTL_HDV1


USE BTL_HDV1;

-- 1. TAI KHOAN (Bảng chung cho authentication)
CREATE TABLE TaiKhoan (
    MaTaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
    MatKhau NVARCHAR(255) NOT NULL,
    LoaiTaiKhoan NVARCHAR(20) NOT NULL, -- 'admin', 'nongdan', 'daily', 'sieuthi'
    TrangThai NVARCHAR(20) DEFAULT N'hoat_dong', -- hoat_dong, khoa
    NgayTao DATETIME2 DEFAULT SYSDATETIME(),
    LanDangNhapCuoi DATETIME2 NULL
);

-- 2. ADMIN
CREATE TABLE Admin (
    MaAdmin INT IDENTITY(1,1) PRIMARY KEY,
    MaTaiKhoan INT UNIQUE NOT NULL,
    HoTen NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

-- 3. NONG DAN
CREATE TABLE NongDan (
    MaNongDan INT IDENTITY(1,1) PRIMARY KEY,
    MaTaiKhoan INT UNIQUE NOT NULL,
    HoTen NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    DiaChi NVARCHAR(255),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

-- 4. DAI LY
CREATE TABLE DaiLy (
    MaDaiLy INT IDENTITY(1,1) PRIMARY KEY,
    MaTaiKhoan INT UNIQUE NOT NULL,
    TenDaiLy NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    DiaChi NVARCHAR(255),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

-- 5. SIEU THI
CREATE TABLE SieuThi (
    MaSieuThi INT IDENTITY(1,1) PRIMARY KEY,
    MaTaiKhoan INT UNIQUE NOT NULL,
    TenSieuThi NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    DiaChi NVARCHAR(255),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

-- 6. TRANG TRAI
CREATE TABLE TrangTrai (
    MaTrangTrai INT IDENTITY(1,1) PRIMARY KEY,
    MaNongDan INT NOT NULL,
    TenTrangTrai NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255),
    SoChungNhan NVARCHAR(50),
    NgayTao DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (MaNongDan) REFERENCES NongDan(MaNongDan)
);

-- 7. SAN PHAM
CREATE TABLE SanPham (
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
    TenSanPham NVARCHAR(100) NOT NULL,
    DonViTinh NVARCHAR(20) NOT NULL,
    MoTa NVARCHAR(255),
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);

-- 8. LO NONG SAN
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

-- 9. KHO
CREATE TABLE Kho (
    MaKho INT IDENTITY(1,1) PRIMARY KEY,
    LoaiKho NVARCHAR(20) NOT NULL,  -- 'daily' hoặc 'sieuthi'
    MaDaiLy INT NULL,
    MaSieuThi INT NULL,
    TenKho NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255),
    TrangThai NVARCHAR(20) DEFAULT N'hoat_dong',
    NgayTao DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy),
    FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi)
);

-- 10. TON KHO
CREATE TABLE TonKho (
    MaKho INT NOT NULL,
    MaLo INT NOT NULL,
    SoLuong DECIMAL(18,2) NOT NULL,
    CapNhatCuoi DATETIME2 DEFAULT SYSDATETIME(),
    PRIMARY KEY (MaKho, MaLo),
    FOREIGN KEY (MaKho) REFERENCES Kho(MaKho),
    FOREIGN KEY (MaLo) REFERENCES LoNongSan(MaLo)
);

-- 11. DON HANG (Bảng cha chung)
CREATE TABLE DonHang (
    MaDonHang INT IDENTITY(1,1) PRIMARY KEY,
    LoaiDon NVARCHAR(30) NOT NULL, -- 'daily_to_nongdan' hoặc 'sieuthi_to_daily'
    NgayDat DATETIME2 DEFAULT SYSDATETIME(),
    NgayGiao DATETIME2 NULL,
    TrangThai NVARCHAR(30) DEFAULT N'chua_nhan', -- chua_nhan, da_nhan, dang_xu_ly, hoan_thanh, da_huy
    TongSoLuong DECIMAL(18,2) NULL,
    TongGiaTri DECIMAL(18,2) NULL,
    GhiChu NVARCHAR(255)
);

-- 12. DON HANG DAI LY -> NONG DAN
CREATE TABLE DonHangDaiLy (
    MaDonHang INT PRIMARY KEY,
    MaDaiLy INT NOT NULL,
    MaNongDan INT NOT NULL,
    MaKho INT NULL,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy),
    FOREIGN KEY (MaNongDan) REFERENCES NongDan(MaNongDan),
    FOREIGN KEY (MaKho) REFERENCES Kho(MaKho)
);

-- 13. DON HANG SIEU THI -> DAI LY
CREATE TABLE DonHangSieuThi (
    MaDonHang INT PRIMARY KEY,
    MaSieuThi INT NOT NULL,
    MaDaiLy INT NOT NULL,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy)
);

-- 14. CHI TIET DON HANG (Chung cho cả 2 loại)
CREATE TABLE ChiTietDonHang (
    MaDonHang INT NOT NULL,
    MaLo INT NOT NULL,
    SoLuong DECIMAL(18,2) NOT NULL,
    DonGia DECIMAL(18,2) NULL,
    ThanhTien DECIMAL(18,2) NULL,
    PRIMARY KEY (MaDonHang, MaLo),
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaLo) REFERENCES LoNongSan(MaLo)
);

-- 15. KIEM DINH
CREATE TABLE KiemDinh (
    MaKiemDinh INT IDENTITY(1,1) PRIMARY KEY,
    MaLo INT NOT NULL,
    NguoiKiemDinh NVARCHAR(100),
    MaDaiLy INT NULL,
    MaSieuThi INT NULL,
    NgayKiemDinh DATETIME2 DEFAULT SYSDATETIME(),
    KetQua NVARCHAR(20) NOT NULL, -- 'dat', 'khong_dat', 'A', 'B', 'C'
    TrangThai NVARCHAR(20) DEFAULT N'hoan_thanh',
    BienBan NVARCHAR(MAX) NULL,
    ChuKySo NVARCHAR(255) NULL,
    GhiChu NVARCHAR(255),
    FOREIGN KEY (MaLo) REFERENCES LoNongSan(MaLo),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy),
    FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi)
);


-- ============================================================================
-- INSERT DỮ LIỆU MẪU - 5 DÒNG MỖI BẢNG
-- ============================================================================

USE BTL_HDV1;

-- 1. INSERT TaiKhoan (5 dòng)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
VALUES 
    ('admin01', 'admin123', 'admin', N'hoat_dong'),
    ('nongdan01', 'nongdan123', 'nongdan', N'hoat_dong'),
    ('nongdan02', 'nongdan123', 'nongdan', N'hoat_dong'),
    ('daily01', 'daily123', 'daily', N'hoat_dong'),
    ('sieuthi01', 'sieuthi123', 'sieuthi', N'hoat_dong');

-- 2. INSERT Admin (5 dòng)
INSERT INTO Admin (MaTaiKhoan, HoTen, SoDienThoai, Email)
VALUES 
    (1, N'Nguyễn Văn Admin', '0912345678', 'admin@example.com'),
    (1, N'Trần Thị Quản Lý', '0923456789', 'manager@example.com'),
    (1, N'Phạm Văn Quân', '0934567890', 'quan@example.com'),
    (1, N'Lê Thị Hà', '0945678901', 'ha@example.com'),
    (1, N'Hoàng Văn Tuấn', '0956789012', 'tuan@example.com');

-- 3. INSERT NongDan (5 dòng)
INSERT INTO NongDan (MaTaiKhoan, HoTen, SoDienThoai, Email, DiaChi)
VALUES 
    (2, N'Bùi Văn Tâm', '0967890123', 'tam@farm.com', N'Hà Nội'),
    (3, N'Đặng Thị Lan', '0978901234', 'lan@farm.com', N'Hải Phòng'),
    (2, N'Võ Văn Hùng', '0989012345', 'hung@farm.com', N'TP. Hồ Chí Minh'),
    (3, N'Nguyễn Thị Hương', '0990123456', 'huong@farm.com', N'Đà Nẵng'),
    (2, N'Phạm Văn Minh', '0901234567', 'minh@farm.com', N'Cần Thơ');

-- 4. INSERT DaiLy (5 dòng)
INSERT INTO DaiLy (MaTaiKhoan, TenDaiLy, SoDienThoai, Email, DiaChi)
VALUES 
    (4, N'Đại Lý Nông Sản An Phú', '0912111111', 'anphu@daily.com', N'52 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'),
    (4, N'Đại Lý Sản Phẩm Nông Nghiệp Hùng', '0913222222', 'hung@daily.com', N'45 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh'),
    (4, N'Đại Lý Nông Sản Sạch Đức', '0914333333', 'duc@daily.com', N'38 Pasteur, Quận 1, TP. Hồ Chí Minh'),
    (4, N'Đại Lý Nông Sản Minh Châu', '0915444444', 'minchau@daily.com', N'25 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh'),
    (4, N'Đại Lý Nông Sản Phát Tiến', '0916555555', 'phattien@daily.com', N'100 Đặng Dung, Quận Phú Nhuận, TP. Hồ Chí Minh');

-- 5. INSERT SieuThi (5 dòng)
INSERT INTO SieuThi (MaTaiKhoan, TenSieuThi, SoDienThoai, Email, DiaChi)
VALUES 
    (5, N'Siêu Thị Co.opmart', '0917666666', 'coopmart@supermarket.com', N'Tô Ký, Quận 12, TP. Hồ Chí Minh'),
    (5, N'Siêu Thị Saigon Co.op', '0918777777', 'saigon@supermarket.com', N'Cộng Hòa, Tân Bình, TP. Hồ Chí Minh'),
    (5, N'Siêu Thị Big C', '0919888888', 'bigc@supermarket.com', N'Lê Văn Sỹ, Phú Nhuận, TP. Hồ Chí Minh'),
    (5, N'Siêu Thị Loteria', '0920999999', 'loteria@supermarket.com', N'Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh'),
    (5, N'Siêu Thị Aeon Mall', '0921111111', 'aeon@supermarket.com', N'Võ Văn Kiệt, Quận 1, TP. Hồ Chí Minh');

-- 6. INSERT TrangTrai (5 dòng)
INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, SoChungNhan)
VALUES 
    (1, N'Trang Trại Xanh Sạch Tâm', N'Hà Nội', 'CC001'),
    (2, N'Trang Trại Lan Hương', N'Hải Phòng', 'CC002'),
    (3, N'Trang Trại Đồng Quê', N'TP. Hồ Chí Minh', 'CC003'),
    (4, N'Trang Trại Đà Nẵng Sạch', N'Đà Nẵng', 'CC004'),
    (5, N'Trang Trại Cần Thơ', N'Cần Thơ', 'CC005');

-- 7. INSERT SanPham (5 dòng)
INSERT INTO SanPham (TenSanPham, DonViTinh, MoTa)
VALUES 
    (N'Cà Chua', N'kg', N'Cà chua tươi, đỏ, chất lượng cao'),
    (N'Dưa Chuột', N'kg', N'Dưa chuột xanh, tươi mát'),
    (N'Cà Rốt', N'kg', N'Cà rốt cam, ngọt, lành mạnh'),
    (N'Bắp Cây', N'kg', N'Bắp ngô tươi, vàng ươm'),
    (N'Hành Tây', N'kg', N'Hành tây nhập khẩu, tím, ngon');

-- 8. INSERT LoNongSan (5 dòng)
INSERT INTO LoNongSan (MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai, NgayThuHoach, HanSuDung, SoChungNhanLo, MaQR, TrangThai)
VALUES 
    (1, 1, 1000, 950, '2025-01-01', '2025-01-15', 'LOT001', 'QR001', N'tai_trang_trai'),
    (2, 2, 800, 750, '2025-01-02', '2025-01-10', 'LOT002', 'QR002', N'tai_trang_trai'),
    (3, 3, 1200, 1100, '2025-01-03', '2025-01-20', 'LOT003', 'QR003', N'tai_trang_trai'),
    (4, 4, 600, 550, '2025-01-04', '2025-01-12', 'LOT004', 'QR004', N'tai_trang_trai'),
    (5, 5, 900, 850, '2025-01-05', '2025-01-18', 'LOT005', 'QR005', N'tai_trang_trai');

-- 9. INSERT Kho (5 dòng)
INSERT INTO Kho (LoaiKho, MaDaiLy, MaSieuThi, TenKho, DiaChi, TrangThai)
VALUES 
    ('daily', 1, NULL, N'Kho Đại Lý An Phú', N'52 Nguyễn Huệ, Q1', N'hoat_dong'),
    ('daily', 2, NULL, N'Kho Đại Lý Hùng', N'45 Lý Thường Kiệt, Q10', N'hoat_dong'),
    ('sieuthi', NULL, 1, N'Kho Co.opmart', N'Tô Ký, Q12', N'hoat_dong'),
    ('sieuthi', NULL, 2, N'Kho Saigon Co.op', N'Cộng Hòa, Tân Bình', N'hoat_dong'),
    ('daily', 3, NULL, N'Kho Đại Lý Đức', N'38 Pasteur, Q1', N'hoat_dong');

-- 10. INSERT TonKho (5 dòng)
INSERT INTO TonKho (MaKho, MaLo, SoLuong)
VALUES 
    (1, 1, 200),
    (1, 2, 150),
    (2, 3, 300),
    (3, 4, 100),
    (4, 5, 250);

-- 11. INSERT DonHang (5 dòng)
INSERT INTO DonHang (LoaiDon, NgayDat, NgayGiao, TrangThai, TongSoLuong, TongGiaTri, GhiChu)
VALUES 
    ('daily_to_nongdan', '2025-01-05 08:00:00', '2025-01-06 14:00:00', N'hoan_thanh', 500, 5000000, N'Đơn hàng cà chua'),
    ('sieuthi_to_daily', '2025-01-06 09:00:00', '2025-01-07 16:00:00', N'hoan_thanh', 300, 3500000, N'Đơn hàng dưa chuột'),
    ('daily_to_nongdan', '2025-01-07 10:00:00', NULL, N'dang_xu_ly', 400, 4200000, N'Đơn hàng cà rốt'),
    ('sieuthi_to_daily', '2025-01-08 11:00:00', NULL, N'chua_nhan', 600, 7200000, N'Đơn hàng bắp cây'),
    ('daily_to_nongdan', '2025-01-09 12:00:00', NULL, N'chua_nhan', 350, 3500000, N'Đơn hàng hành tây');

-- 12. INSERT DonHangDaiLy (5 dòng)
INSERT INTO DonHangDaiLy (MaDonHang, MaDaiLy, MaNongDan)
VALUES 
    (1, 1, 1),
    (3, 2, 2),
    (5, 3, 3),
    (2, 4, 4),
    (4, 5, 5);

-- 13. INSERT DonHangSieuThi (5 dòng)
INSERT INTO DonHangSieuThi (MaDonHang, MaSieuThi, MaDaiLy)
VALUES 
    (2, 1, 1),
    (4, 2, 2),
    (3, 3, 3),
    (1, 4, 4),
    (5, 5, 5);

-- 14. INSERT ChiTietDonHang (5 dòng)
INSERT INTO ChiTietDonHang (MaDonHang, MaLo, SoLuong, DonGia, ThanhTien)
VALUES 
    (1, 1, 100, 10000, 1000000),
    (2, 2, 80, 15000, 1200000),
    (3, 3, 150, 12000, 1800000),
    (4, 4, 120, 18000, 2160000),
    (5, 5, 100, 10000, 1000000);

-- 15. INSERT KiemDinh (5 dòng)
INSERT INTO KiemDinh (MaLo, NguoiKiemDinh, MaDaiLy, MaSieuThi, NgayKiemDinh, KetQua, TrangThai, BienBan, GhiChu)
VALUES 
    (1, N'Trần Quý', 1, NULL, '2025-01-05 09:00:00', N'dat', N'hoan_thanh', N'Chất lượng tốt, không có bệnh', N'Đạt tiêu chuẩn'),
    (2, N'Lê Minh', 2, NULL, '2025-01-05 10:00:00', N'dat', N'hoan_thanh', N'Tươi ngon, đúng chuẩn', N'Đạt tiêu chuẩn'),
    (3, N'Nguyễn Sơn', NULL, 1, '2025-01-06 08:00:00', N'dat', N'hoan_thanh', N'Độ tươi 100%, mầu sắc đep', N'Đạt tiêu chuẩn'),
    (4, N'Phạm Dũng', NULL, 2, '2025-01-06 09:00:00', N'khong_dat', N'hoan_thanh', N'Không đạt tiêu chuẩn vệ sinh', N'Từ chối nhập kho'),
    (5, N'Hoàng Tùng', 3, NULL, '2025-01-07 10:00:00', N'dat', N'hoan_thanh', N'Chất lượng cao, tươi mới', N'Đạt tiêu chuẩn');



