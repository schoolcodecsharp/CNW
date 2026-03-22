namespace AdminService.Models.DTOs
{
    public class TaiKhoanDto
    {
        public int MaTaiKhoan { get; set; }
        public string TenDangNhap { get; set; } = null!;
        public string LoaiTaiKhoan { get; set; } = null!;
        public string? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
        public DateTime? LanDangNhapCuoi { get; set; }
        
        // Thông tin chi tiết theo loại tài khoản
        public AdminDto? Admin { get; set; }
        public NongDanDto? NongDan { get; set; }
        public SieuThiDto? SieuThi { get; set; }
        public DaiLyDto? DaiLy { get; set; }
    }

    public class AdminDto
    {
        public int MaAdmin { get; set; }
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
    }

    public class NongDanDto
    {
        public int MaNongDan { get; set; }
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
    }

    public class SieuThiDto
    {
        public int MaSieuThi { get; set; }
        public string? TenSieuThi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
    }

    public class DaiLyDto
    {
        public int MaDaiLy { get; set; }
        public string? TenDaiLy { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
    }

    public class UpdateTaiKhoanRequest
    {
        public string? MatKhau { get; set; }
        public string? TrangThai { get; set; }
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public string? TenCuaHang { get; set; } // Cho SieuThi hoặc DaiLy
    }
}