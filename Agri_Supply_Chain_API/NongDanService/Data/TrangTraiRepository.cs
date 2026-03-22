using Microsoft.Data.SqlClient;
using NongDanService.Models.DTOs;
using System.Data;

namespace NongDanService.Data
{
    public class TrangTraiRepository : ITrangTraiRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<TrangTraiRepository> _logger;

        public TrangTraiRepository(IConfiguration config, ILogger<TrangTraiRepository> logger)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
            _logger = logger;
        }

        public List<TrangTraiDTO> GetAll()
        {
            var list = new List<TrangTraiDTO>();
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_TrangTrai_GetAll", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(MapToDTO(reader));
                }
                _logger.LogInformation("Retrieved {Count} farms from database", list.Count);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while getting all farms");
                throw new Exception("Lỗi truy vấn cơ sở dữ liệu", ex);
            }
            return list;
        }

        public TrangTraiDTO? GetById(int id)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_TrangTrai_GetById", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@MaTrangTrai", SqlDbType.Int).Value = id;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                if (!reader.Read())
                {
                    _logger.LogWarning("Farm with ID {FarmId} not found", id);
                    return null;
                }
                return MapToDTO(reader);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while getting farm with ID {FarmId}", id);
                throw new Exception("Lỗi truy vấn cơ sở dữ liệu", ex);
            }
        }

        public List<TrangTraiDTO> GetByNongDanId(int maNongDan)
        {
            var list = new List<TrangTraiDTO>();
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_TrangTrai_GetByNongDan", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@MaNongDan", SqlDbType.Int).Value = maNongDan;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(MapToDTO(reader));
                }
                _logger.LogInformation("Retrieved {Count} farms for farmer ID {FarmerId}", list.Count, maNongDan);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while getting farms for farmer ID {FarmerId}", maNongDan);
                throw new Exception("Lỗi truy vấn cơ sở dữ liệu", ex);
            }
            return list;
        }

        public int Create(TrangTraiCreateDTO dto)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_TrangTrai_Create", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@MaNongDan", SqlDbType.Int).Value = dto.MaNongDan;
                cmd.Parameters.Add("@TenTrangTrai", SqlDbType.NVarChar, 100).Value = dto.TenTrangTrai;
                cmd.Parameters.Add("@DiaChi", SqlDbType.NVarChar, 255).Value = (object?)dto.DiaChi ?? DBNull.Value;
                cmd.Parameters.Add("@SoChungNhan", SqlDbType.NVarChar, 50).Value = (object?)dto.SoChungNhan ?? DBNull.Value;
                
                var outputParam = cmd.Parameters.Add("@MaTrangTrai", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;

                conn.Open();
                cmd.ExecuteNonQuery();
                
                var maTrangTrai = (int)outputParam.Value;
                _logger.LogInformation("Created new farm with ID {FarmId}", maTrangTrai);
                return maTrangTrai;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while creating farm");
                if (ex.Number == 547)
                    throw new Exception("Mã nông dân không tồn tại trong hệ thống", ex);
                throw new Exception("Lỗi tạo trang trại trong cơ sở dữ liệu", ex);
            }
        }

        public bool Update(int id, TrangTraiUpdateDTO dto)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_TrangTrai_Update", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@MaTrangTrai", SqlDbType.Int).Value = id;
                cmd.Parameters.Add("@TenTrangTrai", SqlDbType.NVarChar, 100).Value = dto.TenTrangTrai;
                cmd.Parameters.Add("@DiaChi", SqlDbType.NVarChar, 255).Value = (object?)dto.DiaChi ?? DBNull.Value;
                cmd.Parameters.Add("@SoChungNhan", SqlDbType.NVarChar, 50).Value = (object?)dto.SoChungNhan ?? DBNull.Value;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var rowsAffected = reader.GetInt32(0);
                    if (rowsAffected > 0)
                    {
                        _logger.LogInformation("Updated farm with ID {FarmId}", id);
                        return true;
                    }
                }
                _logger.LogWarning("No farm found with ID {FarmId} to update", id);
                return false;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while updating farm with ID {FarmId}", id);
                throw new Exception("Lỗi cập nhật trang trại trong cơ sở dữ liệu", ex);
            }
        }

        public bool Delete(int id)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_TrangTrai_Delete", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@MaTrangTrai", SqlDbType.Int).Value = id;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var rowsAffected = reader.GetInt32(0);
                    if (rowsAffected > 0)
                    {
                        _logger.LogInformation("Deleted farm with ID {FarmId}", id);
                        return true;
                    }
                }
                _logger.LogWarning("No farm found with ID {FarmId} to delete", id);
                return false;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while deleting farm with ID {FarmId}", id);
                if (ex.Number == 547)
                    throw new Exception("Không thể xóa trang trại này vì đang có dữ liệu liên quan (lô nông sản)", ex);
                throw new Exception("Lỗi xóa trang trại trong cơ sở dữ liệu", ex);
            }
        }

        private static TrangTraiDTO MapToDTO(SqlDataReader reader)
        {
            return new TrangTraiDTO
            {
                MaTrangTrai = reader.GetInt32("MaTrangTrai"),
                MaNongDan = reader.GetInt32("MaNongDan"),
                TenTrangTrai = reader.IsDBNull("TenTrangTrai") ? null : reader.GetString("TenTrangTrai"),
                DiaChi = reader.IsDBNull("DiaChi") ? null : reader.GetString("DiaChi"),
                SoChungNhan = reader.IsDBNull("SoChungNhan") ? null : reader.GetString("SoChungNhan"),
                NgayTao = reader.IsDBNull("NgayTao") ? null : reader.GetDateTime("NgayTao")
            };
        }
    }
}
