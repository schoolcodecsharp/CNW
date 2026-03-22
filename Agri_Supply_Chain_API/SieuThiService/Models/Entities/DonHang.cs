using System;
using System.Collections.Generic;

namespace SieuThiService.Models.Entities;

public partial class DonHang
{
    public int MaDonHang { get; set; }

    public string LoaiDon { get; set; } = null!;

    public DateTime? NgayDat { get; set; }

    public DateTime? NgayGiao { get; set; }

    public string? TrangThai { get; set; }

    public decimal? TongSoLuong { get; set; }

    public decimal? TongGiaTri { get; set; }

    public string? GhiChu { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    public virtual DonHangSieuThi? DonHangSieuThi { get; set; }
}
