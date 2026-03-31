using Microsoft.AspNetCore.Mvc;
using SieuThiService.Services;
using SieuThiService.Models.DTOs;

namespace SieuThiService.Controllers
{
    [ApiController]
    [Route("api/sieu-thi")]
    public class SieuThiController : ControllerBase
    {
        private readonly ISieuThiService _sieuThiService;
        private readonly ILogger<SieuThiController> _logger;

        public SieuThiController(ISieuThiService sieuThiService, ILogger<SieuThiController> logger)
        {
            _sieuThiService = sieuThiService;
            _logger = logger;
        }

        /// <summary>
        /// Lấy tất cả siêu thị
        /// </summary>
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _sieuThiService.GetAll();
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách siêu thị thành công",
                    data = data,
                    count = data.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all sieu thi");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Lấy siêu thị theo ID
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
                        message = "ID siêu thị không hợp lệ"
                    });
                }

                var data = _sieuThiService.GetById(id);
                if (data == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy siêu thị"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin siêu thị thành công",
                    data = data
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sieu thi by id {Id}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Tạo siêu thị mới
        /// </summary>
        [HttpPost("create")]
        public IActionResult Create([FromBody] SieuThiTaoMoi dto)
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

                var newId = _sieuThiService.Create(dto);
                return Ok(new
                {
                    success = true,
                    message = "Tạo siêu thị thành công",
                    data = new { id = newId }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sieu thi");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Cập nhật siêu thị
        /// </summary>
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] SieuThiUpdateDTO dto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID siêu thị không hợp lệ"
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

                bool result = _sieuThiService.Update(id, dto);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy siêu thị để cập nhật"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật siêu thị thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating sieu thi {Id}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Xóa siêu thị
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
                        message = "ID siêu thị không hợp lệ"
                    });
                }

                bool result = _sieuThiService.Delete(id);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy siêu thị để xóa"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Xóa siêu thị thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting sieu thi {Id}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Tìm kiếm siêu thị
        /// </summary>
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string? ten, [FromQuery] string? sdt)
        {
            try
            {
                var data = _sieuThiService.Search(ten, sdt);
                return Ok(new
                {
                    success = true,
                    message = "Tìm kiếm siêu thị thành công",
                    data = data,
                    count = data.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching sieu thi");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }
    }
}
