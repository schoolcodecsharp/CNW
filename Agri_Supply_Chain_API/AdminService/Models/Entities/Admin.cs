namespace AdminService.Models.Entities
{
    public class Admin
    {
        public int MaAdmin { get; set; }
        public string TenDangNhap { get; set; } = string.Empty;
        public string MatKhauHash { get; set; } = string.Empty;
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string TrangThai { get; set; } = "hoat_dong";
        public DateTime NgayTao { get; set; }
    }
}
