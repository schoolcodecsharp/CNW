using Microsoft.AspNetCore.Mvc;
using DaiLyService.Services;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Controllers
{
    [ApiController]
    [Route("api/don-hang-sieu-thi")]
    public class DonHangSieuThiController : ControllerBase
    {
        private readonly IDonHangSieuThiService _donHangService;

        public DonHangSieuThiController(IDonHangSieuThiService donHangService)
        {
            _donHangService = donHangService;
        }

        // GET: api/don-hang-sieu-thi/dai-ly/5
        [HttpGet("dai-ly/{maDaiLy}")]
        public IActionResult GetByMaDaiLy(int maDaiLy)
        {
            var data = _donHangService.GetByMaDaiLy(maDaiLy);
            return Ok(data);
        }

        // GET: api/don-hang-sieu-thi/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _donHangService.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // PUT: api/don-hang-sieu-thi/update-trang-thai/5
        [HttpPut("update-trang-thai/{id}")]
        public IActionResult UpdateTrangThai(int id, DonHangSieuThiUpdateDTO dto)
        {
            bool result = _donHangService.UpdateTrangThai(id, dto);

            if (result == false)
                return NotFound();

            return Ok();
        }
    }
}
