using Microsoft.AspNetCore.Mvc;
using NongDanService.Models.DTOs;
using NongDanService.Services;

namespace NongDanService.Controllers
{
    [Route("api/trang-trai")]
    [ApiController]
    public class TrangTraiController : ControllerBase
    {
        private readonly ITrangTraiService _trangTraiService;

        public TrangTraiController(ITrangTraiService trangTraiService)
        {
            _trangTraiService = trangTraiService;
        }

        /// <summary>
        /// Lấy tất cả trang trại
        /// </summary>
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _trangTraiService.GetAll();
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách trang trại thành công",
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
        /// Lấy trang trại theo ID
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
                        message = "ID trang trại không hợp lệ"
                    });
                }

                var data = _trangTraiService.GetById(id);
                if (data == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy trang trại"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin trang trại thành công",
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
        /// Lấy trang trại theo mã nông dân
        /// </summary>
        [HttpGet("get-by-nong-dan/{maNongDan}")]
        public IActionResult GetByNongDanId(int maNongDan)
        {
            try
            {
                if (maNongDan <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Mã nông dân không hợp lệ"
                    });
                }

                var data = _trangTraiService.GetByNongDanId(maNongDan);
                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách trang trại theo nông dân thành công",
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
        /// Tạo trang trại mới
        /// </summary>
        [HttpPost("create")]
        public IActionResult Create([FromBody] TrangTraiCreateDTO dto)
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

                var newId = _trangTraiService.Create(dto);
                return Ok(new
                {
                    success = true,
                    message = "Tạo trang trại thành công",
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
        /// Cập nhật trang trại
        /// </summary>
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] TrangTraiUpdateDTO dto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID trang trại không hợp lệ"
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

                bool result = _trangTraiService.Update(id, dto);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy trang trại để cập nhật"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật trang trại thành công"
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
        /// Xóa trang trại
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
                        message = "ID trang trại không hợp lệ"
                    });
                }

                bool result = _trangTraiService.Delete(id);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy trang trại để xóa"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Xóa trang trại thành công"
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