-- ============================================================================
-- INSERT DỮ LIỆU MẪU - DATABASE BTL_HDV1
-- 50 bản ghi mỗi bảng (hoặc số lượng phù hợp theo quan hệ)
-- Tài khoản mặc định: st1 (siêu thị), dl1 (đại lý), nd1 (nông dân) - mật khẩu: 123456
-- ============================================================================

USE BTL_HDV1;
GO

PRINT '========================================';
PRINT 'XÓA DỮ LIỆU CŨ';
PRINT '========================================';

-- Xóa dữ liệu theo thứ tự ngược lại (từ bảng con đến bảng cha)
DELETE FROM KiemDinhDonHangSieuThi;
DELETE FROM KiemDinhDonHang;
DELETE FROM ChiTietDonHang;
DELETE FROM DonHangSieuThi;
DELETE FROM DonHangDaiLy;
DELETE FROM DonHang;
DELETE FROM KiemDinh;
DELETE FROM TonKho;
DELETE FROM Kho;
DELETE FROM LoNongSan;
DELETE FROM SanPham;
DELETE FROM TrangTrai;
DELETE FROM SieuThi;
DELETE FROM DaiLy;
DELETE FROM NongDan;
DELETE FROM Admin;
DELETE FROM TaiKhoan;

-- Reset identity
DBCC CHECKIDENT ('TaiKhoan', RESEED, 0);
DBCC CHECKIDENT ('Admin', RESEED, 0);
DBCC CHECKIDENT ('NongDan', RESEED, 0);
DBCC CHECKIDENT ('DaiLy', RESEED, 0);
DBCC CHECKIDENT ('SieuThi', RESEED, 0);
DBCC CHECKIDENT ('TrangTrai', RESEED, 0);
DBCC CHECKIDENT ('SanPham', RESEED, 0);
DBCC CHECKIDENT ('LoNongSan', RESEED, 0);
DBCC CHECKIDENT ('Kho', RESEED, 0);
DBCC CHECKIDENT ('DonHang', RESEED, 0);
DBCC CHECKIDENT ('KiemDinh', RESEED, 0);
DBCC CHECKIDENT ('KiemDinhDonHang', RESEED, 0);
DBCC CHECKIDENT ('KiemDinhDonHangSieuThi', RESEED, 0);

PRINT '✓ Đã xóa dữ liệu cũ và reset identity';
PRINT '';

PRINT '========================================';
PRINT 'INSERT DỮ LIỆU MỚI';
PRINT '========================================';
PRINT '';

-- ============================================================
-- 1. TAIKHOAN
-- ============================================================
-- Lưu ý: Mật khẩu '123456' để dạng plain text (hoặc hash tuỳ ứng dụng)
-- Ở đây insert thẳng '123456' — bạn có thể thay bằng hash nếu cần

INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai) VALUES
-- Admin (1)
(N'admin1', N'123456', N'admin', N'hoat_dong'),

-- Nông dân: nd1 -> nd20 (20 tài khoản)
(N'nd1',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd2',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd3',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd4',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd5',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd6',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd7',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd8',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd9',  N'123456', N'nongdan', N'hoat_dong'),
(N'nd10', N'123456', N'nongdan', N'hoat_dong'),
(N'nd11', N'123456', N'nongdan', N'hoat_dong'),
(N'nd12', N'123456', N'nongdan', N'hoat_dong'),
(N'nd13', N'123456', N'nongdan', N'hoat_dong'),
(N'nd14', N'123456', N'nongdan', N'hoat_dong'),
(N'nd15', N'123456', N'nongdan', N'hoat_dong'),
(N'nd16', N'123456', N'nongdan', N'hoat_dong'),
(N'nd17', N'123456', N'nongdan', N'hoat_dong'),
(N'nd18', N'123456', N'nongdan', N'hoat_dong'),
(N'nd19', N'123456', N'nongdan', N'hoat_dong'),
(N'nd20', N'123456', N'nongdan', N'hoat_dong'),

-- Đại lý: dl1 -> dl15 (15 tài khoản)
(N'dl1',  N'123456', N'daily', N'hoat_dong'),
(N'dl2',  N'123456', N'daily', N'hoat_dong'),
(N'dl3',  N'123456', N'daily', N'hoat_dong'),
(N'dl4',  N'123456', N'daily', N'hoat_dong'),
(N'dl5',  N'123456', N'daily', N'hoat_dong'),
(N'dl6',  N'123456', N'daily', N'hoat_dong'),
(N'dl7',  N'123456', N'daily', N'hoat_dong'),
(N'dl8',  N'123456', N'daily', N'hoat_dong'),
(N'dl9',  N'123456', N'daily', N'hoat_dong'),
(N'dl10', N'123456', N'daily', N'hoat_dong'),
(N'dl11', N'123456', N'daily', N'hoat_dong'),
(N'dl12', N'123456', N'daily', N'hoat_dong'),
(N'dl13', N'123456', N'daily', N'hoat_dong'),
(N'dl14', N'123456', N'daily', N'hoat_dong'),
(N'dl15', N'123456', N'daily', N'hoat_dong'),

-- Siêu thị: st1 -> st14 (14 tài khoản)
(N'st1',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st2',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st3',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st4',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st5',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st6',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st7',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st8',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st9',  N'123456', N'sieuthi', N'hoat_dong'),
(N'st10', N'123456', N'sieuthi', N'hoat_dong'),
(N'st11', N'123456', N'sieuthi', N'hoat_dong'),
(N'st12', N'123456', N'sieuthi', N'hoat_dong'),
(N'st13', N'123456', N'sieuthi', N'hoat_dong'),
(N'st14', N'123456', N'sieuthi', N'hoat_dong');
-- Tổng: 1 + 20 + 15 + 14 = 50 bản ghi
PRINT N'✓ Đã insert 50 bản ghi TaiKhoan';
GO

-- ============================================================
-- 2. ADMIN
-- ============================================================
-- Sẽ insert Admin từ TaiKhoan sau (dòng 191)
-- Không insert trực tiếp ở đây để tránh duplicate

-- Thêm 49 tài khoản admin phụ vào TaiKhoan
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai) VALUES
(N'admin2',  N'123456', N'admin', N'hoat_dong'),
(N'admin3',  N'123456', N'admin', N'hoat_dong'),
(N'admin4',  N'123456', N'admin', N'hoat_dong'),
(N'admin5',  N'123456', N'admin', N'hoat_dong'),
(N'admin6',  N'123456', N'admin', N'hoat_dong'),
(N'admin7',  N'123456', N'admin', N'hoat_dong'),
(N'admin8',  N'123456', N'admin', N'hoat_dong'),
(N'admin9',  N'123456', N'admin', N'hoat_dong'),
(N'admin10', N'123456', N'admin', N'hoat_dong'),
(N'admin11', N'123456', N'admin', N'hoat_dong'),
(N'admin12', N'123456', N'admin', N'hoat_dong'),
(N'admin13', N'123456', N'admin', N'hoat_dong'),
(N'admin14', N'123456', N'admin', N'hoat_dong'),
(N'admin15', N'123456', N'admin', N'hoat_dong'),
(N'admin16', N'123456', N'admin', N'hoat_dong'),
(N'admin17', N'123456', N'admin', N'hoat_dong'),
(N'admin18', N'123456', N'admin', N'hoat_dong'),
(N'admin19', N'123456', N'admin', N'hoat_dong'),
(N'admin20', N'123456', N'admin', N'hoat_dong'),
(N'admin21', N'123456', N'admin', N'hoat_dong'),
(N'admin22', N'123456', N'admin', N'hoat_dong'),
(N'admin23', N'123456', N'admin', N'hoat_dong'),
(N'admin24', N'123456', N'admin', N'hoat_dong'),
(N'admin25', N'123456', N'admin', N'hoat_dong'),
(N'admin26', N'123456', N'admin', N'hoat_dong'),
(N'admin27', N'123456', N'admin', N'hoat_dong'),
(N'admin28', N'123456', N'admin', N'hoat_dong'),
(N'admin29', N'123456', N'admin', N'hoat_dong'),
(N'admin30', N'123456', N'admin', N'hoat_dong'),
(N'admin31', N'123456', N'admin', N'hoat_dong'),
(N'admin32', N'123456', N'admin', N'hoat_dong'),
(N'admin33', N'123456', N'admin', N'hoat_dong'),
(N'admin34', N'123456', N'admin', N'hoat_dong'),
(N'admin35', N'123456', N'admin', N'hoat_dong'),
(N'admin36', N'123456', N'admin', N'hoat_dong'),
(N'admin37', N'123456', N'admin', N'hoat_dong'),
(N'admin38', N'123456', N'admin', N'hoat_dong'),
(N'admin39', N'123456', N'admin', N'hoat_dong'),
(N'admin40', N'123456', N'admin', N'hoat_dong'),
(N'admin41', N'123456', N'admin', N'hoat_dong'),
(N'admin42', N'123456', N'admin', N'hoat_dong'),
(N'admin43', N'123456', N'admin', N'hoat_dong'),
(N'admin44', N'123456', N'admin', N'hoat_dong'),
(N'admin45', N'123456', N'admin', N'hoat_dong'),
(N'admin46', N'123456', N'admin', N'hoat_dong'),
(N'admin47', N'123456', N'admin', N'hoat_dong'),
(N'admin48', N'123456', N'admin', N'hoat_dong'),
(N'admin49', N'123456', N'admin', N'hoat_dong'),
(N'admin50', N'123456', N'admin', N'hoat_dong');
GO

-- Lấy MaTaiKhoan của các admin vừa tạo và insert vào bảng Admin
-- admin1 = MaTK 1, admin2..50 = MaTK 51..99
INSERT INTO Admin (MaTaiKhoan, HoTen, SoDienThoai, Email, TrangThai)
SELECT MaTaiKhoan,
    N'Quản Trị Viên ' + CAST(ROW_NUMBER() OVER (ORDER BY MaTaiKhoan) AS NVARCHAR),
    N'090000' + RIGHT('0000' + CAST(MaTaiKhoan AS NVARCHAR), 4),
    TenDangNhap + N'@nongsan.vn',
    N'hoat_dong'
FROM TaiKhoan
WHERE LoaiTaiKhoan = N'admin'
ORDER BY MaTaiKhoan;
PRINT N'✓ Đã insert 50 bản ghi Admin';
GO

-- ============================================================
-- 3. NONG DAN (50 nông dân, MaTaiKhoan 2-51)
-- ============================================================
INSERT INTO NongDan (MaTaiKhoan, HoTen, SoDienThoai, Email, DiaChi, TrangThai)
VALUES
(2,  N'Nguyễn Văn An',      N'0901111101', N'nd1@gmail.com',  N'Hưng Yên',         N'hoat_dong'),
(3,  N'Trần Thị Bình',      N'0901111102', N'nd2@gmail.com',  N'Hà Nam',            N'hoat_dong'),
(4,  N'Lê Văn Cường',       N'0901111103', N'nd3@gmail.com',  N'Nam Định',          N'hoat_dong'),
(5,  N'Phạm Thị Dung',      N'0901111104', N'nd4@gmail.com',  N'Thái Bình',         N'hoat_dong'),
(6,  N'Hoàng Văn Em',       N'0901111105', N'nd5@gmail.com',  N'Ninh Bình',         N'hoat_dong'),
(7,  N'Đặng Thị Phương',    N'0901111106', N'nd6@gmail.com',  N'Hải Dương',         N'hoat_dong'),
(8,  N'Bùi Văn Giang',      N'0901111107', N'nd7@gmail.com',  N'Hà Nội',            N'hoat_dong'),
(9,  N'Ngô Thị Hoa',        N'0901111108', N'nd8@gmail.com',  N'Vĩnh Phúc',         N'hoat_dong'),
(10, N'Vũ Văn Ích',         N'0901111109', N'nd9@gmail.com',  N'Bắc Ninh',          N'hoat_dong'),
(11, N'Đinh Thị Kim',       N'0901111110', N'nd10@gmail.com', N'Phú Thọ',           N'hoat_dong'),
(12, N'Lý Văn Long',        N'0901111111', N'nd11@gmail.com', N'Hải Phòng',         N'hoat_dong'),
(13, N'Trương Thị Mai',     N'0901111112', N'nd12@gmail.com', N'Quảng Ninh',        N'hoat_dong'),
(14, N'Phan Văn Nam',       N'0901111113', N'nd13@gmail.com', N'Lạng Sơn',          N'hoat_dong'),
(15, N'Dương Thị Oanh',     N'0901111114', N'nd14@gmail.com', N'Bắc Giang',         N'hoat_dong'),
(16, N'Cao Văn Phát',       N'0901111115', N'nd15@gmail.com', N'Thái Nguyên',       N'hoat_dong'),
(17, N'Tô Thị Quỳnh',      N'0901111116', N'nd16@gmail.com', N'Tuyên Quang',       N'hoat_dong'),
(18, N'Hà Văn Rạng',        N'0901111117', N'nd17@gmail.com', N'Yên Bái',           N'hoat_dong'),
(19, N'Lưu Thị Sen',        N'0901111118', N'nd18@gmail.com', N'Lào Cai',           N'hoat_dong'),
(20, N'Mai Văn Thắng',      N'0901111119', N'nd19@gmail.com', N'Sơn La',            N'hoat_dong'),
(21, N'Đỗ Thị Uyên',        N'0901111120', N'nd20@gmail.com', N'Hòa Bình',          N'hoat_dong'),
(22, N'Nông Dân 21',        N'0901111121', N'nd21@gmail.com', N'Hà Nội',            N'hoat_dong'),
(23, N'Nông Dân 22',        N'0901111122', N'nd22@gmail.com', N'Hà Nội',            N'hoat_dong'),
(24, N'Nông Dân 23',        N'0901111123', N'nd23@gmail.com', N'Hà Nội',            N'hoat_dong'),
(25, N'Nông Dân 24',        N'0901111124', N'nd24@gmail.com', N'Hà Nội',            N'hoat_dong'),
(26, N'Nông Dân 25',        N'0901111125', N'nd25@gmail.com', N'Hà Nội',            N'hoat_dong'),
(27, N'Nông Dân 26',        N'0901111126', N'nd26@gmail.com', N'Hà Nội',            N'hoat_dong'),
(28, N'Nông Dân 27',        N'0901111127', N'nd27@gmail.com', N'Hà Nội',            N'hoat_dong'),
(29, N'Nông Dân 28',        N'0901111128', N'nd28@gmail.com', N'Hà Nội',            N'hoat_dong'),
(30, N'Nông Dân 29',        N'0901111129', N'nd29@gmail.com', N'Hà Nội',            N'hoat_dong'),
(31, N'Nông Dân 30',        N'0901111130', N'nd30@gmail.com', N'Hà Nội',            N'hoat_dong'),
(32, N'Nông Dân 31',        N'0901111131', N'nd31@gmail.com', N'Hà Nội',            N'hoat_dong'),
(33, N'Nông Dân 32',        N'0901111132', N'nd32@gmail.com', N'Hà Nội',            N'hoat_dong'),
(34, N'Nông Dân 33',        N'0901111133', N'nd33@gmail.com', N'Hà Nội',            N'hoat_dong'),
(35, N'Nông Dân 34',        N'0901111134', N'nd34@gmail.com', N'Hà Nội',            N'hoat_dong'),
(36, N'Nông Dân 35',        N'0901111135', N'nd35@gmail.com', N'Hà Nội',            N'hoat_dong'),
(37, N'Nông Dân 36',        N'0901111136', N'nd36@gmail.com', N'Hà Nội',            N'hoat_dong'),
(38, N'Nông Dân 37',        N'0901111137', N'nd37@gmail.com', N'Hà Nội',            N'hoat_dong'),
(39, N'Nông Dân 38',        N'0901111138', N'nd38@gmail.com', N'Hà Nội',            N'hoat_dong'),
(40, N'Nông Dân 39',        N'0901111139', N'nd39@gmail.com', N'Hà Nội',            N'hoat_dong'),
(41, N'Nông Dân 40',        N'0901111140', N'nd40@gmail.com', N'Hà Nội',            N'hoat_dong'),
(42, N'Nông Dân 41',        N'0901111141', N'nd41@gmail.com', N'Hà Nội',            N'hoat_dong'),
(43, N'Nông Dân 42',        N'0901111142', N'nd42@gmail.com', N'Hà Nội',            N'hoat_dong'),
(44, N'Nông Dân 43',        N'0901111143', N'nd43@gmail.com', N'Hà Nội',            N'hoat_dong'),
(45, N'Nông Dân 44',        N'0901111144', N'nd44@gmail.com', N'Hà Nội',            N'hoat_dong'),
(46, N'Nông Dân 45',        N'0901111145', N'nd45@gmail.com', N'Hà Nội',            N'hoat_dong'),
(47, N'Nông Dân 46',        N'0901111146', N'nd46@gmail.com', N'Hà Nội',            N'hoat_dong'),
(48, N'Nông Dân 47',        N'0901111147', N'nd47@gmail.com', N'Hà Nội',            N'hoat_dong'),
(49, N'Nông Dân 48',        N'0901111148', N'nd48@gmail.com', N'Hà Nội',            N'hoat_dong'),
(50, N'Nông Dân 49',        N'0901111149', N'nd49@gmail.com', N'Hà Nội',            N'hoat_dong'),
(51, N'Nông Dân 50',        N'0901111150', N'nd50@gmail.com', N'Hà Nội',            N'hoat_dong');
PRINT N'✓ Đã insert 50 bản ghi NongDan';
GO

-- ============================================================
-- 4. DAI LY (15 đại lý, MaTaiKhoan 52-66)
-- ============================================================
INSERT INTO DaiLy (MaTaiKhoan, TenDaiLy, SoDienThoai, Email, DiaChi, TrangThai)
VALUES
(52, N'Đại Lý Nông Sản Phát Đạt',    N'0912221101', N'dl1@nongsan.vn',  N'Hà Nội',    N'hoat_dong'),
(23, N'Đại Lý Xanh Sạch',            N'0912221102', N'dl2@nongsan.vn',  N'Hưng Yên',  N'hoat_dong'),
(24, N'Công Ty TNHH Nông Sản Việt',  N'0912221103', N'dl3@nongsan.vn',  N'Hải Phòng', N'hoat_dong'),
(25, N'Đại Lý Thực Phẩm Sạch',       N'0912221104', N'dl4@nongsan.vn',  N'Nam Định',  N'hoat_dong'),
(26, N'Trung Tâm Nông Sản Miền Bắc', N'0912221105', N'dl5@nongsan.vn',  N'Hà Nam',    N'hoat_dong'),
(27, N'Đại Lý Cây Trái Tươi',        N'0912221106', N'dl6@nongsan.vn',  N'Bắc Ninh',  N'hoat_dong'),
(28, N'Công Ty CP Thực Phẩm An Toàn',N'0912221107', N'dl7@nongsan.vn',  N'Vĩnh Phúc', N'hoat_dong'),
(29, N'Đại Lý Rau Sạch Đồng Quê',    N'0912221108', N'dl8@nongsan.vn',  N'Thái Bình', N'hoat_dong'),
(30, N'Đại Lý Nông Sản Hữu Cơ',      N'0912221109', N'dl9@nongsan.vn',  N'Ninh Bình', N'hoat_dong'),
(31, N'Công Ty Thương Mại Nông Sản',  N'0912221110', N'dl10@nongsan.vn', N'Quảng Ninh',N'hoat_dong'),
(32, N'Đại Lý Thực Phẩm Miền Nam',   N'0912221111', N'dl11@nongsan.vn', N'Hà Nội',    N'hoat_dong'),
(33, N'Đại Lý Rau Củ Quả Tươi',      N'0912221112', N'dl12@nongsan.vn', N'Hưng Yên',  N'hoat_dong'),
(34, N'Đại Lý Nông Sản Phố',         N'0912221113', N'dl13@nongsan.vn', N'Hà Nội',    N'hoat_dong'),
(35, N'Công Ty TNHH Tươi Sạch',      N'0912221114', N'dl14@nongsan.vn', N'Bắc Giang', N'hoat_dong'),
(36, N'Đại Lý Nông Sản Sao Việt',    N'0912221115', N'dl15@nongsan.vn', N'Hải Dương', N'hoat_dong');
-- Thêm 35 đại lý phụ
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai) VALUES
(N'dl16', N'123456', N'daily', N'hoat_dong'), (N'dl17', N'123456', N'daily', N'hoat_dong'),
(N'dl18', N'123456', N'daily', N'hoat_dong'), (N'dl19', N'123456', N'daily', N'hoat_dong'),
(N'dl20', N'123456', N'daily', N'hoat_dong'), (N'dl21', N'123456', N'daily', N'hoat_dong'),
(N'dl22', N'123456', N'daily', N'hoat_dong'), (N'dl23', N'123456', N'daily', N'hoat_dong'),
(N'dl24', N'123456', N'daily', N'hoat_dong'), (N'dl25', N'123456', N'daily', N'hoat_dong'),
(N'dl26', N'123456', N'daily', N'hoat_dong'), (N'dl27', N'123456', N'daily', N'hoat_dong'),
(N'dl28', N'123456', N'daily', N'hoat_dong'), (N'dl29', N'123456', N'daily', N'hoat_dong'),
(N'dl30', N'123456', N'daily', N'hoat_dong'), (N'dl31', N'123456', N'daily', N'hoat_dong'),
(N'dl32', N'123456', N'daily', N'hoat_dong'), (N'dl33', N'123456', N'daily', N'hoat_dong'),
(N'dl34', N'123456', N'daily', N'hoat_dong'), (N'dl35', N'123456', N'daily', N'hoat_dong'),
(N'dl36', N'123456', N'daily', N'hoat_dong'), (N'dl37', N'123456', N'daily', N'hoat_dong'),
(N'dl38', N'123456', N'daily', N'hoat_dong'), (N'dl39', N'123456', N'daily', N'hoat_dong'),
(N'dl40', N'123456', N'daily', N'hoat_dong'), (N'dl41', N'123456', N'daily', N'hoat_dong'),
(N'dl42', N'123456', N'daily', N'hoat_dong'), (N'dl43', N'123456', N'daily', N'hoat_dong'),
(N'dl44', N'123456', N'daily', N'hoat_dong'), (N'dl45', N'123456', N'daily', N'hoat_dong'),
(N'dl46', N'123456', N'daily', N'hoat_dong'), (N'dl47', N'123456', N'daily', N'hoat_dong'),
(N'dl48', N'123456', N'daily', N'hoat_dong'), (N'dl49', N'123456', N'daily', N'hoat_dong'),
(N'dl50', N'123456', N'daily', N'hoat_dong');
GO
INSERT INTO DaiLy (MaTaiKhoan, TenDaiLy, SoDienThoai, Email, DiaChi, TrangThai)
SELECT MaTaiKhoan,
    N'Đại Lý ' + TenDangNhap,
    N'0922' + RIGHT('000000' + CAST(MaTaiKhoan AS NVARCHAR), 6),
    TenDangNhap + N'@nongsan.vn',
    N'Hà Nội',
    N'hoat_dong'
FROM TaiKhoan WHERE TenDangNhap IN (
    N'dl16',N'dl17',N'dl18',N'dl19',N'dl20',N'dl21',N'dl22',N'dl23',N'dl24',N'dl25',
    N'dl26',N'dl27',N'dl28',N'dl29',N'dl30',N'dl31',N'dl32',N'dl33',N'dl34',N'dl35',
    N'dl36',N'dl37',N'dl38',N'dl39',N'dl40',N'dl41',N'dl42',N'dl43',N'dl44',N'dl45',
    N'dl46',N'dl47',N'dl48',N'dl49',N'dl50'
);
PRINT N'✓ Đã insert 50 bản ghi DaiLy';
GO

-- ============================================================
-- 5. SIEU THI (MaTK của st1..st14 = 37..50)
-- ============================================================
INSERT INTO SieuThi (MaTaiKhoan, TenSieuThi, SoDienThoai, Email, DiaChi, TrangThai)
VALUES
(37, N'Siêu Thị Xanh Hà Nội',        N'0913331101', N'st1@sieuthi.vn',  N'Hà Nội',    N'hoat_dong'),
(38, N'Siêu Thị Tươi Sạch',           N'0913331102', N'st2@sieuthi.vn',  N'Hưng Yên',  N'hoat_dong'),
(39, N'BigGreen Supermarket',          N'0913331103', N'st3@sieuthi.vn',  N'Hải Phòng', N'hoat_dong'),
(40, N'Siêu Thị Nông Sản Việt',       N'0913331104', N'st4@sieuthi.vn',  N'Nam Định',  N'hoat_dong'),
(41, N'GreenMart Hà Nam',             N'0913331105', N'st5@sieuthi.vn',  N'Hà Nam',    N'hoat_dong'),
(42, N'Siêu Thị Organic Life',        N'0913331106', N'st6@sieuthi.vn',  N'Bắc Ninh',  N'hoat_dong'),
(43, N'FreshMart Vĩnh Phúc',          N'0913331107', N'st7@sieuthi.vn',  N'Vĩnh Phúc', N'hoat_dong'),
(44, N'Siêu Thị Sạch Thái Bình',      N'0913331108', N'st8@sieuthi.vn',  N'Thái Bình', N'hoat_dong'),
(45, N'Siêu Thị Rau Quả Ninh Bình',   N'0913331109', N'st9@sieuthi.vn',  N'Ninh Bình', N'hoat_dong'),
(46, N'GreenFood Quảng Ninh',          N'0913331110', N'st10@sieuthi.vn', N'Quảng Ninh',N'hoat_dong'),
(47, N'Siêu Thị Hữu Cơ Hà Nội',      N'0913331111', N'st11@sieuthi.vn', N'Hà Nội',    N'hoat_dong'),
(48, N'EcoMart Hưng Yên',             N'0913331112', N'st12@sieuthi.vn', N'Hưng Yên',  N'hoat_dong'),
(49, N'Siêu Thị An Toàn Bắc Giang',  N'0913331113', N'st13@sieuthi.vn', N'Bắc Giang', N'hoat_dong'),
(50, N'FreshGreen Hải Dương',         N'0913331114', N'st14@sieuthi.vn', N'Hải Dương', N'hoat_dong');
-- Thêm 36 siêu thị phụ
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai) VALUES
(N'st15', N'123456', N'sieuthi', N'hoat_dong'), (N'st16', N'123456', N'sieuthi', N'hoat_dong'),
(N'st17', N'123456', N'sieuthi', N'hoat_dong'), (N'st18', N'123456', N'sieuthi', N'hoat_dong'),
(N'st19', N'123456', N'sieuthi', N'hoat_dong'), (N'st20', N'123456', N'sieuthi', N'hoat_dong'),
(N'st21', N'123456', N'sieuthi', N'hoat_dong'), (N'st22', N'123456', N'sieuthi', N'hoat_dong'),
(N'st23', N'123456', N'sieuthi', N'hoat_dong'), (N'st24', N'123456', N'sieuthi', N'hoat_dong'),
(N'st25', N'123456', N'sieuthi', N'hoat_dong'), (N'st26', N'123456', N'sieuthi', N'hoat_dong'),
(N'st27', N'123456', N'sieuthi', N'hoat_dong'), (N'st28', N'123456', N'sieuthi', N'hoat_dong'),
(N'st29', N'123456', N'sieuthi', N'hoat_dong'), (N'st30', N'123456', N'sieuthi', N'hoat_dong'),
(N'st31', N'123456', N'sieuthi', N'hoat_dong'), (N'st32', N'123456', N'sieuthi', N'hoat_dong'),
(N'st33', N'123456', N'sieuthi', N'hoat_dong'), (N'st34', N'123456', N'sieuthi', N'hoat_dong'),
(N'st35', N'123456', N'sieuthi', N'hoat_dong'), (N'st36', N'123456', N'sieuthi', N'hoat_dong'),
(N'st37', N'123456', N'sieuthi', N'hoat_dong'), (N'st38', N'123456', N'sieuthi', N'hoat_dong'),
(N'st39', N'123456', N'sieuthi', N'hoat_dong'), (N'st40', N'123456', N'sieuthi', N'hoat_dong'),
(N'st41', N'123456', N'sieuthi', N'hoat_dong'), (N'st42', N'123456', N'sieuthi', N'hoat_dong'),
(N'st43', N'123456', N'sieuthi', N'hoat_dong'), (N'st44', N'123456', N'sieuthi', N'hoat_dong'),
(N'st45', N'123456', N'sieuthi', N'hoat_dong'), (N'st46', N'123456', N'sieuthi', N'hoat_dong'),
(N'st47', N'123456', N'sieuthi', N'hoat_dong'), (N'st48', N'123456', N'sieuthi', N'hoat_dong'),
(N'st49', N'123456', N'sieuthi', N'hoat_dong'), (N'st50', N'123456', N'sieuthi', N'hoat_dong');
GO
INSERT INTO SieuThi (MaTaiKhoan, TenSieuThi, SoDienThoai, Email, DiaChi, TrangThai)
SELECT MaTaiKhoan,
    N'Siêu Thị ' + TenDangNhap,
    N'0933' + RIGHT('000000' + CAST(MaTaiKhoan AS NVARCHAR), 6),
    TenDangNhap + N'@sieuthi.vn',
    N'Hà Nội',
    N'hoat_dong'
FROM TaiKhoan WHERE TenDangNhap IN (
    N'st15',N'st16',N'st17',N'st18',N'st19',N'st20',N'st21',N'st22',N'st23',N'st24',
    N'st25',N'st26',N'st27',N'st28',N'st29',N'st30',N'st31',N'st32',N'st33',N'st34',
    N'st35',N'st36',N'st37',N'st38',N'st39',N'st40',N'st41',N'st42',N'st43',N'st44',
    N'st45',N'st46',N'st47',N'st48',N'st49',N'st50'
);
PRINT N'✓ Đã insert 50 bản ghi SieuThi';
GO

-- ============================================================
-- 6. TRANG TRAI (mỗi nông dân đầu có 1 trang trại, tổng 50)
-- ============================================================
INSERT INTO TrangTrai (MaNongDan, TenTrangTrai, DiaChi, SoChungNhan, TrangThai) VALUES
(1,  N'Trang Trại Rau Sạch An',      N'Thôn 1, Hưng Yên',       N'CN-ND-001', N'hoat_dong'),
(2,  N'Trang Trại Hữu Cơ Bình',      N'Thôn 2, Hà Nam',          N'CN-ND-002', N'hoat_dong'),
(3,  N'Trang Trại Xanh Cường',       N'Thôn 3, Nam Định',         N'CN-ND-003', N'hoat_dong'),
(4,  N'Vườn Rau Sạch Dung',          N'Thôn 4, Thái Bình',        N'CN-ND-004', N'hoat_dong'),
(5,  N'Trang Trại Sinh Thái Em',     N'Thôn 5, Ninh Bình',        N'CN-ND-005', N'hoat_dong'),
(6,  N'Vườn Rau Hữu Cơ Phương',     N'Thôn 6, Hải Dương',        N'CN-ND-006', N'hoat_dong'),
(7,  N'Trang Trại Sạch Giang',       N'Thôn 7, Hà Nội',           N'CN-ND-007', N'hoat_dong'),
(8,  N'Vườn Rau Xanh Hoa',           N'Thôn 8, Vĩnh Phúc',        N'CN-ND-008', N'hoat_dong'),
(9,  N'Trang Trại Tự Nhiên Ích',     N'Thôn 9, Bắc Ninh',         N'CN-ND-009', N'hoat_dong'),
(10, N'Vườn Hữu Cơ Kim',             N'Thôn 10, Phú Thọ',         N'CN-ND-010', N'hoat_dong'),
(11, N'Trang Trại Xanh Long',        N'Thôn 11, Hải Phòng',       N'CN-ND-011', N'hoat_dong'),
(12, N'Vườn Rau Sạch Mai',           N'Thôn 12, Quảng Ninh',      N'CN-ND-012', N'hoat_dong'),
(13, N'Trang Trại Hữu Cơ Nam',       N'Thôn 13, Lạng Sơn',        N'CN-ND-013', N'hoat_dong'),
(14, N'Vườn Sinh Thái Oanh',         N'Thôn 14, Bắc Giang',       N'CN-ND-014', N'hoat_dong'),
(15, N'Trang Trại Xanh Phát',        N'Thôn 15, Thái Nguyên',     N'CN-ND-015', N'hoat_dong'),
(16, N'Vườn Hữu Cơ Quỳnh',         N'Thôn 16, Tuyên Quang',     N'CN-ND-016', N'hoat_dong'),
(17, N'Trang Trại Sạch Rạng',        N'Thôn 17, Yên Bái',         N'CN-ND-017', N'hoat_dong'),
(18, N'Vườn Rau Tươi Sen',           N'Thôn 18, Lào Cai',         N'CN-ND-018', N'hoat_dong'),
(19, N'Trang Trại Xanh Thắng',       N'Thôn 19, Sơn La',          N'CN-ND-019', N'hoat_dong'),
(20, N'Vườn Hữu Cơ Uyên',           N'Thôn 20, Hòa Bình',        N'CN-ND-020', N'hoat_dong'),
(21, N'Trang Trại Rau Sạch ND21',    N'Thôn 21, Hà Nội',          N'CN-ND-021', N'hoat_dong'),
(22, N'Trang Trại Xanh ND22',        N'Thôn 22, Hưng Yên',        N'CN-ND-022', N'hoat_dong'),
(23, N'Vườn Hữu Cơ ND23',           N'Thôn 23, Hà Nam',          N'CN-ND-023', N'hoat_dong'),
(24, N'Trang Trại Sạch ND24',        N'Thôn 24, Nam Định',        N'CN-ND-024', N'hoat_dong'),
(25, N'Vườn Rau ND25',               N'Thôn 25, Thái Bình',       N'CN-ND-025', N'hoat_dong'),
(26, N'Trang Trại Tươi ND26',        N'Thôn 26, Ninh Bình',       N'CN-ND-026', N'hoat_dong'),
(27, N'Vườn Sạch ND27',              N'Thôn 27, Hải Dương',       N'CN-ND-027', N'hoat_dong'),
(28, N'Trang Trại Xanh ND28',        N'Thôn 28, Vĩnh Phúc',      N'CN-ND-028', N'hoat_dong'),
(29, N'Vườn Hữu Cơ ND29',           N'Thôn 29, Bắc Ninh',        N'CN-ND-029', N'hoat_dong'),
(30, N'Trang Trại Sạch ND30',        N'Thôn 30, Phú Thọ',         N'CN-ND-030', N'hoat_dong'),
(31, N'Vườn Rau ND31',               N'Thôn 31, Hà Nội',          N'CN-ND-031', N'hoat_dong'),
(32, N'Trang Trại ND32',             N'Thôn 32, Hải Phòng',       N'CN-ND-032', N'hoat_dong'),
(33, N'Vườn Xanh ND33',              N'Thôn 33, Quảng Ninh',      N'CN-ND-033', N'hoat_dong'),
(34, N'Trang Trại ND34',             N'Thôn 34, Lạng Sơn',        N'CN-ND-034', N'hoat_dong'),
(35, N'Vườn Hữu Cơ ND35',           N'Thôn 35, Bắc Giang',       N'CN-ND-035', N'hoat_dong'),
(36, N'Trang Trại Sạch ND36',        N'Thôn 36, Thái Nguyên',     N'CN-ND-036', N'hoat_dong'),
(37, N'Vườn Rau ND37',               N'Thôn 37, Tuyên Quang',     N'CN-ND-037', N'hoat_dong'),
(38, N'Trang Trại ND38',             N'Thôn 38, Yên Bái',         N'CN-ND-038', N'hoat_dong'),
(39, N'Vườn Xanh ND39',              N'Thôn 39, Lào Cai',         N'CN-ND-039', N'hoat_dong'),
(40, N'Trang Trại ND40',             N'Thôn 40, Sơn La',          N'CN-ND-040', N'hoat_dong'),
(41, N'Vườn Hữu Cơ ND41',           N'Thôn 41, Hòa Bình',        N'CN-ND-041', N'hoat_dong'),
(42, N'Trang Trại Sạch ND42',        N'Thôn 42, Hà Nội',          N'CN-ND-042', N'hoat_dong'),
(43, N'Vườn Rau ND43',               N'Thôn 43, Hưng Yên',        N'CN-ND-043', N'hoat_dong'),
(44, N'Trang Trại ND44',             N'Thôn 44, Hà Nam',          N'CN-ND-044', N'hoat_dong'),
(45, N'Vườn Xanh ND45',              N'Thôn 45, Nam Định',        N'CN-ND-045', N'hoat_dong'),
(46, N'Trang Trại ND46',             N'Thôn 46, Thái Bình',       N'CN-ND-046', N'hoat_dong'),
(47, N'Vườn Hữu Cơ ND47',           N'Thôn 47, Ninh Bình',       N'CN-ND-047', N'hoat_dong'),
(48, N'Trang Trại Sạch ND48',        N'Thôn 48, Hải Dương',       N'CN-ND-048', N'hoat_dong'),
(49, N'Vườn Rau ND49',               N'Thôn 49, Vĩnh Phúc',       N'CN-ND-049', N'hoat_dong'),
(50, N'Trang Trại ND50',             N'Thôn 50, Bắc Ninh',        N'CN-ND-050', N'hoat_dong');
PRINT N'✓ Đã insert 50 bản ghi TrangTrai';
GO

-- ============================================================
-- 7. SAN PHAM (50 sản phẩm nông sản)
-- ============================================================
INSERT INTO SanPham (TenSanPham, DonViTinh, MoTa, TrangThai) VALUES
(N'Cà Chua',           N'kg',  N'Cà chua tươi hữu cơ',          N'hoat_dong'),
(N'Rau Cải Xanh',      N'kg',  N'Rau cải xanh sạch',            N'hoat_dong'),
(N'Dưa Hấu',           N'kg',  N'Dưa hấu ngọt mát',             N'hoat_dong'),
(N'Khoai Lang',        N'kg',  N'Khoai lang mật vàng',           N'hoat_dong'),
(N'Bắp Cải',           N'kg',  N'Bắp cải hữu cơ',               N'hoat_dong'),
(N'Ớt Đỏ',             N'kg',  N'Ớt đỏ cay tươi',               N'hoat_dong'),
(N'Dưa Leo',           N'kg',  N'Dưa leo sạch',                  N'hoat_dong'),
(N'Cà Rốt',            N'kg',  N'Cà rốt hữu cơ',                N'hoat_dong'),
(N'Hành Tây',          N'kg',  N'Hành tây tươi',                 N'hoat_dong'),
(N'Tỏi',               N'kg',  N'Tỏi khô sạch',                  N'hoat_dong'),
(N'Rau Muống',         N'bó',  N'Rau muống tươi',                N'hoat_dong'),
(N'Rau Cần',           N'bó',  N'Rau cần sạch',                  N'hoat_dong'),
(N'Xà Lách',           N'kg',  N'Xà lách hữu cơ',               N'hoat_dong'),
(N'Bí Đỏ',             N'kg',  N'Bí đỏ tươi',                    N'hoat_dong'),
(N'Bí Xanh',           N'kg',  N'Bí xanh sạch',                  N'hoat_dong'),
(N'Ngô Bắp',           N'bắp', N'Ngô ngọt tươi',                 N'hoat_dong'),
(N'Đậu Cô Ve',         N'kg',  N'Đậu cô ve hữu cơ',             N'hoat_dong'),
(N'Đậu Hà Lan',        N'kg',  N'Đậu hà lan tươi',              N'hoat_dong'),
(N'Mướp',              N'kg',  N'Mướp tươi',                     N'hoat_dong'),
(N'Khổ Qua',           N'kg',  N'Khổ qua sạch',                  N'hoat_dong'),
(N'Rau Húng',          N'bó',  N'Rau húng thơm',                 N'hoat_dong'),
(N'Rau Mùi',           N'bó',  N'Rau mùi tươi',                  N'hoat_dong'),
(N'Gừng',              N'kg',  N'Gừng tươi',                     N'hoat_dong'),
(N'Nghệ',              N'kg',  N'Nghệ tươi hữu cơ',             N'hoat_dong'),
(N'Sả',                N'bó',  N'Sả tươi',                       N'hoat_dong'),
(N'Khoai Tây',         N'kg',  N'Khoai tây sạch',                N'hoat_dong'),
(N'Su Su',             N'kg',  N'Su su tươi',                    N'hoat_dong'),
(N'Rau Ngót',          N'bó',  N'Rau ngót tươi',                 N'hoat_dong'),
(N'Cải Thảo',          N'kg',  N'Cải thảo hữu cơ',              N'hoat_dong'),
(N'Cải Bó Xôi',        N'kg',  N'Cải bó xôi sạch',              N'hoat_dong'),
(N'Ổi',                N'kg',  N'Ổi lê đài loan',                N'hoat_dong'),
(N'Cam',               N'kg',  N'Cam sành hữu cơ',              N'hoat_dong'),
(N'Bưởi',              N'quả', N'Bưởi da xanh',                  N'hoat_dong'),
(N'Xoài',              N'kg',  N'Xoài cát Hòa Lộc',             N'hoat_dong'),
(N'Chuối',             N'nải', N'Chuối tiêu hồng',               N'hoat_dong'),
(N'Nhãn',              N'kg',  N'Nhãn lồng Hưng Yên',           N'hoat_dong'),
(N'Vải',               N'kg',  N'Vải thiều Lục Ngạn',           N'hoat_dong'),
(N'Chôm Chôm',         N'kg',  N'Chôm chôm tươi',               N'hoat_dong'),
(N'Thanh Long',        N'kg',  N'Thanh long ruột đỏ',            N'hoat_dong'),
(N'Dứa',               N'quả', N'Dứa mật Queen',                 N'hoat_dong'),
(N'Mít',               N'kg',  N'Mít Thái siêu sớm',            N'hoat_dong'),
(N'Sầu Riêng',         N'kg',  N'Sầu riêng Ri6',                N'hoat_dong'),
(N'Nho',               N'kg',  N'Nho xanh không hạt',           N'hoat_dong'),
(N'Táo',               N'kg',  N'Táo đỏ Hà Giang',              N'hoat_dong'),
(N'Lê',                N'kg',  N'Lê Đài Loan',                   N'hoat_dong'),
(N'Mận',               N'kg',  N'Mận hậu Sơn La',               N'hoat_dong'),
(N'Đào',               N'kg',  N'Đào vàng Mộc Châu',            N'hoat_dong'),
(N'Dừa',               N'quả', N'Dừa xiêm xanh',                 N'hoat_dong'),
(N'Chanh',             N'kg',  N'Chanh ta tươi',                  N'hoat_dong'),
(N'Quýt',              N'kg',  N'Quýt đường hữu cơ',            N'hoat_dong');
PRINT N'✓ Đã insert 50 bản ghi SanPham';
GO

-- ============================================================
-- 8. LO NONG SAN (50 lô, mỗi trang trại 1 lô)
-- ============================================================
INSERT INTO LoNongSan (MaTrangTrai, MaSanPham, SoLuongBanDau, SoLuongHienTai, NgayThuHoach, HanSuDung, SoChungNhanLo, MaQR, TrangThai) VALUES
(1,  1,  500.00, 480.00, '2025-05-01', '2025-05-15', N'LO-001', N'QR-001', N'tai_trang_trai'),
(2,  2,  300.00, 280.00, '2025-05-02', '2025-05-10', N'LO-002', N'QR-002', N'tai_trang_trai'),
(3,  3,  800.00, 750.00, '2025-05-03', '2025-05-20', N'LO-003', N'QR-003', N'tai_trang_trai'),
(4,  4,  600.00, 580.00, '2025-05-04', '2025-06-01', N'LO-004', N'QR-004', N'tai_trang_trai'),
(5,  5,  400.00, 390.00, '2025-05-05', '2025-05-18', N'LO-005', N'QR-005', N'tai_trang_trai'),
(6,  6,  200.00, 195.00, '2025-05-06', '2025-05-16', N'LO-006', N'QR-006', N'tai_trang_trai'),
(7,  7,  350.00, 330.00, '2025-05-07', '2025-05-17', N'LO-007', N'QR-007', N'tai_trang_trai'),
(8,  8,  450.00, 430.00, '2025-05-08', '2025-06-05', N'LO-008', N'QR-008', N'tai_trang_trai'),
(9,  9,  250.00, 240.00, '2025-05-09', '2025-06-10', N'LO-009', N'QR-009', N'tai_trang_trai'),
(10, 10, 150.00, 140.00, '2025-05-10', '2025-07-10', N'LO-010', N'QR-010', N'tai_trang_trai'),
(11, 11, 200.00, 190.00, '2025-05-11', '2025-05-14', N'LO-011', N'QR-011', N'tai_trang_trai'),
(12, 12, 180.00, 170.00, '2025-05-12', '2025-05-15', N'LO-012', N'QR-012', N'tai_trang_trai'),
(13, 13, 300.00, 290.00, '2025-05-01', '2025-05-12', N'LO-013', N'QR-013', N'tai_trang_trai'),
(14, 14, 700.00, 680.00, '2025-04-28', '2025-06-28', N'LO-014', N'QR-014', N'tai_trang_trai'),
(15, 15, 650.00, 620.00, '2025-04-29', '2025-06-29', N'LO-015', N'QR-015', N'tai_trang_trai'),
(16, 16, 400.00, 380.00, '2025-04-30', '2025-05-14', N'LO-016', N'QR-016', N'tai_trang_trai'),
(17, 17, 280.00, 265.00, '2025-05-01', '2025-05-13', N'LO-017', N'QR-017', N'tai_trang_trai'),
(18, 18, 220.00, 210.00, '2025-05-02', '2025-05-14', N'LO-018', N'QR-018', N'tai_trang_trai'),
(19, 19, 300.00, 285.00, '2025-05-03', '2025-05-20', N'LO-019', N'QR-019', N'tai_trang_trai'),
(20, 20, 250.00, 238.00, '2025-05-04', '2025-05-18', N'LO-020', N'QR-020', N'tai_trang_trai'),
(21, 21, 150.00, 145.00, '2025-05-05', '2025-05-12', N'LO-021', N'QR-021', N'tai_trang_trai'),
(22, 22, 130.00, 125.00, '2025-05-06', '2025-05-13', N'LO-022', N'QR-022', N'tai_trang_trai'),
(23, 23, 200.00, 195.00, '2025-05-07', '2025-07-07', N'LO-023', N'QR-023', N'tai_trang_trai'),
(24, 24, 180.00, 175.00, '2025-05-08', '2025-07-08', N'LO-024', N'QR-024', N'tai_trang_trai'),
(25, 25, 120.00, 115.00, '2025-05-09', '2025-05-16', N'LO-025', N'QR-025', N'tai_trang_trai'),
(26, 26, 500.00, 480.00, '2025-05-10', '2025-07-10', N'LO-026', N'QR-026', N'tai_trang_trai'),
(27, 27, 350.00, 340.00, '2025-05-01', '2025-05-20', N'LO-027', N'QR-027', N'tai_trang_trai'),
(28, 28, 160.00, 155.00, '2025-05-02', '2025-05-12', N'LO-028', N'QR-028', N'tai_trang_trai'),
(29, 29, 400.00, 385.00, '2025-05-03', '2025-05-20', N'LO-029', N'QR-029', N'tai_trang_trai'),
(30, 30, 300.00, 290.00, '2025-05-04', '2025-05-18', N'LO-030', N'QR-030', N'tai_trang_trai'),
(31, 31, 700.00, 680.00, '2025-04-20', '2025-05-20', N'LO-031', N'QR-031', N'tai_trang_trai'),
(32, 32, 900.00, 870.00, '2025-04-15', '2025-05-15', N'LO-032', N'QR-032', N'tai_trang_trai'),
(33, 33, 600.00, 580.00, '2025-04-10', '2025-05-25', N'LO-033', N'QR-033', N'tai_trang_trai'),
(34, 34, 800.00, 760.00, '2025-04-01', '2025-05-15', N'LO-034', N'QR-034', N'tai_trang_trai'),
(35, 35, 500.00, 490.00, '2025-04-25', '2025-05-25', N'LO-035', N'QR-035', N'tai_trang_trai'),
(36, 36, 400.00, 390.00, '2025-04-20', '2025-05-20', N'LO-036', N'QR-036', N'tai_trang_trai'),
(37, 37, 350.00, 340.00, '2025-04-18', '2025-05-10', N'LO-037', N'QR-037', N'tai_trang_trai'),
(38, 38, 250.00, 245.00, '2025-04-15', '2025-05-10', N'LO-038', N'QR-038', N'tai_trang_trai'),
(39, 39, 600.00, 580.00, '2025-04-12', '2025-05-12', N'LO-039', N'QR-039', N'tai_trang_trai'),
(40, 40, 300.00, 290.00, '2025-04-10', '2025-05-10', N'LO-040', N'QR-040', N'tai_trang_trai'),
(41, 41, 500.00, 480.00, '2025-04-08', '2025-05-20', N'LO-041', N'QR-041', N'tai_trang_trai'),
(42, 42, 700.00, 670.00, '2025-04-05', '2025-05-30', N'LO-042', N'QR-042', N'tai_trang_trai'),
(43, 43, 400.00, 385.00, '2025-04-03', '2025-05-15', N'LO-043', N'QR-043', N'tai_trang_trai'),
(44, 44, 300.00, 290.00, '2025-04-01', '2025-05-20', N'LO-044', N'QR-044', N'tai_trang_trai'),
(45, 45, 350.00, 340.00, '2025-03-28', '2025-05-28', N'LO-045', N'QR-045', N'tai_trang_trai'),
(46, 46, 250.00, 245.00, '2025-03-25', '2025-05-25', N'LO-046', N'QR-046', N'tai_trang_trai'),
(47, 47, 200.00, 195.00, '2025-03-20', '2025-05-20', N'LO-047', N'QR-047', N'tai_trang_trai'),
(48, 48, 800.00, 780.00, '2025-03-15', '2025-05-30', N'LO-048', N'QR-048', N'tai_trang_trai'),
(49, 49, 600.00, 580.00, '2025-03-10', '2025-05-10', N'LO-049', N'QR-049', N'tai_trang_trai'),
(50, 50, 400.00, 385.00, '2025-03-05', '2025-05-05', N'LO-050', N'QR-050', N'tai_trang_trai');
PRINT N'✓ Đã insert 50 bản ghi LoNongSan';
GO

-- ============================================================
-- 9. KHO (50 kho: 25 kho đại lý, 25 kho siêu thị)
-- ============================================================
-- Kho đại lý (MaDaiLy 1..25)
INSERT INTO Kho (LoaiKho, MaDaiLy, MaSieuThi, TenKho, DiaChi, TrangThai) VALUES
(N'daily', 1,  NULL, N'Kho Đại Lý 1',  N'Hà Nội',     N'hoat_dong'),
(N'daily', 2,  NULL, N'Kho Đại Lý 2',  N'Hưng Yên',   N'hoat_dong'),
(N'daily', 3,  NULL, N'Kho Đại Lý 3',  N'Hải Phòng',  N'hoat_dong'),
(N'daily', 4,  NULL, N'Kho Đại Lý 4',  N'Nam Định',   N'hoat_dong'),
(N'daily', 5,  NULL, N'Kho Đại Lý 5',  N'Hà Nam',     N'hoat_dong'),
(N'daily', 6,  NULL, N'Kho Đại Lý 6',  N'Bắc Ninh',   N'hoat_dong'),
(N'daily', 7,  NULL, N'Kho Đại Lý 7',  N'Vĩnh Phúc',  N'hoat_dong'),
(N'daily', 8,  NULL, N'Kho Đại Lý 8',  N'Thái Bình',  N'hoat_dong'),
(N'daily', 9,  NULL, N'Kho Đại Lý 9',  N'Ninh Bình',  N'hoat_dong'),
(N'daily', 10, NULL, N'Kho Đại Lý 10', N'Quảng Ninh', N'hoat_dong'),
(N'daily', 11, NULL, N'Kho Đại Lý 11', N'Hà Nội',     N'hoat_dong'),
(N'daily', 12, NULL, N'Kho Đại Lý 12', N'Hưng Yên',   N'hoat_dong'),
(N'daily', 13, NULL, N'Kho Đại Lý 13', N'Hà Nội',     N'hoat_dong'),
(N'daily', 14, NULL, N'Kho Đại Lý 14', N'Bắc Giang',  N'hoat_dong'),
(N'daily', 15, NULL, N'Kho Đại Lý 15', N'Hải Dương',  N'hoat_dong'),
(N'daily', 16, NULL, N'Kho Đại Lý 16', N'Hà Nội',     N'hoat_dong'),
(N'daily', 17, NULL, N'Kho Đại Lý 17', N'Hà Nội',     N'hoat_dong'),
(N'daily', 18, NULL, N'Kho Đại Lý 18', N'Hà Nội',     N'hoat_dong'),
(N'daily', 19, NULL, N'Kho Đại Lý 19', N'Hà Nội',     N'hoat_dong'),
(N'daily', 20, NULL, N'Kho Đại Lý 20', N'Hà Nội',     N'hoat_dong'),
(N'daily', 21, NULL, N'Kho Đại Lý 21', N'Hà Nội',     N'hoat_dong'),
(N'daily', 22, NULL, N'Kho Đại Lý 22', N'Hà Nội',     N'hoat_dong'),
(N'daily', 23, NULL, N'Kho Đại Lý 23', N'Hà Nội',     N'hoat_dong'),
(N'daily', 24, NULL, N'Kho Đại Lý 24', N'Hà Nội',     N'hoat_dong'),
(N'daily', 25, NULL, N'Kho Đại Lý 25', N'Hà Nội',     N'hoat_dong');
-- Kho siêu thị (MaSieuThi 1..25)
INSERT INTO Kho (LoaiKho, MaDaiLy, MaSieuThi, TenKho, DiaChi, TrangThai) VALUES
(N'sieuthi', NULL, 1,  N'Kho Siêu Thị 1',  N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 2,  N'Kho Siêu Thị 2',  N'Hưng Yên',  N'hoat_dong'),
(N'sieuthi', NULL, 3,  N'Kho Siêu Thị 3',  N'Hải Phòng', N'hoat_dong'),
(N'sieuthi', NULL, 4,  N'Kho Siêu Thị 4',  N'Nam Định',  N'hoat_dong'),
(N'sieuthi', NULL, 5,  N'Kho Siêu Thị 5',  N'Hà Nam',    N'hoat_dong'),
(N'sieuthi', NULL, 6,  N'Kho Siêu Thị 6',  N'Bắc Ninh',  N'hoat_dong'),
(N'sieuthi', NULL, 7,  N'Kho Siêu Thị 7',  N'Vĩnh Phúc', N'hoat_dong'),
(N'sieuthi', NULL, 8,  N'Kho Siêu Thị 8',  N'Thái Bình', N'hoat_dong'),
(N'sieuthi', NULL, 9,  N'Kho Siêu Thị 9',  N'Ninh Bình', N'hoat_dong'),
(N'sieuthi', NULL, 10, N'Kho Siêu Thị 10', N'Quảng Ninh',N'hoat_dong'),
(N'sieuthi', NULL, 11, N'Kho Siêu Thị 11', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 12, N'Kho Siêu Thị 12', N'Hưng Yên',  N'hoat_dong'),
(N'sieuthi', NULL, 13, N'Kho Siêu Thị 13', N'Bắc Giang', N'hoat_dong'),
(N'sieuthi', NULL, 14, N'Kho Siêu Thị 14', N'Hải Dương', N'hoat_dong'),
(N'sieuthi', NULL, 15, N'Kho Siêu Thị 15', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 16, N'Kho Siêu Thị 16', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 17, N'Kho Siêu Thị 17', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 18, N'Kho Siêu Thị 18', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 19, N'Kho Siêu Thị 19', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 20, N'Kho Siêu Thị 20', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 21, N'Kho Siêu Thị 21', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 22, N'Kho Siêu Thị 22', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 23, N'Kho Siêu Thị 23', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 24, N'Kho Siêu Thị 24', N'Hà Nội',    N'hoat_dong'),
(N'sieuthi', NULL, 25, N'Kho Siêu Thị 25', N'Hà Nội',    N'hoat_dong');
PRINT N'✓ Đã insert 50 bản ghi Kho';
GO

-- ============================================================
-- 10. TON KHO (50 bản ghi: kho 1..50 với lô 1..50)
-- ============================================================
INSERT INTO TonKho (MaKho, MaLo, SoLuong) VALUES
(1,  1,  200.00), (2,  2,  150.00), (3,  3,  300.00), (4,  4,  250.00), (5,  5,  180.00),
(6,  6,  90.00),  (7,  7,  140.00), (8,  8,  200.00), (9,  9,  110.00), (10, 10, 60.00),
(11, 11, 80.00),  (12, 12, 70.00),  (13, 13, 120.00), (14, 14, 300.00), (15, 15, 280.00),
(16, 16, 170.00), (17, 17, 120.00), (18, 18, 90.00),  (19, 19, 130.00), (20, 20, 100.00),
(21, 21, 60.00),  (22, 22, 50.00),  (23, 23, 80.00),  (24, 24, 70.00),  (25, 25, 45.00),
(26, 26, 200.00), (27, 27, 150.00), (28, 28, 65.00),  (29, 29, 170.00), (30, 30, 130.00),
(31, 31, 300.00), (32, 32, 400.00), (33, 33, 260.00), (34, 34, 350.00), (35, 35, 220.00),
(36, 36, 170.00), (37, 37, 150.00), (38, 38, 110.00), (39, 39, 260.00), (40, 40, 130.00),
(41, 41, 220.00), (42, 42, 300.00), (43, 43, 170.00), (44, 44, 130.00), (45, 45, 150.00),
(46, 46, 110.00), (47, 47, 85.00),  (48, 48, 350.00), (49, 49, 260.00), (50, 50, 170.00);
PRINT N'✓ Đã insert 50 bản ghi TonKho';
GO

-- ============================================================
-- 10.5. KIEM DINH (50 bản ghi kiểm định lô nông sản)
-- ============================================================
INSERT INTO KiemDinh (MaLo, NguoiKiemDinh, MaDaiLy, MaSieuThi, NgayKiemDinh, KetQua, TrangThai, BienBan, GhiChu) VALUES
(1,  N'Trần Kiểm Định A', 1,  NULL, '2025-05-02', N'dat',       N'hoan_thanh', N'Đạt tiêu chuẩn VIETGAP', N'OK'),
(2,  N'Nguyễn KD B',      2,  NULL, '2025-05-03', N'dat',       N'hoan_thanh', N'Đạt tiêu chuẩn',         N'OK'),
(3,  N'Lê KD C',          3,  NULL, '2025-05-04', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(4,  N'Phạm KD D',        4,  NULL, '2025-05-05', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(5,  N'Hoàng KD E',       5,  NULL, '2025-05-06', N'khong_dat', N'hoan_thanh', N'Không đạt VIETGAP',      N'Dư lượng thuốc'),
(6,  N'Đặng KD F',        6,  NULL, '2025-05-07', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(7,  N'Bùi KD G',         7,  NULL, '2025-05-08', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(8,  N'Ngô KD H',         8,  NULL, '2025-05-09', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(9,  N'Vũ KD I',          9,  NULL, '2025-05-10', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(10, N'Đinh KD J',        10, NULL, '2025-05-11', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(11, N'Lý KD K',          NULL, 1,  '2025-05-01', N'dat',       N'hoan_thanh', N'Đạt tiêu chuẩn ST',      N'OK'),
(12, N'Trương KD L',      NULL, 2,  '2025-05-02', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(13, N'Phan KD M',        NULL, 3,  '2025-05-03', N'khong_dat', N'hoan_thanh', N'Không đạt',              N'Hàng hỏng'),
(14, N'Dương KD N',       NULL, 4,  '2025-05-04', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(15, N'Cao KD O',         NULL, 5,  '2025-05-05', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(16, N'Tô KD P',          1,  NULL, '2025-05-06', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(17, N'Hà KD Q',          2,  NULL, '2025-05-07', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(18, N'Lưu KD R',         3,  NULL, '2025-05-08', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(19, N'Mai KD S',         4,  NULL, '2025-05-09', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(20, N'Đỗ KD T',          5,  NULL, '2025-05-10', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(21, N'KD Viên 21',       6,  NULL, '2025-05-01', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(22, N'KD Viên 22',       7,  NULL, '2025-05-02', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(23, N'KD Viên 23',       8,  NULL, '2025-05-03', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(24, N'KD Viên 24',       9,  NULL, '2025-05-04', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(25, N'KD Viên 25',       10, NULL, '2025-05-05', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(26, N'KD Viên 26',       11, NULL, '2025-05-06', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(27, N'KD Viên 27',       12, NULL, '2025-05-07', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(28, N'KD Viên 28',       13, NULL, '2025-05-08', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(29, N'KD Viên 29',       14, NULL, '2025-05-09', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(30, N'KD Viên 30',       15, NULL, '2025-05-10', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(31, N'KD Viên 31',       NULL, 6,  '2025-05-01', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(32, N'KD Viên 32',       NULL, 7,  '2025-05-02', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(33, N'KD Viên 33',       NULL, 8,  '2025-05-03', N'khong_dat', N'hoan_thanh', N'Không đạt',              N'Hàng dập nát'),
(34, N'KD Viên 34',       NULL, 9,  '2025-05-04', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(35, N'KD Viên 35',       NULL, 10, '2025-05-05', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(36, N'KD Viên 36',       NULL, 11, '2025-05-06', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(37, N'KD Viên 37',       NULL, 12, '2025-05-07', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(38, N'KD Viên 38',       NULL, 13, '2025-05-08', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(39, N'KD Viên 39',       NULL, 14, '2025-05-09', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(40, N'KD Viên 40',       NULL, 15, '2025-05-10', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(41, N'KD Viên 41',       1,  NULL, '2025-05-01', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(42, N'KD Viên 42',       2,  NULL, '2025-05-02', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(43, N'KD Viên 43',       3,  NULL, '2025-05-03', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(44, N'KD Viên 44',       4,  NULL, '2025-05-04', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(45, N'KD Viên 45',       5,  NULL, '2025-05-05', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(46, N'KD Viên 46',       6,  NULL, '2025-05-06', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(47, N'KD Viên 47',       7,  NULL, '2025-05-07', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(48, N'KD Viên 48',       8,  NULL, '2025-05-08', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(49, N'KD Viên 49',       9,  NULL, '2025-05-09', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK'),
(50, N'KD Viên 50',       10, NULL, '2025-05-10', N'dat',       N'hoan_thanh', N'Đạt',                    N'OK');
PRINT N'✓ Đã insert 50 bản ghi KiemDinh';
GO

-- ============================================================
-- 11. DON HANG (50 đơn hàng cha: 25 daily_to_nongdan, 25 sieuthi_to_daily)
-- ============================================================
INSERT INTO DonHang (LoaiDon, NgayDat, NgayGiao, TrangThai, TongSoLuong, TongGiaTri, GhiChu) VALUES
-- 25 đơn đại lý -> nông dân
(N'daily_to_nongdan', '2025-05-01', '2025-05-03', N'da_nhan',       100.00, 3000000, N'Đơn hàng 1'),
(N'daily_to_nongdan', '2025-05-02', '2025-05-04', N'da_nhan',       150.00, 4500000, N'Đơn hàng 2'),
(N'daily_to_nongdan', '2025-05-03', NULL,          N'cho_kiem_dinh', 200.00, 6000000, N'Đơn hàng 3'),
(N'daily_to_nongdan', '2025-05-04', NULL,          N'chua_nhan',     120.00, 3600000, N'Đơn hàng 4'),
(N'daily_to_nongdan', '2025-05-05', '2025-05-07', N'da_nhan',       180.00, 5400000, N'Đơn hàng 5'),
(N'daily_to_nongdan', '2025-05-06', NULL,          N'hoan_don',      90.00,  2700000, N'Đơn hàng 6'),
(N'daily_to_nongdan', '2025-05-07', '2025-05-09', N'da_nhan',       250.00, 7500000, N'Đơn hàng 7'),
(N'daily_to_nongdan', '2025-05-08', NULL,          N'chua_nhan',     130.00, 3900000, N'Đơn hàng 8'),
(N'daily_to_nongdan', '2025-05-09', '2025-05-11', N'da_nhan',       160.00, 4800000, N'Đơn hàng 9'),
(N'daily_to_nongdan', '2025-05-10', NULL,          N'cho_kiem_dinh', 140.00, 4200000, N'Đơn hàng 10'),
(N'daily_to_nongdan', '2025-05-01', '2025-05-03', N'da_nhan',       110.00, 3300000, N'Đơn hàng 11'),
(N'daily_to_nongdan', '2025-05-02', '2025-05-04', N'da_nhan',       170.00, 5100000, N'Đơn hàng 12'),
(N'daily_to_nongdan', '2025-05-03', NULL,          N'da_huy',        80.00,  2400000, N'Đơn hàng 13'),
(N'daily_to_nongdan', '2025-05-04', '2025-05-06', N'da_nhan',       220.00, 6600000, N'Đơn hàng 14'),
(N'daily_to_nongdan', '2025-05-05', NULL,          N'chua_nhan',     190.00, 5700000, N'Đơn hàng 15'),
(N'daily_to_nongdan', '2025-05-06', '2025-05-08', N'da_nhan',       140.00, 4200000, N'Đơn hàng 16'),
(N'daily_to_nongdan', '2025-05-07', NULL,          N'cho_kiem_dinh', 160.00, 4800000, N'Đơn hàng 17'),
(N'daily_to_nongdan', '2025-05-08', '2025-05-10', N'da_nhan',       200.00, 6000000, N'Đơn hàng 18'),
(N'daily_to_nongdan', '2025-05-09', NULL,          N'chua_nhan',     130.00, 3900000, N'Đơn hàng 19'),
(N'daily_to_nongdan', '2025-05-10', '2025-05-12', N'da_nhan',       175.00, 5250000, N'Đơn hàng 20'),
(N'daily_to_nongdan', '2025-05-01', '2025-05-03', N'da_nhan',       100.00, 3000000, N'Đơn hàng 21'),
(N'daily_to_nongdan', '2025-05-02', NULL,          N'hoan_don',      120.00, 3600000, N'Đơn hàng 22'),
(N'daily_to_nongdan', '2025-05-03', '2025-05-05', N'da_nhan',       150.00, 4500000, N'Đơn hàng 23'),
(N'daily_to_nongdan', '2025-05-04', NULL,          N'chua_nhan',     80.00,  2400000, N'Đơn hàng 24'),
(N'daily_to_nongdan', '2025-05-05', '2025-05-07', N'da_nhan',       210.00, 6300000, N'Đơn hàng 25'),
-- 25 đơn siêu thị -> đại lý
(N'sieuthi_to_daily', '2025-05-01', '2025-05-04', N'da_nhan',       300.00, 12000000, N'Đơn hàng 26'),
(N'sieuthi_to_daily', '2025-05-02', '2025-05-05', N'da_nhan',       250.00, 10000000, N'Đơn hàng 27'),
(N'sieuthi_to_daily', '2025-05-03', NULL,          N'cho_kiem_dinh', 400.00, 16000000, N'Đơn hàng 28'),
(N'sieuthi_to_daily', '2025-05-04', NULL,          N'chua_nhan',     350.00, 14000000, N'Đơn hàng 29'),
(N'sieuthi_to_daily', '2025-05-05', '2025-05-08', N'da_nhan',       280.00, 11200000, N'Đơn hàng 30'),
(N'sieuthi_to_daily', '2025-05-06', NULL,          N'hoan_don',      200.00, 8000000,  N'Đơn hàng 31'),
(N'sieuthi_to_daily', '2025-05-07', '2025-05-10', N'da_nhan',       450.00, 18000000, N'Đơn hàng 32'),
(N'sieuthi_to_daily', '2025-05-08', NULL,          N'chua_nhan',     300.00, 12000000, N'Đơn hàng 33'),
(N'sieuthi_to_daily', '2025-05-09', '2025-05-12', N'da_nhan',       380.00, 15200000, N'Đơn hàng 34'),
(N'sieuthi_to_daily', '2025-05-10', NULL,          N'cho_kiem_dinh', 420.00, 16800000, N'Đơn hàng 35'),
(N'sieuthi_to_daily', '2025-05-01', '2025-05-04', N'da_nhan',       260.00, 10400000, N'Đơn hàng 36'),
(N'sieuthi_to_daily', '2025-05-02', '2025-05-05', N'da_nhan',       310.00, 12400000, N'Đơn hàng 37'),
(N'sieuthi_to_daily', '2025-05-03', NULL,          N'da_huy',        180.00, 7200000,  N'Đơn hàng 38'),
(N'sieuthi_to_daily', '2025-05-04', '2025-05-07', N'da_nhan',       500.00, 20000000, N'Đơn hàng 39'),
(N'sieuthi_to_daily', '2025-05-05', NULL,          N'chua_nhan',     340.00, 13600000, N'Đơn hàng 40'),
(N'sieuthi_to_daily', '2025-05-06', '2025-05-09', N'da_nhan',       280.00, 11200000, N'Đơn hàng 41'),
(N'sieuthi_to_daily', '2025-05-07', NULL,          N'cho_kiem_dinh', 390.00, 15600000, N'Đơn hàng 42'),
(N'sieuthi_to_daily', '2025-05-08', '2025-05-11', N'da_nhan',       320.00, 12800000, N'Đơn hàng 43'),
(N'sieuthi_to_daily', '2025-05-09', NULL,          N'chua_nhan',     270.00, 10800000, N'Đơn hàng 44'),
(N'sieuthi_to_daily', '2025-05-10', '2025-05-13', N'da_nhan',       410.00, 16400000, N'Đơn hàng 45'),
(N'sieuthi_to_daily', '2025-05-01', '2025-05-04', N'da_nhan',       230.00, 9200000,  N'Đơn hàng 46'),
(N'sieuthi_to_daily', '2025-05-02', NULL,          N'hoan_don',      290.00, 11600000, N'Đơn hàng 47'),
(N'sieuthi_to_daily', '2025-05-03', '2025-05-06', N'da_nhan',       360.00, 14400000, N'Đơn hàng 48'),
(N'sieuthi_to_daily', '2025-05-04', NULL,          N'chua_nhan',     200.00, 8000000,  N'Đơn hàng 49'),
(N'sieuthi_to_daily', '2025-05-05', '2025-05-08', N'da_nhan',       470.00, 18800000, N'Đơn hàng 50');
PRINT N'✓ Đã insert 50 bản ghi DonHang';
GO

-- ============================================================
-- 12. DON HANG DAI LY (25 đơn từ đại lý -> nông dân, MaDonHang 1..25)
-- ============================================================
INSERT INTO DonHangDaiLy (MaDonHang, MaDaiLy, MaNongDan, MaKho) VALUES
(1,  1,  1,  1),  (2,  2,  2,  2),  (3,  3,  3,  3),  (4,  4,  4,  4),  (5,  5,  5,  5),
(6,  6,  6,  6),  (7,  7,  7,  7),  (8,  8,  8,  8),  (9,  9,  9,  9),  (10, 10, 10, 10),
(11, 11, 11, 11), (12, 12, 12, 12), (13, 13, 13, 13), (14, 14, 14, 14), (15, 15, 15, 15),
(16, 1,  16, 1),  (17, 2,  17, 2),  (18, 3,  18, 3),  (19, 4,  19, 4),  (20, 5,  20, 5),
(21, 6,  21, 6),  (22, 7,  22, 7),  (23, 8,  23, 8),  (24, 9,  24, 9),  (25, 10, 25, 10);
PRINT N'✓ Đã insert 25 bản ghi DonHangDaiLy';
GO

-- ============================================================
-- 13. DON HANG SIEU THI (25 đơn từ siêu thị -> đại lý, MaDonHang 26..50)
-- ============================================================
INSERT INTO DonHangSieuThi (MaDonHang, MaSieuThi, MaDaiLy) VALUES
(26, 1,  1),  (27, 2,  2),  (28, 3,  3),  (29, 4,  4),  (30, 5,  5),
(31, 6,  6),  (32, 7,  7),  (33, 8,  8),  (34, 9,  9),  (35, 10, 10),
(36, 11, 11), (37, 12, 12), (38, 13, 13), (39, 14, 14), (40, 15, 15),
(41, 1,  16), (42, 2,  17), (43, 3,  18), (44, 4,  19), (45, 5,  20),
(46, 6,  21), (47, 7,  22), (48, 8,  23), (49, 9,  24), (50, 10, 25);
PRINT N'✓ Đã insert 25 bản ghi DonHangSieuThi';
GO

-- ============================================================
-- 14. CHI TIET DON HANG (50 bản ghi: mỗi đơn hàng 1 dòng chi tiết)
-- ============================================================
INSERT INTO ChiTietDonHang (MaDonHang, MaLo, SoLuong, DonGia, ThanhTien) VALUES
(1,  1,  100.00, 30000, 3000000), (2,  2,  150.00, 30000, 4500000),
(3,  3,  200.00, 30000, 6000000), (4,  4,  120.00, 30000, 3600000),
(5,  5,  180.00, 30000, 5400000), (6,  6,  90.00,  30000, 2700000),
(7,  7,  250.00, 30000, 7500000), (8,  8,  130.00, 30000, 3900000),
(9,  9,  160.00, 30000, 4800000), (10, 10, 140.00, 30000, 4200000),
(11, 11, 110.00, 30000, 3300000), (12, 12, 170.00, 30000, 5100000),
(13, 13, 80.00,  30000, 2400000), (14, 14, 220.00, 30000, 6600000),
(15, 15, 190.00, 30000, 5700000), (16, 16, 140.00, 30000, 4200000),
(17, 17, 160.00, 30000, 4800000), (18, 18, 200.00, 30000, 6000000),
(19, 19, 130.00, 30000, 3900000), (20, 20, 175.00, 30000, 5250000),
(21, 21, 100.00, 30000, 3000000), (22, 22, 120.00, 30000, 3600000),
(23, 23, 150.00, 30000, 4500000), (24, 24, 80.00,  30000, 2400000),
(25, 25, 210.00, 30000, 6300000),
(26, 26, 300.00, 40000, 12000000), (27, 27, 250.00, 40000, 10000000),
(28, 28, 400.00, 40000, 16000000), (29, 29, 350.00, 40000, 14000000),
(30, 30, 280.00, 40000, 11200000), (31, 31, 200.00, 40000, 8000000),
(32, 32, 450.00, 40000, 18000000), (33, 33, 300.00, 40000, 12000000),
(34, 34, 380.00, 40000, 15200000), (35, 35, 420.00, 40000, 16800000),
(36, 36, 260.00, 40000, 10400000), (37, 37, 310.00, 40000, 12400000),
(38, 38, 180.00, 40000, 7200000),  (39, 39, 500.00, 40000, 20000000),
(40, 40, 340.00, 40000, 13600000), (41, 41, 280.00, 40000, 11200000),
(42, 42, 390.00, 40000, 15600000), (43, 43, 320.00, 40000, 12800000),
(44, 44, 270.00, 40000, 10800000), (45, 45, 410.00, 40000, 16400000),
(46, 46, 230.00, 40000, 9200000),  (47, 47, 290.00, 40000, 11600000),
(48, 48, 360.00, 40000, 14400000), (49, 49, 200.00, 40000, 8000000),
(50, 50, 470.00, 40000, 18800000);
PRINT N'✓ Đã insert 50 bản ghi ChiTietDonHang';
GO

-- ============================================================
-- 15. KIEM DINH DON HANG (50 bản ghi kiểm định đơn hàng đại lý)
-- ============================================================
INSERT INTO KiemDinhDonHang (MaDonHang, MaDaiLy, MaNongDan, NgayKiemDinh, NguoiKiemDinh, KetQua, MaKho, GhiChu) VALUES
(1,  1,  1,  '2025-05-03', N'Kiểm Định Viên A1',  N'dat',       1,  N'Đạt, nhập kho 1'),
(2,  2,  2,  '2025-05-04', N'Kiểm Định Viên A2',  N'dat',       2,  N'Đạt, nhập kho 2'),
(3,  3,  3,  '2025-05-05', N'Kiểm Định Viên A3',  N'dat',       3,  N'Đạt, nhập kho 3'),
(4,  4,  4,  '2025-05-06', N'Kiểm Định Viên A4',  N'khong_dat', NULL,N'Không đạt, trả hàng'),
(5,  5,  5,  '2025-05-07', N'Kiểm Định Viên A5',  N'dat',       5,  N'Đạt'),
(6,  6,  6,  '2025-05-08', N'Kiểm Định Viên A6',  N'dat',       6,  N'Đạt'),
(7,  7,  7,  '2025-05-09', N'Kiểm Định Viên A7',  N'dat',       7,  N'Đạt'),
(8,  8,  8,  '2025-05-10', N'Kiểm Định Viên A8',  N'khong_dat', NULL,N'Không đạt'),
(9,  9,  9,  '2025-05-11', N'Kiểm Định Viên A9',  N'dat',       9,  N'Đạt'),
(10, 10, 10, '2025-05-12', N'Kiểm Định Viên A10', N'dat',       10, N'Đạt'),
(11, 11, 11, '2025-05-03', N'Kiểm Định Viên B1',  N'dat',       11, N'Đạt'),
(12, 12, 12, '2025-05-04', N'Kiểm Định Viên B2',  N'dat',       12, N'Đạt'),
(13, 13, 13, '2025-05-05', N'Kiểm Định Viên B3',  N'dat',       13, N'Đạt'),
(14, 14, 14, '2025-05-06', N'Kiểm Định Viên B4',  N'dat',       14, N'Đạt'),
(15, 15, 15, '2025-05-07', N'Kiểm Định Viên B5',  N'khong_dat', NULL,N'Không đạt'),
(16, 1,  16, '2025-05-08', N'Kiểm Định Viên B6',  N'dat',       1,  N'Đạt'),
(17, 2,  17, '2025-05-09', N'Kiểm Định Viên B7',  N'dat',       2,  N'Đạt'),
(18, 3,  18, '2025-05-10', N'Kiểm Định Viên B8',  N'dat',       3,  N'Đạt'),
(19, 4,  19, '2025-05-11', N'Kiểm Định Viên B9',  N'dat',       4,  N'Đạt'),
(20, 5,  20, '2025-05-12', N'Kiểm Định Viên B10', N'dat',       5,  N'Đạt'),
(21, 6,  21, '2025-05-03', N'Kiểm Định Viên C1',  N'dat',       6,  N'Đạt'),
(22, 7,  22, '2025-05-04', N'Kiểm Định Viên C2',  N'khong_dat', NULL,N'Không đạt'),
(23, 8,  23, '2025-05-05', N'Kiểm Định Viên C3',  N'dat',       8,  N'Đạt'),
(24, 9,  24, '2025-05-06', N'Kiểm Định Viên C4',  N'dat',       9,  N'Đạt'),
(25, 10, 25, '2025-05-07', N'Kiểm Định Viên C5',  N'dat',       10, N'Đạt'),
-- Thêm 25 bản ghi nữa (dùng lại đơn hàng 1..25 cho đơn kiểm định lần 2 - bạn có thể điều chỉnh)
-- Vì KiemDinhDonHang không có UNIQUE trên MaDonHang nên có thể có nhiều lần kiểm định
(1,  1,  1,  '2025-05-13', N'KĐ Lần 2 - DH1',  N'dat',       1,  N'Kiểm định lại - Đạt'),
(2,  2,  2,  '2025-05-13', N'KĐ Lần 2 - DH2',  N'dat',       2,  N'Đạt'),
(3,  3,  3,  '2025-05-13', N'KĐ Lần 2 - DH3',  N'dat',       3,  N'Đạt'),
(4,  4,  4,  '2025-05-13', N'KĐ Lần 2 - DH4',  N'dat',       4,  N'Kiểm định lại - Đạt'),
(5,  5,  5,  '2025-05-13', N'KĐ Lần 2 - DH5',  N'dat',       5,  N'Đạt'),
(6,  6,  6,  '2025-05-13', N'KĐ Lần 2 - DH6',  N'dat',       6,  N'Đạt'),
(7,  7,  7,  '2025-05-13', N'KĐ Lần 2 - DH7',  N'khong_dat', NULL,N'Không đạt lần 2'),
(8,  8,  8,  '2025-05-13', N'KĐ Lần 2 - DH8',  N'dat',       8,  N'Kiểm định lại - Đạt'),
(9,  9,  9,  '2025-05-13', N'KĐ Lần 2 - DH9',  N'dat',       9,  N'Đạt'),
(10, 10, 10, '2025-05-13', N'KĐ Lần 2 - DH10', N'dat',       10, N'Đạt'),
(11, 11, 11, '2025-05-13', N'KĐ Lần 2 - DH11', N'dat',       11, N'Đạt'),
(12, 12, 12, '2025-05-13', N'KĐ Lần 2 - DH12', N'dat',       12, N'Đạt'),
(13, 13, 13, '2025-05-13', N'KĐ Lần 2 - DH13', N'dat',       13, N'Đạt'),
(14, 14, 14, '2025-05-13', N'KĐ Lần 2 - DH14', N'dat',       14, N'Đạt'),
(15, 15, 15, '2025-05-13', N'KĐ Lần 2 - DH15', N'dat',       15, N'Kiểm định lại - Đạt'),
(16, 1,  16, '2025-05-13', N'KĐ Lần 2 - DH16', N'dat',       1,  N'Đạt'),
(17, 2,  17, '2025-05-13', N'KĐ Lần 2 - DH17', N'dat',       2,  N'Đạt'),
(18, 3,  18, '2025-05-13', N'KĐ Lần 2 - DH18', N'dat',       3,  N'Đạt'),
(19, 4,  19, '2025-05-13', N'KĐ Lần 2 - DH19', N'dat',       4,  N'Đạt'),
(20, 5,  20, '2025-05-13', N'KĐ Lần 2 - DH20', N'dat',       5,  N'Đạt'),
(21, 6,  21, '2025-05-13', N'KĐ Lần 2 - DH21', N'dat',       6,  N'Đạt'),
(22, 7,  22, '2025-05-13', N'KĐ Lần 2 - DH22', N'dat',       7,  N'Kiểm định lại - Đạt'),
(23, 8,  23, '2025-05-13', N'KĐ Lần 2 - DH23', N'dat',       8,  N'Đạt'),
(24, 9,  24, '2025-05-13', N'KĐ Lần 2 - DH24', N'dat',       9,  N'Đạt'),
(25, 10, 25, '2025-05-13', N'KĐ Lần 2 - DH25', N'dat',       10, N'Đạt');
PRINT N'✓ Đã insert 50 bản ghi KiemDinhDonHang';
GO

-- ============================================================
-- 16. KIEM DINH DON HANG SIEU THI (50 bản ghi)
-- ============================================================
INSERT INTO KiemDinhDonHangSieuThi (MaDonHang, MaSieuThi, NgayKiemDinh, NguoiKiemDinh, KetQua, MaKho, GhiChu) VALUES
(26, 1,  '2025-05-04', N'KĐ Siêu Thị A1',  N'dat',       26, N'Đạt, nhập kho ST1'),
(27, 2,  '2025-05-05', N'KĐ Siêu Thị A2',  N'dat',       27, N'Đạt'),
(28, 3,  '2025-05-06', N'KĐ Siêu Thị A3',  N'dat',       28, N'Đạt'),
(29, 4,  '2025-05-07', N'KĐ Siêu Thị A4',  N'khong_dat', NULL,N'Không đạt'),
(30, 5,  '2025-05-08', N'KĐ Siêu Thị A5',  N'dat',       30, N'Đạt'),
(31, 6,  '2025-05-09', N'KĐ Siêu Thị A6',  N'dat',       31, N'Đạt'),
(32, 7,  '2025-05-10', N'KĐ Siêu Thị A7',  N'dat',       32, N'Đạt'),
(33, 8,  '2025-05-11', N'KĐ Siêu Thị A8',  N'khong_dat', NULL,N'Không đạt'),
(34, 9,  '2025-05-12', N'KĐ Siêu Thị A9',  N'dat',       34, N'Đạt'),
(35, 10, '2025-05-11', N'KĐ Siêu Thị A10', N'dat',       35, N'Đạt'),
(36, 11, '2025-05-04', N'KĐ Siêu Thị B1',  N'dat',       36, N'Đạt'),
(37, 12, '2025-05-05', N'KĐ Siêu Thị B2',  N'dat',       37, N'Đạt'),
(38, 13, '2025-05-06', N'KĐ Siêu Thị B3',  N'dat',       38, N'Đạt'),
(39, 14, '2025-05-07', N'KĐ Siêu Thị B4',  N'dat',       39, N'Đạt'),
(40, 15, '2025-05-08', N'KĐ Siêu Thị B5',  N'dat',       40, N'Đạt'),
(41, 1,  '2025-05-04', N'KĐ Siêu Thị B6',  N'dat',       41, N'Đạt'),
(42, 2,  '2025-05-05', N'KĐ Siêu Thị B7',  N'khong_dat', NULL,N'Không đạt'),
(43, 3,  '2025-05-06', N'KĐ Siêu Thị B8',  N'dat',       43, N'Đạt'),
(44, 4,  '2025-05-07', N'KĐ Siêu Thị B9',  N'dat',       44, N'Đạt'),
(45, 5,  '2025-05-08', N'KĐ Siêu Thị B10', N'dat',       45, N'Đạt'),
(46, 6,  '2025-05-04', N'KĐ Siêu Thị C1',  N'dat',       46, N'Đạt'),
(47, 7,  '2025-05-05', N'KĐ Siêu Thị C2',  N'dat',       47, N'Đạt'),
(48, 8,  '2025-05-06', N'KĐ Siêu Thị C3',  N'dat',       48, N'Đạt'),
(49, 9,  '2025-05-07', N'KĐ Siêu Thị C4',  N'dat',       49, N'Đạt'),
(50, 10, '2025-05-08', N'KĐ Siêu Thị C5',  N'dat',       50, N'Đạt'),
-- Lần 2
(26, 1,  '2025-05-14', N'KĐ ST Lần 2 - 26', N'dat',       26, N'Kiểm định lại - Đạt'),
(27, 2,  '2025-05-14', N'KĐ ST Lần 2 - 27', N'dat',       27, N'Đạt'),
(28, 3,  '2025-05-14', N'KĐ ST Lần 2 - 28', N'dat',       28, N'Đạt'),
(29, 4,  '2025-05-14', N'KĐ ST Lần 2 - 29', N'dat',       29, N'Kiểm định lại - Đạt'),
(30, 5,  '2025-05-14', N'KĐ ST Lần 2 - 30', N'dat',       30, N'Đạt'),
(31, 6,  '2025-05-14', N'KĐ ST Lần 2 - 31', N'dat',       31, N'Đạt'),
(32, 7,  '2025-05-14', N'KĐ ST Lần 2 - 32', N'dat',       32, N'Đạt'),
(33, 8,  '2025-05-14', N'KĐ ST Lần 2 - 33', N'dat',       33, N'Kiểm định lại - Đạt'),
(34, 9,  '2025-05-14', N'KĐ ST Lần 2 - 34', N'dat',       34, N'Đạt'),
(35, 10, '2025-05-14', N'KĐ ST Lần 2 - 35', N'dat',       35, N'Đạt'),
(36, 11, '2025-05-14', N'KĐ ST Lần 2 - 36', N'dat',       36, N'Đạt'),
(37, 12, '2025-05-14', N'KĐ ST Lần 2 - 37', N'dat',       37, N'Đạt'),
(38, 13, '2025-05-14', N'KĐ ST Lần 2 - 38', N'dat',       38, N'Đạt'),
(39, 14, '2025-05-14', N'KĐ ST Lần 2 - 39', N'khong_dat', NULL,N'Không đạt lần 2'),
(40, 15, '2025-05-14', N'KĐ ST Lần 2 - 40', N'dat',       40, N'Đạt'),
(41, 1,  '2025-05-14', N'KĐ ST Lần 2 - 41', N'dat',       41, N'Đạt'),
(42, 2,  '2025-05-14', N'KĐ ST Lần 2 - 42', N'dat',       42, N'Kiểm định lại - Đạt'),
(43, 3,  '2025-05-14', N'KĐ ST Lần 2 - 43', N'dat',       43, N'Đạt'),
(44, 4,  '2025-05-14', N'KĐ ST Lần 2 - 44', N'dat',       44, N'Đạt'),
(45, 5,  '2025-05-14', N'KĐ ST Lần 2 - 45', N'dat',       45, N'Đạt'),
(46, 6,  '2025-05-14', N'KĐ ST Lần 2 - 46', N'dat',       46, N'Đạt'),
(47, 7,  '2025-05-14', N'KĐ ST Lần 2 - 47', N'dat',       47, N'Đạt'),
(48, 8,  '2025-05-14', N'KĐ ST Lần 2 - 48', N'dat',       48, N'Đạt'),
(49, 9,  '2025-05-14', N'KĐ ST Lần 2 - 49', N'dat',       49, N'Đạt'),
(50, 10, '2025-05-14', N'KĐ ST Lần 2 - 50', N'dat',       50, N'Đạt');
PRINT N'✓ Đã insert 50 bản ghi KiemDinhDonHangSieuThi';
GO

-- ============================================================
-- TỔNG KẾT
-- ============================================================
PRINT '';
PRINT '========================================';
PRINT 'HOÀN THÀNH INSERT DỮ LIỆU MẪU';
PRINT '========================================';
PRINT 'Tài khoản mặc định:';
PRINT '  • nd1 / 123456  -> Nông dân 1 (Nguyễn Văn An)';
PRINT '  • dl1 / 123456  -> Đại lý 1 (Đại Lý Nông Sản Phát Đạt)';
PRINT '  • st1 / 123456  -> Siêu thị 1 (Siêu Thị Xanh Hà Nội)';
PRINT '  • admin1 / 123456 -> Quản trị viên';
PRINT '========================================';
GO