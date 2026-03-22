namespace DaiLyService.Models.DTOs
{
    public class DonHangSieuThiDTO
    {
        public int MaDonHang { get; set; }
        public int MaSieuThi { get; set; }
        public string? TenSieuThi { get; set; }
        public int MaDaiLy { get; set; }
        public DateTime? NgayDat { get; set; }
        public DateTime? NgayGiao { get; set; }
        public string? TrangThai { get; set; }
        public decimal? TongSoLuong { get; set; }
        public decimal? TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
        public List<ChiTietDonHangDTO>? ChiTietDonHang { get; set; }
    }

    public class DonHangSieuThiUpdateDTO
    {
        public string? TrangThai { get; set; }
        public DateTime? NgayGiao { get; set; }
        public string? GhiChu { get; set; }
    }
}
