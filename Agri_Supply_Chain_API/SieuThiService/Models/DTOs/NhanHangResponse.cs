namespace SieuThiService.Models.DTOs
{
    public class NhanHangResponse
    {
        public int MaDonHang { get; set; }
        public string TrangThaiCu { get; set; } = null!;
        public string TrangThaiMoi { get; set; } = "da_nhan";
        public DateTime NgayNhan { get; set; }
        public string? GhiChuNhan { get; set; }
        public int MaKhoNhan { get; set; }
        public string? TenKhoNhan { get; set; }
        public string Message { get; set; } = "Nhận hàng thành công";
        public bool Success { get; set; } = true;
        public List<TonKhoCapNhat> TonKhoCapNhats { get; set; } = new List<TonKhoCapNhat>();
    }

    public class TonKhoCapNhat
    {
        public int MaLo { get; set; }
        public decimal SoLuongThem { get; set; }
        public decimal SoLuongTonMoi { get; set; }
        public string TrangThai { get; set; } = null!; // "cap_nhat" hoặc "tao_moi"
    }

    public class NhanHangRequest
    {
        public int MaKho { get; set; }
        public string? GhiChuNhan { get; set; }
    }
}