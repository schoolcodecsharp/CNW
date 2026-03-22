using System.ComponentModel.DataAnnotations;

namespace NongDanService.Models.DTOs
{
    public class TrangTraiCreateDTO
    {
        [Required(ErrorMessage = "Mã nông dân là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã nông dân phải lớn hơn 0")]
        public int MaNongDan { get; set; }

        [Required(ErrorMessage = "Tên trang trại là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên trang trại không được vượt quá 100 ký tự")]
        public string TenTrangTrai { get; set; } = "";

        [StringLength(255, ErrorMessage = "Địa chỉ không được vượt quá 255 ký tự")]
        public string? DiaChi { get; set; }

        [StringLength(50, ErrorMessage = "Số chứng nhận không được vượt quá 50 ký tự")]
        public string? SoChungNhan { get; set; }
    }
}