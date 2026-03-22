using System;
using System.Collections.Generic;

namespace SieuThiService.Models.Entities;

public partial class DonHangSieuThi
{
    public int MaDonHang { get; set; }

    public int MaSieuThi { get; set; }

    public int MaDaiLy { get; set; }

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    public virtual SieuThi MaSieuThiNavigation { get; set; } = null!;
}
