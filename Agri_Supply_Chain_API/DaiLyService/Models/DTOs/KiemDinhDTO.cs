namespace DaiLyService.Models.DTOs
{
    public class KiemDinhDTO
    {
        public int MaKiemDinh { get; set; }
        public int MaLo { get; set; }
        public string? NguoiKiemDinh { get; set; }
        public int? MaDaiLy { get; set; }
        public int? MaSieuThi { get; set; }
        public DateTime? NgayKiemDinh { get; set; }
        public string KetQua { get; set; } = string.Empty;
        public string? TrangThai { get; set; }
        public string? BienBan { get; set; }
        public string? ChuKySo { get; set; }
        public string? GhiChu { get; set; }
    }
}
