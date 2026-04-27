namespace DaiLyService.Models.DTOs
{
    public class KiemDinhDTO
    {
        public int MaKiemDinh { get; set; }
        public int MaLo { get; set; }
        public string? NguoiKiemDinh { get; set; }
        public int? MaDaiLy { get; set; }
        public int? MaSieuThi { get; set; }
        public DateTime? NgayKiemDinh { get; set; }
        public string KetQua { get; set; } = string.Empty;
        public string? TrangThai { get; set; }
        public string? BienBan { get; set; }
        public string? ChuKySo { get; set; }
        public string? GhiChu { get; set; }
        public string? SoChungNhanLo { get; set; }
        public string? TenSanPham { get; set; }
    }
}

    public class LoChoKiemDinhDTO
    {
        public int MaLo { get; set; }
        public string SoChungNhanLo { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public decimal SoLuongHienTai { get; set; }
        public DateTime? NgayThuHoach { get; set; }
        public string TrangThai { get; set; } = string.Empty;
        public int MaDonHang { get; set; }
        public DateTime? NgayDat { get; set; }
    }
