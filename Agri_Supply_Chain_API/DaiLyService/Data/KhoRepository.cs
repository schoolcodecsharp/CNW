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
            _connectionString = config.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
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

            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_Kho_GetByMaDaiLy", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

                Console.WriteLine($"=== KHO REPO: Gọi sp_Kho_GetByMaDaiLy với @MaDaiLy={maDaiLy}");
                Console.WriteLine($"=== KHO REPO: Connection string: {_connectionString}");

                conn.Open();
                using var reader = cmd.ExecuteReader();

                Console.WriteLine($"=== KHO REPO: Đã mở reader, đang đọc dữ liệu...");
                int rowCount = 0;
                
                // Đọc result set đầu tiên (dữ liệu kho)
                while (reader.Read())
                {
                    rowCount++;
                    try
                    {
                        var dto = MapToDto(reader);
                        Console.WriteLine($"=== KHO REPO: Dòng {rowCount} - MaKho={dto.MaKho}, TenKho={dto.TenKho}, MaDaiLy={dto.MaDaiLy}");
                        list.Add(dto);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"=== KHO REPO LỖI: Không thể map dòng {rowCount}: {ex.Message}");
                    }
                }
                
                Console.WriteLine($"=== KHO REPO: Tổng số dòng đọc được: {rowCount}");
                
                // Bỏ qua result set thứ 2 (status message)
                if (reader.NextResult())
                {
                    Console.WriteLine($"=== KHO REPO: Đã bỏ qua result set status message");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"=== KHO REPO LỖI: {ex.Message}");
                Console.WriteLine($"=== KHO REPO STACK: {ex.StackTrace}");
                throw;
            }

            return list;
        }

        public List<KhoDTO> GetByMaSieuThi(int maSieuThi)
        {
            var list = new List<KhoDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Kho_GetByMaSieuThi", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaSieuThi", maSieuThi);

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
                MaKho = reader.GetInt32(reader.GetOrdinal("MaKho")),
                LoaiKho = reader.GetString(reader.GetOrdinal("LoaiKho")),
                MaDaiLy = reader.IsDBNull(reader.GetOrdinal("MaDaiLy")) ? null : reader.GetInt32(reader.GetOrdinal("MaDaiLy")),
                MaSieuThi = reader.IsDBNull(reader.GetOrdinal("MaSieuThi")) ? null : reader.GetInt32(reader.GetOrdinal("MaSieuThi")),
                TenKho = reader.GetString(reader.GetOrdinal("TenKho")),
                DiaChi = reader.IsDBNull(reader.GetOrdinal("DiaChi")) ? null : reader.GetString(reader.GetOrdinal("DiaChi")),
                TrangThai = reader.IsDBNull(reader.GetOrdinal("TrangThai")) ? null : reader.GetString(reader.GetOrdinal("TrangThai")),
                NgayTao = reader.IsDBNull(reader.GetOrdinal("NgayTao")) ? null : reader.GetDateTime(reader.GetOrdinal("NgayTao"))
            };
        }
    }
}
