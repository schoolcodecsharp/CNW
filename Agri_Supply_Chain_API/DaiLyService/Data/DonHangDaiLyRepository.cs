using Microsoft.Data.SqlClient;
using DaiLyService.Models.DTOs;
using System.Data;

namespace DaiLyService.Data
{
    public class DonHangDaiLyRepository : IDonHangDaiLyRepository
    {
        private readonly string _connectionString;

        public DonHangDaiLyRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public List<DonHangDaiLyDTO> GetAll()
        {
            var list = new List<DonHangDaiLyDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangDaiLy_GetAll", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public DonHangDaiLyDTO? GetById(int maDonHang)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();

            // Lấy thông tin đơn hàng
            using var cmd = new SqlCommand("sp_DonHangDaiLy_GetById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

            DonHangDaiLyDTO? donHang = null;
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

        public List<DonHangDaiLyDTO> GetByMaDaiLy(int maDaiLy)
        {
            var list = new List<DonHangDaiLyDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangDaiLy_GetByMaDaiLy", conn);
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

        public int Create(DonHangDaiLyCreateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();

            // Tính tổng số lượng và tổng giá trị
            decimal tongSoLuong = dto.ChiTietDonHang.Sum(x => x.SoLuong);
            decimal tongGiaTri = dto.ChiTietDonHang.Sum(x => x.SoLuong * (x.DonGia ?? 0));

            // 1. Tạo DonHang bằng SP
            using var cmdDonHang = new SqlCommand("sp_DonHangDaiLy_Create", conn);
            cmdDonHang.CommandType = CommandType.StoredProcedure;

            cmdDonHang.Parameters.AddWithValue("@MaDaiLy", dto.MaDaiLy);
            cmdDonHang.Parameters.AddWithValue("@MaNongDan", dto.MaNongDan);
            cmdDonHang.Parameters.AddWithValue("@TongSoLuong", tongSoLuong);
            cmdDonHang.Parameters.AddWithValue("@TongGiaTri", tongGiaTri);
            cmdDonHang.Parameters.AddWithValue("@GhiChu", (object?)dto.GhiChu ?? DBNull.Value);

            var outputParam = new SqlParameter("@MaDonHang", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmdDonHang.Parameters.Add(outputParam);

            cmdDonHang.ExecuteNonQuery();
            int maDonHang = (int)outputParam.Value;

            // 2. Tạo ChiTietDonHang bằng SP
            foreach (var chiTiet in dto.ChiTietDonHang)
            {
                using var cmdChiTiet = new SqlCommand("sp_ChiTietDonHang_Create", conn);
                cmdChiTiet.CommandType = CommandType.StoredProcedure;

                cmdChiTiet.Parameters.AddWithValue("@MaDonHang", maDonHang);
                cmdChiTiet.Parameters.AddWithValue("@MaLo", chiTiet.MaLo);
                cmdChiTiet.Parameters.AddWithValue("@SoLuong", chiTiet.SoLuong);
                cmdChiTiet.Parameters.AddWithValue("@DonGia", (object?)chiTiet.DonGia ?? DBNull.Value);
                cmdChiTiet.ExecuteNonQuery();
            }

            return maDonHang;
        }

        public bool UpdateTrangThai(int maDonHang, DonHangDaiLyUpdateDTO dto)
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

        public bool Delete(int maDonHang)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangDaiLy_Delete", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

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

        private DonHangDaiLyDTO MapToDto(SqlDataReader reader)
        {
            return new DonHangDaiLyDTO
            {
                MaDonHang = (int)reader["MaDonHang"],
                MaDaiLy = (int)reader["MaDaiLy"],
                MaNongDan = (int)reader["MaNongDan"],
                TenNongDan = reader["TenNongDan"] as string,
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
