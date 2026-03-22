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
        public ActionResult CreateDonHangOnly([FromBody] CreateDonHangRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Kiểm tra siêu thị có tồn tại không
                var sieuThiExists = _sieuThiRepository.GetSieuThiById(request.MaSieuThi);
                if (!sieuThiExists)
                {
                    return NotFound($"Không tìm thấy siêu thị với mã {request.MaSieuThi}");
                }

                var result = _sieuThiRepository.CreateDonHangOnly(request);
                
                if (!result)
                {
                    return BadRequest("Không thể tạo đơn hàng");
                }

                return Ok("Tạo đơn hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
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
                    return NotFound($"Không tìm thấy siêu thị với mã {maSieuThi}");
                }

                var donHangs = _sieuThiRepository.GetDonHangsBySieuThi(maSieuThi);
                return Ok(donHangs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }
}