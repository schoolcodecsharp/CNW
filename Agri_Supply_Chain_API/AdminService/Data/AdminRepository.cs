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

            return (false, "L?i kh�ng x�c �?nh");
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

        // ==================== ĐẠI LÝ MANAGEMENT ====================
        
        public List<DaiLyDto> GetAllDaiLy()
        {
            var dailyList = new List<DaiLyDto>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_GetAllDaiLy", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            connection.Open();
            using var reader = command.ExecuteReader();

            while (reader.Read())
            {
                dailyList.Add(new DaiLyDto
                {
                    MaDaiLy = reader.GetInt32("MaDaiLy"),
                    MaTaiKhoan = reader.GetInt32("MaTaiKhoan"),
                    TenDaiLy = reader.IsDBNull("TenDaiLy") ? null : reader.GetString("TenDaiLy"),
                    DiaChi = reader.IsDBNull("DiaChi") ? null : reader.GetString("DiaChi"),
                    SoDienThoai = reader.IsDBNull("SoDienThoai") ? null : reader.GetString("SoDienThoai"),
                    Email = reader.IsDBNull("Email") ? null : reader.GetString("Email"),
                    TenDangNhap = reader.IsDBNull("TenDangNhap") ? null : reader.GetString("TenDangNhap"),
                    TrangThai = reader.IsDBNull("TrangThai") ? null : reader.GetString("TrangThai"),
                    NgayTao = reader.IsDBNull("NgayTao") ? null : reader.GetDateTime("NgayTao")
                });
            }

            return dailyList;
        }

        public DaiLyDto? GetDaiLyById(int maDaiLy)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_GetDaiLyById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return new DaiLyDto
                {
                    MaDaiLy = reader.GetInt32("MaDaiLy"),
                    MaTaiKhoan = reader.GetInt32("MaTaiKhoan"),
                    TenDaiLy = reader.IsDBNull("TenDaiLy") ? null : reader.GetString("TenDaiLy"),
                    DiaChi = reader.IsDBNull("DiaChi") ? null : reader.GetString("DiaChi"),
                    SoDienThoai = reader.IsDBNull("SoDienThoai") ? null : reader.GetString("SoDienThoai"),
                    Email = reader.IsDBNull("Email") ? null : reader.GetString("Email"),
                    TenDangNhap = reader.IsDBNull("TenDangNhap") ? null : reader.GetString("TenDangNhap"),
                    TrangThai = reader.IsDBNull("TrangThai") ? null : reader.GetString("TrangThai"),
                    NgayTao = reader.IsDBNull("NgayTao") ? null : reader.GetDateTime("NgayTao")
                };
            }

            return null;
        }

        public (bool success, int maDaiLy, string message) CreateDaiLy(CreateDaiLyRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_CreateDaiLy", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@TenDangNhap", request.TenDangNhap);
            command.Parameters.AddWithValue("@MatKhau", request.MatKhau);
            command.Parameters.AddWithValue("@TenDaiLy", request.TenDaiLy);
            command.Parameters.AddWithValue("@DiaChi", (object?)request.DiaChi ?? DBNull.Value);
            command.Parameters.AddWithValue("@SoDienThoai", (object?)request.SoDienThoai ?? DBNull.Value);
            command.Parameters.AddWithValue("@Email", (object?)request.Email ?? DBNull.Value);
            
            var outputParam = command.Parameters.Add("@MaDaiLy", SqlDbType.Int);
            outputParam.Direction = ParameterDirection.Output;

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                var success = reader.GetInt32("Success") == 1;
                var maDaiLy = reader.IsDBNull("MaDaiLy") ? 0 : reader.GetInt32("MaDaiLy");
                var message = reader.GetString("Message");
                return (success, maDaiLy, message);
            }

            return (false, 0, "Lỗi không xác định");
        }

        public bool UpdateDaiLy(int maDaiLy, UpdateDaiLyRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_UpdateDaiLy", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaDaiLy", maDaiLy);
            command.Parameters.AddWithValue("@TenDaiLy", request.TenDaiLy);
            command.Parameters.AddWithValue("@DiaChi", (object?)request.DiaChi ?? DBNull.Value);
            command.Parameters.AddWithValue("@SoDienThoai", (object?)request.SoDienThoai ?? DBNull.Value);
            command.Parameters.AddWithValue("@Email", (object?)request.Email ?? DBNull.Value);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return reader.GetInt32("RowsAffected") > 0;
            }

            return false;
        }

        public bool DeleteDaiLy(int maDaiLy)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_DeleteDaiLy", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return reader.GetInt32("RowsAffected") > 0;
            }

            return false;
        }

        // ==================== SIÊU THỊ MANAGEMENT ====================
        
        public List<SieuThiDto> GetAllSieuThi()
        {
            var sieuThiList = new List<SieuThiDto>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_GetAllSieuThi", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            connection.Open();
            using var reader = command.ExecuteReader();

            while (reader.Read())
            {
                sieuThiList.Add(new SieuThiDto
                {
                    MaSieuThi = reader.GetInt32("MaSieuThi"),
                    MaTaiKhoan = reader.GetInt32("MaTaiKhoan"),
                    TenSieuThi = reader.IsDBNull("TenSieuThi") ? null : reader.GetString("TenSieuThi"),
                    DiaChi = reader.IsDBNull("DiaChi") ? null : reader.GetString("DiaChi"),
                    SoDienThoai = reader.IsDBNull("SoDienThoai") ? null : reader.GetString("SoDienThoai"),
                    Email = reader.IsDBNull("Email") ? null : reader.GetString("Email"),
                    TenDangNhap = reader.IsDBNull("TenDangNhap") ? null : reader.GetString("TenDangNhap"),
                    TrangThai = reader.IsDBNull("TrangThai") ? null : reader.GetString("TrangThai"),
                    NgayTao = reader.IsDBNull("NgayTao") ? null : reader.GetDateTime("NgayTao")
                });
            }

            return sieuThiList;
        }

        public SieuThiDto? GetSieuThiById(int maSieuThi)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_GetSieuThiById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaSieuThi", maSieuThi);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return new SieuThiDto
                {
                    MaSieuThi = reader.GetInt32("MaSieuThi"),
                    MaTaiKhoan = reader.GetInt32("MaTaiKhoan"),
                    TenSieuThi = reader.IsDBNull("TenSieuThi") ? null : reader.GetString("TenSieuThi"),
                    DiaChi = reader.IsDBNull("DiaChi") ? null : reader.GetString("DiaChi"),
                    SoDienThoai = reader.IsDBNull("SoDienThoai") ? null : reader.GetString("SoDienThoai"),
                    Email = reader.IsDBNull("Email") ? null : reader.GetString("Email"),
                    TenDangNhap = reader.IsDBNull("TenDangNhap") ? null : reader.GetString("TenDangNhap"),
                    TrangThai = reader.IsDBNull("TrangThai") ? null : reader.GetString("TrangThai"),
                    NgayTao = reader.IsDBNull("NgayTao") ? null : reader.GetDateTime("NgayTao")
                };
            }

            return null;
        }

        public (bool success, int maSieuThi, string message) CreateSieuThi(CreateSieuThiRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_CreateSieuThi", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@TenDangNhap", request.TenDangNhap);
            command.Parameters.AddWithValue("@MatKhau", request.MatKhau);
            command.Parameters.AddWithValue("@TenSieuThi", request.TenSieuThi);
            command.Parameters.AddWithValue("@DiaChi", (object?)request.DiaChi ?? DBNull.Value);
            command.Parameters.AddWithValue("@SoDienThoai", (object?)request.SoDienThoai ?? DBNull.Value);
            command.Parameters.AddWithValue("@Email", (object?)request.Email ?? DBNull.Value);
            
            var outputParam = command.Parameters.Add("@MaSieuThi", SqlDbType.Int);
            outputParam.Direction = ParameterDirection.Output;

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                var success = reader.GetInt32("Success") == 1;
                var maSieuThi = reader.IsDBNull("MaSieuThi") ? 0 : reader.GetInt32("MaSieuThi");
                var message = reader.GetString("Message");
                return (success, maSieuThi, message);
            }

            return (false, 0, "Lỗi không xác định");
        }

        public bool UpdateSieuThi(int maSieuThi, UpdateSieuThiRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_UpdateSieuThi", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaSieuThi", maSieuThi);
            command.Parameters.AddWithValue("@TenSieuThi", request.TenSieuThi);
            command.Parameters.AddWithValue("@DiaChi", (object?)request.DiaChi ?? DBNull.Value);
            command.Parameters.AddWithValue("@SoDienThoai", (object?)request.SoDienThoai ?? DBNull.Value);
            command.Parameters.AddWithValue("@Email", (object?)request.Email ?? DBNull.Value);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return reader.GetInt32("RowsAffected") > 0;
            }

            return false;
        }

        public bool DeleteSieuThi(int maSieuThi)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("sp_Admin_DeleteSieuThi", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@MaSieuThi", maSieuThi);

            connection.Open();
            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return reader.GetInt32("RowsAffected") > 0;
            }

            return false;
        }
    }
}

