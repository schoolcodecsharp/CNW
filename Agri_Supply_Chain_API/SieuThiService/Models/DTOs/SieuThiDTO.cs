using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    public class SieuThiDTO
    {
        public int MaSieuThi { get; set; }
        public int MaTaiKhoan { get; set; }
        public string? TenSieuThi { get; set; }
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
    }

    public class SieuThiTaoMoi
    {
        [Required(ErrorMessage = "Mã tài khoản là bắt buộc")]
        public int MaTaiKhoan { get; set; }

        [Required(ErrorMessage = "Tên siêu thị là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên siêu thị không được vượt quá 100 ký tự")]
        public string TenSieuThi { get; set; } = "";

        [StringLength(255, ErrorMessage = "Địa chỉ không được vượt quá 255 ký tự")]
        public string? DiaChi { get; set; }

        [StringLength(15, ErrorMessage = "Số điện thoại không được vượt quá 15 ký tự")]
        public string? SoDienThoai { get; set; }

        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [StringLength(100, ErrorMessage = "Email không được vượt quá 100 ký tự")]
        public string? Email { get; set; }
    }

    public class SieuThiUpdateDTO
    {
        [Required(ErrorMessage = "Tên siêu thị là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên siêu thị không được vượt quá 100 ký tự")]
        public string TenSieuThi { get; set; } = "";

        [StringLength(255, ErrorMessage = "Địa chỉ không được vượt quá 255 ký tự")]
        public string? DiaChi { get; set; }

        [StringLength(15, ErrorMessage = "Số điện thoại không được vượt quá 15 ký tự")]
        public string? SoDienThoai { get; set; }

        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [StringLength(100, ErrorMessage = "Email không được vượt quá 100 ký tự")]
        public string? Email { get; set; }
    }
}
