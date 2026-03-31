using AdminService.Services;
using AdminService.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        /// <summary>
        /// Health check endpoint
        /// </summary>
        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok(new
            {
                service = "AdminService",
                status = "running",
                timestamp = DateTime.Now
            });
        }

        // ==================== ĐẠI LÝ ENDPOINTS ====================
        
        [HttpGet("daily")]
        public IActionResult GetAllDaiLy()
        {
            try
            {
                var dailyList = _adminService.GetAllDaiLy();
                return Ok(new { success = true, data = dailyList });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all dai ly");
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách đại lý" });
            }
        }

        [HttpGet("daily/{id}")]
        public IActionResult GetDaiLyById(int id)
        {
            try
            {
                var daily = _adminService.GetDaiLyById(id);
                if (daily == null)
                    return NotFound(new { success = false, message = "Không tìm thấy đại lý" });
                
                return Ok(new { success = true, data = daily });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dai ly by id {Id}", id);
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy thông tin đại lý" });
            }
        }

        [HttpPost("daily")]
        public IActionResult CreateDaiLy([FromBody] CreateDaiLyRequest request)
        {
            try
            {
                var (success, maDaiLy, message) = _adminService.CreateDaiLy(request);
                if (!success)
                    return BadRequest(new { success = false, message });
                
                return Ok(new { success = true, data = new { maDaiLy }, message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating dai ly");
                return StatusCode(500, new { success = false, message = "Lỗi khi tạo đại lý" });
            }
        }

        [HttpPut("daily/{id}")]
        public IActionResult UpdateDaiLy(int id, [FromBody] UpdateDaiLyRequest request)
        {
            try
            {
                var success = _adminService.UpdateDaiLy(id, request);
                if (!success)
                    return NotFound(new { success = false, message = "Không tìm thấy đại lý" });
                
                return Ok(new { success = true, message = "Cập nhật đại lý thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating dai ly {Id}", id);
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật đại lý" });
            }
        }

        [HttpDelete("daily/{id}")]
        public IActionResult DeleteDaiLy(int id)
        {
            try
            {
                var success = _adminService.DeleteDaiLy(id);
                if (!success)
                    return NotFound(new { success = false, message = "Không tìm thấy đại lý" });
                
                return Ok(new { success = true, message = "Xóa đại lý thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting dai ly {Id}", id);
                return StatusCode(500, new { success = false, message = "Lỗi khi xóa đại lý" });
            }
        }

        // ==================== SIÊU THỊ ENDPOINTS ====================
        
        [HttpGet("sieuthi")]
        public IActionResult GetAllSieuThi()
        {
            try
            {
                var sieuThiList = _adminService.GetAllSieuThi();
                return Ok(new { success = true, data = sieuThiList });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all sieu thi");
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách siêu thị" });
            }
        }

        [HttpGet("sieuthi/{id}")]
        public IActionResult GetSieuThiById(int id)
        {
            try
            {
                var sieuThi = _adminService.GetSieuThiById(id);
                if (sieuThi == null)
                    return NotFound(new { success = false, message = "Không tìm thấy siêu thị" });
                
                return Ok(new { success = true, data = sieuThi });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sieu thi by id {Id}", id);
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy thông tin siêu thị" });
            }
        }

        [HttpPost("sieuthi")]
        public IActionResult CreateSieuThi([FromBody] CreateSieuThiRequest request)
        {
            try
            {
                var (success, maSieuThi, message) = _adminService.CreateSieuThi(request);
                if (!success)
                    return BadRequest(new { success = false, message });
                
                return Ok(new { success = true, data = new { maSieuThi }, message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sieu thi");
                return StatusCode(500, new { success = false, message = "Lỗi khi tạo siêu thị" });
            }
        }

        [HttpPut("sieuthi/{id}")]
        public IActionResult UpdateSieuThi(int id, [FromBody] UpdateSieuThiRequest request)
        {
            try
            {
                var success = _adminService.UpdateSieuThi(id, request);
                if (!success)
                    return NotFound(new { success = false, message = "Không tìm thấy siêu thị" });
                
                return Ok(new { success = true, message = "Cập nhật siêu thị thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating sieu thi {Id}", id);
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật siêu thị" });
            }
        }

        [HttpDelete("sieuthi/{id}")]
        public IActionResult DeleteSieuThi(int id)
        {
            try
            {
                var success = _adminService.DeleteSieuThi(id);
                if (!success)
                    return NotFound(new { success = false, message = "Không tìm thấy siêu thị" });
                
                return Ok(new { success = true, message = "Xóa siêu thị thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting sieu thi {Id}", id);
                return StatusCode(500, new { success = false, message = "Lỗi khi xóa siêu thị" });
            }
        }
    }
}
