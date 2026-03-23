using AuthService.Data;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAccountRepository accountRepository, ILogger<AuthController> logger)
        {
            _accountRepository = accountRepository;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.TenDangNhap) || string.IsNullOrWhiteSpace(request.MatKhau))
                {
                    return BadRequest(new { message = "Tên đăng nhập và mật khẩu không được để trống" });
                }

                var (success, loaiTaiKhoan, maTaiKhoan) = _accountRepository.Login(request.TenDangNhap, request.MatKhau);

                if (success)
                {
                    return Ok(new
                    {
                        message = "Đăng nhập thành công",
                        loaiTaiKhoan,
                        maTaiKhoan
                    });
                }

                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "Lỗi hệ thống" });
            }
        }
    }

    public class LoginRequest
    {
        public string TenDangNhap { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
    }
}
