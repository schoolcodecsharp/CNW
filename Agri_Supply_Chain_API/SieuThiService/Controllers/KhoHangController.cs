using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SieuThiService.Data;
using SieuThiService.Models.DTOs;

namespace SieuThiService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhoHangController : ControllerBase
    {
        private readonly ISieuThiRepository _sieuThiRepository;

        public KhoHangController(ISieuThiRepository sieuThiRepository)
        {
            _sieuThiRepository = sieuThiRepository;
        }

        [HttpGet("sieu-thi/{maSieuThi}")]
        public ActionResult<List<KhoSimpleInfo>> GetDanhSachKhoBySieuThi(int maSieuThi)
        {
            try
            {
                var result = _sieuThiRepository.GetDanhSachKhoBySieuThi(maSieuThi);
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("{maKho}")]
        public ActionResult<KhoHangResponse> GetKhoHangById(int maKho)
        {
            try
            {
                var result = _sieuThiRepository.GetKhoHangById(maKho);
                
                if (result == null)
                {
                    return NotFound($"Không tìm thấy kho với mã {maKho}");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPost("tao-kho")]
        public ActionResult CreateKho([FromBody] CreateKhoRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = _sieuThiRepository.CreateKho(request);
                
                if (!result)
                {
                    return BadRequest("Không thể tạo kho");
                }

                return Ok("Tạo kho thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPut("cap-nhat-kho")]
        public ActionResult UpdateKho([FromBody] UpdateKhoRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = _sieuThiRepository.UpdateKho(request);
                
                if (!result)
                {
                    return BadRequest("Không thể cập nhật kho");
                }

                return Ok("Cập nhật kho thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpDelete("xoa-kho/{maKho}")]
        public ActionResult DeleteKho(int maKho)
        {
            try
            {
                var result = _sieuThiRepository.DeleteKho(maKho);
                
                if (!result)
                {
                    return BadRequest("Không thể xóa kho");
                }

                return Ok("Xóa kho thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpDelete("xoa-ton-kho")]
        public ActionResult DeleteTonKho([FromBody] DeleteTonKhoRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = _sieuThiRepository.DeleteTonKho(request);
                
                if (!result)
                {
                    return BadRequest("Không thể xóa tồn kho");
                }

                return Ok("Xóa tồn kho thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }
}