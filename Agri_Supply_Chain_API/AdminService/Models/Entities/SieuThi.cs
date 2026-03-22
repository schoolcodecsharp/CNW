using System;
using System.Collections.Generic;

namespace AdminService.Models.Entities;

public partial class SieuThi
{
    public int MaSieuThi { get; set; }

    public int MaTaiKhoan { get; set; }

    public string? TenSieuThi { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? DiaChi { get; set; }

    public virtual TaiKhoan MaTaiKhoanNavigation { get; set; } = null!;
}
