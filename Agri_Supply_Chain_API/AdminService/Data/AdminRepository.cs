using AdminService.Models.DTOs;
using Microsoft.Data.SqlClient;
using System.Data;

namespace AdminService.Data
{
    public class AdminRepository : IAdminRepository
    {
        private readonly string _connectionString;

        public AdminRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public List<TaiKhoanDto> GetAllTaiKhoan()
        {
            var taiKhoans = new List<TaiKhoanDto>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetAllTaiKhoan", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            connection.Open();
            using var reader = command.ExecuteReader();

            while (reader.Read())
            {
                var taiKhoan = MapToTaiKhoanDto(reader);
                taiKhoans.Add(taiKhoan);
            }

            return taiKhoans;
        }

        public TaiKhoanDto? GetTaiKhoanById(int maTaiKhoan)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_GetTaiKhoanById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return MapToTaiKhoanDto(reader);
            }

            return null;
        }

        public bool UpdateTaiKhoan(int maTaiKhoan, UpdateTaiKhoanRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_UpdateTaiKhoan", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);
            command.Parameters.AddWithValue("@MatKhau", (object?)request.MatKhau ?? DBNull.Value);
            command.Parameters.AddWithValue("@TrangThai", (object?)request.TrangThai ?? DBNull.Value);
            command.Parameters.AddWithValue("@HoTen", (object?)request.HoTen ?? DBNull.Value);
            command.Parameters.AddWithValue("@SoDienThoai", (object?)request.SoDienThoai ?? DBNull.Value);
            command.Parameters.AddWithValue("@Email", (object?)request.Email ?? DBNull.Value);
            command.Parameters.AddWithValue("@DiaChi", (object?)request.DiaChi ?? DBNull.Value);
            command.Parameters.AddWithValue("@TenCuaHang", (object?)request.TenCuaHang ?? DBNull.Value);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return reader.GetInt32("Success") == 1;
            }

            return false;
        }

        public (bool success, string message) DeleteTaiKhoan(int maTaiKhoan)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_DeleteTaiKhoan", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                var success = reader.GetInt32("Success") == 1;
                var message = reader.GetString("Message");
                return (success, message);
            }

            return (false, "Lỗi không xác định");
        }

        private TaiKhoanDto MapToTaiKhoanDto(SqlDataReader reader)
        {
            var taiKhoan = new TaiKhoanDto
            {
                MaTaiKhoan = reader.GetInt32("MaTaiKhoan"),
                TenDangNhap = reader.GetString("TenDangNhap"),
                LoaiTaiKhoan = reader.GetString("LoaiTaiKhoan"),
                TrangThai = reader.IsDBNull("TrangThai") ? null : reader.GetString("TrangThai"),
                NgayTao = reader.IsDBNull("NgayTao") ? null : reader.GetDateTime("NgayTao"),
                LanDangNhapCuoi = reader.IsDBNull("LanDangNhapCuoi") ? null : reader.GetDateTime("LanDangNhapCuoi")
            };

            // Map Admin info
            if (!reader.IsDBNull("MaAdmin"))
            {
                taiKhoan.Admin = new AdminDto
                {
                    MaAdmin = reader.GetInt32("MaAdmin"),
                    HoTen = reader.IsDBNull("AdminHoTen") ? null : reader.GetString("AdminHoTen"),
                    SoDienThoai = reader.IsDBNull("AdminSoDienThoai") ? null : reader.GetString("AdminSoDienThoai"),
                    Email = reader.IsDBNull("AdminEmail") ? null : reader.GetString("AdminEmail")
                };
            }

            // Map NongDan info
            if (!reader.IsDBNull("MaNongDan"))
            {
                taiKhoan.NongDan = new NongDanDto
                {
                    MaNongDan = reader.GetInt32("MaNongDan"),
                    HoTen = reader.IsDBNull("NongDanHoTen") ? null : reader.GetString("NongDanHoTen"),
                    SoDienThoai = reader.IsDBNull("NongDanSoDienThoai") ? null : reader.GetString("NongDanSoDienThoai"),
                    Email = reader.IsDBNull("NongDanEmail") ? null : reader.GetString("NongDanEmail"),
                    DiaChi = reader.IsDBNull("NongDanDiaChi") ? null : reader.GetString("NongDanDiaChi")
                };
            }

            // Map SieuThi info
            if (!reader.IsDBNull("MaSieuThi"))
            {
                taiKhoan.SieuThi = new SieuThiDto
                {
                    MaSieuThi = reader.GetInt32("MaSieuThi"),
                    TenSieuThi = reader.IsDBNull("TenSieuThi") ? null : reader.GetString("TenSieuThi"),
                    SoDienThoai = reader.IsDBNull("SieuThiSoDienThoai") ? null : reader.GetString("SieuThiSoDienThoai"),
                    Email = reader.IsDBNull("SieuThiEmail") ? null : reader.GetString("SieuThiEmail"),
                    DiaChi = reader.IsDBNull("SieuThiDiaChi") ? null : reader.GetString("SieuThiDiaChi")
                };
            }

            // Map DaiLy info
            if (!reader.IsDBNull("MaDaiLy"))
            {
                taiKhoan.DaiLy = new DaiLyDto
                {
                    MaDaiLy = reader.GetInt32("MaDaiLy"),
                    TenDaiLy = reader.IsDBNull("TenDaiLy") ? null : reader.GetString("TenDaiLy"),
                    SoDienThoai = reader.IsDBNull("DaiLySoDienThoai") ? null : reader.GetString("DaiLySoDienThoai"),
                    Email = reader.IsDBNull("DaiLyEmail") ? null : reader.GetString("DaiLyEmail"),
                    DiaChi = reader.IsDBNull("DaiLyDiaChi") ? null : reader.GetString("DaiLyDiaChi")
                };
            }

            return taiKhoan;
        }
    }
}
