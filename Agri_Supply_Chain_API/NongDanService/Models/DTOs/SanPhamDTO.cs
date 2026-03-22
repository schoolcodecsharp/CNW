namespace NongDanService.Models.DTOs
{
    public class SanPhamDTO
    {
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; } = "";
        public string DonViTinh { get; set; } = "";
        public string? MoTa { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
