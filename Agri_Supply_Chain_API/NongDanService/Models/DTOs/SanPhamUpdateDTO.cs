using System.ComponentModel.DataAnnotations;

namespace NongDanService.Models.DTOs
{
    public class SanPhamUpdateDTO
    {
        [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên sản phẩm không được vượt quá 100 ký tự")]
        public string TenSanPham { get; set; } = "";

        [Required(ErrorMessage = "Đơn vị tính là bắt buộc")]
        [StringLength(20, ErrorMessage = "Đơn vị tính không được vượt quá 20 ký tự")]
        public string DonViTinh { get; set; } = "";

        [StringLength(255, ErrorMessage = "Mô tả không được vượt quá 255 ký tự")]
        public string? MoTa { get; set; }
    }
}
