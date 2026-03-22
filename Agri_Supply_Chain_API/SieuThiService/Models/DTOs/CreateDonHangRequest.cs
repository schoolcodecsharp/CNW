using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    public class CreateDonHangRequest
    {
        [Required(ErrorMessage = "Mã siêu thị là bắt buộc")]
        public int MaSieuThi { get; set; }

        [Required(ErrorMessage = "Mã đại lý là bắt buộc")]
        public int MaDaiLy { get; set; }

        public DateTime? NgayGiao { get; set; }

        public string? GhiChu { get; set; }
    }

    public class CreateChiTietDonHangRequest
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
}