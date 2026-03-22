using System.ComponentModel.DataAnnotations;

namespace SieuThiService.Models.DTOs
{
    /// <summary>
    /// Request để xóa tồn kho
    /// </summary>
    public class DeleteTonKhoRequest
    {
        [Required(ErrorMessage = "Mã kho là bắt buộc")]
        public int MaKho { get; set; }

        [Required(ErrorMessage = "Mã lô là bắt buộc")]
        public int MaLo { get; set; }
    }

    /// <summary>
    /// Response cho việc xóa tồn kho
    /// </summary>
    public class DeleteTonKhoResponse
    {
        public int MaKho { get; set; }
        public string TenKho { get; set; } = "";
        public int MaLo { get; set; }
        public decimal SoLuongDaXoa { get; set; }
        public DateTime NgayXoa { get; set; }
        public string Message { get; set; } = "Xóa tồn kho thành công";
        public bool Success { get; set; } = true;
    }
}