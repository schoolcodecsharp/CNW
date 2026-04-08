using Microsoft.AspNetCore.Mvc;
using DaiLyService.Services;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Controllers
{
    [ApiController]
    [Route("api/don-hang-dai-ly")]
    public class DonHangDaiLyController : ControllerBase
    {
        private readonly IDonHangDaiLyService _donHangService;

        public DonHangDaiLyController(IDonHangDaiLyService donHangService)
        {
            _donHangService = donHangService;
        }

        // GET: api/don-hang-dai-ly/get-all
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            var data = _donHangService.GetAll();
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách đơn hàng thành công",
                data = data,
                count = data?.Count ?? 0
            });
        }

        // GET: api/don-hang-dai-ly/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _donHangService.GetById(id);

            if (result == null)
                return NotFound(new
                {
                    success = false,
                    message = $"Không tìm thấy đơn hàng với mã {id}",
                    data = (object?)null
                });

            return Ok(new
            {
                success = true,
                message = "Lấy thông tin đơn hàng thành công",
                data = result
            });
        }

        // GET: api/don-hang-dai-ly/dai-ly/5
        [HttpGet("get-by-dai-ly/{maDaiLy}")]
        public IActionResult GetByMaDaiLy(int maDaiLy)
        {
            var data = _donHangService.GetByMaDaiLy(maDaiLy);
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách đơn hàng thành công",
                data = data,
                count = data?.Count ?? 0
            });
        }

        // GET: api/don-hang-dai-ly/get-by-nong-dan/5
        [HttpGet("get-by-nong-dan/{maNongDan}")]
        public IActionResult GetByMaNongDan(int maNongDan)
        {
            var data = _donHangService.GetByMaNongDan(maNongDan);
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách đơn hàng thành công",
                data = data,
                count = data?.Count ?? 0
            });
        }

        // POST: api/don-hang-dai-ly/create
        [HttpPost("create")]
        public IActionResult Create(DonHangDaiLyCreateDTO dto)
        {
            var newId = _donHangService.Create(dto);
            return Ok(new
            {
                success = true,
                message = "Tạo đơn hàng thành công",
                data = new { maDonHang = newId }
            });
        }

        // PUT: api/don-hang-dai-ly/update-trang-thai/5
        [HttpPut("update-trang-thai/{id}")]
        public IActionResult UpdateTrangThai(int id, DonHangDaiLyUpdateDTO dto)
        {
            bool result = _donHangService.UpdateTrangThai(id, dto);

            if (result == false)
                return NotFound(new
                {
                    success = false,
                    message = $"Không tìm thấy đơn hàng với mã {id}",
                    data = (object?)null
                });

            return Ok(new
            {
                success = true,
                message = "Cập nhật trạng thái đơn hàng thành công",
                data = (object?)null
            });
        }

        // DELETE: api/don-hang-dai-ly/delete/5
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _donHangService.Delete(id);

            if (result == false)
                return NotFound(new
                {
                    success = false,
                    message = $"Không tìm thấy đơn hàng với mã {id}",
                    data = (object?)null
                });

            return Ok(new
            {
                success = true,
                message = "Xóa đơn hàng thành công",
                data = (object?)null
            });
        }
    }
}
