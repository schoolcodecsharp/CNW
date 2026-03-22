using System;
using System.Collections.Generic;

namespace AuthService.Models.Entities;

public partial class TaiKhoan
{
    public int MaTaiKhoan { get; set; }

    public string TenDangNhap { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string LoaiTaiKhoan { get; set; } = null!;

    public string? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? LanDangNhapCuoi { get; set; }
}
