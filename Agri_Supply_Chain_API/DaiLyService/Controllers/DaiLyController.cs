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
        private readonly ILogger<DaiLyController> _logger;

        public DaiLyController(IDaiLyService daiLyService, ILogger<DaiLyController> logger)
        {
            _daiLyService = daiLyService;
            _logger = logger;
        }

        /// <summary>
        /// Lấy tất cả đại lý
        /// </summary>
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _daiLyService.GetAll();
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đại lý thành công",
                    data = data,
                    count = data.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all dai ly");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Lấy đại lý theo ID
        /// </summary>
        [HttpGet("get-by-id/{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID đại lý không hợp lệ"
                    });
                }

                var data = _daiLyService.GetById(id);
                if (data == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy đại lý"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin đại lý thành công",
                    data = data
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dai ly by id {Id}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Tạo đại lý mới
        /// </summary>
        [HttpPost("create")]
        public IActionResult Create([FromBody] DaiLyTaoMoi dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ",
                        errors = ModelState
                    });
                }

                var newId = _daiLyService.Create(dto);
                return Ok(new
                {
                    success = true,
                    message = "Tạo đại lý thành công",
                    data = new { id = newId }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating dai ly");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Cập nhật đại lý
        /// </summary>
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] DaiLyUpdateDTO dto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID đại lý không hợp lệ"
                    });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ",
                        errors = ModelState
                    });
                }

                bool result = _daiLyService.Update(id, dto);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy đại lý để cập nhật"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật đại lý thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating dai ly {Id}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Xóa đại lý
        /// </summary>
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID đại lý không hợp lệ"
                    });
                }

                bool result = _daiLyService.Delete(id);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy đại lý để xóa"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Xóa đại lý thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting dai ly {Id}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Tìm kiếm đại lý
        /// </summary>
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string? ten, [FromQuery] string? sdt)
        {
            try
            {
                var data = _daiLyService.Search(ten, sdt);
                return Ok(new
                {
                    success = true,
                    message = "Tìm kiếm đại lý thành công",
                    data = data,
                    count = data.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching dai ly");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }
    }
}
