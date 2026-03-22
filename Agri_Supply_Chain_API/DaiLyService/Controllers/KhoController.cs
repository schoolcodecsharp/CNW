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
            var data = _khoService.GetAll();
            return Ok(data);
        }

        // GET: api/kho/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _khoService.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/kho/dai-ly/5
        [HttpGet("dai-ly/{maDaiLy}")]
        public IActionResult GetByMaDaiLy(int maDaiLy)
        {
            var data = _khoService.GetByMaDaiLy(maDaiLy);
            return Ok(data);
        }

        // POST: api/kho/create
        [HttpPost("create")]
        public IActionResult Create(KhoCreateDTO dto)
        {
            var newId = _khoService.Create(dto);
            return Ok(newId);
        }

        // PUT: api/kho/update/5
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, KhoUpdateDTO dto)
        {
            bool result = _khoService.Update(id, dto);

            if (result == false)
                return NotFound();

            return Ok();
        }

        // DELETE: api/kho/delete/5
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _khoService.Delete(id);

            if (result == false)
                return NotFound();

            return Ok();
        }
    }
}
