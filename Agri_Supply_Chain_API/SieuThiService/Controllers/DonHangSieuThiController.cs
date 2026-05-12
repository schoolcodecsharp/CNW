using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SieuThiService.Data;
using SieuThiService.Models.DTOs;

namespace SieuThiService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangSieuThiController : ControllerBase
    {
        private readonly ISieuThiRepository _sieuThiRepository;

        public DonHangSieuThiController(ISieuThiRepository sieuThiRepository)
        {
            _sieuThiRepository = sieuThiRepository;
        }

        [HttpPost("tao-don-hang")]
        public ActionResult CreateDonHangOnly([FromBody] CreateDonHangSieuThiRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new { 
                        success = false, 
                        message = "Dữ liệu không hợp lệ", 
                        errors = errors,
                        modelState = ModelState 
                    });
                }

                // Kiểm tra siêu thị có tồn tại không
                var sieuThiExists = _sieuThiRepository.GetSieuThiById(request.MaSieuThi);
                if (!sieuThiExists)
                {
                    return NotFound(new { 
                        success = false, 
                        message = $"Không tìm thấy siêu thị với mã {request.MaSieuThi}",
                        debug = new { maSieuThi = request.MaSieuThi }
                    });
                }

                // Nếu có chi tiết đơn hàng, sử dụng phương thức tạo đầy đủ
                if (request.ChiTietDonHangs != null && request.ChiTietDonHangs.Count > 0)
                {
                    var result = _sieuThiRepository.CreateDonHang(request);
                    
                    if (!result)
                    {
                        return BadRequest(new { 
                            success = false, 
                            message = "Không thể tạo đơn hàng - Repository trả về false",
                            debug = new {
                                maSieuThi = request.MaSieuThi,
                                maDaiLy = request.MaDaiLy,
                                soChiTiet = request.ChiTietDonHangs.Count
                            }
                        });
                    }

                    return Ok(new 
                    { 
                        success = true, 
                        message = "Tạo đơn hàng thành công"
                    });
                }
                else
                {
                    // Nếu không có chi tiết, chỉ tạo đơn hàng trống (backward compatibility)
                    var createDonHangRequest = new CreateDonHangRequest
                    {
                        MaSieuThi = request.MaSieuThi,
                        MaDaiLy = request.MaDaiLy,
                        NgayGiao = request.NgayGiao,
                        GhiChu = request.GhiChu
                    };

                    var result = _sieuThiRepository.CreateDonHangOnly(createDonHangRequest);
                    
                    if (!result)
                    {
                        return BadRequest(new { 
                            success = false, 
                            message = "Không thể tạo đơn hàng trống - Repository trả về false" 
                        });
                    }

                    return Ok(new { success = true, message = "Tạo đơn hàng thành công" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = $"Lỗi server: {ex.Message}",
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpPost("create")]
        public ActionResult CreateDonHangWithDetails([FromBody] CreateDonHangSieuThiRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors = ModelState });
                }

                // Kiểm tra siêu thị có tồn tại không
                var sieuThiExists = _sieuThiRepository.GetSieuThiById(request.MaSieuThi);
                if (!sieuThiExists)
                {
                    return NotFound(new { success = false, message = $"Không tìm thấy siêu thị với mã {request.MaSieuThi}" });
                }

                // Tạo đơn hàng
                var createDonHangRequest = new CreateDonHangRequest
                {
                    MaSieuThi = request.MaSieuThi,
                    MaDaiLy = request.MaDaiLy,
                    NgayGiao = request.NgayGiao,
                    GhiChu = request.GhiChu
                };

                var donHangCreated = _sieuThiRepository.CreateDonHangOnly(createDonHangRequest);
                
                if (!donHangCreated)
                {
                    return BadRequest(new { success = false, message = "Không thể tạo đơn hàng" });
                }

                // Lấy mã đơn hàng vừa tạo
                var donHangs = _sieuThiRepository.GetDonHangsBySieuThi(request.MaSieuThi);
                var newDonHang = donHangs.OrderByDescending(d => d.MaDonHang).FirstOrDefault();
                
                if (newDonHang == null)
                {
                    return BadRequest(new { success = false, message = "Không tìm thấy đơn hàng vừa tạo" });
                }

                // Thêm chi tiết đơn hàng
                foreach (var chiTiet in request.ChiTietDonHangs)
                {
                    var addChiTietRequest = new CreateChiTietDonHangRequest
                    {
                        MaDonHang = newDonHang.MaDonHang,
                        MaLo = chiTiet.MaLo,
                        SoLuong = chiTiet.SoLuong,
                        DonGia = chiTiet.DonGia
                    };

                    var chiTietAdded = _sieuThiRepository.AddChiTietDonHang(addChiTietRequest);
                    
                    if (!chiTietAdded)
                    {
                        return BadRequest(new { success = false, message = $"Không thể thêm chi tiết đơn hàng cho lô {chiTiet.MaLo}" });
                    }
                }

                return Ok(new 
                { 
                    success = true, 
                    message = "Tạo đơn hàng thành công",
                    data = new { maDonHang = newDonHang.MaDonHang }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Lỗi server: {ex.Message}" });
            }
        }

        [HttpPost("them-chi-tiet")]
        public ActionResult AddChiTietDonHang([FromBody] CreateChiTietDonHangRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = _sieuThiRepository.AddChiTietDonHang(request);
                
                if (!result)
                {
                    return NotFound($"Không tìm thấy đơn hàng với mã {request.MaDonHang}");
                }

                return Ok("Thêm chi tiết đơn hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPut("nhan-hang/{id}")]
        public ActionResult NhanHang(int id, [FromBody] NhanHangRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (request.MaKho <= 0)
                {
                    return BadRequest("Mã kho là bắt buộc và phải lớn hơn 0");
                }

                var result = _sieuThiRepository.NhanHang(id, request);
                
                if (!result)
                {
                    return BadRequest("Không thể nhận hàng");
                }

                return Ok("Nhận hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPut("cap-nhat-chi-tiet")]
        public ActionResult UpdateChiTietDonHang([FromBody] UpdateChiTietDonHangRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = _sieuThiRepository.UpdateChiTietDonHang(request);
                
                if (!result)
                {
                    return BadRequest("Không thể cập nhật chi tiết đơn hàng");
                }

                return Ok("Cập nhật chi tiết đơn hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpDelete("xoa-chi-tiet")]
        public ActionResult DeleteChiTietDonHang([FromBody] DeleteChiTietDonHangRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = _sieuThiRepository.DeleteChiTietDonHang(request);
                
                if (!result)
                {
                    return BadRequest("Không thể xóa chi tiết đơn hàng");
                }

                return Ok("Xóa chi tiết đơn hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPut("huy-don-hang/{id}")]
        public ActionResult HuyDonHang(int id)
        {
            try
            {
                var result = _sieuThiRepository.HuyDonHang(id);
                
                if (!result)
                {
                    return BadRequest("Không thể hủy đơn hàng");
                }

                return Ok("Hủy đơn hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        
        [HttpGet("{id}")]
        public ActionResult<DonHangSieuThiResponse> GetDonHangById(int id)
        {
            try
            {
                var donHang = _sieuThiRepository.GetDonHangById(id);
                
                if (donHang == null)
                {
                    return NotFound($"Không tìm thấy đơn hàng với mã {id}");
                }

                return Ok(donHang);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("sieu-thi/{maSieuThi}")]
        public ActionResult<List<DonHangSieuThiResponse>> GetDonHangsBySieuThi(int maSieuThi)
        {
            try
            {
                // Kiểm tra siêu thị có tồn tại không
                var sieuThiExists = _sieuThiRepository.GetSieuThiById(maSieuThi);
                if (!sieuThiExists)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Không tìm thấy siêu thị với mã {maSieuThi}",
                        data = (object?)null
                    });
                }

                var donHangs = _sieuThiRepository.GetDonHangsBySieuThi(maSieuThi);
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng thành công",
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

        // GET: api/DonHangSieuThi/dai-ly/{maDaiLy}
        [HttpGet("dai-ly/{maDaiLy}")]
        public ActionResult<List<DonHangSieuThiResponse>> GetDonHangsByDaiLy(int maDaiLy)
        {
            try
            {
                var donHangs = _sieuThiRepository.GetDonHangsByDaiLy(maDaiLy);
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng thành công",
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

        // GET: api/DonHangSieuThi/get-all
        [HttpGet("get-all")]
        public ActionResult<List<DonHangSieuThiResponse>> GetAll()
        {
            try
            {
                var allDonHangs = _sieuThiRepository.GetAllDonHangSieuThi();
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách tất cả đơn hàng siêu thị thành công",
                    data = allDonHangs,
                    count = allDonHangs.Count
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
        // KIỂM ĐỊNH ĐƠN HÀNG TỪ ĐẠI LÝ
        // ============================================================================

        // GET: api/DonHangSieuThi/cho-kiem-dinh/{maSieuThi}
        // Lấy danh sách đơn hàng chờ kiểm định
        [HttpGet("cho-kiem-dinh/{maSieuThi}")]
        public ActionResult GetChoKiemDinh(int maSieuThi)
        {
            try
            {
                var donHangs = new List<DonHangChoKiemDinhResponse>();

                var connectionString = _sieuThiRepository.GetConnectionString();
                using (var connection = new Microsoft.Data.SqlClient.SqlConnection(connectionString))
                {
                    using (var command = new Microsoft.Data.SqlClient.SqlCommand("sp_SieuThi_GetDonHangChoKiemDinh", connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@MaSieuThi", maSieuThi);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                donHangs.Add(new DonHangChoKiemDinhResponse
                                {
                                    MaDonHang = reader.GetInt32(reader.GetOrdinal("MaDonHang")),
                                    NgayDat = reader.GetDateTime(reader.GetOrdinal("NgayDat")),
                                    TrangThai = reader.GetString(reader.GetOrdinal("TrangThai")),
                                    TongSoLuong = reader.IsDBNull(reader.GetOrdinal("TongSoLuong")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TongSoLuong")),
                                    TongGiaTri = reader.IsDBNull(reader.GetOrdinal("TongGiaTri")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TongGiaTri")),
                                    GhiChu = reader.IsDBNull(reader.GetOrdinal("GhiChu")) ? null : reader.GetString(reader.GetOrdinal("GhiChu")),
                                    MaDaiLy = reader.GetInt32(reader.GetOrdinal("MaDaiLy")),
                                    TenDaiLy = reader.GetString(reader.GetOrdinal("TenDaiLy")),
                                    DiaChiDaiLy = reader.IsDBNull(reader.GetOrdinal("DiaChiDaiLy")) ? null : reader.GetString(reader.GetOrdinal("DiaChiDaiLy")),
                                    SoDienThoaiDaiLy = reader.IsDBNull(reader.GetOrdinal("SoDienThoaiDaiLy")) ? null : reader.GetString(reader.GetOrdinal("SoDienThoaiDaiLy"))
                                });
                            }
                        }
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng chờ kiểm định thành công",
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

        // PUT: api/DonHangSieuThi/kiem-dinh/{id}
        // Kiểm định đơn hàng (đạt → nhập kho, không đạt → hoàn trả)
        [HttpPut("kiem-dinh/{id}")]
        public ActionResult KiemDinh(int id, [FromBody] KiemDinhDonHangRequest request)
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

                // Kiểm tra nếu đạt thì phải có mã kho
                if (request.KetQua == "dat" && (request.MaKho == null || request.MaKho <= 0))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Vui lòng chọn kho để nhập hàng khi kiểm định đạt"
                    });
                }

                var connectionString = _sieuThiRepository.GetConnectionString();
                using (var connection = new Microsoft.Data.SqlClient.SqlConnection(connectionString))
                {
                    using (var command = new Microsoft.Data.SqlClient.SqlCommand("sp_SieuThi_KiemDinhDonHang", connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@MaDonHang", id);
                        command.Parameters.AddWithValue("@MaSieuThi", request.MaSieuThi);
                        command.Parameters.AddWithValue("@KetQua", request.KetQua);
                        command.Parameters.AddWithValue("@MaKho", (object?)request.MaKho ?? DBNull.Value);
                        command.Parameters.AddWithValue("@GhiChu", (object?)request.GhiChu ?? DBNull.Value);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var status = reader.GetString(reader.GetOrdinal("Status"));

                                if (status == "ERROR")
                                {
                                    return BadRequest(new
                                    {
                                        success = false,
                                        message = "Không thể kiểm định đơn hàng. Vui lòng kiểm tra lại."
                                    });
                                }

                                // Determine message based on result
                                var successMessage = request.KetQua == "dat" 
                                    ? "Kiểm định đạt. Đơn hàng đã được nhập kho." 
                                    : "Kiểm định không đạt. Đơn hàng đã được hoàn trả.";

                                return Ok(new
                                {
                                    success = true,
                                    message = successMessage
                                });
                            }
                        }
                    }
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Không thể kiểm định đơn hàng"
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