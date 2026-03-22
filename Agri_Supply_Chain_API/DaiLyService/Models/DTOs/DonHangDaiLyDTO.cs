namespace DaiLyService.Models.DTOs
{
    public class DonHangDaiLyDTO
    {
        public int MaDonHang { get; set; }
        public int MaDaiLy { get; set; }
        public int MaNongDan { get; set; }
        public string? TenNongDan { get; set; }
        public DateTime? NgayDat { get; set; }
        public DateTime? NgayGiao { get; set; }
        public string? TrangThai { get; set; }
        public decimal? TongSoLuong { get; set; }
        public decimal? TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
        public List<ChiTietDonHangDTO>? ChiTietDonHang { get; set; }
    }

    public class ChiTietDonHangDTO
    {
        public int MaLo { get; set; }
        public string? TenSanPham { get; set; }
        public decimal SoLuong { get; set; }
        public decimal? DonGia { get; set; }
        public decimal? ThanhTien { get; set; }
    }
}
