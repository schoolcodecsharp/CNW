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
            return Ok(data);
        }

        // GET: api/don-hang-dai-ly/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _donHangService.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/don-hang-dai-ly/dai-ly/5
        [HttpGet("dai-ly/{maDaiLy}")]
        public IActionResult GetByMaDaiLy(int maDaiLy)
        {
            var data = _donHangService.GetByMaDaiLy(maDaiLy);
            return Ok(data);
        }

        // POST: api/don-hang-dai-ly/create
        [HttpPost("create")]
        public IActionResult Create(DonHangDaiLyCreateDTO dto)
        {
            var newId = _donHangService.Create(dto);
            return Ok(newId);
        }

        // PUT: api/don-hang-dai-ly/update-trang-thai/5
        [HttpPut("update-trang-thai/{id}")]
        public IActionResult UpdateTrangThai(int id, DonHangDaiLyUpdateDTO dto)
        {
            bool result = _donHangService.UpdateTrangThai(id, dto);

            if (result == false)
                return NotFound();

            return Ok();
        }

        // DELETE: api/don-hang-dai-ly/delete/5
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _donHangService.Delete(id);

            if (result == false)
                return NotFound();

            return Ok();
        }
    }
}
