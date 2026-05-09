-- ============================================================================
-- DATABASE BTL_HDV1 - PHIÊN BẢN ĐẦY ĐỦ
-- Bao gồm: Tất cả bảng + Bảng KiemDinhDonHang (kiểm định đơn hàng)
-- ============================================================================

-- Xóa database cũ nếu tồn tại
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'BTL_HDV1')
BEGIN
    ALTER DATABASE BTL_HDV1 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BTL_HDV1;
END
GO

-- Tạo database mới
CREATE DATABASE BTL_HDV1;
GO

USE BTL_HDV1;
GO

PRINT '========================================';
PRINT 'TẠO CÁC BẢNG';
PRINT '========================================';
PRINT '';

-- 1. TAI KHOAN (Bảng chung cho authentication)
CREATE TABLE TaiKhoan (
    MaTaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
    MatKhau NVARCHAR(255) NOT NULL,
    LoaiTaiKhoan NVARCHAR(20) NOT NULL, -- 'admin', 'nongdan', 'daily', 'sieuthi'
    TrangThai NVARCHAR(20) DEFAULT N'hoat_dong', -- hoat_dong, khoa, da_xoa
    NgayTao DATETIME2 DEFAULT SYSDATETIME(),
    LanDangNhapCuoi DATETIME2 NULL
);
PRINT '✓ Đã tạo bảng TaiKhoan';

-- 2. ADMIN
CREATE TABLE Admin (
    MaAdmin INT IDENTITY(1,1) PRIMARY KEY,
    MaTaiKhoan INT UNIQUE NOT NULL,
    HoTen NVARCHAR(100),
    SoDienThoai NVARCHAR(20),
    Email NVARCHAR(100),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);
PRINT '✓ Đã tạo bảng Admin';

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
PRINT '✓ Đã tạo bảng NongDan';

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
PRINT '✓ Đã tạo bảng DaiLy';

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
PRINT '✓ Đã tạo bảng SieuThi';

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
PRINT '✓ Đã tạo bảng TrangTrai';

-- 7. SAN PHAM
CREATE TABLE SanPham (
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
    TenSanPham NVARCHAR(100) NOT NULL,
    DonViTinh NVARCHAR(20) NOT NULL,
    MoTa NVARCHAR(255),
    NgayTao DATETIME2 DEFAULT SYSDATETIME()
);
PRINT '✓ Đã tạo bảng SanPham';

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
PRINT '✓ Đã tạo bảng LoNongSan';

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
PRINT '✓ Đã tạo bảng Kho';

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
PRINT '✓ Đã tạo bảng TonKho';

-- 11. DON HANG (Bảng cha chung)
CREATE TABLE DonHang (
    MaDonHang INT IDENTITY(1,1) PRIMARY KEY,
    LoaiDon NVARCHAR(30) NOT NULL, -- 'daily_to_nongdan' hoặc 'sieuthi_to_daily'
    NgayDat DATETIME2 DEFAULT SYSDATETIME(),
    NgayGiao DATETIME2 NULL,
    TrangThai NVARCHAR(30) DEFAULT N'chua_nhan', -- chua_nhan, cho_kiem_dinh, da_nhan, hoan_don, da_huy
    TongSoLuong DECIMAL(18,2) NULL,
    TongGiaTri DECIMAL(18,2) NULL,
    GhiChu NVARCHAR(255)
);
PRINT '✓ Đã tạo bảng DonHang';

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
PRINT '✓ Đã tạo bảng DonHangDaiLy';

-- 13. DON HANG SIEU THI -> DAI LY
CREATE TABLE DonHangSieuThi (
    MaDonHang INT PRIMARY KEY,
    MaSieuThi INT NOT NULL,
    MaDaiLy INT NOT NULL,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaSieuThi) REFERENCES SieuThi(MaSieuThi),
    FOREIGN KEY (MaDaiLy) REFERENCES DaiLy(MaDaiLy)
);
PRINT '✓ Đã tạo bảng DonHangSieuThi';

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
PRINT '✓ Đã tạo bảng ChiTietDonHang';

-- 15. KIEM DINH DON HANG (MỚI - Kiểm định đơn hàng từ nông dân)
CREATE TABLE KiemDinhDonHang (
    MaKiemDinh INT IDENTITY(1,1) PRIMARY KEY,
    MaDonHang INT NOT NULL,
    MaDaiLy INT NOT NULL,
    MaNongDan INT NOT NULL,
    
    -- Thông tin kiểm định
    NgayKiemDinh DATETIME NOT NULL DEFAULT GETDATE(),
    NguoiKiemDinh NVARCHAR(100),
    KetQua NVARCHAR(20) NOT NULL CHECK (KetQua IN (N'dat', N'khong_dat')),
    
    -- Thông tin kho (nếu đạt)
    MaKho INT NULL,
    
    -- Chi tiết kiểm định
    ChatLuong NVARCHAR(50), -- tot, kha, trung_binh, kem
    DoAn DECIMAL(5,2), -- % độ ẩm
    TapChat DECIMAL(5,2), -- % tạp chất
    MauSac NVARCHAR(50),
    MuiVi NVARCHAR(100),
    
    -- Ghi chú và biên bản
    GhiChu NVARCHAR(500),
    BienBan NVARCHAR(MAX),
    
    -- Hình ảnh kiểm định (JSON array)
    HinhAnh NVARCHAR(MAX),
    
    -- Chữ ký số
    ChuKySo NVARCHAR(255),
    
    -- Audit
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    
    -- Foreign Keys
    CONSTRAINT FK_KiemDinhDonHang_DonHang FOREIGN KEY (MaDonHang) 
        REFERENCES DonHangDaiLy(MaDonHang),
    CONSTRAINT FK_KiemDinhDonHang_DaiLy FOREIGN KEY (MaDaiLy) 
        REFERENCES DaiLy(MaDaiLy),
    CONSTRAINT FK_KiemDinhDonHang_NongDan FOREIGN KEY (MaNongDan) 
        REFERENCES NongDan(MaNongDan),
    CONSTRAINT FK_KiemDinhDonHang_Kho FOREIGN KEY (MaKho) 
        REFERENCES Kho(MaKho)
);
PRINT '✓ Đã tạo bảng KiemDinhDonHang';

-- Tạo indexes cho KiemDinhDonHang
CREATE INDEX IX_KiemDinhDonHang_MaDonHang ON KiemDinhDonHang(MaDonHang);
CREATE INDEX IX_KiemDinhDonHang_MaDaiLy ON KiemDinhDonHang(MaDaiLy);
CREATE INDEX IX_KiemDinhDonHang_MaNongDan ON KiemDinhDonHang(MaNongDan);
CREATE INDEX IX_KiemDinhDonHang_NgayKiemDinh ON KiemDinhDonHang(NgayKiemDinh);
CREATE INDEX IX_KiemDinhDonHang_KetQua ON KiemDinhDonHang(KetQua);
PRINT '✓ Đã tạo indexes cho KiemDinhDonHang';

PRINT '';
PRINT '========================================';
PRINT 'HOÀN THÀNH TẠO DATABASE';
PRINT '========================================';
PRINT '';
PRINT 'ĐÃ TẠO:';
PRINT '- 15 bảng (bao gồm KiemDinhDonHang)';
PRINT '- 5 indexes cho KiemDinhDonHang';
PRINT '';
PRINT 'TIẾP THEO: Chạy file sp_BTL_FULL.sql để tạo stored procedures';
PRINT '';
PRINT '========================================';
GO
