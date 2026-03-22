using Microsoft.AspNetCore.Mvc;
using NongDanService.Models.DTOs;
using NongDanService.Services;

namespace NongDanService.Controllers
{
    [Route("api/don-hang-dai-ly")]
    [ApiController]
    public class DonHangDaiLyController : ControllerBase
    {
        private readonly IDonHangDaiLyService _donHangService;

        public DonHangDaiLyController(IDonHangDaiLyService donHangService)
        {
            _donHangService = donHangService;
        }

        // ========== ĐƠN HÀNG ==========

        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _donHangService.GetAll();
                return Ok(new { success = true, message = "Lấy danh sách đơn hàng thành công", data, count = data.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpGet("get-by-id/{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                if (id <= 0) return BadRequest(new { success = false, message = "ID đơn hàng không hợp lệ" });

                var data = _donHangService.GetById(id);
                if (data == null) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng" });

                return Ok(new { success = true, message = "Lấy thông tin đơn hàng thành công", data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpGet("get-by-nong-dan/{maNongDan}")]
        public IActionResult GetByNongDanId(int maNongDan)
        {
            try
            {
                if (maNongDan <= 0) return BadRequest(new { success = false, message = "Mã nông dân không hợp lệ" });

                var data = _donHangService.GetByNongDanId(maNongDan);
                return Ok(new { success = true, message = "Lấy danh sách đơn hàng theo nông dân thành công", data, count = data.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpGet("get-by-dai-ly/{maDaiLy}")]
        public IActionResult GetByDaiLyId(int maDaiLy)
        {
            try
            {
                if (maDaiLy <= 0) return BadRequest(new { success = false, message = "Mã đại lý không hợp lệ" });

                var data = _donHangService.GetByDaiLyId(maDaiLy);
                return Ok(new { success = true, message = "Lấy danh sách đơn hàng theo đại lý thành công", data, count = data.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        /// <summary>
        /// Tạo đơn hàng mới (kèm danh sách chi tiết các lô sản phẩm)
        /// </summary>
        [HttpPost("create")]
        public IActionResult Create([FromBody] DonHangDaiLyCreateDTO dto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });

                var newId = _donHangService.Create(dto);
                return Ok(new { success = true, message = "Tạo đơn hàng thành công", data = new { id = newId } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] DonHangDaiLyUpdateDTO dto)
        {
            try
            {
                if (id <= 0) return BadRequest(new { success = false, message = "ID đơn hàng không hợp lệ" });

                bool result = _donHangService.Update(id, dto);
                if (!result) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng để cập nhật" });

                return Ok(new { success = true, message = "Cập nhật đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpPut("xac-nhan/{id}")]
        public IActionResult XacNhanDon(int id)
        {
            try
            {
                if (id <= 0) return BadRequest(new { success = false, message = "ID đơn hàng không hợp lệ" });

                bool result = _donHangService.XacNhanDon(id);
                if (!result) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng để xác nhận" });

                return Ok(new { success = true, message = "Xác nhận đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpPut("xuat-don/{id}")]
        public IActionResult XuatDon(int id)
        {
            try
            {
                if (id <= 0) return BadRequest(new { success = false, message = "ID đơn hàng không hợp lệ" });

                bool result = _donHangService.XuatDon(id);
                if (!result) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng để xuất" });

                return Ok(new { success = true, message = "Xuất đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpPut("huy-don/{id}")]
        public IActionResult HuyDon(int id)
        {
            try
            {
                if (id <= 0) return BadRequest(new { success = false, message = "ID đơn hàng không hợp lệ" });

                bool result = _donHangService.HuyDon(id);
                if (!result) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng để hủy" });

                return Ok(new { success = true, message = "Hủy đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (id <= 0) return BadRequest(new { success = false, message = "ID đơn hàng không hợp lệ" });

                bool result = _donHangService.Delete(id);
                if (!result) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng để xóa" });

                return Ok(new { success = true, message = "Xóa đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        // ========== CHI TIẾT ĐƠN HÀNG ==========

        /// <summary>
        /// Lấy chi tiết đơn hàng (danh sách các lô sản phẩm trong đơn)
        /// </summary>
        [HttpGet("{maDonHang}/chi-tiet")]
        public IActionResult GetChiTiet(int maDonHang)
        {
            try
            {
                if (maDonHang <= 0) return BadRequest(new { success = false, message = "Mã đơn hàng không hợp lệ" });

                var data = _donHangService.GetChiTietDonHang(maDonHang);
                return Ok(new { success = true, message = "Lấy chi tiết đơn hàng thành công", data, count = data.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        /// <summary>
        /// Thêm lô sản phẩm vào đơn hàng
        /// </summary>
        [HttpPost("{maDonHang}/chi-tiet")]
        public IActionResult ThemChiTiet(int maDonHang, [FromBody] ChiTietDonHangItemDTO item)
        {
            try
            {
                if (maDonHang <= 0) return BadRequest(new { success = false, message = "Mã đơn hàng không hợp lệ" });

                bool result = _donHangService.ThemChiTiet(maDonHang, item);
                if (!result) return BadRequest(new { success = false, message = "Không thể thêm chi tiết" });

                return Ok(new { success = true, message = "Thêm chi tiết đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật chi tiết (số lượng, đơn giá)
        /// </summary>
        [HttpPut("{maDonHang}/chi-tiet/{maLo}")]
        public IActionResult CapNhatChiTiet(int maDonHang, int maLo, [FromBody] ChiTietDonHangItemDTO item)
        {
            try
            {
                if (maDonHang <= 0 || maLo <= 0) return BadRequest(new { success = false, message = "Mã không hợp lệ" });

                bool result = _donHangService.CapNhatChiTiet(maDonHang, maLo, item);
                if (!result) return NotFound(new { success = false, message = "Không tìm thấy chi tiết để cập nhật" });

                return Ok(new { success = true, message = "Cập nhật chi tiết thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }

        /// <summary>
        /// Xóa lô sản phẩm khỏi đơn hàng
        /// </summary>
        [HttpDelete("{maDonHang}/chi-tiet/{maLo}")]
        public IActionResult XoaChiTiet(int maDonHang, int maLo)
        {
            try
            {
                if (maDonHang <= 0 || maLo <= 0) return BadRequest(new { success = false, message = "Mã không hợp lệ" });

                bool result = _donHangService.XoaChiTiet(maDonHang, maLo);
                if (!result) return NotFound(new { success = false, message = "Không tìm thấy chi tiết để xóa" });

                return Ok(new { success = true, message = "Xóa chi tiết thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }
    }
}
