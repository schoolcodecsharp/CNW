using Microsoft.AspNetCore.Mvc;
using DaiLyService.Services;

namespace DaiLyService.Controllers
{
    [ApiController]
    [Route("api/ton-kho")]
    public class TonKhoController : ControllerBase
    {
        private readonly ITonKhoService _tonKhoService;

        public TonKhoController(ITonKhoService tonKhoService)
        {
            _tonKhoService = tonKhoService;
        }

        // GET: api/ton-kho/get-all
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            var data = _tonKhoService.GetAll();
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách tồn kho thành công",
                data = data,
                count = data?.Count ?? 0
            });
        }

        // GET: api/ton-kho/dai-ly/5
        [HttpGet("dai-ly/{maDaiLy}")]
        public IActionResult GetByMaDaiLy(int maDaiLy)
        {
            var data = _tonKhoService.GetByMaDaiLy(maDaiLy);
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách tồn kho thành công",
                data = data,
                count = data?.Count ?? 0
            });
        }

        // GET: api/ton-kho/kho/5
        [HttpGet("kho/{maKho}")]
        public IActionResult GetByMaKho(int maKho)
        {
            var data = _tonKhoService.GetByMaKho(maKho);
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách tồn kho thành công",
                data = data,
                count = data?.Count ?? 0
            });
        }
    }
}
