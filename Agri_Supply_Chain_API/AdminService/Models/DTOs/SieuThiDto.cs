namespace AdminService.Models.DTOs
{
    public class SieuThiDto
    {
        public int MaSieuThi { get; set; }
        public int MaTaiKhoan { get; set; }
        public string? TenSieuThi { get; set; }
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? TenDangNhap { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
    }

    public class CreateSieuThiRequest
    {
        public string TenDangNhap { get; set; } = "";
        public string MatKhau { get; set; } = "";
        public string TenSieuThi { get; set; } = "";
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
    }

    public class UpdateSieuThiRequest
    {
        public string TenSieuThi { get; set; } = "";
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
    }
}
