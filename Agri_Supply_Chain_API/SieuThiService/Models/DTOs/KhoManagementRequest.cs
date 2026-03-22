using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    /// <summary>
    /// Request để tạo kho mới
    /// </summary>
    public class CreateKhoRequest
    {
        [Required(ErrorMessage = "Mã siêu thị là bắt buộc")]
        public int MaSieuThi { get; set; }

        [Required(ErrorMessage = "Tên kho là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên kho không được vượt quá 100 ký tự")]
        public string TenKho { get; set; } = null!;

        [Required(ErrorMessage = "Loại kho là bắt buộc")]
        [StringLength(50, ErrorMessage = "Loại kho không được vượt quá 50 ký tự")]
        public string LoaiKho { get; set; } = null!;

        [StringLength(200, ErrorMessage = "Địa chỉ không được vượt quá 200 ký tự")]
        public string? DiaChi { get; set; }

        [StringLength(50, ErrorMessage = "Trạng thái không được vượt quá 50 ký tự")]
        public string? TrangThai { get; set; } = "hoat_dong";
    }

    /// <summary>
    /// Request để cập nhật kho
    /// </summary>
    public class UpdateKhoRequest
    {
        [Required(ErrorMessage = "Mã kho là bắt buộc")]
        public int MaKho { get; set; }

        [Required(ErrorMessage = "Tên kho là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên kho không được vượt quá 100 ký tự")]
        public string TenKho { get; set; } = null!;

        [Required(ErrorMessage = "Loại kho là bắt buộc")]
        [StringLength(50, ErrorMessage = "Loại kho không được vượt quá 50 ký tự")]
        public string LoaiKho { get; set; } = null!;

        [StringLength(200, ErrorMessage = "Địa chỉ không được vượt quá 200 ký tự")]
        public string? DiaChi { get; set; }

        [StringLength(50, ErrorMessage = "Trạng thái không được vượt quá 50 ký tự")]
        public string? TrangThai { get; set; }
    }

    /// <summary>
    /// Response cho việc tạo kho
    /// </summary>
    public class CreateKhoResponse
    {
        public int MaKho { get; set; }
        public int MaSieuThi { get; set; }
        public string TenSieuThi { get; set; } = "";
        public string TenKho { get; set; } = "";
        public string LoaiKho { get; set; } = "";
        public string? DiaChi { get; set; }
        public string? TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public string Message { get; set; } = "Tạo kho thành công";
        public bool Success { get; set; } = true;
    }

    /// <summary>
    /// Response cho việc cập nhật kho
    /// </summary>
    public class UpdateKhoResponse
    {
        public int MaKho { get; set; }
        public string TenKhoCu { get; set; } = "";
        public string TenKhoMoi { get; set; } = "";
        public string LoaiKhoCu { get; set; } = "";
        public string LoaiKhoMoi { get; set; } = "";
        public string? DiaChiCu { get; set; }
        public string? DiaChiMoi { get; set; }
        public string? TrangThaiCu { get; set; }
        public string? TrangThaiMoi { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public string Message { get; set; } = "Cập nhật kho thành công";
        public bool Success { get; set; } = true;
    }

    /// <summary>
    /// Response cho việc xóa kho
    /// </summary>
    public class DeleteKhoResponse
    {
        public int MaKho { get; set; }
        public string TenKho { get; set; } = "";
        public string LoaiKho { get; set; } = "";
        public int SoLuongTonKhoDaXoa { get; set; }
        public DateTime NgayXoa { get; set; }
        public string Message { get; set; } = "Xóa kho thành công";
        public bool Success { get; set; } = true;
    }
}