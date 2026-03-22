using System.ComponentModel.DataAnnotations;

namespace DaiLyService.Models.DTOs
{
    public class KhoCreateDTO
    {
        [Required(ErrorMessage = "Loại kho là bắt buộc")]
        [StringLength(20, ErrorMessage = "Loại kho không được vượt quá 20 ký tự")]
        public string LoaiKho { get; set; } = string.Empty;

        public int? MaDaiLy { get; set; }

        public int? MaSieuThi { get; set; }

        [Required(ErrorMessage = "Tên kho là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên kho không được vượt quá 100 ký tự")]
        public string TenKho { get; set; } = string.Empty;

        [StringLength(255, ErrorMessage = "Địa chỉ không được vượt quá 255 ký tự")]
        public string? DiaChi { get; set; }
    }
}
