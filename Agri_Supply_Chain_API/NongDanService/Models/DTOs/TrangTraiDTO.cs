namespace NongDanService.Models.DTOs
{
    public class TrangTraiDTO
    {
        public int MaTrangTrai { get; set; }
        public int MaNongDan { get; set; }
        public string? TenTrangTrai { get; set; }
        public string? DiaChi { get; set; }
        public string? SoChungNhan { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}