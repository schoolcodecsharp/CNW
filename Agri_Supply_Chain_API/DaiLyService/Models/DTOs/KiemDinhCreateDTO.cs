using System.ComponentModel.DataAnnotations;

namespace DaiLyService.Models.DTOs
{
    public class KiemDinhCreateDTO
    {
        [Required(ErrorMessage = "Mã lô là bắt buộc")]
        public int MaLo { get; set; }

        [StringLength(100, ErrorMessage = "Người kiểm định không được vượt quá 100 ký tự")]
        public string? NguoiKiemDinh { get; set; }

        public int? MaDaiLy { get; set; }

        public int? MaSieuThi { get; set; }

        [Required(ErrorMessage = "Kết quả là bắt buộc")]
        [StringLength(20, ErrorMessage = "Kết quả không được vượt quá 20 ký tự")]
        public string KetQua { get; set; } = string.Empty;

        public string? BienBan { get; set; }

        [StringLength(255, ErrorMessage = "Chữ ký số không được vượt quá 255 ký tự")]
        public string? ChuKySo { get; set; }

        [StringLength(255, ErrorMessage = "Ghi chú không được vượt quá 255 ký tự")]
        public string? GhiChu { get; set; }
    }
}
