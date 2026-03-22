using Microsoft.AspNetCore.Mvc;
using NongDanService.Models.DTOs;
using NongDanService.Services;

namespace NongDanService.Controllers
{
    [Route("api/nong-dan")]
    [ApiController]
    public class NongDanController : ControllerBase
    {
        private readonly INongDanService _nongDanService;

        public NongDanController(INongDanService nongDanService)
        {
            _nongDanService = nongDanService;
        }

        /// <summary>
        /// Lấy tất cả nông dân
        /// </summary>
        /// <returns>Danh sách nông dân</returns>
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _nongDanService.GetAll();
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách nông dân thành công",
                    data = data,
                    count = data.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Lấy nông dân theo ID
        /// </summary>
        /// <param name="id">Mã nông dân</param>
        /// <returns>Thông tin nông dân</returns>
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
                        message = "ID nông dân không hợp lệ"
                    });
                }

                var data = _nongDanService.GetById(id);
                if (data == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy nông dân"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin nông dân thành công",
                    data = data
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Tạo nông dân mới
        /// </summary>
        /// <param name="dto">Thông tin nông dân</param>
        /// <returns>ID nông dân mới</returns>
        [HttpPost("create")]
        public IActionResult Create([FromBody] NongDanCreateDTO dto)
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

                var newId = _nongDanService.Create(dto);
                return Ok(new
                {
                    success = true,
                    message = "Tạo nông dân thành công",
                    data = new { id = newId }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Cập nhật nông dân
        /// </summary>
        /// <param name="id">Mã nông dân</param>
        /// <param name="dto">Thông tin cập nhật</param>
        /// <returns>Kết quả cập nhật</returns>
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] NongDanUpdateDTO dto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID nông dân không hợp lệ"
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

                bool result = _nongDanService.Update(id, dto);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy nông dân để cập nhật"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật nông dân thành công"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Xóa nông dân
        /// </summary>
        /// <param name="id">Mã nông dân</param>
        /// <returns>Kết quả xóa</returns>
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
                        message = "ID nông dân không hợp lệ"
                    });
                }

                bool result = _nongDanService.Delete(id);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy nông dân để xóa"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Xóa nông dân thành công"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message
                });
            }
        }
    }
}
