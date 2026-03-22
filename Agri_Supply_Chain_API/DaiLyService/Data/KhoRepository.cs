using Microsoft.Data.SqlClient;
using DaiLyService.Models.DTOs;
using System.Data;

namespace DaiLyService.Data
{
    public class KhoRepository : IKhoRepository
    {
        private readonly string _connectionString;

        public KhoRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public List<KhoDTO> GetAll()
        {
            var list = new List<KhoDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Kho_GetAll", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public KhoDTO? GetById(int maKho)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Kho_GetById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaKho", maKho);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read()) return null;

            return MapToDto(reader);
        }

        public List<KhoDTO> GetByMaDaiLy(int maDaiLy)
        {
            var list = new List<KhoDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Kho_GetByMaDaiLy", conn);
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

        public int Create(KhoCreateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Kho_Create", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@LoaiKho", dto.LoaiKho);
            cmd.Parameters.AddWithValue("@MaDaiLy", (object?)dto.MaDaiLy ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaSieuThi", (object?)dto.MaSieuThi ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TenKho", dto.TenKho);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)dto.DiaChi ?? DBNull.Value);

            var outputParam = new SqlParameter("@MaKho", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(outputParam);

            conn.Open();
            cmd.ExecuteNonQuery();

            return (int)outputParam.Value;
        }

        public bool Update(int maKho, KhoUpdateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Kho_Update", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaKho", maKho);
            cmd.Parameters.AddWithValue("@TenKho", dto.TenKho);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)dto.DiaChi ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TrangThai", (object?)dto.TrangThai ?? DBNull.Value);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int maKho)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Kho_Delete", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaKho", maKho);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        private KhoDTO MapToDto(SqlDataReader reader)
        {
            return new KhoDTO
            {
                MaKho = (int)reader["MaKho"],
                LoaiKho = reader["LoaiKho"].ToString()!,
                MaDaiLy = reader["MaDaiLy"] as int?,
                MaSieuThi = reader["MaSieuThi"] as int?,
                TenKho = reader["TenKho"].ToString()!,
                DiaChi = reader["DiaChi"] as string,
                TrangThai = reader["TrangThai"] as string,
                NgayTao = reader["NgayTao"] as DateTime?
            };
        }
    }
}
