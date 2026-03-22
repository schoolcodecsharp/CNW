using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SieuThiService.Models.Entities;

public partial class BtlHdv1Context : DbContext
{
    public BtlHdv1Context()
    {
    }

    public BtlHdv1Context(DbContextOptions<BtlHdv1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }

    public virtual DbSet<DonHang> DonHangs { get; set; }

    public virtual DbSet<DonHangSieuThi> DonHangSieuThis { get; set; }

    public virtual DbSet<Kho> Khos { get; set; }

    public virtual DbSet<SieuThi> SieuThis { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<TonKho> TonKhos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
            optionsBuilder.UseSqlServer("Server=DuyThuanzz;Database=BTL_HDV1;Trusted_Connection=True;TrustServerCertificate=True;");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            entity.HasKey(e => new { e.MaDonHang, e.MaLo }).HasName("PK__ChiTietD__60E7D8D817114A00");

            entity.ToTable("ChiTietDonHang");

            entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SoLuong).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ThanhTien).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.ChiTietDonHangs)
                .HasForeignKey(d => d.MaDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietDo__MaDon__6FE99F9F");
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.HasKey(e => e.MaDonHang).HasName("PK__DonHang__129584AD453005A8");

            entity.ToTable("DonHang");

            entity.Property(e => e.GhiChu).HasMaxLength(255);
            entity.Property(e => e.LoaiDon).HasMaxLength(30);
            entity.Property(e => e.NgayDat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TongGiaTri).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TongSoLuong).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("chua_nhan");
        });

        modelBuilder.Entity<DonHangSieuThi>(entity =>
        {
            entity.HasKey(e => e.MaDonHang).HasName("PK__DonHangS__129584ADC8B45C99");

            entity.ToTable("DonHangSieuThi");

            entity.Property(e => e.MaDonHang).ValueGeneratedNever();

            entity.HasOne(d => d.MaDonHangNavigation).WithOne(p => p.DonHangSieuThi)
                .HasForeignKey<DonHangSieuThi>(d => d.MaDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHangSi__MaDon__6B24EA82");

            entity.HasOne(d => d.MaSieuThiNavigation).WithMany(p => p.DonHangSieuThis)
                .HasForeignKey(d => d.MaSieuThi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHangSi__MaSie__6C190EBB");
        });

        modelBuilder.Entity<Kho>(entity =>
        {
            entity.HasKey(e => e.MaKho).HasName("PK__Kho__3BDA9350E3DB6FF4");

            entity.ToTable("Kho");

            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.LoaiKho).HasMaxLength(20);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TenKho).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("hoat_dong");

            entity.HasOne(d => d.MaSieuThiNavigation).WithMany(p => p.Khos)
                .HasForeignKey(d => d.MaSieuThi)
                .HasConstraintName("FK__Kho__MaSieuThi__5AEE82B9");
        });

        modelBuilder.Entity<SieuThi>(entity =>
        {
            entity.HasKey(e => e.MaSieuThi).HasName("PK__SieuThi__7CF72B9F6A6B90D3");

            entity.ToTable("SieuThi");

            entity.HasIndex(e => e.MaTaiKhoan, "UQ__SieuThi__AD7C65282B66BF0E").IsUnique();

            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);
            entity.Property(e => e.TenSieuThi).HasMaxLength(100);

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.SieuThi)
                .HasForeignKey<SieuThi>(d => d.MaTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SieuThi__MaTaiKh__48CFD27E");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.MaTaiKhoan).HasName("PK__TaiKhoan__AD7C65291E1DB12F");

            entity.ToTable("TaiKhoan");

            entity.HasIndex(e => e.TenDangNhap, "UQ__TaiKhoan__55F68FC07B06BC9D").IsUnique();

            entity.Property(e => e.LoaiTaiKhoan).HasMaxLength(20);
            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TenDangNhap).HasMaxLength(50);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("hoat_dong");
        });

        modelBuilder.Entity<TonKho>(entity =>
        {
            entity.HasKey(e => new { e.MaKho, e.MaLo }).HasName("PK__TonKho__49A8CF2519594A7D");

            entity.ToTable("TonKho");

            entity.Property(e => e.CapNhatCuoi).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.SoLuong).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaKhoNavigation).WithMany(p => p.TonKhos)
                .HasForeignKey(d => d.MaKho)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TonKho__MaKho__5EBF139D");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
