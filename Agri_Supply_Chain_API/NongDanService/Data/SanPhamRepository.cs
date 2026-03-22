using Microsoft.Data.SqlClient;
using NongDanService.Models.DTOs;
using System.Data;

namespace NongDanService.Data
{
    public class SanPhamRepository : ISanPhamRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<SanPhamRepository> _logger;

        public SanPhamRepository(IConfiguration config, ILogger<SanPhamRepository> logger)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
            _logger = logger;
        }

        public List<SanPhamDTO> GetAll()
        {
            var list = new List<SanPhamDTO>();
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_SanPham_GetAll", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(MapToDTO(reader));
                }
                _logger.LogInformation("Retrieved {Count} products from database", list.Count);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while getting all products");
                throw new Exception("Lỗi truy vấn cơ sở dữ liệu", ex);
            }
            return list;
        }

        public SanPhamDTO? GetById(int id)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_SanPham_GetById", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@MaSanPham", SqlDbType.Int).Value = id;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                if (!reader.Read())
                {
                    _logger.LogWarning("Product with ID {ProductId} not found", id);
                    return null;
                }
                return MapToDTO(reader);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while getting product with ID {ProductId}", id);
                throw new Exception("Lỗi truy vấn cơ sở dữ liệu", ex);
            }
        }

        public int Create(SanPhamCreateDTO dto)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_SanPham_Create", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@TenSanPham", SqlDbType.NVarChar, 100).Value = dto.TenSanPham;
                cmd.Parameters.Add("@DonViTinh", SqlDbType.NVarChar, 20).Value = dto.DonViTinh;
                cmd.Parameters.Add("@MoTa", SqlDbType.NVarChar, 255).Value = (object?)dto.MoTa ?? DBNull.Value;
                
                var outputParam = cmd.Parameters.Add("@MaSanPham", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;

                conn.Open();
                cmd.ExecuteNonQuery();
                
                var maSanPham = (int)outputParam.Value;
                _logger.LogInformation("Created new product with ID {ProductId}", maSanPham);
                return maSanPham;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while creating product");
                throw new Exception("Lỗi tạo sản phẩm trong cơ sở dữ liệu", ex);
            }
        }

        public bool Update(int id, SanPhamUpdateDTO dto)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_SanPham_Update", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@MaSanPham", SqlDbType.Int).Value = id;
                cmd.Parameters.Add("@TenSanPham", SqlDbType.NVarChar, 100).Value = dto.TenSanPham;
                cmd.Parameters.Add("@DonViTinh", SqlDbType.NVarChar, 20).Value = dto.DonViTinh;
                cmd.Parameters.Add("@MoTa", SqlDbType.NVarChar, 255).Value = (object?)dto.MoTa ?? DBNull.Value;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var rowsAffected = reader.GetInt32(0);
                    if (rowsAffected > 0)
                    {
                        _logger.LogInformation("Updated product with ID {ProductId}", id);
                        return true;
                    }
                }
                _logger.LogWarning("No product found with ID {ProductId} to update", id);
                return false;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while updating product with ID {ProductId}", id);
                throw new Exception("Lỗi cập nhật sản phẩm trong cơ sở dữ liệu", ex);
            }
        }

        public bool Delete(int id)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_SanPham_Delete", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@MaSanPham", SqlDbType.Int).Value = id;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var rowsAffected = reader.GetInt32(0);
                    if (rowsAffected > 0)
                    {
                        _logger.LogInformation("Deleted product with ID {ProductId}", id);
                        return true;
                    }
                }
                _logger.LogWarning("No product found with ID {ProductId} to delete", id);
                return false;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while deleting product with ID {ProductId}", id);
                throw new Exception("Lỗi xóa sản phẩm trong cơ sở dữ liệu", ex);
            }
        }

        private static SanPhamDTO MapToDTO(SqlDataReader reader)
        {
            return new SanPhamDTO
            {
                MaSanPham = reader.GetInt32("MaSanPham"),
                TenSanPham = reader.GetString("TenSanPham"),
                DonViTinh = reader.GetString("DonViTinh"),
                MoTa = reader.IsDBNull("MoTa") ? null : reader.GetString("MoTa"),
                NgayTao = reader.IsDBNull("NgayTao") ? null : reader.GetDateTime("NgayTao")
            };
        }
    }
}
