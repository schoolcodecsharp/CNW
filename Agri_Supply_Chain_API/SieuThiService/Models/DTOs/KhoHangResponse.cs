namespace SieuThiService.Models.DTOs
{
    public class KhoHangResponse
    {
        public int MaKho { get; set; }
        public string TenKho { get; set; } = null!;
        public string LoaiKho { get; set; } = null!;
        public string? DiaChi { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
        public List<TonKhoResponse> TonKhos { get; set; } = new List<TonKhoResponse>();
        public int TongSoLoHang { get; set; }
        public decimal TongSoLuong { get; set; }
    }

    public class TonKhoResponse
    {
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public DateTime? CapNhatCuoi { get; set; }
        public string? TenSanPham { get; set; }
        public string? DonViTinh { get; set; }
        public string? TrangThaiLo { get; set; }
    }

    public class DanhSachKhoResponse
    {
        public int MaSieuThi { get; set; }
        public string? TenSieuThi { get; set; }
        public List<KhoHangResponse> DanhSachKho { get; set; } = new List<KhoHangResponse>();
        public int TongSoKho { get; set; }
        public decimal TongSoLuongTatCaKho { get; set; }
    }
}