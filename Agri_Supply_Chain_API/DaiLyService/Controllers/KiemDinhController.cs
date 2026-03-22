using Microsoft.AspNetCore.Mvc;
using DaiLyService.Services;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Controllers
{
    [ApiController]
    [Route("api/kiem-dinh")]
    public class KiemDinhController : ControllerBase
    {
        private readonly IKiemDinhService _kiemDinhService;

        public KiemDinhController(IKiemDinhService kiemDinhService)
        {
            _kiemDinhService = kiemDinhService;
        }

        // GET: api/kiem-dinh/get-all
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            var data = _kiemDinhService.GetAll();
            return Ok(data);
        }

        // GET: api/kiem-dinh/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _kiemDinhService.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/kiem-dinh/dai-ly/5
        [HttpGet("dai-ly/{maDaiLy}")]
        public IActionResult GetByMaDaiLy(int maDaiLy)
        {
            var data = _kiemDinhService.GetByMaDaiLy(maDaiLy);
            return Ok(data);
        }

        // POST: api/kiem-dinh/create
        [HttpPost("create")]
        public IActionResult Create(KiemDinhCreateDTO dto)
        {
            var newId = _kiemDinhService.Create(dto);
            return Ok(newId);
        }

        // PUT: api/kiem-dinh/update/5
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, KiemDinhUpdateDTO dto)
        {
            bool result = _kiemDinhService.Update(id, dto);

            if (result == false)
                return NotFound();

            return Ok();
        }

        // DELETE: api/kiem-dinh/delete/5
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _kiemDinhService.Delete(id);

            if (result == false)
                return NotFound();

            return Ok();
        }
    }
}
