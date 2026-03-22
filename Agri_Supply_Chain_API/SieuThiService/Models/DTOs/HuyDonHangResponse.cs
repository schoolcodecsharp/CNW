namespace SieuThiService.Models.DTOs
{
    public class HuyDonHangResponse
    {
        public int MaDonHang { get; set; }
        public string TrangThaiCu { get; set; } = null!;
        public string TrangThaiMoi { get; set; } = "da_huy";
        public DateTime NgayHuy { get; set; }
        public string Message { get; set; } = "Hủy đơn hàng thành công";
        public bool Success { get; set; } = true;
    }
}