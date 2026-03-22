using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    public class UpdateChiTietDonHangRequest
    {
        [Required(ErrorMessage = "Mã đơn hàng là bắt buộc")]
        public int MaDonHang { get; set; }

        [Required(ErrorMessage = "Mã lô là bắt buộc")]
        public int MaLo { get; set; }

        [Required(ErrorMessage = "Số lượng là bắt buộc")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public decimal SoLuong { get; set; }

        public decimal? DonGia { get; set; }
    }

    public class UpdateChiTietDonHangResponse
    {
        public int MaDonHang { get; set; }
        public int MaLo { get; set; }
        public decimal SoLuongCu { get; set; }
        public decimal SoLuongMoi { get; set; }
        public decimal? DonGiaCu { get; set; }
        public decimal? DonGiaMoi { get; set; }
        public decimal? ThanhTienCu { get; set; }
        public decimal? ThanhTienMoi { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public string Message { get; set; } = "Cập nhật chi tiết đơn hàng thành công";
        public bool Success { get; set; } = true;
    }
}