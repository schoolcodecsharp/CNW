namespace DaiLyService.Models.DTOs
{
    public class KhoDTO
    {
        public int MaKho { get; set; }
        public string LoaiKho { get; set; } = string.Empty;
        public int? MaDaiLy { get; set; }
        public int? MaSieuThi { get; set; }
        public string TenKho { get; set; } = string.Empty;
        public string? DiaChi { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
