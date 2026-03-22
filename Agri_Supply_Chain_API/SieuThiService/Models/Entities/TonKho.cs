using System;
using System.Collections.Generic;

namespace SieuThiService.Models.Entities;

public partial class TonKho
{
    public int MaKho { get; set; }

    public int MaLo { get; set; }

    public decimal SoLuong { get; set; }

    public DateTime? CapNhatCuoi { get; set; }

    public virtual Kho MaKhoNavigation { get; set; } = null!;
}
