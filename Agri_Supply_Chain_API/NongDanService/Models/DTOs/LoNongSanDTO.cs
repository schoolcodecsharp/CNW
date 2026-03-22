namespace NongDanService.Models.DTOs
{
    public class LoNongSanDTO
    {
        public int MaLo { get; set; }
        public int MaTrangTrai { get; set; }
        public int MaSanPham { get; set; }
        public decimal SoLuongBanDau { get; set; }
        public decimal SoLuongHienTai { get; set; }
        public string? SoChungNhanLo { get; set; }
        public string? MaQR { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
        
        // Thông tin bổ sung
        public string? TenTrangTrai { get; set; }
        public string? TenSanPham { get; set; }
    }
}