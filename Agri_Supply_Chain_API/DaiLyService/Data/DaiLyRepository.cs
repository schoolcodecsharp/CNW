using Microsoft.Data.SqlClient;
using DaiLyService.Models.DTOs;
using System.Data;

namespace DaiLyService.Data
{
    public class DaiLyRepository : IDaiLyRepository
    {
        private readonly string _connectionString;

        public DaiLyRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public List<DaiLyPhanHoi> GetAll()
        {
            var list = new List<DaiLyPhanHoi>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DaiLy_GetAll", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public DaiLyPhanHoi? GetById(int maDaiLy)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DaiLy_GetById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read()) return null;

            return MapToDto(reader);
        }

        public int Create(DaiLyTaoMoi dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DaiLy_Create", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@TenDangNhap", dto.TenDangNhap);
            cmd.Parameters.AddWithValue("@MatKhau", dto.MatKhau);
            cmd.Parameters.AddWithValue("@TenDaiLy", dto.TenDaiLy);
            cmd.Parameters.AddWithValue("@SoDienThoai", (object?)dto.SoDienThoai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)dto.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)dto.DiaChi ?? DBNull.Value);

            var outputParam = new SqlParameter("@MaDaiLy", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(outputParam);

            conn.Open();
            cmd.ExecuteNonQuery();

            return (int)outputParam.Value;
        }

        public bool Update(int maDaiLy, DaiLyUpdateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DaiLy_Update", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);
            cmd.Parameters.AddWithValue("@TenDaiLy", dto.TenDaiLy);
            cmd.Parameters.AddWithValue("@SoDienThoai", (object?)dto.SoDienThoai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)dto.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)dto.DiaChi ?? DBNull.Value);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int maDaiLy)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DaiLy_Delete", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public List<DaiLyPhanHoi> Search(string? tenDaiLy, string? soDienThoai)
        {
            var list = new List<DaiLyPhanHoi>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DaiLy_Search", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@TenDaiLy", (object?)tenDaiLy ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@SoDienThoai", (object?)soDienThoai ?? DBNull.Value);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        private DaiLyPhanHoi MapToDto(SqlDataReader reader)
        {
            return new DaiLyPhanHoi
            {
                MaDaiLy = (int)reader["MaDaiLy"],
                TenDaiLy = reader["TenDaiLy"] as string,
                SoDienThoai = reader["SoDienThoai"] as string,
                Email = reader["Email"] as string,
                DiaChi = reader["DiaChi"] as string,
                TenDangNhap = reader["TenDangNhap"] as string,
                TrangThai = reader["TrangThai"] as string
            };
        }
    }
}
