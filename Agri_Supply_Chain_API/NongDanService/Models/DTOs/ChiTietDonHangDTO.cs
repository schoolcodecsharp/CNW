namespace NongDanService.Models.DTOs
{
    // DTO hiển thị chi tiết đơn hàng
    public class ChiTietDonHangDTO
    {
        public int MaDonHang { get; set; }
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
        
        // Thông tin bổ sung từ JOIN
        public string? TenSanPham { get; set; }
        public string? MaQR { get; set; }
        public string? TenTrangTrai { get; set; }
    }

    // DTO cho 1 item chi tiết (dùng trong danh sách)
    public class ChiTietDonHangItemDTO
    {
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    // DTO tạo chi tiết đơn hàng đơn lẻ
    public class ChiTietDonHangCreateDTO
    {
        public int MaDonHang { get; set; }
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    // DTO cập nhật chi tiết
    public class ChiTietDonHangUpdateDTO
    {
        public decimal? SoLuong { get; set; }
        public decimal? DonGia { get; set; }
    }
}
