using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Models.Entities;

public partial class BtlHdv1Context : DbContext
{
    public BtlHdv1Context()
    {
    }

    public BtlHdv1Context(DbContextOptions<BtlHdv1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<DaiLy> DaiLies { get; set; }

    public virtual DbSet<NongDan> NongDans { get; set; }

    public virtual DbSet<SieuThi> SieuThis { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DuyThuanzz;Database=BTL_HDV1;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.MaAdmin).HasName("PK__Admin__49341E3894E7F6CA");

            entity.ToTable("Admin");

            entity.HasIndex(e => e.MaTaiKhoan, "UQ__Admin__AD7C6528336147FB").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.HoTen).HasMaxLength(100);
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.Admin)
                .HasForeignKey<Admin>(d => d.MaTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Admin__MaTaiKhoa__3D5E1FD2");
        });

        modelBuilder.Entity<DaiLy>(entity =>
        {
            entity.HasKey(e => e.MaDaiLy).HasName("PK__DaiLy__069B00B35AD5446B");

            entity.ToTable("DaiLy");

            entity.HasIndex(e => e.MaTaiKhoan, "UQ__DaiLy__AD7C6528E8023C64").IsUnique();

            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);
            entity.Property(e => e.TenDaiLy).HasMaxLength(100);

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.DaiLy)
                .HasForeignKey<DaiLy>(d => d.MaTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DaiLy__MaTaiKhoa__44FF419A");
        });

        modelBuilder.Entity<NongDan>(entity =>
        {
            entity.HasKey(e => e.MaNongDan).HasName("PK__NongDan__A4CC49E6DA343779");

            entity.ToTable("NongDan");

            entity.HasIndex(e => e.MaTaiKhoan, "UQ__NongDan__AD7C65283F2EDC81").IsUnique();

            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.HoTen).HasMaxLength(100);
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.NongDan)
                .HasForeignKey<NongDan>(d => d.MaTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NongDan__MaTaiKh__412EB0B6");
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
