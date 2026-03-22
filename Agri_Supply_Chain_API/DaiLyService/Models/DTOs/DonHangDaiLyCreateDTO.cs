using System.ComponentModel.DataAnnotations;

namespace DaiLyService.Models.DTOs
{
    public class DonHangDaiLyCreateDTO
    {
        [Required(ErrorMessage = "Mã đại lý là bắt buộc")]
        public int MaDaiLy { get; set; }

        [Required(ErrorMessage = "Mã nông dân là bắt buộc")]
        public int MaNongDan { get; set; }

        [StringLength(255, ErrorMessage = "Ghi chú không được vượt quá 255 ký tự")]
        public string? GhiChu { get; set; }

        [Required(ErrorMessage = "Chi tiết đơn hàng là bắt buộc")]
        public List<ChiTietDonHangCreateDTO> ChiTietDonHang { get; set; } = new();
    }

    public class ChiTietDonHangCreateDTO
    {
        [Required(ErrorMessage = "Mã lô là bắt buộc")]
        public int MaLo { get; set; }

        [Required(ErrorMessage = "Số lượng là bắt buộc")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public decimal SoLuong { get; set; }

        public decimal? DonGia { get; set; }
    }
}
