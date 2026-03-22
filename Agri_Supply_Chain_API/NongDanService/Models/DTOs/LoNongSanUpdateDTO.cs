using System.ComponentModel.DataAnnotations;

namespace NongDanService.Models.DTOs
{
    public class LoNongSanUpdateDTO
    {
        [Range(0, double.MaxValue, ErrorMessage = "Số lượng hiện tại không được âm")]
        public decimal? SoLuongHienTai { get; set; }

        [StringLength(50, ErrorMessage = "Số chứng nhận lô không được vượt quá 50 ký tự")]
        public string? SoChungNhanLo { get; set; }

        [StringLength(30, ErrorMessage = "Trạng thái không được vượt quá 30 ký tự")]
        [RegularExpression(@"^(tai_trang_trai|dang_van_chuyen|da_giao|da_ban)$", 
            ErrorMessage = "Trạng thái không hợp lệ (tai_trang_trai, dang_van_chuyen, da_giao, da_ban)")]
        public string? TrangThai { get; set; }
    }
}