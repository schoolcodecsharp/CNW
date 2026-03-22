using System;
using System.Collections.Generic;

namespace AdminService.Models.Entities;

public partial class TaiKhoan
{
    public int MaTaiKhoan { get; set; }

    public string TenDangNhap { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string LoaiTaiKhoan { get; set; } = null!;

    public string? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? LanDangNhapCuoi { get; set; }

    public virtual Admin? Admin { get; set; }

    public virtual DaiLy? DaiLy { get; set; }

    public virtual NongDan? NongDan { get; set; }

    public virtual SieuThi? SieuThi { get; set; }
}
