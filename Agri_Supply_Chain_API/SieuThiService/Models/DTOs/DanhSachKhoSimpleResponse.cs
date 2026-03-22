namespace SieuThiService.Models.DTOs
{
    /// <summary>
    /// Response cho danh sách kho đơn giản (chỉ thông tin cơ bản)
    /// </summary>
    public class DanhSachKhoSimpleResponse
    {
        public int MaSieuThi { get; set; }
        public string? TenSieuThi { get; set; }
        public List<KhoSimpleInfo> DanhSachKho { get; set; } = new List<KhoSimpleInfo>();
        public int TongSoKho { get; set; }
    }

    /// <summary>
    /// Thông tin cơ bản của kho (không bao gồm tồn kho chi tiết)
    /// </summary>
    public class KhoSimpleInfo
    {
        public int MaKho { get; set; }
        public string TenKho { get; set; } = null!;
        public string LoaiKho { get; set; } = null!;
        public string? DiaChi { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
        public int TongSoLoHang { get; set; }
        public decimal TongSoLuong { get; set; }
    }
}