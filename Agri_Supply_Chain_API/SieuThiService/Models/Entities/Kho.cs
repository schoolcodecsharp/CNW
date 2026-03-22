using System;
using System.Collections.Generic;

namespace SieuThiService.Models.Entities;

public partial class Kho
{
    public int MaKho { get; set; }

    public string LoaiKho { get; set; } = null!;

    public int? MaDaiLy { get; set; }

    public int? MaSieuThi { get; set; }

    public string TenKho { get; set; } = null!;

    public string? DiaChi { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual SieuThi? MaSieuThiNavigation { get; set; }

    public virtual ICollection<TonKho> TonKhos { get; set; } = new List<TonKho>();
}
