using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    // Request để kiểm định đơn hàng từ đại lý
    public class KiemDinhDonHangRequest
    {
        [Required(ErrorMessage = "Mã siêu thị là bắt buộc")]
        public int MaSieuThi { get; set; }

        public int? MaKho { get; set; }

        [Required(ErrorMessage = "Kết quả kiểm định là bắt buộc")]
        [RegularExpression("^(dat|khong_dat)$", ErrorMessage = "Kết quả kiểm định phải là 'dat' hoặc 'khong_dat'")]
        public string KetQua { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Ghi chú không được vượt quá 500 ký tự")]
        public string? GhiChu { get; set; }
    }

    // Response cho đơn hàng chờ kiểm định
    public class DonHangChoKiemDinhResponse
    {
        public int MaDonHang { get; set; }
        public DateTime NgayDat { get; set; }
        public string TrangThai { get; set; } = string.Empty;
        public decimal TongSoLuong { get; set; }
        public decimal TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
        public int MaDaiLy { get; set; }
        public string TenDaiLy { get; set; } = string.Empty;
        public string? DiaChiDaiLy { get; set; }
        public string? SoDienThoaiDaiLy { get; set; }
    }
}
