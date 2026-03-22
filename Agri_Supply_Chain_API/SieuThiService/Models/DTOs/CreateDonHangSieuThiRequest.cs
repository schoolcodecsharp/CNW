using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    public class CreateDonHangSieuThiRequest
    {
        [Required(ErrorMessage = "Mã siêu thị là bắt buộc")]
        public int MaSieuThi { get; set; }

        [Required(ErrorMessage = "Mã đại lý là bắt buộc")]
        public int MaDaiLy { get; set; }

        public DateTime? NgayGiao { get; set; }

        public string? GhiChu { get; set; }

        [Required(ErrorMessage = "Chi tiết đơn hàng là bắt buộc")]
        public List<ChiTietDonHangSieuThiRequest> ChiTietDonHangs { get; set; } = new List<ChiTietDonHangSieuThiRequest>();
    }

    public class ChiTietDonHangSieuThiRequest
    {
        [Required(ErrorMessage = "Mã lô là bắt buộc")]
        public int MaLo { get; set; }

        [Required(ErrorMessage = "Số lượng là bắt buộc")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public decimal SoLuong { get; set; }

        public decimal? DonGia { get; set; }
    }
}