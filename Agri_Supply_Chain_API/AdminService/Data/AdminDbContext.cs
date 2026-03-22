using Microsoft.EntityFrameworkCore;

namespace AdminService.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options)
        {
        }

        public DbSet<Models.Entities.Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Models.Entities.Admin>(entity =>
            {
                entity.ToTable("Admin");
                entity.HasKey(e => e.MaAdmin);
                entity.Property(e => e.TenDangNhap).IsRequired().HasMaxLength(50);
                entity.Property(e => e.MatKhauHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.HoTen).HasMaxLength(100);
                entity.Property(e => e.SoDienThoai).HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.TrangThai).HasMaxLength(20).HasDefaultValue("hoat_dong");
                entity.Property(e => e.NgayTao).HasDefaultValueSql("SYSDATETIME()");
            });
        }
    }
}
