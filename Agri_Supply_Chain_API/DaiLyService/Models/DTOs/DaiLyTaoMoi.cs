using System.ComponentModel.DataAnnotations;

namespace DaiLyService.Models.DTOs
{
    public class DaiLyTaoMoi
    {
        // Thông tin tài khoản
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        [StringLength(50, ErrorMessage = "Tên đăng nhập không được vượt quá 50 ký tự")]
        public string TenDangNhap { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [StringLength(255, ErrorMessage = "Mật khẩu không được vượt quá 255 ký tự")]
        public string MatKhau { get; set; } = string.Empty;

        // Thông tin đại lý
        [Required(ErrorMessage = "Tên đại lý là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên đại lý không được vượt quá 100 ký tự")]
        public string TenDaiLy { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự")]
        public string? SoDienThoai { get; set; }

        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [StringLength(100, ErrorMessage = "Email không được vượt quá 100 ký tự")]
        public string? Email { get; set; }

        [StringLength(255, ErrorMessage = "Địa chỉ không được vượt quá 255 ký tự")]
        public string? DiaChi { get; set; }
    }
}
