using System;
using System.Collections.Generic;

namespace SieuThiService.Models.Entities;

public partial class ChiTietDonHang
{
    public int MaDonHang { get; set; }

    public int MaLo { get; set; }

    public decimal SoLuong { get; set; }

    public decimal? DonGia { get; set; }

    public decimal? ThanhTien { get; set; }

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;
}
