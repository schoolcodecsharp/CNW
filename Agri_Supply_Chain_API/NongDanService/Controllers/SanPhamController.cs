using Microsoft.AspNetCore.Mvc;
using NongDanService.Models.DTOs;
using NongDanService.Services;

[ApiController]
[Route("api/san-pham")]
public class SanPhamController : ControllerBase
{
    private readonly ISanPhamService _sanPhamService;

    public SanPhamController(ISanPhamService sanPhamService)
    {
        _sanPhamService = sanPhamService;
    }

    /// <summary>
    /// Lấy tất cả sản phẩm
    /// </summary>
    /// <returns>Danh sách sản phẩm</returns>
    [HttpGet("get-all")]
    public IActionResult GetAll()
    {
        try
        {
            var data = _sanPhamService.GetAll();
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách sản phẩm thành công",
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
    /// Lấy sản phẩm theo ID
    /// </summary>
    /// <param name="id">Mã sản phẩm</param>
    /// <returns>Thông tin sản phẩm</returns>
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
                    message = "ID sản phẩm không hợp lệ"
                });
            }

            var data = _sanPhamService.GetById(id);
            if (data == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy sản phẩm"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Lấy thông tin sản phẩm thành công",
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
    /// Tạo sản phẩm mới
    /// </summary>
    /// <param name="dto">Thông tin sản phẩm</param>
    /// <returns>ID sản phẩm mới</returns>
    [HttpPost("create")]
    public IActionResult Create([FromBody] SanPhamCreateDTO dto)
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

            var newId = _sanPhamService.Create(dto);
            return Ok(new
            {
                success = true,
                message = "Tạo sản phẩm thành công",
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
    /// Cập nhật sản phẩm
    /// </summary>
    /// <param name="id">Mã sản phẩm</param>
    /// <param name="dto">Thông tin cập nhật</param>
    /// <returns>Kết quả cập nhật</returns>
    [HttpPut("update/{id}")]
    public IActionResult Update(int id, [FromBody] SanPhamUpdateDTO dto)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "ID sản phẩm không hợp lệ"
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

            bool result = _sanPhamService.Update(id, dto);
            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy sản phẩm để cập nhật"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Cập nhật sản phẩm thành công"
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
    /// Xóa sản phẩm
    /// </summary>
    /// <param name="id">Mã sản phẩm</param>
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
                    message = "ID sản phẩm không hợp lệ"
                });
            }

            bool result = _sanPhamService.Delete(id);
            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy sản phẩm để xóa"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Xóa sản phẩm thành công"
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
