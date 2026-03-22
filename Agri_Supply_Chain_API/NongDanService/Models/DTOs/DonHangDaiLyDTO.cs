namespace NongDanService.Models.DTOs
{
    public class DonHangDaiLyDTO
    {
        // Từ bảng DonHangDaiLy
        public int MaDonHang { get; set; }
        public int? MaDaiLy { get; set; }
        public int? MaNongDan { get; set; }
        
        // Từ bảng DonHang
        public string? LoaiDon { get; set; }
        public DateTime? NgayDat { get; set; }
        public DateTime? NgayGiao { get; set; }
        public string? TrangThai { get; set; }
        public decimal? TongSoLuong { get; set; }
        public decimal? TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
        
        // Thông tin bổ sung từ join
        public string? TenNongDan { get; set; }
        public string? TenDaiLy { get; set; }
        
        // Chi tiết đơn hàng (danh sách các lô sản phẩm)
        public List<ChiTietDonHangDTO>? ChiTietDonHang { get; set; }
    }
}
