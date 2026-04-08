using System.Data;
using Microsoft.Data.SqlClient;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Data
{
    public class TonKhoRepository : ITonKhoRepository
    {
        private readonly string _connectionString;

        public TonKhoRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection") ?? "";
        }

        public List<TonKhoDTO> GetAll()
        {
            var result = new List<TonKhoDTO>();
            using (var conn = new SqlConnection(_connectionString))
            {
                using (var cmd = new SqlCommand("sp_TonKho_GetAll", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(MapToDTO(reader));
                        }
                    }
                }
            }
            return result;
        }

        public List<TonKhoDTO> GetByMaDaiLy(int maDaiLy)
        {
            var result = new List<TonKhoDTO>();
            using (var conn = new SqlConnection(_connectionString))
            {
                using (var cmd = new SqlCommand("sp_TonKho_GetByDaiLy", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(MapToDTO(reader));
                        }
                    }
                }
            }
            return result;
        }

        public List<TonKhoDTO> GetByMaKho(int maKho)
        {
            var result = new List<TonKhoDTO>();
            using (var conn = new SqlConnection(_connectionString))
            {
                using (var cmd = new SqlCommand("sp_TonKho_SearchByKho", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MaKho", maKho);
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(MapToDTO(reader));
                        }
                    }
                }
            }
            return result;
        }

        private TonKhoDTO MapToDTO(SqlDataReader reader)
        {
            return new TonKhoDTO
            {
                MaKho = reader.GetInt32(reader.GetOrdinal("MaKho")),
                MaLo = reader.GetInt32(reader.GetOrdinal("MaLo")),
                SoLuong = reader.GetDecimal(reader.GetOrdinal("SoLuong")),
                CapNhatCuoi = reader.IsDBNull(reader.GetOrdinal("CapNhatCuoi")) ? null : reader.GetDateTime(reader.GetOrdinal("CapNhatCuoi")),
                TenKho = reader.FieldExists("TenKho") && !reader.IsDBNull(reader.GetOrdinal("TenKho")) ? reader.GetString(reader.GetOrdinal("TenKho")) : null,
                MaDaiLy = reader.FieldExists("MaDaiLy") && !reader.IsDBNull(reader.GetOrdinal("MaDaiLy")) ? reader.GetInt32(reader.GetOrdinal("MaDaiLy")) : null,
                TenSanPham = reader.FieldExists("TenSanPham") && !reader.IsDBNull(reader.GetOrdinal("TenSanPham")) ? reader.GetString(reader.GetOrdinal("TenSanPham")) : null,
                DonViTinh = reader.FieldExists("DonViTinh") && !reader.IsDBNull(reader.GetOrdinal("DonViTinh")) ? reader.GetString(reader.GetOrdinal("DonViTinh")) : null
            };
        }
    }

    public static class SqlDataReaderExtensions
    {
        public static bool FieldExists(this SqlDataReader reader, string fieldName)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(fieldName, StringComparison.OrdinalIgnoreCase))
                    return true;
            }
            return false;
        }
    }
}
