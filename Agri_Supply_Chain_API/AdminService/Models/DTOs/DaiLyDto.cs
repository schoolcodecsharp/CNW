namespace AdminService.Models.DTOs
{
    public class DaiLyDto
    {
        public int MaDaiLy { get; set; }
        public int MaTaiKhoan { get; set; }
        public string? TenDaiLy { get; set; }
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? TenDangNhap { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
    }

    public class CreateDaiLyRequest
    {
        public string TenDangNhap { get; set; } = "";
        public string MatKhau { get; set; } = "";
        public string TenDaiLy { get; set; } = "";
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
    }

    public class UpdateDaiLyRequest
    {
        public string TenDaiLy { get; set; } = "";
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
    }
}
