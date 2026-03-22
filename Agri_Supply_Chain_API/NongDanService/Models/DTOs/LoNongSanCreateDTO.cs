using System.ComponentModel.DataAnnotations;

namespace NongDanService.Models.DTOs
{
    public class LoNongSanCreateDTO
    {
        [Required(ErrorMessage = "Mã trang trại là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã trang trại phải lớn hơn 0")]
        public int MaTrangTrai { get; set; }

        [Required(ErrorMessage = "Mã sản phẩm là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã sản phẩm phải lớn hơn 0")]
        public int MaSanPham { get; set; }

        [Required(ErrorMessage = "Số lượng ban đầu là bắt buộc")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public decimal SoLuongBanDau { get; set; }

        [StringLength(50, ErrorMessage = "Số chứng nhận lô không được vượt quá 50 ký tự")]
        public string? SoChungNhanLo { get; set; }
    }
}