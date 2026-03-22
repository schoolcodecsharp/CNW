using System.ComponentModel.DataAnnotations;

namespace DaiLyService.Models.DTOs
{
    public class DonHangDaiLyUpdateDTO
    {
        [StringLength(30, ErrorMessage = "Trạng thái không được vượt quá 30 ký tự")]
        public string? TrangThai { get; set; }

        public DateTime? NgayGiao { get; set; }

        [StringLength(255, ErrorMessage = "Ghi chú không được vượt quá 255 ký tự")]
        public string? GhiChu { get; set; }
    }
}
