using Microsoft.Data.SqlClient;
using System.Data;

namespace AuthService.Data
{
    public class AccountRepository : IAccountRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<AccountRepository> _logger;

        public AccountRepository(IConfiguration config, ILogger<AccountRepository> logger)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
            _logger = logger;
        }

        public (bool success, string? loaiTaiKhoan, int? maTaiKhoan) Login(string tenDangNhap, string matKhau)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                using var cmd = new SqlCommand("sp_Login", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@TenDangNhap", SqlDbType.NVarChar, 50).Value = tenDangNhap;
                cmd.Parameters.Add("@MatKhau", SqlDbType.NVarChar, 255).Value = matKhau;

                conn.Open();
                using var reader = cmd.ExecuteReader();
                
                if (reader.Read())
                {
                    var success = reader.GetInt32("Success") == 1;
                    if (success)
                    {
                        var loaiTaiKhoan = reader.IsDBNull("LoaiTaiKhoan") ? null : reader.GetString("LoaiTaiKhoan");
                        var maTaiKhoan = reader.IsDBNull("MaTaiKhoan") ? null : (int?)reader.GetInt32("MaTaiKhoan");
                        _logger.LogInformation("User {Username} logged in successfully", tenDangNhap);
                        return (true, loaiTaiKhoan, maTaiKhoan);
                    }
                }
                
                _logger.LogWarning("Login failed for user {Username}", tenDangNhap);
                return (false, null, null);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred during login for user {Username}", tenDangNhap);
                throw new Exception("Lỗi đăng nhập", ex);
            }
        }
    }
}
