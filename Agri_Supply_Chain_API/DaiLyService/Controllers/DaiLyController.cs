using Microsoft.AspNetCore.Mvc;
using DaiLyService.Services;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Controllers
{
    [ApiController]
    [Route("api/dai-ly")]
    public class DaiLyController : ControllerBase
    {
        private readonly IDaiLyService _daiLyService;

        public DaiLyController(IDaiLyService daiLyService)
        {
            _daiLyService = daiLyService;
        }

        // GET: api/dai-ly/get-all
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            var data = _daiLyService.GetAll();
            return Ok(data);
        }

        // GET: api/dai-ly/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _daiLyService.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // POST: api/dai-ly/create
        [HttpPost("create")]
        public IActionResult Create(DaiLyTaoMoi dto)
        {
            var newId = _daiLyService.Create(dto);
            return Ok(newId);
        }

        // PUT: api/dai-ly/update/5
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, DaiLyUpdateDTO dto)
        {
            bool result = _daiLyService.Update(id, dto);

            if (result == false)
                return NotFound();

            return Ok();
        }

        // DELETE: api/dai-ly/delete/5
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _daiLyService.Delete(id);

            if (result == false)
                return NotFound();

            return Ok();
        }

        // GET: api/dai-ly/search?ten=abc&sdt=123
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string? ten, [FromQuery] string? sdt)
        {
            var data = _daiLyService.Search(ten, sdt);
            return Ok(data);
        }
    }
}
