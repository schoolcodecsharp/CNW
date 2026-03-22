using AdminService.Models.DTOs;
using AdminService.Services;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public UserController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        /// Lấy tất cả tài khoản (chỉ admin)
        /// </summary>
        [HttpGet]
        public IActionResult GetAllTaiKhoan()
        {
            var taiKhoans = _adminService.GetAllTaiKhoan();
            return Ok(new
            {
                success = true,
                message = "Lấy danh sách tài khoản thành công",
                data = taiKhoans
            });
        }

        /// <summary>
        /// Lấy thông tin tài khoản theo ID
        /// </summary>
        [HttpGet("{id}")]
        public IActionResult GetTaiKhoanById(int id)
        {
            var taiKhoan = _adminService.GetTaiKhoanById(id);
            
            if (taiKhoan == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy tài khoản"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Lấy thông tin tài khoản thành công",
                data = taiKhoan
            });
        }

        /// <summary>
        /// Cập nhật thông tin tài khoản
        /// </summary>
        [HttpPut("{id}")]
        public IActionResult UpdateTaiKhoan(int id, [FromBody] UpdateTaiKhoanRequest request)
        {
            var result = _adminService.UpdateTaiKhoan(id, request);
            
            if (!result)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Cập nhật tài khoản thất bại"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Cập nhật tài khoản thành công"
            });
        }

        /// <summary>
        /// Xóa tài khoản (hoặc ngừng hoạt động nếu có dữ liệu liên quan)
        /// </summary>
        [HttpDelete("{id}")]
        public IActionResult DeleteTaiKhoan(int id)
        {
            var (success, message) = _adminService.DeleteTaiKhoan(id);
            
            if (!success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = message
                });
            }

            return Ok(new
            {
                success = true,
                message = message
            });
        }
    }
}
