namespace DaiLyService.Models.DTOs
{
    public class DaiLyPhanHoi
    {
        public int MaDaiLy { get; set; }
        public string? TenDaiLy { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public string? TenDangNhap { get; set; }  // Từ bảng TaiKhoan
        public string? TrangThai { get; set; }     // Từ bảng TaiKhoan
    }
}