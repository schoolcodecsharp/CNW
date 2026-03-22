using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    public class DeleteChiTietDonHangRequest
    {
        [Required(ErrorMessage = "Mã đơn hàng là bắt buộc")]
        public int MaDonHang { get; set; }

        [Required(ErrorMessage = "Mã lô là bắt buộc")]
        public int MaLo { get; set; }
    }

    public class DeleteChiTietDonHangResponse
    {
        public int MaDonHang { get; set; }
        public int MaLo { get; set; }
        public string TenSanPham { get; set; } = "";
        public decimal SoLuongDaXoa { get; set; }
        public decimal? DonGiaDaXoa { get; set; }
        public decimal? ThanhTienDaXoa { get; set; }
        public decimal TongSoLuongConLai { get; set; }
        public decimal TongGiaTriConLai { get; set; }
        public DateTime NgayXoa { get; set; }
        public string Message { get; set; } = "Xóa chi tiết đơn hàng thành công";
        public bool Success { get; set; } = true;
    }
}