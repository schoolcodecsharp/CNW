using Microsoft.Data.SqlClient;
using DaiLyService.Models.DTOs;
using System.Data;

namespace DaiLyService.Data
{
    public class DonHangSieuThiRepository : IDonHangSieuThiRepository
    {
        private readonly string _connectionString;

        public DonHangSieuThiRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public List<DonHangSieuThiDTO> GetByMaDaiLy(int maDaiLy)
        {
            var list = new List<DonHangSieuThiDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangSieuThi_GetByMaDaiLy", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public DonHangSieuThiDTO? GetById(int maDonHang)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();

            using var cmd = new SqlCommand("sp_DonHangSieuThi_GetById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

            DonHangSieuThiDTO? donHang = null;
            using (var reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    donHang = MapToDto(reader);
                }
            }

            if (donHang == null) return null;

            // Lấy chi tiết đơn hàng
            donHang.ChiTietDonHang = GetChiTietDonHang(conn, maDonHang);

            return donHang;
        }

        public bool UpdateTrangThai(int maDonHang, DonHangSieuThiUpdateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHang_UpdateTrangThai", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);
            cmd.Parameters.AddWithValue("@TrangThai", (object?)dto.TrangThai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NgayGiao", (object?)dto.NgayGiao ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GhiChu", (object?)dto.GhiChu ?? DBNull.Value);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        private List<ChiTietDonHangDTO> GetChiTietDonHang(SqlConnection conn, int maDonHang)
        {
            var list = new List<ChiTietDonHangDTO>();

            using var cmd = new SqlCommand("sp_ChiTietDonHang_GetByMaDonHang", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new ChiTietDonHangDTO
                {
                    MaLo = (int)reader["MaLo"],
                    TenSanPham = reader["TenSanPham"] as string,
                    SoLuong = (decimal)reader["SoLuong"],
                    DonGia = reader["DonGia"] as decimal?,
                    ThanhTien = reader["ThanhTien"] as decimal?
                });
            }

            return list;
        }


        private DonHangSieuThiDTO MapToDto(SqlDataReader reader)
        {
            return new DonHangSieuThiDTO
            {
                MaDonHang = (int)reader["MaDonHang"],
                MaSieuThi = (int)reader["MaSieuThi"],
                TenSieuThi = reader["TenSieuThi"] as string,
                MaDaiLy = (int)reader["MaDaiLy"],
                NgayDat = reader["NgayDat"] as DateTime?,
                NgayGiao = reader["NgayGiao"] as DateTime?,
                TrangThai = reader["TrangThai"] as string,
                TongSoLuong = reader["TongSoLuong"] as decimal?,
                TongGiaTri = reader["TongGiaTri"] as decimal?,
                GhiChu = reader["GhiChu"] as string
            };
        }
    }
}
