using Microsoft.AspNetCore.Mvc;
using DaiLyService.Services;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Controllers
{
    [ApiController]
    [Route("api/kho")]
    public class KhoController : ControllerBase
    {
        private readonly IKhoService _khoService;

        public KhoController(IKhoService khoService)
        {
            _khoService = khoService;
        }

        // GET: api/kho/get-all
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _khoService.GetAll();
                return Ok(new { success = true, message = "Lấy danh sách kho thành công", data });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/kho/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var result = _khoService.GetById(id);

                if (result == null)
                    return NotFound(new { success = false, message = "Không tìm thấy kho" });

                return Ok(new { success = true, message = "Lấy thông tin kho thành công", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/kho/dai-ly/{maDaiLy}
        [HttpGet("dai-ly/{maDaiLy}")]
        public IActionResult GetByMaDaiLy(int maDaiLy)
        {
            try
            {
                var data = _khoService.GetByMaDaiLy(maDaiLy);
                return Ok(new { success = true, message = "Lấy danh sách kho thành công", data });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/kho/sieu-thi/{maSieuThi}
        [HttpGet("sieu-thi/{maSieuThi}")]
        public IActionResult GetByMaSieuThi(int maSieuThi)
        {
            try
            {
                var data = _khoService.GetByMaSieuThi(maSieuThi);
                return Ok(new { success = true, message = "Lấy danh sách kho thành công", data });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: api/kho/create
        [HttpPost("create")]
        public IActionResult Create([FromBody] KhoCreateDTO dto)
        {
            try
            {
                // Debug logging
                Console.WriteLine($"=== CREATE KHO DEBUG ===");
                Console.WriteLine($"LoaiKho: {dto.LoaiKho}");
                Console.WriteLine($"MaDaiLy: {dto.MaDaiLy}");
                Console.WriteLine($"MaSieuThi: {dto.MaSieuThi}");
                Console.WriteLine($"TenKho: {dto.TenKho}");
                Console.WriteLine($"DiaChi: {dto.DiaChi}");
                Console.WriteLine($"========================");
                
                var newId = _khoService.Create(dto);
                return Ok(new { success = true, message = "Tạo kho thành công", data = new { maKho = newId } });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                Console.WriteLine($"STACK: {ex.StackTrace}");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // PUT: api/kho/update/{id}
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] KhoUpdateDTO dto)
        {
            try
            {
                bool result = _khoService.Update(id, dto);

                if (result == false)
                    return NotFound(new { success = false, message = "Không tìm thấy kho" });

                return Ok(new { success = true, message = "Cập nhật kho thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/kho/delete/{id}
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                bool result = _khoService.Delete(id);

                if (result == false)
                    return NotFound(new { success = false, message = "Không tìm thấy kho" });

                return Ok(new { success = true, message = "Xóa kho thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
