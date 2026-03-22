namespace SieuThiService.Models.DTOs
{
    // DTO cho stored procedure sp_CheckSieuThiExists
    public class ExistsResult
    {
        public int ExistsCount { get; set; }
    }

    // DTO cho stored procedure sp_GetDonHangForStatusCheck
    public class DonHangStatusInfo
    {
        public int MaDonHang { get; set; }
        public string? TrangThai { get; set; }
        public int MaSieuThi { get; set; }
    }

    // DTO cho stored procedure sp_CalculateDonHangTotals
    public class DonHangTotals
    {
        public decimal TongSoLuong { get; set; }
        public decimal TongGiaTri { get; set; }
    }

    // DTO cho stored procedure sp_GetTonKhoByKhoAndLo
    public class TonKhoInfo
    {
        public int MaKho { get; set; }
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
    }

    // DTO cho stored procedure sp_GetChiTietDonHangForReceive
    public class ChiTietForReceive
    {
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
    }

    // DTO cho stored procedure sp_GetKhoHangById (thông tin kho)
    public class KhoInfo
    {
        public int MaKho { get; set; }
        public string? TenKho { get; set; }
        public string? LoaiKho { get; set; }
        public string? DiaChi { get; set; }
        public string? TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public int MaSieuThi { get; set; }
        public string? TenSieuThi { get; set; }
    }

    // DTO cho stored procedure sp_GetKhoHangById (tồn kho)
    public class TonKhoDetail
    {
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public DateTime CapNhatCuoi { get; set; }
        public string? TrangThaiLo { get; set; }
    }

    // DTO cho stored procedure sp_GetDonHangById (thông tin đơn hàng)
    public class DonHangInfo
    {
        public int MaDonHang { get; set; }
        public string? LoaiDon { get; set; }
        public DateTime NgayDat { get; set; }
        public DateTime? NgayGiao { get; set; }
        public string? TrangThai { get; set; }
        public decimal TongSoLuong { get; set; }
        public decimal TongGiaTri { get; set; }
        public string? GhiChu { get; set; }
        public int MaSieuThi { get; set; }
        public int MaDaiLy { get; set; }
        public string? TenSieuThi { get; set; }
    }

    // DTO cho stored procedure sp_GetChiTietDonHangByMaDonHang
    public class ChiTietDonHangInfo
    {
        public int MaLo { get; set; }
        public decimal SoLuong { get; set; }
        public decimal? DonGia { get; set; }
        public decimal? ThanhTien { get; set; }
    }

    // DTO cho stored procedure sp_CheckKhoValidForReceive
    public class KhoValidResult
    {
        public int IsValid { get; set; }
    }

    // DTO cho stored procedure sp_CheckKhoHasTonKho
    public class TonKhoExistsResult
    {
        public int HasTonKho { get; set; }
    }

    // DTO cho stored procedure sp_CountChiTietDonHang
    public class ChiTietCountResult
    {
        public int SoChiTiet { get; set; }
    }
}