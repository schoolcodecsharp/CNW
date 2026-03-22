using System;
using System.Collections.Generic;

namespace AdminService.Models.Entities;

public partial class DaiLy
{
    public int MaDaiLy { get; set; }

    public int MaTaiKhoan { get; set; }

    public string? TenDaiLy { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? DiaChi { get; set; }

    public virtual TaiKhoan MaTaiKhoanNavigation { get; set; } = null!;
}
