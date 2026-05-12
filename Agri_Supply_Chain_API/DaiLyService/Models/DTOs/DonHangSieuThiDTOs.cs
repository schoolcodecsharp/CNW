using System.ComponentModel.DataAnnotations;

namespace DaiLyService.Models.DTOs
{
    // Request để xác nhận đơn hàng từ siêu thị (cần MaKho để trừ tồn kho)
    public class XacNhanDonHangSieuThiRequest
    {
        [Required(ErrorMessage = "Mã đại lý là bắt buộc")]
        public int MaDaiLy { get; set; }

        [Required(ErrorMessage = "Mã kho là bắt buộc")]
        public int MaKho { get; set; }
    }

    // Request để xử lý hoàn đơn từ siêu thị
    public class XuLyHoanDonSieuThiRequest
    {
        [Required(ErrorMessage = "Mã đại lý là bắt buộc")]
        public int MaDaiLy { get; set; }

        [Required(ErrorMessage = "Mã kho là bắt buộc")]
        public int MaKho { get; set; }
    }

    // Request để hủy đơn hàng từ siêu thị
    public class HuyDonSieuThiRequest
    {
        [Required(ErrorMessage = "Mã đại lý là bắt buộc")]
        public int MaDaiLy { get; set; }
    }

    // Response cho đơn hàng siêu thị
    public class DonHangSieuThiResponse
    {
        public int MaDonHang { get; set; }
        public DateTime NgayDat { get; set; }
        public string TrangThai { get; set; } = string.Empty;
        public decimal TongSoLuong { get; set; }
        public decimal TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
        public int MaSieuThi { get; set; }
        public string TenSieuThi { get; set; } = string.Empty;
        public string? DiaChiSieuThi { get; set; }
        public string? SoDienThoaiSieuThi { get; set; }
    }
}
