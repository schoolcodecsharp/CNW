using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Controllers
{
    [ApiController]
    [Route("api/don-hang-sieu-thi")]
    public class DonHangSieuThiDaiLyController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public DonHangSieuThiDaiLyController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        // ============================================================================
        // 1. GET: api/don-hang-sieu-thi/chua-xac-nhan-dai-ly/{maDaiLy}
        // Lấy danh sách đơn hàng từ siêu thị chưa xác nhận
        // ============================================================================
        [HttpGet("chua-xac-nhan-dai-ly/{maDaiLy}")]
        public IActionResult GetChuaXacNhan(int maDaiLy)
        {
            try
            {
                var donHangs = new List<DonHangSieuThiResponse>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand("sp_DaiLy_GetDonHangChuaXacNhan_SieuThi", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                donHangs.Add(new DonHangSieuThiResponse
                                {
                                    MaDonHang = reader.GetInt32(reader.GetOrdinal("MaDonHang")),
                                    NgayDat = reader.GetDateTime(reader.GetOrdinal("NgayDat")),
                                    TrangThai = reader.GetString(reader.GetOrdinal("TrangThai")),
                                    TongSoLuong = reader.IsDBNull(reader.GetOrdinal("TongSoLuong")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TongSoLuong")),
                                    TongGiaTri = reader.IsDBNull(reader.GetOrdinal("TongGiaTri")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TongGiaTri")),
                                    GhiChu = reader.IsDBNull(reader.GetOrdinal("GhiChu")) ? null : reader.GetString(reader.GetOrdinal("GhiChu")),
                                    MaSieuThi = reader.GetInt32(reader.GetOrdinal("MaSieuThi")),
                                    TenSieuThi = reader.GetString(reader.GetOrdinal("TenSieuThi")),
                                    DiaChiSieuThi = reader.IsDBNull(reader.GetOrdinal("DiaChiSieuThi")) ? null : reader.GetString(reader.GetOrdinal("DiaChiSieuThi")),
                                    SoDienThoaiSieuThi = reader.IsDBNull(reader.GetOrdinal("SoDienThoaiSieuThi")) ? null : reader.GetString(reader.GetOrdinal("SoDienThoaiSieuThi"))
                                });
                            }
                        }
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng chưa xác nhận thành công",
                    data = donHangs,
                    count = donHangs.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi server: {ex.Message}",
                    data = (object?)null
                });
            }
        }

        // ============================================================================
        // 2. PUT: api/don-hang-sieu-thi/xac-nhan-dai-ly/{id}
        // Xác nhận đơn hàng từ siêu thị (chọn kho, trừ tồn kho, chuyển sang cho_kiem_duyet)
        // ============================================================================
        [HttpPut("xac-nhan-dai-ly/{id}")]
        public IActionResult XacNhan(int id, [FromBody] XacNhanDonHangSieuThiRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ",
                        errors = ModelState
                    });
                }

                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand("sp_DaiLy_XacNhanDonHang_SieuThi", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@MaDonHang", id);
                        command.Parameters.AddWithValue("@MaDaiLy", request.MaDaiLy);
                        command.Parameters.AddWithValue("@MaKho", request.MaKho);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var status = reader.GetString(reader.GetOrdinal("Status"));
                                var message = reader.GetString(reader.GetOrdinal("Message"));

                                if (status == "ERROR")
                                {
                                    return BadRequest(new
                                    {
                                        success = false,
                                        message = message
                                    });
                                }

                                return Ok(new
                                {
                                    success = true,
                                    message = message
                                });
                            }
                        }
                    }
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Không thể xác nhận đơn hàng"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi server: {ex.Message}"
                });
            }
        }

        // ============================================================================
        // 3. GET: api/don-hang-sieu-thi/hoan-don-dai-ly/{maDaiLy}
        // Lấy danh sách đơn hàng hoàn trả từ siêu thị
        // ============================================================================
        [HttpGet("hoan-don-dai-ly/{maDaiLy}")]
        public IActionResult GetHoanDon(int maDaiLy)
        {
            try
            {
                var donHangs = new List<DonHangSieuThiResponse>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand("sp_DaiLy_GetDonHangHoanDon_SieuThi", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                donHangs.Add(new DonHangSieuThiResponse
                                {
                                    MaDonHang = reader.GetInt32(reader.GetOrdinal("MaDonHang")),
                                    NgayDat = reader.GetDateTime(reader.GetOrdinal("NgayDat")),
                                    TrangThai = reader.GetString(reader.GetOrdinal("TrangThai")),
                                    TongSoLuong = reader.IsDBNull(reader.GetOrdinal("TongSoLuong")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TongSoLuong")),
                                    TongGiaTri = reader.IsDBNull(reader.GetOrdinal("TongGiaTri")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TongGiaTri")),
                                    GhiChu = reader.IsDBNull(reader.GetOrdinal("GhiChu")) ? null : reader.GetString(reader.GetOrdinal("GhiChu")),
                                    MaSieuThi = reader.GetInt32(reader.GetOrdinal("MaSieuThi")),
                                    TenSieuThi = reader.GetString(reader.GetOrdinal("TenSieuThi")),
                                    DiaChiSieuThi = reader.IsDBNull(reader.GetOrdinal("DiaChiSieuThi")) ? null : reader.GetString(reader.GetOrdinal("DiaChiSieuThi")),
                                    SoDienThoaiSieuThi = reader.IsDBNull(reader.GetOrdinal("SoDienThoaiSieuThi")) ? null : reader.GetString(reader.GetOrdinal("SoDienThoaiSieuThi"))
                                });
                            }
                        }
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng hoàn trả thành công",
                    data = donHangs,
                    count = donHangs.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi server: {ex.Message}",
                    data = (object?)null
                });
            }
        }

        // ============================================================================
        // 4. PUT: api/don-hang-sieu-thi/xu-ly-hoan-don-dai-ly/{id}
        // Xử lý đơn hoàn trả (gửi lại kiểm định, cộng lại tồn kho)
        // ============================================================================
        [HttpPut("xu-ly-hoan-don-dai-ly/{id}")]
        public IActionResult XuLyHoanDon(int id, [FromBody] XuLyHoanDonSieuThiRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ",
                        errors = ModelState
                    });
                }

                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand("sp_DaiLy_XuLyHoanDon_SieuThi", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@MaDonHang", id);
                        command.Parameters.AddWithValue("@MaDaiLy", request.MaDaiLy);
                        command.Parameters.AddWithValue("@MaKho", request.MaKho);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var status = reader.GetString(reader.GetOrdinal("Status"));
                                var message = reader.GetString(reader.GetOrdinal("Message"));

                                if (status == "ERROR")
                                {
                                    return BadRequest(new
                                    {
                                        success = false,
                                        message = message
                                    });
                                }

                                return Ok(new
                                {
                                    success = true,
                                    message = message
                                });
                            }
                        }
                    }
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Không thể xử lý hoàn đơn"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi server: {ex.Message}"
                });
            }
        }

        // ============================================================================
        // 5. PUT: api/don-hang-sieu-thi/huy-don-dai-ly/{id}
        // Hủy đơn hàng từ siêu thị
        // ============================================================================
        [HttpPut("huy-don-dai-ly/{id}")]
        public IActionResult HuyDon(int id, [FromBody] HuyDonSieuThiRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ",
                        errors = ModelState
                    });
                }

                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand("sp_DaiLy_HuyDonHang_SieuThi", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@MaDonHang", id);
                        command.Parameters.AddWithValue("@MaDaiLy", request.MaDaiLy);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var status = reader.GetString(reader.GetOrdinal("Status"));
                                var message = reader.GetString(reader.GetOrdinal("Message"));

                                if (status == "ERROR")
                                {
                                    return BadRequest(new
                                    {
                                        success = false,
                                        message = message
                                    });
                                }

                                return Ok(new
                                {
                                    success = true,
                                    message = message
                                });
                            }
                        }
                    }
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Không thể hủy đơn hàng"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi server: {ex.Message}"
                });
            }
        }
    }
}
