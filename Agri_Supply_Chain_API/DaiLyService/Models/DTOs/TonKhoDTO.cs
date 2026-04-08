namespace DaiLyService.Models.DTOs
{
    public class TonKhoDTO
    {
        public int MaKho { get; set; }
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public DateTime? CapNhatCuoi { get; set; }
        public string? TenKho { get; set; }
        public int? MaDaiLy { get; set; }
        public string? TenSanPham { get; set; }
        public string? DonViTinh { get; set; }
    }
}
