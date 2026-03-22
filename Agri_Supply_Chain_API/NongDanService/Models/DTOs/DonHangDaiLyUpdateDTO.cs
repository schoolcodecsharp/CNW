namespace NongDanService.Models.DTOs
{
    public class DonHangDaiLyUpdateDTO
    {
        public string? LoaiDon { get; set; }
        public DateTime? NgayGiao { get; set; }
        public string? TrangThai { get; set; }
        public decimal? TongSoLuong { get; set; }
        public decimal? TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
    }
}
