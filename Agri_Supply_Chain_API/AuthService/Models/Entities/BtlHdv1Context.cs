using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Models.Entities;

public partial class BtlHdv1Context : DbContext
{
    public BtlHdv1Context()
    {
    }

    public BtlHdv1Context(DbContextOptions<BtlHdv1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DuyThuanzz;Database=BTL_HDV1;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
