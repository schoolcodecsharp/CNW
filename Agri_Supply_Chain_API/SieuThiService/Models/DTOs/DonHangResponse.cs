namespace SieuThiService.Models.DTOs
{
    public class DonHangResponse
    {
        public int MaDonHang { get; set; }
        public int MaSieuThi { get; set; }
        public int MaDaiLy { get; set; }
        public string LoaiDon { get; set; } = null!;
        public DateTime? NgayDat { get; set; }
        public DateTime? NgayGiao { get; set; }
        public string? TrangThai { get; set; }
        public decimal? TongSoLuong { get; set; }
        public decimal? TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
        public string? TenSieuThi { get; set; }
    }

    public class ChiTietDonHangAddResponse
    {
        public int MaDonHang { get; set; }
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public decimal? DonGia { get; set; }
        public decimal? ThanhTien { get; set; }
        public string Message { get; set; } = "Thêm chi tiết đơn hàng thành công";
    }
}